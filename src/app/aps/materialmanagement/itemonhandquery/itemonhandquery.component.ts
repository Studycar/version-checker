/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:11
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-02 16:26:18
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from './queryService';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { MaterialmanagementItemonhandqueryEditComponent } from './edit/edit.component';
import { ItemonhandQueryService } from '../../../modules/generated_module/services/itemonhand-query-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { MaterialmanagementListItemonhandchildComponent } from 'app/aps/materialmanagement/itemonhandchild/itemonhandchild.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-itemonhandquery',
  templateUrl: './itemonhandquery.component.html',
  providers: [QueryService]
})
export class MaterialmanagementItemonhandqueryComponent extends CustomBaseContext implements OnInit {

  subInventorys: any[] = [];
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  plantoptions: any[] = [];
  stockStatusOptions: any[] = [];
  context = this;
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsItems: any[] = [
    {
      field: 'stockCode',
      title: '存货编码',
      width: '100'
    },
    {
      field: 'stockName',
      title: '存货名称',
      width: '100'
    },
    {
      field: 'stockDesc',
      title: '产品描述',
      width: '100'
    }
  ];

  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
    {
      field: 'plantCode',
      title: '工厂',
      width: '100'
    },
    {
      field: 'subinventoryCode',
      title: '仓库编码',
      width: '100'
    },
    {
      field: 'subinventoryDescription',
      title: '仓库名称',
      width: '100'
    }
  ];

  public queryParams = {
    defines: [
      { field: 'PLANT_CODE', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 2 } },
      {
        field: 'ITEM_CODE', title: '存货编码', ui: {
          type: UiType.popupSelect, valueField: 'stockCode', textField: 'stockCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 1,
          extraEvent: {
            TextChangedEventNo: 3,
          }
        }
      },

      {
        field: 'spec',
        title: '规格尺寸',
        ui: { type: UiType.text },
      },
      { field: 'SUBINVENTORY_ALLOCATION', title: '库位编码', ui: { type: UiType.text } },
      { field: 'SURFACE', title: '表面', ui: { type: UiType.text } },
      { field: 'steelGrade', title: '钢种', ui: { type: UiType.text } },
      { field: 'makeOrderNum', title: '计划单号', ui: { type: UiType.text } },
      { field: 'batchCode', title: '批号', ui: { type: UiType.text } },
      {
        field: 'whName', title: '仓库', ui: {
          type: UiType.popupSelect, valueField: 'subinventoryCode', textField: 'subinventoryCode', gridView: this.gridViewWares, columns: this.columnsWares, eventNo: 4,
          extraEvent: {
            RowSelectEventNo: 5,
            TextChangedEventNo: 6,
          }
        }
      },
      { field: 'stockStatus', title: '库存状态', ui: { type: UiType.select, options: this.stockStatusOptions} },
    ],
    values: {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      ITEM_CODE: { value: '', text: '' },
      spec: null,
      SUBINVENTORY_ALLOCATION: '',
      makeOrderNum: '',
      batchCode: '',
      SURFACE: '',
      steelGrade: '',
      stockStatus: '',
      whName: { value: '', text: '' },
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }
  };

  httpAction = {
    url: this.querydata.url,
    method: 'GET'
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 50, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    { field: 'plantCode', width: 120, headerName: '工厂编码' },
    { field: 'makeOrderNum', width: 120, headerName: '计划单号' },
    { field: 'subinventoryCode', width: 90, headerName: '实体仓库编码', menuTabs: ['filterMenuTab'] },
    { field: 'subinventoryAllocation', width: 130, headerName: '库位编码', menuTabs: ['filterMenuTab'] },
    { field: 'whName', width: 130, headerName: '仓库', menuTabs: ['filterMenuTab'] },
    { field: 'itemId', width: 190, headerName: '存货编码', menuTabs: ['filterMenuTab'] },
    { field: 'skuName', width: 350, headerName: '存货名称', tooltipField: 'descriptionsCn', menuTabs: ['filterMenuTab'] },
    { field: 'onhandQuantity', width: 90, headerName: '现存量', menuTabs: ['filterMenuTab'] },
    { field: 'unitName', width: 90, headerName: '单位', menuTabs: ['filterMenuTab'] },
    { field: 'batchCode', width: 160, headerName: '批号', menuTabs: ['filterMenuTab'] },
    { field: 'steelGrade', width: 90, headerName: '钢种', menuTabs: ['filterMenuTab'] },
    { field: 'surface', width: 120, headerName: '表面', menuTabs: ['filterMenuTab'] },
    { field: 'spec', width: 120, headerName: '规格尺寸', menuTabs: ['filterMenuTab'] },
    { field: 'grade', width: 120, headerName: '等级', menuTabs: ['filterMenuTab'] },
    { field: 'paper', width: 120, headerName: '表面保护', menuTabs: ['filterMenuTab'] },
    { field: 'actHeight', width: 120, headerName: '实厚', menuTabs: ['filterMenuTab'] },
    { field: 'actWidth', width: 120, headerName: '实宽', menuTabs: ['filterMenuTab'] },
    { field: 'unitWeight', width: 120, headerName: '单重', menuTabs: ['filterMenuTab'] },
    { field: 'rollLength', width: 120, headerName: '卷长', menuTabs: ['filterMenuTab'] },
    { field: 'quality', width: 240, headerName: '品质信息', menuTabs: ['filterMenuTab'] },
    { field: 'inBatchCode', width: 120, headerName: '来料批号', menuTabs: ['filterMenuTab'] },
    { field: 'skuType', width: 120, headerName: '存货类型', menuTabs: ['filterMenuTab'] },
    { field: 'avaQuantity', width: 120, headerName: '可用量', menuTabs: ['filterMenuTab'] },
    { field: 'entryTime', width: 120, headerName: '入库时间', menuTabs: ['filterMenuTab'] },
    { field: 'subsectionState', width: 120, headerName: '分卷状态', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1).label' },
    { field: 'rewinding', width: 120, headerName: '重卷次数', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,2).label' },
    { field: 'coilInnerDia', width: 120, headerName: '钢卷内径', menuTabs: ['filterMenuTab'] },
    { field: 'packType', width: 120, headerName: '包装方式', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,3).label' },
    { field: 'fullVolume', width: 120, headerName: '是否整卷', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,2).label' },
    { field: 'elongation', width: 120, headerName: '延伸率', menuTabs: ['filterMenuTab'] },
    { field: 'gloss', width: 120, headerName: '光泽度', menuTabs: ['filterMenuTab'] },
    { field: 'ironLoss', width: 120, headerName: '铁损', menuTabs: ['filterMenuTab'] },
    { field: 'magnetoreception', width: 120, headerName: '磁感', menuTabs: ['filterMenuTab'] },
    { field: 'cusAbbreviation', width: 120, headerName: '客户简称', menuTabs: ['filterMenuTab'] },
    { field: 'baleNo', width: 120, headerName: '捆包号', menuTabs: ['filterMenuTab'] },
    { field: 'coatingUpCode', width: 120, headerName: '面膜存货编码', menuTabs: ['filterMenuTab'] },    
    { field: 'coatingUpName', width: 120, headerName: '面膜存货名称', menuTabs: ['filterMenuTab'] },    
    { field: 'coatingUpDesc', width: 120, headerName: '面膜存货描述', menuTabs: ['filterMenuTab'] },
    { field: 'coatingDownCode', width: 120, headerName: '底膜存货编码', menuTabs: ['filterMenuTab'] },
    { field: 'coatingDownName', width: 120, headerName: '底膜存货名称', menuTabs: ['filterMenuTab'] },
    { field: 'coatingDownDesc', width: 120, headerName: '底膜存货描述', menuTabs: ['filterMenuTab'] },
    { field: 'hardness', width: 120, headerName: '硬度', menuTabs: ['filterMenuTab'] },
    { field: 'lockId', width: 120, headerName: '锁库标识', menuTabs: ['filterMenuTab'] },
    { field: 'lockQuantity', width: 120, headerName: '锁库数量', menuTabs: ['filterMenuTab'] },
    { field: 'lockType', width: 120, headerName: '锁库类型', menuTabs: ['filterMenuTab'] },
    { field: 'stockStatus', width: 120, headerName: '库存状态', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,4).label' },
    { field: 'plateLength', width: 120, headerName: '板长', menuTabs: ['filterMenuTab'] },
    { field: 'formerBatchCode', width: 120, headerName: '原批号', menuTabs: ['filterMenuTab'] },
    { field: 'theoreticalWeight', width: 120, headerName: '理重', menuTabs: ['filterMenuTab'] },
    { field: 'trmming', width: 120, headerName: '是否切边', menuTabs: ['filterMenuTab'] },
    { field: 'tolerance', width: 120, headerName: '公差（标签厚度减去实厚）', menuTabs: ['filterMenuTab'] },
    { field: 'sleeveType', width: 120, headerName: '套筒类型', menuTabs: ['filterMenuTab'] },
    { field: 'sleeveWeight', width: 120, headerName: '套筒重量', menuTabs: ['filterMenuTab'] },
    { field: 'prodType', width: 120, headerName: '形式', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,5).label' },
    { field: 'pricingType', width: 120, headerName: '计价方式', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,6).label' },
    { field: 'labelSpecs', width: 120, headerName: '标签规格', menuTabs: ['filterMenuTab'] },
    { field: 'paperPlate', width: 120, headerName: '纸板', menuTabs: ['filterMenuTab'] },
    { field: 'quantityUnstocked', width: 120, headerName: '待入库数量', menuTabs: ['filterMenuTab'] },
    { field: 'quantityUnshipped', width: 120, headerName: '待发货数量', menuTabs: ['filterMenuTab'] },
    { field: 'quantityTransferring', width: 120, headerName: '调拨在途数量', menuTabs: ['filterMenuTab'] },
    { field: 'quantityUntransferred', width: 120, headerName: '调拨待发数量', menuTabs: ['filterMenuTab'] },
    { field: 'boxType', width: 120, headerName: '箱体类型', menuTabs: ['filterMenuTab'] },
    { field: 'entrustedProcessing', width: 120, headerName: '是否受托', menuTabs: ['filterMenuTab'] },
    { field: 'haveContract', width: 120, headerName: '是否有合同', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,2).label' },
    { field: 'itemDescription', width: 120, headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'standardType', width: 120, headerName: '规格型号', menuTabs: ['filterMenuTab'] },
    { field: 'weight', width: 120, headerName: '净重', menuTabs: ['filterMenuTab'] },    
    { field: 'grossWeight', width: 120, headerName: '毛重', menuTabs: ['filterMenuTab'] },
    { field: 'lastEnterDate', width: 120, headerName: '最新入库日期', menuTabs: ['filterMenuTab'] },
    { field: 'coatingLength', width: 120, headerName: '胶膜长度', menuTabs: ['filterMenuTab'] },
    { field: 'paperLength', width: 120, headerName: '垫纸长度', menuTabs: ['filterMenuTab'] },
  ];     
  subsectionStateOptions: any[] = [];
  YesNoOptions: any[] = [];
  packTypeOptions: any[] = [];
  prodTypeOptions: any[] = [];
  pricingTypeOptions: any[] = [];
 
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.subsectionStateOptions;
        break;
      case 2:
        options = this.YesNoOptions;
        break;
      case 3:
        options = this.packTypeOptions;
        break;
      case 4:
        options = this.stockStatusOptions;
        break;
      case 5:
        options = this.prodTypeOptions;
        break;
      case 6:
        options = this.pricingTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  // expColumns = [
  //   { field: 'plantCode', title: '工厂', width: 120, locked: false },
  //   { field: 'subinventoryCode', title: '实体仓库编码', width: 90, locked: false },
  //   { field: 'subinventoryAllocation', title: '库位编码', width: 130, locked: false },
  //   { field: 'itemId', title: '存货编码', width: 190, locked: false },
  //   { field: 'skuName', title: '存货名称', width: 350, locked: false },
  //   { field: 'onhandQuantity', title: '现存量', width: 90, locked: false },
  //   { field: 'unitName', title: '单位', width: 90, locked: false },
  //   { field: 'batchCode', title: '成品批号', width: 120, locked: false },
  //   { field: 'steelGrade', title: '钢种', width: 120, locked: false },
  //   { field: 'surface', title: '表面', width: 120, locked: false },
  //   { field: 'spec', title: '规格尺寸', width: 120, locked: false },
  //   { field: 'grade', title: '等级', width: 120, locked: false },
  //   { field: 'coating', title: '表面保护', width: 120, locked: false },
  //   { field: 'actHeight', title: '实厚', width: 120, locked: false },
  //   { field: 'actWidth', title: '实宽', width: 120, locked: false },
  //   { field: 'unitWeight', title: '单重', width: 120, locked: false },
  //   { field: 'rollLength', title: '卷长', width: 120, locked: false },
  //   { field: 'quality', title: '品质信息', width: 120, locked: false },
  //   { field: 'inBatchCode', title: '来料批号', width: 120, locked: false },
  //   { field: 'avaQuantity', title: '可用量', width: 120, locked: false },
  //   { field: 'entryTime', title: '入库时间', width: 120, locked: false },
  //   { field: 'subsectionState', title: '分卷状态', width: 120, locked: false },
  //   { field: 'rewinding', title: '重卷次数', width: 120, locked: false },
  //   { field: 'coilInnerDia', title: '钢卷内径', width: 120, locked: false },
  //   { field: 'packType', title: '包装方式', width: 120, locked: false },
  //   { field: 'fullVolume', title: '是否整卷', width: 120, locked: false },
  //   { field: 'entryTime', title: '入库时间', width: 120, locked: false },
  //   { field: 'entryTime', title: '入库时间', width: 120, locked: false },
  // ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private querySerive: QueryService,
    private querydata: ItemonhandQueryService,
    private appConfigService: AppConfigService,
    private appTranslationService: AppTranslationService,
    public msgSrv: NzMessageService,
    private commonquery: PlanscheduleHWCommonService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.LoadData().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async LoadData() {
    await this.commonquery.GetLookupByTypeRefZip({
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_STOCK_STATUS': this.stockStatusOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
    });
    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
    this.querySerive.SearchSubInventory(this.queryParams.values.PLANT_CODE).subscribe(result => {
      result.data.forEach(element => {
        this.subInventorys.push({
          label: element,
          value: element
        });
      });
    });
  }
  add() {
    this.modal
      .static(
        MaterialmanagementItemonhandqueryEditComponent,
        { i: { Id: 1 } },
        'lg'
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  GetqueryParams(isExport: boolean = false) {
    return {
      plantCode: this.queryParams.values.PLANT_CODE,
      itemCode: this.queryParams.values.ITEM_CODE.value,
      spec: this.queryParams.values.spec,
      subinventoryAllocation: this.queryParams.values.SUBINVENTORY_ALLOCATION,
      makeOrderNum: this.queryParams.values.makeOrderNum,
      whName: this.queryParams.values.whName.text,
      batchCode: this.queryParams.values.batchCode,
      surface: this.queryParams.values.SURFACE,
      steelGrade: this.queryParams.values.steelGrade,
      stockStatus: this.queryParams.values.stockStatus,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  queryCommon() {
    this.querySerive.loadGridViewNew(this.httpAction, this.GetqueryParams(), this.context);
  }

  public detail(item: any) {
    this.modal
      .static(
        MaterialmanagementListItemonhandchildComponent,
        {
          p: {
            plantCode: (item !== undefined ? item.plantCode : null),
            currentSubinventoryCode: (item !== undefined ? item.subinventoryCode : null),
            currentSubinventoryAllo: (item !== undefined ? item.subinventoryAllocation : null),
            itemCode: (item !== undefined ? item.itemCode : null)
          }
        },
        'lg',
      )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  clear() {
    this.queryParams.values = {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      ITEM_CODE: { value: '', text: '' },
      spec: null,
      SUBINVENTORY_ALLOCATION: '',
      SURFACE: '',
      steelGrade: '',
      whName: { value: '', text: '' },
      makeOrderNum: '',
      batchCode: '',
      stockStatus: null,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  expColumnsOptions: any[] = [
    { field: 'subsectionState', options: this.subsectionStateOptions },
    { field: 'fullVolume', options: this.YesNoOptions },
    { field: 'rewinding', options: this.YesNoOptions },
    { field: 'entrustedProcessing', options: this.YesNoOptions },
    { field: 'haveContract', options: this.YesNoOptions },
    { field: 'stockStatus', options: this.stockStatusOptions },
    { field: 'packType', options: this.packTypeOptions },
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'pricingType', options: this.pricingTypeOptions },
    { field: 'stockStatus', options: this.stockStatusOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.querySerive.exportAction(this.httpAction, this.GetqueryParams(true), this.excelexport);
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getProductions({
      plantCode: PLANT_CODE || this.appConfigService.getActivePlantCode(),
      stockCodeOrName: ITEM_CODE,
      pageIndex: PageIndex,
      pageSize: PageSize
    }).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
  }

  onItemsTextChanged(e) {
    const ITEM_CODE = e.Text.trim();
    if (ITEM_CODE !== '') {
      this.commonquery.getProductions({
        plantCode: this.queryParams.values.PLANT_CODE || this.appConfigService.getActivePlantCode(),
        stockCodeOrName: ITEM_CODE,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if (res.data.content.length > 0) {
          this.queryParams.values.ITEM_CODE = { value: res.data.content[0].stockCode, text: res.data.content[0].stockCode };
        } else {
          this.queryParams.values.ITEM_CODE = { value: '', text: '' };
          this.msgSrv.warning(this.appTranslationService.translate('此存货编码无效'));
        }
      });
    }
  }

  plantChange(value: any) {
    this.subInventorys.length = 0;
    this.querySerive.SearchSubInventory(value).subscribe(result => {
      result.data.forEach(element => {
        this.subInventorys.push({
          label: element,
          value: element
        });
      });
    });
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
      this.queryCommon();
    } else {
      this.setLoading(false);
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
    const fields = ['avaQuantity', 'theoreticalWeight', 'weight', 'onhandQuantity', 'quantityUnstocked', 'quantityUnshipped'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  /**
     * 仓库弹出查询
     * @param {any} e
     */
  public searchWares(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadWares(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载仓库
   * @param {string} subinventoryCode  仓库编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadWares(
    subinventoryCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.querySerive
      .getWares({
        plantCode: this.queryParams.values.PLANT_CODE,
        subinventoryCode: subinventoryCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewWares.data = res.data.content;
        this.gridViewWares.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onWaresSelect(e: any) {
    this.queryParams.values.whName = {
      value: e.Row.subinventoryCode,
      text: e.Row.subinventoryDescription,
    };
  }

  onWaresTextChanged(event: any) {
    const subinventoryCode = event.Text.trim();
    if (subinventoryCode !== '') {
      this.querySerive
        .getWares({
          plantCode: this.queryParams.values.PLANT_CODE,
          subinventoryCode: subinventoryCode,
          pageIndex: 1,
          pageSize: 1,
        }).subscribe(res => {
          if (res.data.content.length > 0) {
            // 判断转入转出仓库是否相同
            this.queryParams.values.whName = {
              value: res.data.content[0].subinventoryCode,
              text: res.data.content[0].subinventoryDescription,
            };
          } else {
            this.queryParams.values.whName = {
              value: '',
              text: ''
            };
            this.msgSrv.info(this.appTranslationService.translate('仓库编码无效'))
          }
        });
    } else {
      this.queryParams.values.whName = {
        value: '',
        text: ''
      };
    }
  }
}
