import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { deepCopy } from '@delon/util';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BrandService } from 'app/layout/pro/pro.service';

import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext, LookupItem } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { MessageManageService } from 'app/modules/generated_module/services/message-manage-service';
import { SopDemandAnalysisdm } from 'app/modules/generated_module/services/sopdemandanalysisdm-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ProductSellBalanceForecastService } from '../product-sell-balance-forecast.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

export class DemandCustomizationBasic extends CustomBaseContext implements OnInit {
  public gridStateKey = 'demand-customization';
  public BtnImg = {
    addImgSrc: '/assets/imgs/base-icon/基础icon-新增.svg',
    save: '/assets/imgs/planSchedule/11.svg',
    save_disabled: '/assets/imgs/planSchedule/11_un.svg',
  };
  public mothOptions: any[] = []; // 月份
  public salesCatgoryBigOptions: any[] = []; // 产品大类
  public salesCatgorySubOptions: any[] = []; // 产品小类
  public plantOptions: Set<any> = new Set(); // 工厂
  public businessUnitOptions: Set<any> = new Set(); // 事业单位
  public userPrivilage: any[] = []; // 用户的授权数据
  public salesTypeOptions: Set<LookupItem> = new Set<LookupItem>(); // 内外销
  public valueChangedItem = new Map(); // 更新的项数组
  // public valueChangedItem = []; // 更新的项数组

  public queryParams = {
    defines: [
      { field: 'BUSINESS_UNIT_CODE', title: '事业部', required: true, ui: { type: UiType.select, options: this.businessUnitOptions, /*optionsLabel: 'SCHEDULE_REGION_CODE',*/optionsLabel: 'DESCRIPTIONS2', optionsValue: 'SCHEDULE_REGION_CODE', ngModelChange: this.onBusinessUnitCodeChange } },
      { field: 'SALES_TYPE', title: '内外销', ui: { type: UiType.select, options: this.salesTypeOptions, optionsLabel: 'Text', optionsValue: 'Text', /* optionsValue: 'Code'*/ } },
      { field: 'DEMAND_DATE', title: '月份', required: true, ui: { type: UiType.monthPicker, format: 'yyyy-MM' } },
      { field: 'PLANT_CODE', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, optionsLabel: 'PLANT_CODE', optionsValue: 'PLANT_CODE' } },
      { field: 'SALES_CATGORY_BIG', title: '产品大类', ui: { type: UiType.select, options: this.salesCatgoryBigOptions, optionsLabel: 'NAME', optionsValue: 'NAME' } },
      { field: 'SALES_CATGORY_SUB', title: '产品小类', ui: { type: UiType.select, options: this.salesCatgorySubOptions, optionsLabel: 'NAME', optionsValue: 'NAME' } },
    ],
    values: {
      BUSINESS_UNIT_CODE: null,
      SALES_TYPE: null,
      DEMAND_DATE: '',
      SALES_CATGORY_BIG: null,
      SALES_CATGORY_SUB: null,
      PLANT_CODE: null,
    }
  };

  public columns = [];
  public origin_columns = [{ field: 'BUSINESS_UNIT_CODE', headerName: '事业部', menuTabs: ['filterMenuTab'] },
  { field: 'PLANT_CODE', headerName: '产地', menuTabs: ['filterMenuTab'] },
  { field: 'SALES_TYPE', headerName: '内外销', menuTabs: ['filterMenuTab'] },
  {
    field: 'DEMAND_DATE',
    headerName: '月份',
    valueFormatter: 'ctx.demandDateFormatter(value)', menuTabs: ['filterMenuTab']
  },
  { field: 'SALES_CATGORY_BIG', headerName: '产品大类', menuTabs: ['filterMenuTab'] },
  { field: 'SALES_CATGORY_SUB', headerName: '产品小类', menuTabs: ['filterMenuTab'] },
  { field: 'PS_ITEM.ITEM_CODE', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
  { field: 'PS_ITEM.DESCRIPTIONS_CN', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
  {
    field: 'IS_NEW',
    headerName: '是否新品',
    valueFormatter: 'ctx.isNewFormatter(data)', menuTabs: ['filterMenuTab']
  },
  { field: 'NEW_PRODUCT_NAME', headerName: '新品描述', menuTabs: ['filterMenuTab'] },
  { field: 'PRICE', headerName: '单价', menuTabs: ['filterMenuTab'] },
  { field: 'AVG_SALES', headerName: '月均分销量', menuTabs: ['filterMenuTab'] },
  { field: 'NO_SHIPMENT_AND_UNMET', headerName: '未发订单', menuTabs: ['filterMenuTab'] },
  { field: 'ONHAND', headerName: '当前库存', headerClass: '', editable: false, periodIndex: 0, menuTabs: ['filterMenuTab'] },
  { field: 'APPROVE_STATUS', headerName: '审批状态', headerClass: '', editable: false, periodIndex: 0, menuTabs: ['filterMenuTab'] },
  ];


  constructor(public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public messageManageService: MessageManageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public innerService: ProductSellBalanceForecastService,
    public sopDemandAnalysisdmService: SopDemandAnalysisdm,
    public appGridStateService: AppGridStateService,
    public appConfigService: AppConfigService) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      commonQuerySrv: innerService,
      appGridStateService: appGridStateService
    });
    this.headerNameTranslate(this.origin_columns);
  }

  ngOnInit() {
    this.cloneQueryParams();
    this.init();
  }

  /**
   * 控件初始化
   */
  protected init(): void {
    // 获取服务器时间
    this.innerService.getServerDatetime({ dateFormat: 'yyyy-MM' })
      .subscribe(rsp => {
        this.queryParams.values.DEMAND_DATE = rsp.data;
        this.queryValuesClone.DEMAND_DATE = rsp.data;
      });

    /** 大类 */
    this.innerService
      .getSalescatgoryBig({ DateMonth: '' })
      .subscribe(rsp => {
        console.log('this.salesCatgoryBigOptions loading');
        if (rsp.data !== undefined) {
          rsp.data.forEach(element => {
            this.salesCatgoryBigOptions.push(element);
          });
        }
        console.log(this.salesCatgoryBigOptions);
      });

    /** 小类 */
    this.innerService
      .getSalescatgorySub({ DateMonth: '' })
      .subscribe(rsp => {
        console.log('this.salesCatgorySubOptions loading');
        if (rsp.data !== undefined) {
          rsp.data.forEach(element => {
            this.salesCatgorySubOptions.push(element);
          });
        }
        console.log(this.salesCatgorySubOptions);
      });

    /**加载事业部和工厂 */
    this.innerService.getUserPrivilage({ UserID: this.appConfigService.getUserId() }).subscribe(res => {
      if (res.Extra !== undefined) {
        console.log(res.Extra);
        // 获取到用户的授权数据
        this.userPrivilage = res.Extra;
        // 设置默认值
        this.queryParams.values.PLANT_CODE = res.Extra[0].USER.DEFAULT_PLANT_CODE;
        const region = this.userPrivilage.find((item, index) => {
          if (item.PLANT.PLANT_CODE === this.queryParams.values.PLANT_CODE)
            return item;
        });
        this.queryValuesClone.BUSINESS_UNIT_CODE = region.PLANT.SCHEDULE_REGION_CODE;
        this.queryParams.values.BUSINESS_UNIT_CODE = region.PLANT.SCHEDULE_REGION_CODE;
        console.log(this.queryParams.values);
        this.resetPlant({ BUSINESS_UNIT_CODE: this.queryParams.values.BUSINESS_UNIT_CODE });
        // 设置事业部
        this.businessUnitOptions.clear();
        const businessUnitCodeOptions = new Set();
        this.userPrivilage.forEach(element => {
          if (!businessUnitCodeOptions.has(element.PLANT.SCHEDULE_REGION.SCHEDULE_REGION_CODE)) {
            element.PLANT.SCHEDULE_REGION.DESCRIPTIONS2 = element.PLANT.SCHEDULE_REGION.SCHEDULE_REGION_CODE + '-' + element.PLANT.SCHEDULE_REGION.DESCRIPTIONS;
            this.businessUnitOptions.add(element.PLANT.SCHEDULE_REGION);
            businessUnitCodeOptions.add(element.PLANT.SCHEDULE_REGION.SCHEDULE_REGION_CODE);
          }
        });
      }
    });

    // 内外销
    this.getLookupItems('PP_DOMESTIC_EXPORT')
      .subscribe(rsp => {
        console.log('this.salesTypeOptions loading');
        rsp.forEach((item) => {
          this.salesTypeOptions.add(item);
        });
        console.log(this.salesTypeOptions);
      });
  }

  // 重置
  public clear() {
    super.clear();
  }

  /**
   * 单元格内容改变
   */
  onCellValueChanged(event) {
    console.log(event);
    if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString()) {
      const updateObj = this.getCellUpdateValueObj(event);
      console.log('onCellValueChanged:');
      console.log(updateObj);
      // 修改更新标记
      this.valueChangedItem.set(event.data.ID + '_' + updateObj.FieldName, updateObj);
      // this.valueChangedItem.push(updateObj);
      this.reCountValues(event);
      // 刷新数据值
      this.gridApi.refreshCells({ rowNodes: [event.node] });
    }
  }

  /**
   * 重新计算值
   */
  reCountValues(data: any) {
    console.log('reCountValues:');
    console.log(data);
    if (data.column.colId === 'UPDATE_ONHAND') {
      // M月底库存
      this.countMNMonthValues_After_UPDATE_ONHAND(data);
    } else if (data.column.colId === 'PRODUCTION_N') {
      // 修改 M月预计入库
      // 重新计算M月底库存
      this.countMNMonthValues_After_PRODUCTION_N(data);
    } else if (data.column.colId.startsWith('M_N_MONTH_INVENTORY_FORECAST_UPDATE')) {
      console.log('M_N_MONTH_INVENTORY_FORECAST_UPDATE');
      const index = data.column.userProvidedColDef.periodIndex;
      data.data.M_N_MONTH_INVENTORY[index].FORECAST_UPDATE = data.newValue;
      // 修改 M+N月销量调整
      this.countMNMonthValues_After_FORECAST_UPDATE(data);
    } else if (data.column.colId.startsWith('M_N_MONTH_INVENTORY_PRODUCTION_N1')) {
      const index = data.column.userProvidedColDef.periodIndex;
      data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_N1 = data.newValue;
      // 修改 M+N月规划生产量
      this.countMNMonthValues_After_PRODUCTION_N1(data);
    }
    this.configGridData(this.gridData);
  }

  /**
   * 修改 M月预计入库 后调整的方法
   * @param data
   */
  countMNMonthValues_After_PRODUCTION_N(data: any) {
    if (Number.parseFloat(data.data.UPDATE_ONHAND_DBVALUE) === -1) {
      // M月底库存
      data.data.UPDATE_ONHAND = Number.parseFloat(data.data.ONHAND) +
        Number.parseFloat(data.newValue) -
        Number.parseFloat(data.data.NO_SHIPMENT_AND_UNMET);
      this.countMNMonthValues_After_UPDATE_ONHAND(data);
    }
  }

  /**
   * 修改 M月底库存 后调整的方法
   * @param data
   */
  countMNMonthValues_After_UPDATE_ONHAND(data: any) {
    // 重新计算库存金额
    data.data.ONHAND_AMOUNT = Number.parseFloat(data.data.PRICE) *
      Number.parseFloat(data.data.UPDATE_ONHAND);
    // 重新计算 M+1月末库存
    data.data.ONHAND1 = Number.parseFloat(data.data.UPDATE_ONHAND) +
      Number.parseFloat(data.data.PRODUCTION_N1);
    // 重新计算 M+1月末库存金额
    data.data.ONHAND1_AMOUNT = Number.parseFloat(data.data.PRICE) *
      Number.parseFloat(data.data.ONHAND1);
    // 重新计算 M+1月存销比
    if (Number.parseFloat(data.data.AVG_SALES) !== 0) {
      data.data.PRODUCTION_DEPOSITRATIO_1 = Number.parseFloat(data.data.ONHAND1) /
        Number.parseFloat(data.data.AVG_SALES);
      // 小数点格式化
      data.data.PRODUCTION_DEPOSITRATIO_1 =
        Number.parseFloat(data.data.PRODUCTION_DEPOSITRATIO_1).toFixed(2);
    }
  }

  /**
   * 修改 M+N月销量调整 后调用的方法
   */
  countMNMonthValues_After_FORECAST_UPDATE(data: any) {
    // 重新计算 M+N月规划生产量
    const index = data.column.userProvidedColDef.periodIndex;
    console.log('data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_N1_DBVALUE:' +
      data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_N1_DBVALUE);
    // 当规划生产量未修改过，则动态计算
    if (Number.parseFloat(data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_N1_DBVALUE) === -1) {
      data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_N1 =
        Number.parseFloat(data.data.M_N_MONTH_INVENTORY[index].FORECAST_UPDATE);
      // const proKey = 'M_N_MONTH_INVENTORY_PRODUCTION_N1' + index;
      // data.data[proKey] = data.data.M_N_MONTH_INVENTORY[index].FORECAST_UPDATE;
      console.log('data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_N1:');
      console.log(data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_N1);
      this.countMNMonthValues_After_PRODUCTION_N1(data);
    }
    console.log('index:' + index);
  }

  /**
   * 修改 M+N月规划生产量 后调用的方法
   */
  countMNMonthValues_After_PRODUCTION_N1(data: any) {
    // 重新计算 M+N月规划生产量
    const index = data.column.userProvidedColDef.periodIndex;
    // 当规划生产量未修改过，则动态计算
    // 动态修改 M+N月末库存
    data.data.M_N_MONTH_INVENTORY[index].ONHAND1 =
      Number.parseFloat(data.data.M_N_MONTH_INVENTORY[index].UPDATE_ONHAND) +
      Number.parseFloat(data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_N1);
    // const proKey2 = 'M_N_MONTH_INVENTORY_ONHAND1' + index;
    // data.data[proKey2] = data.data.M_N_MONTH_INVENTORY[index].ONHAND1;

    // M+N月末库存金额
    data.data.M_N_MONTH_INVENTORY[index].ONHAND1_AMOUNT =
      Number.parseFloat(data.data.M_N_MONTH_INVENTORY[index].ONHAND1) *
      Number.parseFloat(data.data.PRICE);

    // M+N月存销比
    if (Number.parseFloat(data.data.AVG_SALES) !== 0) {
      data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_DEPOSITRATIO_1 =
        Number.parseFloat(data.data.M_N_MONTH_INVENTORY[index].ONHAND1) /
        Number.parseFloat(data.data.AVG_SALES);

      // 小数点格式化
      data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_DEPOSITRATIO_1 =
        Number.parseFloat(data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_DEPOSITRATIO_1).toFixed(2);
    }
  }

  /**
   * 重新配置grid的列值
   * 主要是把M_N_MONTH_INVENTORY数组的数据拷贝出来
   */
  configGridData(data: any) {
    data.forEach((rowData) => {
      let columnIndex = 0;
      const item_inventorys = rowData.M_N_MONTH_INVENTORY;
      item_inventorys.forEach((item) => {
        console.log('grid data foreach:');
        console.log(item);
        for (const pro in item) {
          rowData['M_N_MONTH_INVENTORY_' + pro + columnIndex] = item[pro];
        }
        columnIndex++;
      });
    });
  }

  /**
   * grid加载完毕回调事件
   */
  gridLoadCallback() {
    super.gridLoadCallback();
    this.columns = deepCopy(this.origin_columns);
    // this.headerNameTranslate(this.columns);
    (<any>this.gridApi).setColumnDefs(this.columns);
    this.agGridStateReset(this.gridStateKey);
  }

  /**
   * 获取单元格更新的值对象
   */
  getCellUpdateValueObj(data: any) {
    const obj = {
      ID: '',
      RelativeID: '',
      FieldName: '',
      Value: '',
      PeriodIndex: 0,
    };
    console.log('getCellUpdateValueObj:');
    console.log(data);
    const fields = ['UPDATE_ONHAND', 'PRODUCTION_N', 'FORECAST_UPDATE', 'PRODUCTION_N1'];
    if (fields.findIndex(it => it === data.column.colId) >= 0) {
      obj.ID = data.data.ID;
      obj.FieldName = data.column.colId;
      obj.Value = data.newValue;
    } else {
      // 获取更新对应记录的ID
      const columnIndex = data.column.userProvidedColDef.periodIndex;
      // 寻找该月份对应的行记录ID，如果找不到，则传入相关联的本月的行ID值
      const relativeID = data.data.M_N_MONTH_INVENTORY[columnIndex].SOP_UNCSTR_FORECAST_ID;
      if (relativeID !== undefined && relativeID !== null) {
        obj.ID = relativeID;
      } else {
        obj.RelativeID = data.data.ID;
      }
      obj.FieldName = data.column.userProvidedColDef.dbField;
      obj.Value = data.newValue;
      obj.PeriodIndex = data.column.userProvidedColDef.periodIndex;
    }
    return obj;
  }

  /**
   * 判断是否可以编辑
   */
  public isCellCanEdit(params: any) {
    console.log('isCellCanEdit');
    console.log(params);
  }

  /**
   * 单元格开始编辑
   * @param params
   */
  public onCellEditingStarted(params: any) {
    console.log('onCellEditingStarted');
    console.log(params);
    if (params.data.APPROVE_STATUS === '已审批') {
      this.gridApi.stopEditing(true);
      this.msgSrv.warning(this.appTranslationService.translate('[已审批]的记录不能编辑！'));
    }
  }

  /**
   * 事业部变化事件
   */
  public onBusinessUnitCodeChange(eventParams: any): void {
    console.log(eventParams);
    console.log(this);
    this.resetPlant({ BUSINESS_UNIT_CODE: eventParams });
  }

  /**
   * 保存调整后的数据
   */
  public save(): void {
    this.gridApi.showLoadingOverlay();
    const dtos = [];
    for (const item of this.valueChangedItem.entries()) {
      console.log(item[1]);
      dtos.push(item[1]);
    }
    console.log(dtos);
    this.innerService.saveSopUncstrForecastPSI({ dtos: dtos })
      .subscribe((rsp) => {
        this.gridApi.hideOverlay();
        if (rsp.code === 200) {
          this.valueChangedItem.clear();
          this.query();
        }
      });
  }

  /**
   * 是否新品列格式化
   */
  public isNewFormatter(data) {
    if (data.NEW_PRODUCT_CODE !== undefined && data.NEW_PRODUCT_CODE != null && data.NEW_PRODUCT_CODE !== '') {
      return this.appTranslationService.translate('是');
    }
    return this.appTranslationService.translate('否');
  }

  /**
   * 格式化需求日期
   * @param value
   */
  public demandDateFormatter(value) {
    return this.innerService.formatDateTime2(value, 'yyyy-MM');
    // if (value !== undefined) {
    //   const date = new Date(value);
    //   return date.getFullYear() + '-' + (date.getMonth() + 1);
    // }
    // return value;
  }

  /**
   * 查询
   */
  public query() {
    super.query();
    this.queryCommon();
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    const action = { url: this.innerService.baseUrl + '/getsopdemandforupdate', method: 'POST' };
    this.innerService.exportAction(action, this.getQueryParams(), this.excelexport, this, (rsp) => {
      console.log(rsp);
      // 处理数据
      this.respDataHandle(rsp.Result);
      this.expColumns = this.getExportColumns();
      const rspDto = new ActionResponseDto();
      rspDto.Extra = rsp.Result;
      return rspDto;
    });
  }

  /**
   * 根据当前的grid-columns数组，生成导出列
   */
  public getExportColumns() {
    const expColumns = [];
    this.columns.forEach(it => {
      expColumns.push({ field: it.field, title: it.headerName, width: 200, locked: false });
    });
    return expColumns;
  }

  /**
   * 查询的公共方法
   */
  public queryCommon() {
    this.innerService.loadGridView({ url: this.innerService.baseUrl + '/getsopdemandforupdate', method: 'POST' }, this.getQueryParams(), this.context,
      (result) => {
        console.log(result);
        return result;
      },
      () => {
        this.respDataHandle(this.gridData);
        // this.headerNameTranslate(this.columns);
        // 必须要set空一次，再set，才能更新列名
        (<any>this.gridApi).setColumnDefs([]);
        (<any>this.gridApi).setColumnDefs(this.columns);
        // 重置个性化
        this.agGridStateReset(this.gridStateKey);
      });
  }

  /**
   * 服务器返回数据的后处理
   */
  respDataHandle(data: any) {
    // 查询之后回调的方法
    if (data !== undefined && data !== null && data.length > 0) {
      // 先构造列
      const m_n_month_inventorys = data[0].M_N_MONTH_INVENTORY;
      if (m_n_month_inventorys !== undefined && m_n_month_inventorys !== null && m_n_month_inventorys.length > 0) {
        this.columns = deepCopy(this.origin_columns);
        // 查询月份
        let monthIndex = new Date(this.queryParams.values.DEMAND_DATE).getMonth() + 1;
        // 替换M月份的列名
        const columnFields = [{ field: 'PRODUCTION_N', headerName: '月预计入库', headerClass: 'demandCustomization_EditColumnHeader', editable: true },
        { field: 'UPDATE_ONHAND', headerName: '月底库存', headerClass: 'demandCustomization_EditColumnHeader', editable: true },
        { field: 'ONHAND_AMOUNT', headerName: '月底库存金额' },
        ];
        columnFields.forEach(item => {
          // M月份为查询月份的前一个月
          const headerName = (monthIndex - 1) + this.appTranslationService.translate(item.headerName);
          item.headerName = headerName;
          this.columns.push(item);
        });

        // 替换M+1月份的列名
        const columnFields2 = [{ field: 'FORECAST_QTY', headerName: '月销量' },
        { field: 'FORECAST_UPDATE', headerName: '月销量调整', headerClass: 'demandCustomization_EditColumnHeader', editable: true },
        { field: 'PRODUCTION_N1', headerName: '月规划生产量', headerClass: 'demandCustomization_EditColumnHeader', editable: true },
        { field: 'ONHAND1', headerName: '月末库存' },
        { field: 'ONHAND1_AMOUNT', headerName: '月末库存金额' },
        { field: 'PRODUCTION_DEPOSITRATIO_1', headerName: '月存销比' },
        ];
        columnFields2.forEach(item => {
          const headerName = monthIndex + this.appTranslationService.translate(item.headerName);
          item.headerName = headerName;
          this.columns.push(item);
        });

        console.log('m_n_month_inventorys:');
        console.log(m_n_month_inventorys);

        // 遍历每一个月份的列，动态构造
        let columnIndex = 0;
        m_n_month_inventorys.forEach((item) => {
          monthIndex++;
          this.columns.push({ field: 'M_N_MONTH_INVENTORY_FORECAST_QTY' + columnIndex, headerName: monthIndex + this.appTranslationService.translate('月销量') });
          this.columns.push({ field: 'M_N_MONTH_INVENTORY_FORECAST_UPDATE' + columnIndex, headerName: monthIndex + this.appTranslationService.translate('月销量调整'), headerClass: 'demandCustomization_EditColumnHeader', periodIndex: columnIndex, editable: true, dbField: 'FORECAST_UPDATE' });
          this.columns.push({ field: 'M_N_MONTH_INVENTORY_PRODUCTION_N1' + columnIndex, headerName: monthIndex + this.appTranslationService.translate('月规划生产量'), headerClass: 'demandCustomization_EditColumnHeader', periodIndex: columnIndex, editable: true, dbField: 'PRODUCTION_N1' });
          this.columns.push({ field: 'M_N_MONTH_INVENTORY_ONHAND1' + columnIndex, headerName: monthIndex + this.appTranslationService.translate('月末库存') });
          this.columns.push({ field: 'M_N_MONTH_INVENTORY_ONHAND1_AMOUNT' + columnIndex, headerName: monthIndex + this.appTranslationService.translate('月末库存金额') });
          this.columns.push({ field: 'M_N_MONTH_INVENTORY_PRODUCTION_DEPOSITRATIO_1' + columnIndex, headerName: monthIndex + this.appTranslationService.translate('月存销比') });
          columnIndex++;
        });
      }

      // 再构造数据
      console.log('old this.gridData:');
      console.log(data);
      this.configGridData(data);
    }
    console.log('new this.gridData:');
    console.log(data);
    console.log(this.columns);
  }

  /**
   * 构造查询参数
   */
  public getQueryParams(): any {
    this.queryParams.values.DEMAND_DATE = this.innerService.formatDateTime2(this.queryParams.values.DEMAND_DATE, 'yyyy-MM');
    // if (this.queryParams.values.PS_ITEM !== null) {
    //   this.queryParams.values.ITEM_CODE = this.queryParams.values.PS_ITEM.text;
    // }
    return this.queryParams.values;
  }

  /**
   * 设置用户的工厂和区域
   */
  public resetPlant({ BUSINESS_UNIT_CODE = '' }): void {
    if (BUSINESS_UNIT_CODE !== undefined && BUSINESS_UNIT_CODE) {
      // 根据区域过滤工厂
      this.plantOptions.clear();
      const plantCodeOptions = new Set();
      this.queryParams.values.PLANT_CODE = null;
      this.userPrivilage.forEach(element => {
        if (element.PLANT.SCHEDULE_REGION.SCHEDULE_REGION_CODE === BUSINESS_UNIT_CODE) {
          if (!plantCodeOptions.has(element.PLANT.PLANT_CODE)) {
            this.plantOptions.add(element.PLANT);
            plantCodeOptions.add(element.PLANT.PLANT_CODE);
          }
        }
      });
    }
  }

  /**
   * 页码变换
   * @param event
   */
  public onPageChanged(event: any): void {

  }

}
