import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { QueryService } from './edit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MoMultiMouldEditComponent } from './edit/edit.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { MoMultiMouldManageService } from 'app/modules/generated_module/services/momultimould-manage-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { PsItemRoutingsService } from 'app/modules/generated_module/services/ps-item-routings-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';

@Component({
  selector: 'momultimould-manage',
  templateUrl: './momultimould.component.html',
  providers: [QueryService, PsItemRoutingsService],
})
export class MoMultimouldManageComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  expandForm = false;
  applicationOptions: any[] = [];
  application: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];
  context = this;
  //工厂编码 
  public plantCodeOptions: any[] = [];
  //计划组编码
  public scheduleGroupCodeOptions: any[] = [];

  //当前选中的工厂
  currentPlantCode: { label: '', value: '', scheduleRegionCode: '' };





  public queryParams = {
    defines: [
      { field: 'strPlantCode', title: '工厂', ui: { type: UiType.select, options: this.plantCodeOptions, eventNo: 1 }, required: true },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.scheduleGroupCodeOptions } },
      { field: 'primaryMoNum', title: '主生产订单', ui: { type: UiType.text } },

    ],
    values: {
      strPlantCode: '',
      scheduleGroupCode: '',
      primaryMoNum: '',
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '产线', menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderNum', headerName: '生产订单', menuTabs: ['filterMenuTab'] },
    { field: 'itemId', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'itemDescriptions', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'projectNumber', headerName: '项目号', menuTabs: ['filterMenuTab'] },
    { field: 'primaryMoNum', headerName: '主生产订单', menuTabs: ['filterMenuTab'] },

  ];


  public clear() {
    this.queryParams.values = {
      strPlantCode: this.appService.getPlantCode(),
      primaryMoNum: '',
      scheduleGroupCode: '',
    };
  }

  httpAction = {
    url: this.moMultiMouldManageService.seachUrl,
    method: 'GET',
    data: false
  };

  getQueryParams(): { [key: string]: any } {
    return {
      plantCode: this.queryParams.values.strPlantCode,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      primaryMoNum: this.queryParams.values.primaryMoNum,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }
  // 事业部切换动态加载工厂
  public LoadPlantCodes(event: string) {
    this.queryParams.values.strPlantCode = null;
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.primaryMoNum = null;
    this.commonquery.GetUserPlant(event).subscribe(result => {
      this.plantCodeOptions.length = 0;
      result.Extra.forEach(d => {
        this.plantCodeOptions.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  // 加载计划组
  private loadGroup() {
    this.scheduleGroupCodeOptions.length = 0;
    this.commonquery
      .GetUserPlantGroup(this.currentPlantCode.value || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.scheduleGroupCodeOptions.push({
            label: d.scheduleGroupCode,
            value: d.scheduleGroupCode,
          });
        });
      });
  }

  public query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.queryservice.loadGridViewNew(this.httpAction, this.getQueryParams(), this.context);
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,  // 模态对话框
    private formBuilder: FormBuilder,
    public queryservice: QueryService,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    private translateservice: AppTranslationService,
    private moMultiMouldManageService: MoMultiMouldManageService,
    private commonquery: CommonQueryService,
    private appService: AppConfigService,
    public psItemRoutingsService: PsItemRoutingsService,
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  public add(item?: any) {
    this.modal
      .static(
        MoMultiMouldEditComponent,
        { i: { id: (item !== undefined ? item.id : null) } },
        'md',
      )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }





  public onStateChange(state: State) {
    this.gridState = state;
    this.queryservice.read(this.httpAction, this.queryParams);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();

    this.getPlantCodesAndItemCodes();
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
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
  // 加载工厂
  getPlantCodesAndItemCodes() {
    this.commonquery.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodeOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });
        this.currentPlantCode = this.plantCodeOptions[0];
        this.loadGroup();
      });
    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    this.plantCodeOptions.forEach(ele => {
      if (ele.value === value) {
        this.currentPlantCode = ele;
      }
    })
    this.queryParams.values.scheduleGroupCode = null;

    this.loadGroup();
  }


  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要取消的数据。');
      return;
    }

    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要取消配套吗？'),
      nzOnOk: () => {
        this.moMultiMouldManageService.CancelMoMatch(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.translateservice.translate('取消配套成功'));
            this.query();
          } else {
            this.msgSrv.error(this.translateservice.translate(res.msg));
          }
        });
      },
    });
  }

  remove(value: any) {
    this.moMultiMouldManageService.CancelMoMatch([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.translateservice.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg));
      }
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [];


  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }


}
