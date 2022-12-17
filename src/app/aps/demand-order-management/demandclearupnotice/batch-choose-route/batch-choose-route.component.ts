import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from './query.service';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { LOOKUP_CODE } from 'app/modules/generated_module/dtos/LOOKUP_CODE';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'batch-choose-route',
  templateUrl: './batch-choose-route.component.html',
  providers: [QueryService]
})
export class BatchChooseRouteComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    public http: _HttpClient,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }
  // 绑定路径
  public gridViewRoute: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsRoute: any[] = [
    {
      field: 'routeId',
      title: '制造路径标识',
      width: '50'
    },
    {
      field: 'routeName',
      title: '制造路径',
      width: '150'
    },
    {
      field: 'listOrder',
      title: '优先级',
      width: '100'
    },
    // {
    //   field: 'quantity',
    //   title: '现有量',
    //   width: '100'
    // },
  ];

  columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 90,
    },
    {
      field: 'reqNumber',
      headerName: '需求订单号',
    },
    {
      field: 'projectNumber',
      width: 120,
      headerName: '项目号码',
    },
    {
      field: 'stockCode', width: 100, headerName: '产品编码',
    },
    {
      field: 'stockName', width: 100, headerName: '产品名称',
    },
    {
      field: 'standardsType', width: 100, headerName: '规格尺寸',
      filter: 'standardsTypeFilter'
    },
    {
      field: 'steelType', width: 100, headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'surface', width: 100, headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'needSideCut', width: 100, headerName: '切边标识',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
  ]
  needSiteCutOptions: any[] = LOOKUP_CODE.NEED_SITE_CUT;
  surfaceOptions: any[] = [];
  steelTypeOption: any[] = [];
  selected: any = null;
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.needSiteCutOptions;
        break;
      case 2:
        options = this.surfaceOptions;
        break;
      case 3:
        options = this.steelTypeOption;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }
  loading = false;
  isModify = false;
  i: any = {};
  iClone: any;
  // 测试用的下拉列表，可删除
  selectOptions: { label: any, value: any, [key: string]: any }[] = [];

  // 初始化
  ngOnInit(): void {
    if (this.i.id !== null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    }
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    })
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOption,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
    });
  }

  onSelectionChanged(event) {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.selected = selectedRows[0];
    } else {
      this.selected = null;
    }
  }

  public loadRoute(plantCode: string, stockCode: string, routeId: string, steelType: string, surface: string,
    standards: number, width: number, length: number, needSideCut: string, PageIndex: number, PageSize: number) {
    this.gridViewRoute.data.length = 0;
    // 加载产品编码
    this.queryService.getPsRouteList(plantCode || '', stockCode || '', routeId || '', steelType || '', surface || '',
      standards || 0, width || 0, length || 0, needSideCut || '0', PageIndex, 1000).subscribe(res => {
        if (res.code === 200) {
          this.gridViewRoute.data = res.data;
          this.gridViewRoute.total = res.data.length;
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  }
  // 产品编码弹出查询
  public searchRoute(e: any) {
    if (!this.selected) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选单条数据'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadRoute(this.selected.plantCode, this.selected.stockCode, e.SearchValue, 
      this.selected.steelType, this.selected.surface, this.selected.standards, this.selected.width, this.selected.length, this.selected.needSideCut, PageIndex, e.PageSize);
  }
  //  行点击事件， 给参数赋值
  onRowSelectRoute(e: any) {
    this.i.routeId = e.Row.routeId;
    this.i.manufRoute = e.Row.routeName;
  }


  onTextChangedRoute({ sender, event, Text }) {
    if (!this.selected) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选单条数据'));
      return;
    }
    if (Text.trim() === '') {
      return;
    }
    // 加载产品信息
    this.queryService.getPsRouteList(this.selected.plantCode || '', this.selected.stockCode || '', Text, this.selected.steelType || '',
      this.selected.surface || '', this.selected.standards || 0, this.selected.width || 0, this.selected.length || 0, this.selected.needSideCut, 1, sender.PageSize).subscribe(res => {
        if (res.code === 200) {
          const stockInfo = res.data.find(x => x.routeId === Text);
          if (stockInfo) {
            this.i.routeId = stockInfo.routeId;
            this.i.manufRoute = stockInfo.routeName;
          } else {
            this.i.routeId = '';
            this.i.manufRoute = '';
            this.msgSrv.warning(this.appTranslationService.translate('路径信息无效'));
          }
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });

  }

  // 保存
  save(value: any) {
    const ids = this.gridData.map(d => d.id);
    this.queryService.batchChooseRoute(ids, this.selected.plantCode, this.i.routeId, this.i.manufRoute).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  // 关闭
  close() {
    this.modal.destroy();
  }

  // 重置
  clear() {
    this.i = Object.assign({}, this.iClone);
  }

}