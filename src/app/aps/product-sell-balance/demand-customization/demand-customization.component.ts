import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { deepCopy } from '@delon/util';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import {
  CustomBaseContext,
  LookupItem,
} from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { MessageManageService } from 'app/modules/generated_module/services/message-manage-service';
import { SopDemandAnalysisdm } from 'app/modules/generated_module/services/sopdemandanalysisdm-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ProductSellBalanceForecastService } from '../product-sell-balance-forecast.service';
import { DemandCustomizationImportComponent } from './import/import.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { AgNumberEditorComponent } from 'app/modules/base_module/components/ag-number-editor.component';
import { AppAgGridStateService } from 'app/modules/base_module/services/app-ag-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-customization',
  templateUrl: './demand-customization.component.html',
  styleUrls: ['./demand-customization.component.css'],
  encapsulation: ViewEncapsulation.None, // 组件css直接应用于全局CSS（css可进可出）
  providers: [ProductSellBalanceForecastService],
})
export class DemandCustomizationComponent extends CustomBaseContext
  implements OnInit {
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
  public approveStatus: Set<LookupItem> = new Set<LookupItem>(); // 审批状态
  public valueChangedItem = new Map(); // 更新的项数组
  // public valueChangedItem = []; // 更新的项数组
  public viewItems: GridDataResult = { data: [], total: 0 }; // 物料
  public approvalDisabled: boolean = true; // 审批、取消审批控件状态
  public columnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料',
      width: '100',
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100',
    },
  ];
  public gridOptions2 = Object.assign(this.gridOptions, {
    pagination: false,
  });

  public queryParams = {
    defines: [
      {
        field: 'BUSINESS_UNIT_CODE',
        title: '事业部',
        required: true,
        ui: {
          type: UiType.select,
          options: this.businessUnitOptions,
          /*optionsLabel: 'SCHEDULE_REGION_CODE',*/ optionsLabel:
            'DESCRIPTIONS2',
          optionsValue: 'SCHEDULE_REGION_CODE',
          ngModelChange: this.onBusinessUnitCodeChange,
        },
      },
      {
        field: 'SALES_TYPE',
        title: '内外销',
        ui: {
          type: UiType.select,
          options: this.salesTypeOptions,
          optionsLabel: 'Text',
          optionsValue: 'Code' /* optionsValue: 'Code'*/,
        },
      },
      {
        field: 'DEMAND_DATE',
        title: '月份',
        required: true,
        ui: {
          type: UiType.monthPicker,
          format: 'yyyy-MM',
          ngModelChange: this.loadSalesCatgory,
        },
      },
      {
        field: 'PLANT_CODE',
        title: '工厂',
        ui: {
          type: UiType.select,
          options: this.plantOptions,
          optionsLabel: 'PLANT_CODE',
          optionsValue: 'PLANT_CODE',
        },
      },
      {
        field: 'SALES_CATGORY_BIG',
        title: '产品大类',
        ui: {
          type: UiType.select,
          options: this.salesCatgoryBigOptions,
          optionsLabel: 'NAME',
          optionsValue: 'NAME',
          nzLoading: false,
        },
      },
      {
        field: 'SALES_CATGORY_SUB',
        title: '产品小类',
        ui: {
          type: UiType.select,
          options: this.salesCatgorySubOptions,
          optionsLabel: 'NAME',
          optionsValue: 'NAME',
          nzLoading: false,
        },
      },
      {
        field: 'PS_ITEM',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          gridView: this.viewItems,
          valueField: 'ITEM_CODE',
          textField: 'ITEM_CODE',
          columns: this.columnsItems,
          eventNo: 1,
          nzLoading: false,
        },
      },
    ],
    values: {
      BUSINESS_UNIT_CODE: null,
      SALES_TYPE: null,
      DEMAND_DATE: '',
      SALES_CATGORY_BIG: null,
      SALES_CATGORY_SUB: null,
      PLANT_CODE: null,
      ITEM_CODE: '',
      PS_ITEM: { value: '', text: '' },
    },
  };

  public columns = [];
  public origin_columns = [
    { field: 'BUSINESS_UNIT_CODE', headerName: '事业部' },
    { field: 'PLANT_CODE', headerName: '工厂' },
    {
      field: 'SALES_TYPE',
      headerName: '内外销',
      valueFormatter: 'ctx.innerService.getLookupText("SOP_SALES_TYPE", value)',
    },
    {
      field: 'DEMAND_DATE',
      headerName: '月份',
      valueFormatter: 'ctx.demandDateFormatter(value)',
    },
    { field: 'SALES_CATGORY_BIG', headerName: '产品大类' },
    { field: 'SALES_CATGORY_SUB', headerName: '产品小类' },
    { field: 'PS_ITEM.ITEM_CODE', headerName: '物料编码' },
    { field: 'PS_ITEM.DESCRIPTIONS_CN', headerName: '物料描述' },
    {
      field: 'IS_NEW',
      headerName: '是否新品',
      valueFormatter: 'ctx.isNewFormatter(data)',
    },
    { field: 'NEW_PRODUCT_CODE', headerName: '新品编码' },
    { field: 'NEW_PRODUCT_NAME', headerName: '新品描述' },
    { field: 'PRICE', headerName: '单价' },
    { field: 'AVG_SALES', headerName: '月均分销量' },
    { field: 'NO_SHIPMENT_AND_UNMET', headerName: '未发订单' },
    {
      field: 'ONHAND',
      headerName: '当前库存',
      headerClass: '',
      editable: false,
      periodIndex: 0,
    },
    {
      field: 'APPROVE_STATUS',
      headerName: '审批状态',
      headerClass: '',
      editable: false,
      periodIndex: 0,
      valueFormatter:
        'ctx.innerService.getLookupText("FND_APPROVE_STATUS", value)',
    },
  ];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public messageManageService: MessageManageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public innerService: ProductSellBalanceForecastService,
    public sopDemandAnalysisdmService: SopDemandAnalysisdm,
    public appAgGridStateService: AppAgGridStateService,
    public appGridStateService: AppGridStateService,
    public appConfigService: AppConfigService,
    public http: _HttpClient,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      commonQuerySrv: innerService,
      appAgGridStateService: appAgGridStateService,
      appGridStateService: appGridStateService,
    });
    this.headerNameTranslate(this.origin_columns);
  }

  ngOnInit() {
    this.gridData = [];
    this.cloneQueryParams();
    this.init();
  }

  /**
   * 控件初始化
   */
  protected init(): void {
    /**加载事业部和工厂 */
    this.innerService
      .getUserPrivilage({ UserID: this.appConfigService.getUserId() })
      .subscribe(res => {
        if (res.Extra !== undefined) {
          console.log(res.Extra);
          // 获取到用户的授权数据
          this.userPrivilage = res.Extra;
          // 设置默认值
          this.queryParams.values.PLANT_CODE =
            res.Extra[0].USER.DEFAULT_PLANT_CODE;
          const region = this.userPrivilage.find((item, index) => {
            if (item.PLANT.PLANT_CODE === this.queryParams.values.PLANT_CODE)
              return item;
          });
          // 底层做的重置的方法用到的对象
          this.queryValuesClone.BUSINESS_UNIT_CODE =
            region.PLANT.SCHEDULE_REGION_CODE;
          this.queryParams.values.BUSINESS_UNIT_CODE =
            region.PLANT.SCHEDULE_REGION_CODE;
          console.log(this.queryParams.values);
          this.resetPlant({
            BUSINESS_UNIT_CODE: this.queryParams.values.BUSINESS_UNIT_CODE,
          });
          this.queryParams.values.PLANT_CODE = this.appConfigService.getPlantCode();
          // 设置事业部
          this.businessUnitOptions.clear();
          const businessUnitCodeOptions = new Set();
          this.userPrivilage.forEach(element => {
            if (
              !businessUnitCodeOptions.has(
                element.PLANT.SCHEDULE_REGION.SCHEDULE_REGION_CODE,
              )
            ) {
              element.PLANT.SCHEDULE_REGION.DESCRIPTIONS2 =
                element.PLANT.SCHEDULE_REGION.SCHEDULE_REGION_CODE +
                '-' +
                element.PLANT.SCHEDULE_REGION.DESCRIPTIONS;
              this.businessUnitOptions.add(element.PLANT.SCHEDULE_REGION);
              businessUnitCodeOptions.add(
                element.PLANT.SCHEDULE_REGION.SCHEDULE_REGION_CODE,
              );
            }
          });

          // 获取服务器时间
          this.innerService
            .getServerDatetime({ dateFormat: 'yyyy-MM', addMonth: 1 })
            .subscribe(rsp => {
              this.queryParams.values.DEMAND_DATE = rsp.data;
              // 底层做的重置的方法用到的对象
              this.queryValuesClone.DEMAND_DATE = rsp.data;
              // 加载大类小类
              this.loadSalesCatgory({
                DateMonth: rsp.data,
                BusinessUnitCode: this.queryParams.values.BUSINESS_UNIT_CODE,
              });
            });
        }
      });

    // 获取用户的内外销
    this.innerService
      .getUserDetails({ UserID: this.appConfigService.getUserId() })
      .subscribe(it => {
        const salesTypeOptions: Set<String> = new Set<String>(); // 内外销
        if (it.data !== undefined && it.data !== null) {
          (<any[]>it.data).forEach(item => {
            if (item.SALES_TYPE) {
              salesTypeOptions.add(item.SALES_TYPE);
            }
          });
          console.log('salesTypeOptions:');
          console.log(salesTypeOptions);
          // 如果没有配置，则可以看内外销
          this.getLookupItems('SOP_SALES_TYPE').subscribe(rsp => {
            console.log('this.salesTypeOptions loading');
            rsp.forEach(item => {
              if (
                salesTypeOptions.size === 0 ||
                salesTypeOptions.has(item.Code)
              ) {
                this.salesTypeOptions.add(item);
              }
            });
            console.log(this.salesTypeOptions);
          });
        }
      });

    /** 审批状态 */
    this.innerService
      .getLookupItems('FND_APPROVE_STATUS')
      .subscribe(rsp => (this.approveStatus = rsp));
  }

  /**
   * 加载产品大类和小类
   */
  public loadSalesCatgory({ DateMonth = '', BusinessUnitCode = '' } = {}) {
    console.log('loadSalesCatgory...');
    if (this.isNull(DateMonth)) {
      DateMonth = this.queryParams.values.DEMAND_DATE;
    }
    if (this.isNull(BusinessUnitCode)) {
      BusinessUnitCode = this.queryParams.values.BUSINESS_UNIT_CODE;
    }

    const bigUI = ['SALES_CATGORY_BIG'];
    this.setQueryFormUILoading(bigUI, true);
    /** 大类 */
    this.innerService
      .getSalescatgoryBig({
        DateMonth: DateMonth,
        BusinessUnitCode: BusinessUnitCode,
      })
      .subscribe(rsp => {
        console.log('this.salesCatgoryBigOptions loading');
        this.salesCatgoryBigOptions.splice(
          0,
          this.salesCatgoryBigOptions.length,
        );
        if (rsp.data !== undefined) {
          rsp.data.forEach(element => {
            this.salesCatgoryBigOptions.push(element);
          });
        }
        this.setQueryFormUILoading(bigUI, false);
        console.log(this.salesCatgoryBigOptions);
      });

    const subUI = ['SALES_CATGORY_SUB'];
    this.setQueryFormUILoading(subUI, true);
    /** 小类 */
    this.innerService
      .getSalescatgorySub({
        DateMonth: DateMonth,
        BusinessUnitCode: BusinessUnitCode,
      })
      .subscribe(rsp => {
        console.log('this.salesCatgorySubOptions loading');
        this.salesCatgorySubOptions.splice(
          0,
          this.salesCatgorySubOptions.length,
        );
        if (rsp.data !== undefined) {
          rsp.data.forEach(element => {
            this.salesCatgorySubOptions.push(element);
          });
        }
        this.setQueryFormUILoading(subUI, false);
        console.log(this.salesCatgorySubOptions);
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
    if (
      this.isNullDefault(event.oldValue, '').toString() !==
      this.isNullDefault(event.newValue, '').toString()
    ) {
      const updateObj = this.getCellUpdateValueObj(event);
      console.log('onCellValueChanged:');
      console.log(updateObj);
      console.log(event.data.Id + '_' + updateObj.FieldName);
      // 修改更新标记
      this.valueChangedItem.set(
        event.data.Id + '_' + updateObj.FieldName,
        updateObj,
      );
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
      // 重新计算M月底库存金额
      this.countOtherValues_After_ValueChanged(data);
    } else if (data.column.colId === 'PRODUCTION_N') {
      // 修改 M月预计入库
      // 重新计算M月底库存（这里判断了M月底库存是否已经被修改过，如果曾经被手动修改过，则不会联动修改）
      if (Number.parseFloat(data.data.UPDATE_ONHAND_DBVALUE) === -1) {
        data.data.UPDATE_ONHAND =
          Number.parseFloat(data.data.ONHAND) +
          Number.parseFloat(data.data.PRODUCTION_N) -
          Number.parseFloat(data.data.NO_SHIPMENT_AND_UNMET);
      }
      this.countOtherValues_After_ValueChanged(data);
    } else if (
      data.column.colId.startsWith('M_N_MONTH_INVENTORY_FORECAST_UPDATE_')
    ) {
      console.log('M_N_MONTH_INVENTORY_FORECAST_UPDATE');
      const index = data.column.userProvidedColDef.periodIndex;
      data.data.M_N_MONTH_INVENTORY[index].FORECAST_UPDATE = data.newValue;
      // 修改 M+N月销量调整
      this.countOtherValues_After_ValueChanged(data);
    } else if (
      data.column.colId.startsWith('M_N_MONTH_INVENTORY_PRODUCTION_N1_')
    ) {
      const index = data.column.userProvidedColDef.periodIndex;
      data.data.M_N_MONTH_INVENTORY[index].PRODUCTION_N1 = data.newValue;
      // 修改 M+N月规划生产量
      this.countOtherValues_After_ValueChanged(data);
    }
    this.configGridData(this.gridData);
  }

  /**
   * 修改 M+N月销量调整
   * 修改 M+N月规划生产量
   * 重新计算各个列值
   * @param data
   */
  countOtherValues_After_ValueChanged(data: any) {
    console.log('countOtherValues_After_ValueChanged:');
    console.log(data);

    // 重新计算M月底库存金额
    data.data.ONHAND_AMOUNT =
      Number.parseFloat(data.data.PRICE) *
      Number.parseFloat(data.data.UPDATE_ONHAND);

    // 重新计算修改月份后面的月份
    let index = data.column.userProvidedColDef.periodIndex;
    if (index === undefined || index === '') {
      index = 0; // 如果修改的不是M+N列的数据，则默认从M+1月开始计算
    }
    for (let i = index; i < data.data.M_N_MONTH_INVENTORY.length; i++) {
      // M+N月末库存 = M+N-1月的库存现有量 + M+N规划生产量 - M+N销量
      // M+N月末库存 = M+N月末库存 + M+N规划生产量 - M+N销量
      let UPDATE_ONHAND = 0;
      if (i === 0) {
        // M+1月份的库存余额取值M月份的库存现有量
        UPDATE_ONHAND = Number.parseFloat(data.data.UPDATE_ONHAND);
      } else {
        // M+N月份的库存余额取值M+N-1月份的月末库存量（N>=2）
        UPDATE_ONHAND = Number.parseFloat(
          data.data.M_N_MONTH_INVENTORY[i - 1].UPDATE_ONHAND,
        );
      }

      // 如果没有手工输入，则字段为空时，默认等于：M+N月销量调整
      // if (data.data.M_N_MONTH_INVENTORY[i].PRODUCTION_N1_DBVALUE === -1) {
      //   data.data.M_N_MONTH_INVENTORY[i].PRODUCTION_N1 = data.data.M_N_MONTH_INVENTORY[i].FORECAST_UPDATE;
      // }

      data.data.M_N_MONTH_INVENTORY[i].UPDATE_ONHAND =
        UPDATE_ONHAND +
        Number.parseFloat(data.data.M_N_MONTH_INVENTORY[i].PRODUCTION_N1) -
        Number.parseFloat(data.data.M_N_MONTH_INVENTORY[i].FORECAST_UPDATE);

      // 如果计算小于0，则为0
      data.data.M_N_MONTH_INVENTORY[i].UPDATE_ONHAND = Math.max(
        data.data.M_N_MONTH_INVENTORY[i].UPDATE_ONHAND,
        0,
      );

      // M+N月末库存金额
      data.data.M_N_MONTH_INVENTORY[i].ONHAND_AMOUNT =
        Number.parseFloat(data.data.M_N_MONTH_INVENTORY[i].UPDATE_ONHAND) *
        Number.parseFloat(data.data.PRICE);

      // M+N月存销比
      if (Number.parseFloat(data.data.AVG_SALES) !== 0) {
        data.data.M_N_MONTH_INVENTORY[i].PRODUCTION_DEPOSITRATIO =
          Number.parseFloat(data.data.M_N_MONTH_INVENTORY[i].UPDATE_ONHAND) /
          Number.parseFloat(data.data.AVG_SALES);

        // 小数点格式化
        data.data.M_N_MONTH_INVENTORY[
          i
        ].PRODUCTION_DEPOSITRATIO = Number.parseFloat(
          data.data.M_N_MONTH_INVENTORY[i].PRODUCTION_DEPOSITRATIO,
        ).toFixed(2);
      }
    }
  }

  /**
   * 重新配置grid的列值
   * 主要是把M_N_MONTH_INVENTORY数组的数据拷贝出来
   */
  configGridData(data: any) {
    data.forEach(rowData => {
      let columnIndex = 0;
      const item_inventorys = rowData.M_N_MONTH_INVENTORY;
      item_inventorys.forEach(item => {
        for (const pro in item) {
          rowData['M_N_MONTH_INVENTORY_' + pro + '_' + columnIndex] = item[pro];
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
    console.log('this.gridColumnApi.getColumnState()');
    console.log(this.gridColumnApi.getColumnState());
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
      PeriodIndex: -1, // -1=M月份，0=M+1月份。。。
      DEMAND_PERIOD: '',
    };
    console.log('getCellUpdateValueObj:');
    console.log(data);
    const fields = ['UPDATE_ONHAND', 'PRODUCTION_N']; // M月份的修改列
    obj.DEMAND_PERIOD = data.data.DEMAND_DATE;
    if (fields.findIndex(it => it === data.column.colId) >= 0) {
      obj.ID = data.data.Id;
      obj.RelativeID = data.data.RelativeID;
      obj.FieldName = data.column.colId;
      obj.Value = data.newValue;
    } else {
      // M+N月份的修改列
      // 获取更新对应记录的ID
      const columnIndex = data.column.userProvidedColDef.periodIndex;
      // 寻找该月份对应的行记录ID，如果找不到，则传入相关联的本月的行ID值
      const relativeID =
        data.data.M_N_MONTH_INVENTORY[columnIndex].SOP_UNCSTR_FORECAST_ID;
      if (relativeID !== undefined && relativeID !== null) {
        obj.ID = relativeID;
      } else {
        obj.RelativeID = data.data.Id;
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
    if (params.data.APPROVE_STATUS === 'APPROVED') {
      params.context.gridApi.stopEditing(true);
      params.context.msgSrv.warning(
        params.context.appTranslationService.translate(
          '[已审批]的记录不能编辑！',
        ),
      );
    }
  }

  /**
   * 事业部变化事件
   */
  public onBusinessUnitCodeChange(eventParams: any): void {
    console.log(eventParams);
    console.log(this);
    this.loadSalesCatgory();
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
    this.innerService.saveSopUncstrForecastPSI(dtos).subscribe(rsp => {
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
    if (
      data.NEW_PRODUCT_CODE !== undefined &&
      data.NEW_PRODUCT_CODE != null &&
      data.NEW_PRODUCT_CODE !== ''
    ) {
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
  }

  /**
   * 导入
   */
  public import() {
    this.modal
      .static(
        DemandCustomizationImportComponent,
        { q: this.getQueryParams() },
        'md',
      )
      .subscribe(rsp => {
        if (rsp) {
          this.query();
        }
      });
  }

  /**
   * 查询
   */
  public query() {
    super.query();
    this.innerService.getLookupItemsMutil(['SOP_SALES_TYPE']).subscribe(it => {
      console.log(it);
      this.queryCommon();
    });
    // this.queryCommon();
  }

  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    const action = {
      url: this.innerService.baseUrl + '/getsopdemandforupdate',
      method: 'POST',
    };
    this.innerService.exportAction(
      action,
      this.getQueryParams(),
      this.excelexport,
      this,
      rsp => {
        console.log(rsp);
        // 处理数据
        this.respDataHandle(rsp.Result);
        this.expColumns = this.getExportColumns();
        const rspDto = new ActionResponseDto();
        rspDto.Extra = rsp.Result;
        return rspDto;
      },
    );
  }

  /**
   * 根据当前的grid-columns数组，生成导出列
   */
  public getExportColumns() {
    const expColumns = [];
    this.columns.forEach(it => {
      expColumns.push({
        field: it.field,
        title: it.headerName,
        width: 200,
        locked: false,
      });
    });
    return expColumns;
  }

  /**
   * 审批
   */
  public approval() {
    this.doApproval('APPROVED', '确定要审批吗？');
  }

  /**
   * 取消审批
   */
  public unApproval() {
    this.doApproval('UNAPPROVE', '确定要取消审批吗？');
  }

  /**
   * 执行审批动作
   */
  public doApproval(status: string, tips: string) {
    const qParams = this.getQueryParams();
    qParams.APPROVE_STATUS = status;
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(tips),
      nzOnOk: () => {
        this.http
          .post<ActionResponseDto>(
            '/afs/serversopforecast/serversopforecastappservice/approvalforecase',
            qParams,
          )
          .subscribe(rsp => {
            if (rsp.Success === true) {
              this.msgSrv.success(
                this.appTranslationService.translate('审批成功！'),
              );
              this.queryCommon();
            } else {
              this.msgSrv.error(
                this.appTranslationService.translate(rsp.Message),
              );
            }
          });
      },
    });
  }

  /**
   * 查询的公共方法
   */
  public queryCommon() {
    this.approvalDisabled = false; // 执行查询后控制审批、取消审批可操作
    this.innerService.loadGridView(
      {
        url: this.innerService.baseUrl + '/getsopdemandforupdate',
        method: 'POST',
      },
      this.getQueryParams(),
      this.context,
      result => {
        console.log('queryCommon()');
        console.log(result);
        return result;
      },
      () => {
        this.respDataHandle(this.gridData);
        // 必须要set空一次，再set，才能更新列名
        (<any>this.gridApi).setColumnDefs([]);
        (<any>this.gridApi).setColumnDefs(this.columns);
        // 重置个性化
        this.agGridStateReset(this.gridStateKey);
        // 清空页面逻辑缓存
        this.valueChangedItem.clear();
      },
    );
  }

  /**
   * 服务器返回数据的后处理
   */
  respDataHandle(data: any) {
    // 查询之后回调的方法
    if (data !== undefined && data !== null && data.length > 0) {
      // 先构造列
      const m_n_month_inventorys = data[0].M_N_MONTH_INVENTORY;
      if (
        m_n_month_inventorys !== undefined &&
        m_n_month_inventorys !== null &&
        m_n_month_inventorys.length > 0
      ) {
        this.columns = deepCopy(this.origin_columns);
        // 查询月份（也就是M+1月）
        let monthIndex =
          new Date(this.queryParams.values.DEMAND_DATE).getMonth() + 1;
        // 替换M月份的列名
        const columnFields = [
          {
            field: 'PRODUCTION_N',
            hide: false,
            headerName: '月预计入库',
            // cellEditor: 'AgNumberEditor2',
            headerClass: 'demandCustomization_EditColumnHeader',
            editable: true,
            cellEditorParams: {
              inputParams: {
                numberType: 'float', // 默认为支持整型
                // maxValue: Number.MAX_VALUE, // 限制最大值
                // minValue: Number.MIN_VALUE, // 限制最小值
                charPress: '1234567890.-', // 只能输入的字符
              },
            },
          },
          {
            field: 'UPDATE_ONHAND',
            headerName: '月底库存',
            // cellEditor: 'AgNumberEditor2',
            headerClass: 'demandCustomization_EditColumnHeader',
            editable: true,
          },
          { field: 'ONHAND_AMOUNT', headerName: '月底库存金额' },
        ];
        columnFields.forEach(item => {
          // M月份为查询月份的前一个月
          const headerName =
            monthIndex -
            1 +
            this.appTranslationService.translate(item.headerName);
          item.headerName = headerName;
          this.columns.push(item);
        });

        console.log('m_n_month_inventorys:');
        console.log(m_n_month_inventorys);

        // 构造M+N月份列，遍历每一个月份的列，动态构造
        let columnIndex = 0; // 代表N（M+N的N）
        m_n_month_inventorys.forEach(item => {
          this.columns.push({
            field: 'M_N_MONTH_INVENTORY_FORECAST_QTY_' + columnIndex,
            headerName:
              monthIndex + this.appTranslationService.translate('月销量'),
          });
          this.columns.push({
            field: 'M_N_MONTH_INVENTORY_FORECAST_UPDATE_' + columnIndex,
            headerName:
              monthIndex + this.appTranslationService.translate('月销量调整'),
            headerClass: 'demandCustomization_EditColumnHeader',
            periodIndex: columnIndex,
            // cellEditor: 'AgNumberEditor2',
            editable: true,
            dbField: 'FORECAST_UPDATE',
          });
          this.columns.push({
            field: 'M_N_MONTH_INVENTORY_PRODUCTION_N1_' + columnIndex,
            headerName:
              monthIndex + this.appTranslationService.translate('月规划生产量'),
            headerClass: 'demandCustomization_EditColumnHeader',
            periodIndex: columnIndex,
            // cellEditor: 'AgNumberEditor2',
            editable: true,
            dbField: 'PRODUCTION_N1',
          });
          this.columns.push({
            field: 'M_N_MONTH_INVENTORY_UPDATE_ONHAND_' + columnIndex,
            headerName:
              monthIndex + this.appTranslationService.translate('月末库存'),
          });
          this.columns.push({
            field: 'M_N_MONTH_INVENTORY_ONHAND_AMOUNT_' + columnIndex,
            headerName:
              monthIndex + this.appTranslationService.translate('月末库存金额'),
          });
          this.columns.push({
            field: 'M_N_MONTH_INVENTORY_PRODUCTION_DEPOSITRATIO_' + columnIndex,
            headerName:
              monthIndex + this.appTranslationService.translate('月存销比'),
          });
          monthIndex++;
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
    this.queryParams.values.DEMAND_DATE = this.innerService.formatDateTime2(
      this.queryParams.values.DEMAND_DATE,
      'yyyy-MM',
    );
    this.queryParams.values.ITEM_CODE = this.queryParams.values.PS_ITEM.text;
    return this.queryParams.values;
  }

  /**
   * 根据选中的事业部，设置可选的工厂
   */
  public resetPlant({ BUSINESS_UNIT_CODE = '' }): void {
    if (BUSINESS_UNIT_CODE !== undefined && BUSINESS_UNIT_CODE) {
      // 根据区域过滤工厂
      this.plantOptions.clear();
      const plantCodeOptions = new Set();
      this.queryParams.values.PLANT_CODE = null;
      this.userPrivilage.forEach(element => {
        if (
          element.PLANT.SCHEDULE_REGION.SCHEDULE_REGION_CODE ===
          BUSINESS_UNIT_CODE
        ) {
          if (!plantCodeOptions.has(element.PLANT.PLANT_CODE)) {
            this.plantOptions.add(element.PLANT);
            plantCodeOptions.add(element.PLANT.PLANT_CODE);
          }
        }
      });
    }
  }

  /**
   * 加载物料
   */
  public loadItems({
    PLANT_CODE = '',
    ITEM_CODE = '',
    PageIndex = 1,
    PageSize = 10,
  }) {
    const items = ['PS_ITEM'];
    this.setQueryFormUILoading(items, true);
    this.innerService
      .GetUserPlantItemPageList(
        PLANT_CODE || '',
        ITEM_CODE || '',
        '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        this.viewItems.data = res.Result;
        this.viewItems.total = res.TotalCount;
        this.setQueryFormUILoading(items, false);
      });
  }

  /**
   * 物料起始
   * @param e
   */
  public searchItems(e: any) {
    if (
      !this.queryParams.values.PLANT_CODE ||
      this.queryParams.values.PLANT_CODE === undefined
    ) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选择工厂！'),
      );
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems({
      PLANT_CODE: this.queryParams.values.PLANT_CODE,
      ITEM_CODE: e.SearchValue,
      PageIndex: PageIndex,
      PageSize: e.PageSize,
    });
  }

  /**
   * 页码变换
   * @param event
   */
  public onPageChanged(event: any): void { }
}
