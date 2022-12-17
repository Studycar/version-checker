import { Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { LOOKUP_CODE } from 'app/modules/generated_module/dtos/LOOKUP_CODE';
import { ActivatedRoute } from '@angular/router';
import { RealPurchaseDemandCountEditComponent } from './edit/edit.component';

@Component({
  selector: 'real-purchase-demand-count',
  templateUrl: './real-purchase-demand-count.component.html',
  providers: [QueryService],
})
export class RealPurchaseDemandCountComponent extends CustomBaseContext implements OnInit {
  plantOptions: any[] = [];
  versionOptions: any[] = [];
  steelTypeOptions: any[] = [];
  surfaceOptions: any[] = [];
  unitOptions: any[] = [];
  gradeOptions: any[] = [];
  demandTypeOptions: any[] = LOOKUP_CODE.DEMAND_TYPE;
  pushFlagOptions: any[] = LOOKUP_CODE.PUSH_STATE;
  applicationYesNo: any[] = [];
  type: string = 'count';
  isEditable = (data) => data.demandType === 'manual' && ['N', 'E'].includes(data.pushFlag);
  isCellEditable = (data) => ['N', 'E'].includes(data.pushFlag);

  countColumns = [
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'newFlag',
      width: 120,
      headerName: '最新版本',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'stockCode',
      width: 120,
      headerName: '产品编码',
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '产品名称',
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'standardType',
      width: 120,
      headerName: '规格尺寸',
      filter: 'standardsTypeFilter'
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      headerName: '单位',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'requirementQty',
      width: 120,
      headerName: '需求数量',
    },
    {
      field: 'realRequirementQty',
      width: 120,
      headerName: '实际需求数量',
    },
    {
      field: 'onhandQty',
      width: 120,
      headerName: '当前库存',
    },
    {
      field: 'manualUpdateQty',
      width: 120,
      headerName: '修改数量',
      editable: (params) => this.isCellEditable(params.data),
      cellEditor: 'AgAntNumberEditor'
    },
    {
      field: 'pushQty',
      width: 120,
      headerName: '推送总数',
    },
    {
      field: 'demandType',
      width: 120,
      headerName: '需求类型',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    // {
    //   field: 'srmNo',
    //   width: 120,
    //   headerName: 'SRM需求号',
    // },
    {
      field: 'version',
      width: 120,
      headerName: '版本号',
    },
    {
      field: 'pushFlag',
      width: 120,
      headerName: '推送标识',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'comments',
      width: 120,
      headerName: '备注描述',
      editable: (params) => this.isCellEditable(params.data),
      cellEditor: 'agTextCellEditor'
    },
  ];
  countQueryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions, ngModelChange: this.getVersionList } },
      { field: 'versionList', title: '版本号', required: true, ui: { type: UiType.selectMultiple, options: this.versionOptions } },
      { field: 'stockName', title: '产品名称', ui: { type: UiType.text, } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'surface', title: '表面', ui: { type: UiType.select, options: this.surfaceOptions } },
      { field: 'standardType', title: '规格尺寸', ui: { type: UiType.text, } },
    ],
    values: {
      plantCode: this.appConfigService.getActivePlantCode(),
      versionList: [],
      stockName: '',
      steelType: '',
      surface: '',
      standardType: '',
      coatingFlag: 'N'
    }
  }

  coatingColumns = [
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'newFlag',
      width: 120,
      headerName: '最新版本',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'stockCode',
      width: 120,
      headerName: '产品编码',
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '产品名称',
    },
    {
      field: 'stockDesc',
      width: 120,
      headerName: '产品描述',
    },
    {
      field: 'standards',
      width: 120,
      headerName: '规格',
    },
    {
      field: 'catName',
      width: 120,
      headerName: '胶膜分类',
    },
    {
      field: 'unitWeight',
      width: 120,
      headerName: '单位重量',
    },
    {
      field: 'requirementMeter',
      width: 120,
      headerName: '订单需求米数',
    },
    {
      field: 'requirementQty',
      width: 120,
      headerName: '订单需求重量',
    },
    {
      field: 'realRequirementMeter',
      width: 120,
      headerName: '实际需求米数',
    },
    {
      field: 'realRequirementQty',
      width: 120,
      headerName: '实际需求重量',
    },
    {
      field: 'onhandMeter',
      width: 120,
      headerName: '当前库存米数',
    },
    {
      field: 'onhandQty',
      width: 120,
      headerName: '当前库存重量',
    },
    {
      field: 'manualUpdateMeter',
      width: 120,
      headerName: '修改米数',
      editable: (params) => this.isCellEditable(params.data),
      cellEditor: 'AgAntNumberEditor'
    },
    {
      field: 'pushMeter',
      width: 120,
      headerName: '推送米数',
    },
    {
      field: 'pushQty',
      width: 120,
      headerName: '推送重量',
    },
    {
      field: 'comments',
      width: 120,
      headerName: '备注描述',
      editable: (params) => this.isCellEditable(params.data),
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'demandType',
      width: 120,
      headerName: '需求类型',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    // {
    //   field: 'srmNo',
    //   width: 120,
    //   headerName: 'SRM需求号',
    // },
    {
      field: 'version',
      width: 120,
      headerName: '版本号',
    },
    {
      field: 'pushFlag',
      width: 120,
      headerName: '推送标识',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '核算时间'
    },
  ];
  coatingQueryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions, ngModelChange: this.getVersionList } },
      { field: 'versionList', title: '版本号', required: true, ui: { type: UiType.selectMultiple, options: this.versionOptions } },
      { field: 'stockName', title: '产品名称', ui: { type: UiType.text, } },
      { field: 'stockDesc', title: '产品描述', ui: { type: UiType.text, } },
      { field: 'pushFlag', title: '推送标识', ui: { type: UiType.select, options: this.pushFlagOptions } },
      {
        field: 'catId', title: '胶膜分类', ui: {
          type: UiType.select, options: [
            { label: '自有胶膜', value: '188' }, { label: '客供胶膜', value: '189' }
          ]
        }
      },
      { field: 'standards', title: '规格', ui: { type: UiType.text, } },
    ],
    values: {
      plantCode: this.appConfigService.getActivePlantCode(),
      versionList: [],
      stockName: '',
      pushFlag: null,
      catId: null,
      standards: '',
      stockDesc: '',
      coatingFlag: 'Y'
    }
  }
  property = {
    count: {
      myAgGridState: 'ps_real_purchase_demand_count', // 缓存列配置
      exportFileName: '原材料实时采购需求汇总表', // 导出表名
      coatingFlag: 'N',
      columns: this.countColumns, // 列配置
      countFields: ['requirementQty', 'realRequirementQty', 'manualUpdateQty', 'pushQty'], // 合计列
      queryParams: this.countQueryParams, // 查询配置
    },
    coating: {
      myAgGridState: 'ps_real_purchase_demand_coating',
      exportFileName: '胶膜实时需求汇总表',
      coatingFlag: 'Y',
      columns: this.coatingColumns,
      countFields: ['requirementMeter', 'requirementQty', 'onhandMeter', 'onhandQty',
        'manualUpdateMeter', 'pushMeter', 'pushQty', 'realRequirementMeter', 'realRequirementQty'], // 合计列
      queryParams: this.coatingQueryParams,
    },
  }
  constructor(
    public pro: BrandService,
    public appTranslationService: AppTranslationService,
    public appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public modal: ModalHelper,
    public queryService: QueryService,
    private router: ActivatedRoute,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
    this.type = this.router.snapshot.data.type;
  }

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.queryUrl,
    method: 'POST',
  };

  // 表格列配置
  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    // {
    //   field: 'index',
    //   width: 120,
    //   headerName: '序号',
    //   valueGetter: params => { return params.node.rowIndex+1; }
    // },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.steelTypeOptions;
        break;
      case 2:
        options = this.surfaceOptions;
        break;
      case 3:
        options = this.unitOptions;
        break;
      case 4:
        options = this.demandTypeOptions;
        break;
      case 5:
        options = this.pushFlagOptions;
        break;
      case 6:
        options = this.gradeOptions;
        break;
      case 7:
        options = this.applicationYesNo;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  // 查询条件配置
  queryParams: any = {
    defines: [],
    values: {}
  };

  // 获取查询条件
  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      params.isExport = true;
    } else {
      params.isExport = false;
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  // 初始化生命周期
  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.columns = [...this.columns, ...this.property[this.type].columns];
    this.queryParams.defines = this.property[this.type].queryParams.defines;
    this.queryParams.values = { ...this.property[this.type].queryParams.values };
    this.refreshVersion();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onVirtualColumnsChanged(null);
    });
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['修改米数', '修改数量', '备注描述'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#demandCountGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }

  // 查询搜索条件
  async loadOptions() {
    if (this.type === 'count') {
      await this.queryService.GetLookupByTypeRefZip({
        'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
        'PS_CONTRACT_SURFACE': this.surfaceOptions,
        'PS_ITEM_UNIT': this.unitOptions,
        'PS_GRADE': this.gradeOptions,
        'FND_YES_NO': this.applicationYesNo,
      });
    } else {
      await this.queryService.GetLookupByTypeRefZip({
        'FND_YES_NO': this.applicationYesNo,
      });
    }
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  async getVersionList() {
    this.versionOptions.length = 0;
    this.queryParams.values.versionList = [];
    return new Promise(async resolve => {
      const res = await this.queryService.getVersionList(this.queryParams.values.plantCode, this.queryParams.values.coatingFlag).toPromise();
      if (res.code === 200) {
        res.data.forEach(d => {
          this.versionOptions.push({
            label: d,
            value: d
          })
        })
        if (res.data.length > 0) { this.queryParams.values.versionList = [res.data[0]]; resolve(true); }
        else { resolve(false); }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        resolve(false);
      }
    })
  }

  refreshVersion() {
    this.getVersionList().then((value) => {
      if (value) {
        this.query();
      }
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // 查询方法
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParams(),
      this.context,
    );
  }

  add(dataItem?: any) {
    this.modal.static(
      RealPurchaseDemandCountEditComponent,
      {
        i: dataItem !== undefined ? dataItem : { id: null },
        type: this.type,
      }
    ).subscribe(value => {
      if (value) {
        this.query();
      }
    })
  }

  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if (dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要删除吗？'),
          nzOnOk: () => {
            this.delete(ids);
          },
        });
      } else {
        this.delete(ids);
      }
    }
  }

  delete(ids) {
    this.queryService.delete(ids).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  compute() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要发起实时需求计算请求吗？'),
      nzOnOk: () => {
        this.queryService.submitRequestPurchaseDemandCreate(this.queryParams.values.plantCode, this.queryParams.values.coatingFlag).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  pushToSrm() {
    const ids = this.getGridSelectionKeys();
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择数据'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要发起推送SRM请求吗？'),
      nzOnOk: () => {
        this.queryService.submitRequestSend2Srm(ids).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });

  }

  onCellValueChanged(event) {
    if (this.isNullDefault(event.oldValue.toString(), '') !==
      this.isNullDefault(event.newValue.toString(), '')) {
      let updateMethod = '';
      if (event.colDef.field === 'manualUpdateQty') {
        updateMethod = 'modifyManualUpdateQty';
      } else if (event.colDef.field === 'manualUpdateMeter') {
        updateMethod = 'modifyManualUpdateMeter';
      } else if (event.colDef.field === 'comments') {
        updateMethod = 'modifyComments';
      }
      if (!!updateMethod) {
        this.queryService[updateMethod](event.data.id, event.newValue).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
            let data = event.data;
            data[event.colDef.field] = event.oldValue;
            event.node.setData(data); // 修改失败，显示原来的值
          }
        });
      }
    }
  }

  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
        }
      }
      this.setTotalBottomRow(data);
    });
  }

  // 过滤后重新统计
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }

  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'plantCode';
    // 需要统计的列数组
    const fields = this.property[this.type].countFields;
    super.setTotalBottomRow(data, totalField, fields);
  }

  // 重置
  public clear() {
    this.queryParams.values = { ...this.property[this.type].queryParams.values };
    if(this.versionOptions.length > 0) {
      this.queryParams.values.versionList = [this.versionOptions[0].value];
    }
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'grade', options: this.gradeOptions },
    { field: 'unitOfMeasure', options: this.unitOptions },
    { field: 'demandType', options: this.demandTypeOptions },
    { field: 'pushFlag', options: this.pushFlagOptions },
    { field: 'newFlag', options: this.applicationYesNo },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.exportAction(
      this.httpAction,
      params,
      this.excelexport,
      this.context,
      // this.exportDataPreFilter
    );
  }

  // exportDataPreFilter(res) {

  // }
}