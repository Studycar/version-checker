import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { OrderBaseDetailComponent } from "./detail/detail.component";
import { QueryService } from './query.service';

@Component({
  selector: 'order-base-platform',
  templateUrl: './order-base-platform.component.html',
  providers: [QueryService],
})
export class MixedResourceIssuedOrderBasePlatformComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public appTranslationService: AppTranslationService,
    public appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public modal: ModalHelper,
    public queryService: QueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  // 表格列配置
  columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 30, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantDesc', headerName: '工厂' },
    { field: 'scheduleGroupDesc', headerName: '计划组' },
    { field: 'resourceDesc', headerName: '资源' },
    { field: 'manufLineName', headerName: '产线' },
    { field: 'makeOrderNum', headerName: '工单号' },
   // { field: 'itemId', headerName: '物料编码' },
    { field: 'stockCode', headerName: '产品编码' },
    { field: 'stockName', headerName: '产品描述' },
    { field: 'steelType', headerName: '钢种' },
    //{ field: 'standards', headerName: '规格' },
    { field: 'surface', headerName: '表面' },
    { field: 'specSize', headerName: '规格尺寸', valueFormatter: 'ctx.formatSpec(value)' },
    //{ field: 'processCode', headerName: '工序' },
    //{ field: 'length', headerName: '长度' },
    //{ field: 'width', headerName: '宽度' },
    { field: 'projectNumber', headerName: '项目号' },
    { field: 'makeOrderStatus', headerName: '工单状态', valueFormatter: 'ctx.optionsFind(value).label' },
    { field: 'moQty', headerName: '工单数量' },
    { field: 'fpcTime', headerName: '开工时间' },
    { field: 'lpcTime', headerName: '完工时间' },
    { field: 'bindindNum', headerName: '合并标识' },
    //{ field: 'levelNum', headerName: '层级' },
  ];

  formatSpec(value) {
    const specs = value.split('*');
    if(specs.length > 1 && Number(specs[1]) === Math.floor(specs[1])) {
      specs[1] = Math.floor(specs[1]).toString();
    }
    if(specs.length > 2 && Number(specs[2]) === Math.floor(specs[2])) {
      specs[2] = Math.floor(specs[2]).toString();
    }
    return specs.join('*');
  }

  // 查询条件配置
  plantOptions: any[] = [];
  scheduleGroupCodeList: any[] = [];
  resourceCodeList: any[] = [];
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions, ngModelChange: this.loadScheduleGroup } },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.scheduleGroupCodeList, ngModelChange: this.loadResource } },
      { field: 'resourceCode', title: '资源', ui: { type: UiType.select, options: this.resourceCodeList } },
      { field: 'stockCode', title: '产品名称', ui: { type: UiType.string } },
      { field: 'projectNumber', title: '项目号', ui: { type: UiType.string } },
      { field: 'makeOrderNum', title: '工单号', ui: { type: UiType.string } },
      { field: 'dateRange', title: '开工时间', ui: { type: UiType.dateRange } },
    ],
    values: {
      plantCode: this.appConfigService.getActivePlantCode(),
      scheduleGroupCode: '',
      resourceCode: '',
      stockCode: '',
      projectNumber: '',
      makeOrderNum: '',
      dateRange: [],
    }
  };

  // 获取查询条件
  getQueryParams(isExport?: boolean): any {
    const values = this.queryParams.values
    const formatDate = this.queryService.formatDate
    const params: any = {
      ...values,
      startBegin: formatDate(values.dateRange[0]),
      startEnd: formatDate(values.dateRange[1]),
    };
    delete params.dateRange
    if (isExport) {
      params.isExport = true;
    } else {
      params.isExport = false;
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  // 初始化生命周期
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    })
  }

  // 获取快码
  makeOrderStatusOptions: any[] = [];
  loadOptions () {
    this.loadPlants()
    this.loadScheduleGroup()
    return this.queryService.GetLookupByTypeRefZip({
      'PS_MAKE_ORDER_STATUS': this.makeOrderStatusOptions,
    });
  }

  public optionsFind(value: string): any {
    const found = this.makeOrderStatusOptions.find(x => x.value == value);
    return found || { label: value }
  }

  loadPlants() {
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
          value: d.plantCode,
        })
      })
    });
  }

  loadScheduleGroup() {
    /** 根据工厂获取计划组编码  下拉框*/
    this.scheduleGroupCodeList.length = 0;
    this.queryService.GetScheduleGroupCode(this.queryParams.values.plantCode).subscribe(res => {
      res.data.forEach(d => {
        this.scheduleGroupCodeList.push({
          label: d.descriptions,
          value: d.scheduleGroupCode,
        });
      });
      this.queryParams.values.scheduleGroupCode = null;
    });
  }

  public loadResource() {
    /** 根据计划组获取资源  下拉框*/
    this.resourceCodeList.length = 0;
    this.queryService.GetResourceBySchedule(this.queryParams.values.plantCode, this.queryParams.values.scheduleGroupCode).subscribe(result => {
      result.data.content.forEach(d => {
        this.resourceCodeList.push({
          label: d.descriptions,
          value: d.resourceCode,
        });
      });
      this.queryParams.values.resourceCode = null;
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.searchUrl,
    method: 'POST',
  };

  // 查询方法
  queryCommon() {
    const queryValues = this.getQueryParams();
    const httpAction = { url: this.httpAction.url + `?pageIndex=${queryValues.pageIndex}&pageSize=${queryValues.pageSize}`, 
      method: this.httpAction.method};
    this.queryService.loadGridViewNew(
      httpAction,
      queryValues,
      this.context,
    );
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getActivePlantCode(),
      scheduleGroupCode: '',
      resourceCode: '',
      stockCode: '',
      projectNumber: '',
      makeOrderNum: '',
      dateRange: [],
    };
  }

  // 翻页
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  // 详情
  showDetail(dataItem) {
    this.modal.static(
      OrderBaseDetailComponent,
      {
        makeOrderNum: dataItem.makeOrderNum,
        plantCode: dataItem.plantCode,
        makeOrderStatusOptions: this.makeOrderStatusOptions,
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  // 批量下达
  selectKeys = 'makeOrderNum';
  onSelectionChanged() {
    this.getGridSelectionKeys(this.selectKeys);
  }
  batchIssue() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要下达的数据');
      return;
    }

    // console.log('in batchIssue ==>', this.selectionKeys)
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要下达吗？'),
      nzOnOk: () => {
        const params = {
          makeOrderNumList: this.selectionKeys,
          plantCode: this.queryParams.values.plantCode
        }
        const currentPlantCode = this.queryParams.values.plantCode
        this.queryService.BatchIssue(this.selectionKeys, currentPlantCode).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  rollback() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要回退的数据');
      return;
    }

    // console.log('in batchIssue ==>', this.selectionKeys)
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要回退吗？'),
      nzOnOk: () => {
        const params = {
          makeOrderNumList: this.selectionKeys,
          plantCode: this.queryParams.values.plantCode
        }
        const currentPlantCode = this.queryParams.values.plantCode
        this.queryService.Rollback(this.selectionKeys, currentPlantCode).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  // 导出
  expColumnsOptions: any[] = [
    { field: 'makeOrderStatus', options: this.makeOrderStatusOptions },
  ];
  expColumns: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.exportAction(
      this.httpAction,
      params,
      this.excelexport,
      this.context
    );
  }
}
