import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { ModalHelper } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from '../../../modules/base_module/components/custom-operatecell-render.component';
import { StockageAnalysisDetailComponent } from './detail/detail.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'stockage-analysis',
  templateUrl: './stockage-analysis.component.html',
})
export class StockageAnalysisComponent extends CustomBaseContext implements OnInit {

  constructor(public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modal: ModalHelper,
    private commonQueryService: CommonQueryService) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  plantOption: any[] = [];
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption, ngModelChange: this.onPlantCodeChange },
        required: true
      },
      {
        field: 'itemCode',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
          },
        },
      }
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { text: '', value: '' }
    }
  };
  columns = [
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 70,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    { field: 'plantCode', headerName: '工厂', width: 80, menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', width: 180, menuTabs: ['filterMenuTab'] },
    { field: 'subinventoryCode', headerName: '仓库', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'expirationPeriod', headerName: '质保期(天)', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'onhandQuantity', headerName: '汇总数', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'day0To30', headerName: '0-30天', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'day30To60', headerName: '30-60天', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'day60To90', headerName: '60-90天', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'day90To120', headerName: '90-120天', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'day120To150', headerName: '120-150天', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'day150To180', headerName: '150-180天', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'day180ToEnd', headerName: '>180天', width: 110, menuTabs: ['filterMenuTab'] },
  ];
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadPlantOption(this.appConfigService.getDefaultScheduleRegionCode());
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonQueryService.loadGridViewNew({ url: '/api/mrp/mrpDataOperation/stockAgeAnalysis', method: 'GET' }, this.getQueryParams(), this.context);
  }

  getQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode.text,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { text: '', value: '' }
    };
  }

  detail(data: any) {
    this.modal.static(StockageAnalysisDetailComponent, { data: data }, 'lg'
    ).subscribe(res => { });
  }

  onPlantCodeChange(val: string) {
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
  }

  loadPlantOption(businessUnitCode: string) {
    this.commonQueryService.GetUserPlant(businessUnitCode, '').subscribe(res => {
      this.plantOption.length = 0;
      res.Extra.forEach(item => {
        this.plantOption.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  rowSelect({ sender, Row, Value, Text }) {
    this.queryParams.values.itemCode.text = Text;
    this.queryParams.values.itemCode.value = Value;
  }

  searchItems(e: any) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate(this.appTranslationService.translate('请先选择工厂！')));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}
