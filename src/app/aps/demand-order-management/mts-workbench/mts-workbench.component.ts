import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { State, process } from '@progress/kendo-data-query';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { GridDataResult, SelectableSettings, } from '@progress/kendo-angular-grid';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { DemandOrderManagementMtsWorkbenchViewComponent } from './view/view.component';
import { DemandclearupnoticeService } from '../../../modules/generated_module/services/demandclearupnotice-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { InventoryDetailComponent } from '../inventory-calculation/detail/detail.component';
import { formatDate } from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-mts-workbench',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mts-workbench.component.html',
  providers: [QueryService],
})
export class DemandOrderManagementMtsWorkbenchComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;

  public view = {
    data: [],
    total: 0,
  };
  IDList = '';
  beginTmpDate = new Date();
  public gridHeight = 400;
  public totalCount = 0;
  public context = this;
  public str: any;
  plantOptions: any[] = [];
  queryParamsOption: any = {};
  searchParans: any = {};
  dateRange: any[] = [];
  lastDateRange: any[] = [];
  public gridData: any[] = null;
  public selectableSettings: SelectableSettings;
  public mySelection: any[] = [];
  public extendColumns: any[] = []; // 日期扩展列
  /** 标注MTS开始类型*/
  _oldMtsType = 0;
  _newMtsType = 0;

  set mtsType(val) {
    this._oldMtsType = this._newMtsType;
    this._newMtsType = val;
  }

  get mtsType() {
    return this._newMtsType;
  }

  mtsTypes: string[] = ['MTS内销订单', 'MTS外销订单'];

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };

  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      {
        field: 'strItemCodeFrom', title: '物料编码', ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
        },
      },

      { field: 'dateTimeRange', title: '时间范围', ui: { type: UiType.dateRange } },
      { field: 'isPlanOrder', title: '计划单大于0', ui: { type: UiType.checkbox } },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      strItemCodeFrom: { value: '', text: '' },
      // strItemCodeTo: { value: '', text: '' },
      dateTimeRange: [],
      isPlanOrder: false
    },
  };

  columnTypes = {
    'rowSpan': {
      rowSpan: params => {
        if (params.data.attribute3 === this.mtsTypes[this.mtsType]) {
          return params.data.ITEM_MERGE;
        } else {
          return 1;
        }
      },
      cellClassRules: { 'agGridShowCell': 'value !== undefined' },
      pinned: 'left',
      lockPinned: true,
    },
  };

  staticcolumns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: (dataItem) => {

        return this.canChecked(dataItem);
      },
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'plantCode', headerName: '工厂',
      width: 70,
      type: 'rowSpan', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemCode', headerName: '物料编码',
      width: 130,
      type: 'rowSpan', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemDesc', headerName: '物料描述',
      width: 130,
      type: 'rowSpan', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'transferStatus', headerName: '状态',
      width: 70,
      type: 'rowSpan', menuTabs: ['filterMenuTab'],
    },

    // {
    //   field: 'ATTRIBUTE5', headerName: '来源类型',
    //   width: 130,
    //   type: 'rowSpan',
    // },
    {
      field: 'attribute3',
      headerName: '来源分类',
      pinned: 'left',
      lockPinned: true,
      width: 130,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'beginning', headerName: '期初', pinned: 'left', lockPinned: true,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
      width: 90, menuTabs: ['filterMenuTab'],
    },
  ];
  columns = this.staticcolumns;
  expColumns: any[] = [];
  sources: any[] = [];
  status: any[] = [];
  formGroup: FormGroup;
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  private components;

  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private formBuilder: FormBuilder,
    public commonQueryService: QueryService,
    private commonService: CommonQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private demandclearupnoticeService: DemandclearupnoticeService,
    private appConfigService: AppConfigService,
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.components = { showCellRenderer: createShowCellRenderer() };
    this.headerNameTranslate(this.columns);
    this.setGridHeight({ topMargin: 20, bottomMargin: this.pagerHeight + 136 });
  }

  public clear() {
    // 默认开始时间为当前时间，结束时间为当前时间+15天
    const tf = new Date();
    const tt = this.commonQueryService.addDays(tf, 15);
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      dateTimeRange: [tf, tt],
      strItemCodeFrom: { value: '', text: '' },
      isPlanOrder: false
      // strItemCodeTo: { value: '', text: '' },
    };
  }

  public ngOnInit(): void {
    this.columns[this.columns.length - 1].cellRendererParams.customTemplate = this.customTemplate;

    this.defaultColDef.sortable = false;
    this.defaultColDef.filter = false;
    this.selectableSettings = {
      checkboxOnly: true,
      mode: 'multiple',
    };
    this._pageSize = 10;
    this.loadOptions();
    this.clear();
    this.query();
  }

  canChecked(dataItem: any) {
    if (dataItem.data.attribute3 === this.mtsTypes[this.mtsType]) {
      return true;
    }
    return false;
  }

  private loadOptions() {
    // 加载工厂
    this.commonQueryService.GetUserPlantNew()
      .subscribe(result => {
        this.plantOptions.length = 0;
        result.data.forEach(d => {
          this.plantOptions.push({ value: d.plantCode, label: d.plantCode });
        });
      });

    /** 初始化 需求来源*/
    this.commonService.GetLookupByTypeNew('PP_DM_SOURCE_SYSTEM').subscribe(result => {
      this.sources.length = 0;
      result.data.forEach(d => {
        this.sources.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    /** 初始化 状态*/
    this.status.length = 0;
    this.commonService.GetLookupByTypeNew('PP_DM_PUBLISH_STATUS').subscribe(result => {
      result.data.forEach(d => {
        this.status.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    if (this.status.length === 0) {
      this.status = [{ value: '0', label: '未发布' }, { value: '1', label: '已发布' }];

    }

  }

  // 物料弹出查询
  public searchItemsFrom(e: any) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
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

  query() {
    super.query();
    this.queryCommon();
  }

  private cloneParam(): any {
    const dto = {
      plantCode: this.queryParams.values.plantCode,
      startDate: this.queryParams.values.dateTimeRange.length > 0 ? formatDate(this.queryParams.values.dateTimeRange[0], 'yyyy-MM-dd', 'zh-Hans') : null,
      endDate: this.queryParams.values.dateTimeRange.length > 0 ? formatDate(this.queryParams.values.dateTimeRange[1], 'yyyy-MM-dd', 'zh-Hans') : null,
      itemCode: this.queryParams.values.strItemCodeFrom.text,
      // strItemCodeTo: this.queryParams.values.strItemCodeTo.text,
    };
    return dto;
  }

  public queryCommon() {
    this.setLoading(true);
    const tfCompare = new Date();
    const tt1 = this.commonQueryService.addDays(tfCompare, -1);
    const tf1 = new Date(this.queryParams.values.dateTimeRange[0]);
    if (tf1 < tt1) {
      const msg = this.appTranslationService.translate('查询开始日期不能小于当前日期');
      this.msgSrv.info(msg);
      return;
    }
    // 设置扩展列头
    let isChange = false;
    if (this.lastDateRange == null || this.lastDateRange[0] !== this.queryParams.values.dateTimeRange[0] || this.lastDateRange[1] !== this.queryParams.values.dateTimeRange[1]) {
      // 时间范围有修改
      isChange = true;
    }
    if (isChange) {
      // 加载列头
      this.extendColumns = [];
      const tt = new Date(this.queryParams.values.dateTimeRange[0]);
      const tf = new Date(this.queryParams.values.dateTimeRange[1]);
      const weekDays = this.appTranslationService.translate('日一二三四五六');
      if (tt < tf) {
        for (const dt = tt; dt <= tf;) {
          this.str = this.getDateFormat(dt);
          const reg = new RegExp('-', 'g'); // 创建正则RegExp对象
          // const col = { field: 'COL' + this.str.replace(reg, ''), headerName: this.str, width: 120, locked: false };
          const col = {
            field: 'COL' + this.str.replace(reg, ''),
            headerName: (this.str.substring(5) + '(' + weekDays.charAt(dt.getDay()) + ')'),
            title: this.commonQueryService.formatDate(dt),
            cellRendererFramework: CustomOperateCellRenderComponent,
            cellRendererParams: {
              customTemplate: this.customTemplate1,
              str: this.str.replace(reg, ''),
            },
            width: 100,
            lockPinned: false,
            originDate: this.str,
          };
          this.extendColumns.push(col);
          dt.setDate(dt.getDate() + 1);
        }
      }
      this.columns = [...this.staticcolumns, ...this.extendColumns];
      this.lastDateRange = [this.queryParams.values.dateTimeRange[0], this.queryParams.values.dateTimeRange[1]];
    }
    const queryValues = this.cloneParam();
    // queryValues.pageIndex = this._pageNo;
    // queryValues.pageSize = this._pageSize;
    queryValues.isExport = false;

    this.commonQueryService.Search(queryValues).subscribe(result => {
      this.gridData = this.createDataSource(result);
      if (this.gridData[0].attribute3 === 'MTS外销订单') {
        this.mtsType = 1;
      }

      const mergerow = this.strToNumber(this.gridData[0]['ITEM_MERGE']);
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length, // this.gridState.take,
          filter: this.gridState.filter,
        }).data,
        total: this.totalCount * mergerow,
      };
      this.setLoading(false);
    },
    );
  }

  // 生成工单
  setReqOrder() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('系统将提交请求生成净需求数据，是否继续生成?'),
      nzOnOk: () => {
        this.commonQueryService.setReqOrder(this.queryParams.values.plantCode).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success('生成净需求请求已提交，请等候处理');
            this.query();
          } else {
            this.msgSrv.error(res.msg);
          }
        });
      },
    });

  }


  public export() {
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    // this.extendColumns.length = 0;
    this.expColumns = [];
    this.staticcolumns.forEach(dr => {
      const str = { field: dr.field, title: dr.headerName, width: dr.width };
      this.expColumns.push(str);
    });
    this.extendColumns.forEach(dr => {
      const str = { field: dr.field, title: dr.headerName, width: dr.width };
      this.expColumns.push(str);
    });
    const queryValues = this.cloneParam();
    queryValues.isExport = true;
    this.commonQueryService.Search(queryValues).subscribe(result => {
      const _gridData = this.createDataSource(result);
      this.excelexport.export(_gridData);
    });
  }

  getsearchParameter() {
    const pageNo = this.gridState.skip / this.gridState.take + 1;
    const pageSize = 10000000; // this.gridState.take
    this.searchParans = {
      strPlantCode: this.queryParamsOption.strPlantCode,
      startBegin: this.getDateFormat(this.queryParamsOption.strTimeRange[0]),
      startEnd: this.getDateFormat(this.queryParamsOption.strTimeRange[1]),
      pageIndex: pageNo,
      pageSize: pageSize,
      IsExport: false, // 是否导出
    };
  }

  // 获取特定日期的汇总数量
  getDateSum(dataSet: any, dateColName: string, qtyColName: string, colName: string) {
    let retQty = null;
    dataSet.forEach(dd => {
      if (this.getDateFormat(new Date(dd[dateColName])) === colName) {
        retQty = this.strToNumber(retQty) + this.strToNumber(dd[qtyColName]);
      }
    });
    return retQty;
  }

  public otherInfo() {
    const param = {
      strType: 'OtherInfo',
      strPlantCode: this.queryParams.values.plantCode,
      strItemCodeFrom: '',
      strfieldName: '',
      strtitleName: '',
      startDate: '',
      fixColName: this.fixColName,
      sources: this.sources,
    };
    this.modal.static(DemandOrderManagementMtsWorkbenchViewComponent, { iParam: param }, 'lg')
      .subscribe(() => {
        // this.query();
      });
  }

  inventoryCheck() {
    this.modal.static(
      InventoryDetailComponent,
      {
        params: {
          PlantCode: this.queryParams.values.plantCode,
          StartDatetime: this.queryParams.values.dateTimeRange[0],
          EndDatetime: this.queryParams.values.dateTimeRange[1],
        }
      },
      'lg'
    ).subscribe(res => { });
  }

  public publish() {
    this.IDList = '';
    const gridSelectRows = this.gridApi.getSelectedRows();
    if (gridSelectRows) {
      gridSelectRows.forEach(item => {
        this.IDList += item.ITEM_ID + ',';
      });
    }
    console.log(this.IDList);
    if (gridSelectRows.length === 0) {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('没有勾选数据，继续提交将发布整个工厂的数据，是否继续发布?'),
        nzOnOk: () => {
          this.demandclearupnoticeService.PublishData(this.queryParams.values.plantCode, []).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('发布请求已提交，请等候处理'));
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
            this.query();
          });
        },
      });
    } else {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('系统将发布已勾选数据，是否继续发布?'),
        nzOnOk: () => {
          this.demandclearupnoticeService.PublishData(this.queryParams.values.plantCode, gridSelectRows.map(item => item.itemId)).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('发布请求已提交，请等候处理'));
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
            this.query();
          });
        },
      });
    }
  }

  // 常量列
  fixColName: any[] = [];

  // 处理数据源
  createDataSource(result: any): any[] {
    if (result == null || result.data == null) return;
    // 头数据源
    const dtHeader = result.data;
    this.fixColName = [];
    // this.extendColumns.length = 0;
    // PEGGING_DATA
    const dtPegging = result.extra.peggingData;
    const dtSUPPLY_DATA = result.extra.supplyData;
    const dtDEMAND_DATA = result.extra.demandData;
    // PLAN_OPTION
    const dtPlanOption = result.extra.planOption;
    const out_index = dtPlanOption.findIndex(item => item.sourceCategory === 'MTS_OUT');
    if (out_index >= 0) {
      dtPlanOption.unshift(...dtPlanOption.splice(out_index, 1));
    }
    const in_index = dtPlanOption.findIndex(item => item.sourceCategory === 'MTS_IN');
    if (in_index >= 0) {
      dtPlanOption.unshift(...dtPlanOption.splice(in_index, 1));
    }
    this.beginTmpDate = new Date(this.queryParams.values.dateTimeRange[0]);
    const beginDate = this.beginTmpDate.toLocaleDateString();
    dtPlanOption.forEach(d => {
      const sourcetypeadd = { ATTRIBUTE2: d.sourceCategory, ATTRIBUTE3: d.commentary, ATTRIBUTE4: d.sourceType };
      this.fixColName.push(sourcetypeadd);
    });

    const planOrder = { ATTRIBUTE2: 'PLAN_ORDER', ATTRIBUTE3: '计划单', ATTRIBUTE4: '供应' };
    this.fixColName.push(planOrder);
    const stockMove = { ATTRIBUTE2: 'DEDUCT_STOCK', ATTRIBUTE3: '推演库存', ATTRIBUTE4: 'N' };
    this.fixColName.push(stockMove);
    const _gridData = [];
    const _gridData1 = [];
    dtHeader.forEach(d => {
      let demandBegin = 0;
      let supplyBegin = 0;
      const publishStatus = this.status.find(x => x.value === d.transferStatus);
      if (publishStatus !== undefined) {
        d.transferStatus = publishStatus.label;
      }
      this.fixColName.forEach(df => {
        const dt = Object.assign({}, d);
        dt.attribute2 = df.ATTRIBUTE2; // 来源分类
        dt.attribute3 = df.ATTRIBUTE3;
        dt.attribute4 = df.ATTRIBUTE4;
        let _dtPegging = [];
        let _dtSupplyDemand = [];
        if (dt.attribute4 === '需求') {
          _dtPegging = dtDEMAND_DATA.filter(dd => dd.plantCode === d.plantCode && dd.itemCode === d.itemCode && dd.reqSource === d.reqSource && dd.reqSourceCategory === dt.attribute2);
          // 计算期初
          dt.beginning = this.getBeginHisSum(_dtPegging, 'reqDate', beginDate, 'reqQty');
        } else if (dt.attribute4 === '供应') {
          _dtPegging = dtSUPPLY_DATA.filter(dd => dd.plantCode === d.plantCode && dd.itemCode === d.itemCode && dd.supplySource === d.reqSource && dd.supplySourceCategory === dt.attribute2);
          // 计算期初
          dt.beginning = this.getBeginHisSum(_dtPegging, 'supplyDate', beginDate, 'supplyQty');
          if (dt.attribute2 === 'PLAN_ORDER' && dt.beginning > 0) {
            dt['lastUpdatedBy'] = 'OK';
            console.log('OK');
          }
        }
        else {//推演库存
          let _dtPegging1 = dtDEMAND_DATA.filter(dd => dd.plantCode === d.plantCode && dd.itemCode === d.itemCode && dd.reqSource === d.reqSource);
          // 计算需求期初
          const demandBegin1 = this.getBeginHisSum(_dtPegging1, 'reqDate', beginDate, 'reqQty');
          let _dtPegging2 = dtSUPPLY_DATA.filter(dd => dd.plantCode === d.plantCode && dd.itemCode === d.itemCode && dd.supplySource === d.reqSource);
          // 计算供应期初
          const supplyBegin1 = this.getBeginHisSum(_dtPegging2, 'supplyDate', beginDate, 'supplyQty');
          dt.beginning = supplyBegin1 - demandBegin1;
          if (dt.attribute2 === 'PLAN_ORDER' && dt.beginning > 0) {
            dt['lastUpdatedBy'] = 'OK';
            console.log('OK');
          }
        }
        let currentDate = '2019-09-10';
        this.extendColumns.forEach(dc => {
          const t1 = new Date(this.queryParams.values.dateTimeRange[0]);
          const t2 = new Date(dc.originDate + ' 00:00:00');
          currentDate = dc.originDate;
          if (dt.attribute4 === '需求') {
            dt[dc.field] = this.getDateSum(_dtPegging, 'reqDate', 'reqQty', dc.originDate);
          } else if (dt.attribute4 === '供应') {
            dt[dc.field] = this.getDateSum(_dtPegging, 'supplyDate', 'supplyQty', dc.originDate);
            if (dt.attribute2 === 'PLAN_ORDER' && dt[dc.field] > 0) {
              dt['lastUpdatedBy'] = 'OK';
              console.log('OK');
            }
          } else {// 来源分类=推演库存
            let _dtPegging1 = dtDEMAND_DATA.filter(dd => dd.plantCode === d.plantCode && dd.itemCode === d.itemCode && dd.reqSource === d.reqSource);
            // 计算需求期初
            const demandBegin1 = this.getBeginSum(_dtPegging1, 'reqDate', dc.originDate, 'reqQty');
            let _dtPegging2 = dtSUPPLY_DATA.filter(dd => dd.plantCode === d.plantCode && dd.itemCode === d.itemCode && dd.supplySource === d.reqSource);
            // 计算供应期初
            const supplyBegin1 = this.getBeginSum(_dtPegging2, 'supplyDate', dc.originDate, 'supplyQty');
            dt[dc.field] = supplyBegin1 - demandBegin1;

            if (dt.attribute2 === 'PLAN_ORDER' && dt[dc.field] > 0) {
              dt['lastUpdatedBy'] = 'OK';
              console.log('OK');
            }
          }
        });

        dt['ITEM_MERGE'] = dtPlanOption.length + 2; // 合并行数 ,+2是因为计划单， 推演库存这2个不在计划选项表的需要加上
        _gridData.push(dt);
      });
    });
    console.log(_gridData);
    let listPlanOrder = _gridData.filter(dd => dd.lastUpdatedBy === 'OK');
    console.log(listPlanOrder);
    _gridData.forEach(dc => {
      const addObject = listPlanOrder.find(x => x.plantCode === dc.plantCode && x.itemCode === dc.itemCode && x.action === dc.action && x.transferStatus === dc.transferStatus);
      if (addObject !== undefined) {
        _gridData1.push(dc);
      }
    });
    console.log(_gridData1);
    if (this.queryParams.values.isPlanOrder === true) {
      return _gridData1;
    } else {
      return _gridData;
    }

  }

  strToNumber(str: any) {
    if (str == null || str.length === 0) return 0;
    return Number(str);
  }

  getDateFormat(dt: Date) {
    return this.commonQueryService.formatDate(dt);
  }

  // 获取期初数
  getBeginSum(dataSet: any, dateColName: string, startBegin: string, qtyColName: string) {
    let retQty = 0;
    dataSet.forEach(dd => {
      if (dd[dateColName] !== null) {
        if (this.commonQueryService.CompareDate(dd[dateColName], startBegin + ' 23:59:59') < 0) {
          retQty = retQty + this.strToNumber(dd[qtyColName]);
        }
      }
    });
    return retQty;
  }

  // 获取期初的历史数
  getBeginHisSum(dataSet: any, dateColName: string, startBegin: string, qtyColName: string) {
    let historyQty = 0;
    dataSet.forEach(dd => {
      if (dd[dateColName] !== null) {
        if (this.commonQueryService.CompareDate(dd[dateColName], startBegin + ' 00:00:00') < 0) {
          historyQty = historyQty + this.strToNumber(dd[qtyColName]);
        }
      }
    });
    return historyQty;
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
      // this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  // 单元格双击
  onCellDoubleClicked(event) {
    if (event.value === null || event.value === 0 || event.colDef.field === 'plantCode' || event.colDef.field === 'itemCode' || event.colDef.field === 'action' || event.colDef.field === 'transferStatus' || event.colDef.field === 'reqSource') {
      return;
    }
    const startBegin = this.queryParams.values.dateTimeRange[0];
    const startTmpBegin = this.beginTmpDate.toLocaleDateString();
    let rowType = event.data.attribute4; // 供应 需求
    const SOURCE_CATEGORY = event.data.attribute2; // 来源分类
    const PLANT_CODE = event.data.plantCode;
    const REQ_SOURCE = event.data.reqSource;
    const ITEM_CODE = event.data.itemCode;
    if (rowType === '需求' || rowType === '供应') {
      const param = {
        strType: rowType,
        strPlantCode: PLANT_CODE,
        strItemCodeFrom: ITEM_CODE,
        strfieldName: event.colDef.field, //  COL20190103
        strtitleName: event.colDef.title,
        startBegin: startBegin,
        fixColName: this.fixColName,
        sources: this.sources,
        strReqSource: REQ_SOURCE,
        strReqSourceCategory: SOURCE_CATEGORY,
        plantOptions: this.plantOptions,
      };
      if (this.checkEventTriggered()) return;
      this.modal.static(DemandOrderManagementMtsWorkbenchViewComponent, { iParam: param }, 'lg')
        .subscribe(() => {
          this.hasEventTriggered = false;
        });
    }
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    // this.queryCommon();
  }

  selectRow: any = [];
  selectColumn: any;
  dateClick: any = null;
}

function createShowCellRenderer() {
  function ShowCellRenderer() {
  }

  ShowCellRenderer.prototype.init = function (params) {
    const cellBlank = !params.value;
    if (cellBlank) {
      return null;
    }
    this.ui = document.createElement('div');
    this.ui.innerHTML =
      '<div class="agGridShowCell">' +
      params.value.attribute3 +
      '' +
      '</div>';
  };
  ShowCellRenderer.prototype.getGui = function () {
    return this.ui;
  };
  return ShowCellRenderer;
}
