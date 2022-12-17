import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { deepCopy } from '@delon/util';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { MessageManageService } from 'app/modules/generated_module/services/message-manage-service';
import { SopDemandAnalysisdm } from 'app/modules/generated_module/services/sopdemandanalysisdm-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { ProductSellBalanceForecastService } from '../product-sell-balance-forecast.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { AppAgGridStateService } from 'app/modules/base_module/services/app-ag-gridstate-service';
import { SupplyCustomizationImportComponent } from './import/import.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'supply-customization',
  templateUrl: './supply-customization.component.html',
  styleUrls: ['./supply-customization.component.css'],
  encapsulation: ViewEncapsulation.None, // 组件css直接应用于全局CSS（css可进可出）
  providers: [ProductSellBalanceForecastService],
})
export class SupplyCustomizationComponent extends CustomBaseContext implements OnInit {
  public gridStateKey = 'supply-customization';

  public isMothWeek = '';
  public salesCatgoryBigOptions: any[] = []; // 产品大类
  public salesCatgorySubOptions: any[] = []; // 产品小类
  public businessUnitOptions: any[] = []; // 事业单位
  public plantOptions: any[] = []; // 工厂
  public salesTypeOptions: any[] = []; // 内外销
  public approveStatus: any[] = []; // 审批状态

  public valueChangedItem = new Map(); // 更新的项数组

  // 物料
  public viewItems: GridDataResult = { data: [], total: 0 };
  public columnsItems: any[] = [
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

  public gridOptions2 = Object.assign(this.gridOptions, { pagination: false });

  public queryParams = {
    defines: [
      {
        field: 'businessUnitCode',
        title: '事业部',
        required: true,
        ui: {
          type: UiType.select,
          options: this.businessUnitOptions,
          ngModelChange: this.onBusinessUnitCodeChange
        }
      },
      {
        field: 'salesType',
        title: '内外销',
        ui: {
          type: UiType.select,
          options: this.salesTypeOptions
        }
      },
      {
        field: 'demandDate',
        title: '日期',
        required: true,
        ui: {
          type: this.isMothWeek === 'MONTH' ? UiType.monthPicker : UiType.date,
          format: 'yyyy-MM-dd',
          ngModelChange: this.loadSalesCatgory
        }
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: {
          type: UiType.select,
          options: this.plantOptions
        },
      },
      {
        field: 'salesCatgoryBig',
        title: '产品大类',
        ui: {
          type: UiType.select,
          options: this.salesCatgoryBigOptions
        }
      },
      {
        field: 'salesCatgorySub',
        title: '产品小类',
        ui: {
          type: UiType.select,
          options: this.salesCatgorySubOptions
        }
      },
      {
        field: 'itemCode',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          gridView: this.viewItems,
          valueField: 'itemCode',
          textField: 'itemCode',
          columns: this.columnsItems,
          eventNo: 1
        }
      },
      {
        field: 'demandZeroFlag',
        title: '是否显示为0需求',
        ui: {
          type: UiType.checkbox
        }
      }
    ],
    values: {
      businessUnitCode: '',
      salesType: '',
      demandDate: '',
      plantCode: '',
      salesCatgoryBig: '',
      salesCatgorySub: '',
      itemCode: { value: '', text: '' },
      demandZeroFlag: false
    }
  };

  public columns = [];
  public origin_columns = [
    { field: 'businessUnitCode', headerName: '事业部' },
    { field: 'plantCode', headerName: '工厂' },
    { field: 'salesType', headerName: '内外销', valueFormatter: 'ctx.optionsFind(value,1).label' },
    { field: 'demandPeriod', headerName: '周期' },
    { field: 'salesCatgoryBig', headerName: '产品大类' },
    { field: 'salesCatgorySub', headerName: '产品小类' },
    { field: 'itemCode', headerName: '物料编码' },
    { field: 'descriptionsCn', headerName: '物料描述' },
    { field: 'isNew', headerName: '是否新品', valueFormatter: 'ctx.isNewFormatter(data)' },
    { field: 'newProductCode', headerName: '新品编码' },
    { field: 'newProductName', headerName: '新品描述' },
    { field: 'price', headerName: '单价' },
    { field: 'avgSales', headerName: '月均分销量' },
    { field: 'noShipmentAndUnmet', headerName: '未发订单' },
    { field: 'onhand', headerName: '当前库存', headerClass: '', editable: false, periodIndex: 0 },
    {
      field: 'approveStatus', headerName: '审批状态', headerClass: '', editable: false, periodIndex: 0,
      valueFormatter: 'ctx.optionsFind(value,2).label'
    }
  ];

  constructor(public pro: BrandService,
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
    private commonQueryService: CommonQueryService,
    public http: _HttpClient,
  ) {
    super({
      pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService,
      commonQuerySrv: innerService, appAgGridStateService: appAgGridStateService, appGridStateService: appGridStateService
    });
    this.headerNameTranslate(this.origin_columns);
  }

  ngOnInit() {
    this.gridData = [];
    this.init();
  }

  /**
   * 控件初始化
   */
  protected init(): void {
    /**加载事业部和工厂 */
    this.businessUnitOptions.length = 0;
    this.innerService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.businessUnitOptions.push({
          label: item.scheduleRegionCode + '-' + item.descriptions,
          value: item.scheduleRegionCode,
        });
      });
      this.clear();
    });

    // 获取用户的内外销
    this.salesTypeOptions.length = 0;
    this.innerService.getUserDetails({ UserID: this.appConfigService.getUserId() })
      .subscribe(it => {
        // 内外销
        if (!this.isNull(it.data) && !this.isNull(it.data.salesType)) {
          this.salesTypeOptions.push({
            label: it.data.salesType,
            value: it.data.salesType,
          });
        } else {
          // 如果没有配置，则可以看内外销
          this.innerService.GetLookupByType('SOP_SALES_TYPE').subscribe(res => {
            res.Extra.forEach(item => {
              this.salesTypeOptions.push({
                label: item.meaning,
                value: item.lookupCode,
              });
            });
          });
        }
      });

    /** 审批状态 */
    this.innerService.GetLookupByType('FND_APPROVE_STATUS').subscribe(res => {
      res.Extra.forEach(item => {
        this.approveStatus.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      businessUnitCode: this.businessUnitOptions[0].value,
      salesType: '',
      demandDate: '',
      plantCode: '',
      salesCatgoryBig: '',
      salesCatgorySub: '',
      itemCode: { value: '', text: '' },
      demandZeroFlag: false
    };
    this.resetPlant(this.queryParams.values.businessUnitCode);
    this.loadPeriodLevel();

    // 获取服务器时间
    this.innerService.getServerDatetime({ dateFormat: 'yyyy-MM-dd', addMonth: 1 })
      .subscribe(rsp => {
        this.queryParams.values.demandDate = rsp.data;
        // 加载大类小类
        this.loadSalesCatgory();
      });
  }

  /**
   * 事业部变化事件
   */
  public onBusinessUnitCodeChange(eventParams: any): void {
    this.loadSalesCatgory();
    this.resetPlant(eventParams);
    this.loadPeriodLevel();
    this.queryParams.values.itemCode = { value: '', text: '' };
  }

  /**
  * 加载产品大类和小类
  */
  public loadSalesCatgory() {
    const dto = {
      demandDate: new Date(this.queryParams.values.demandDate),
      businessUnitCode: this.queryParams.values.businessUnitCode
    };

    const bigUI = ['salesCatgoryBig'];
    this.setQueryFormUILoading(bigUI, true);
    /** 大类 */
    this.salesCatgoryBigOptions.length = 0;
    this.innerService.getSalescatgoryBig(dto).subscribe(rsp => {
      if (rsp.data !== undefined) {
        rsp.data.forEach(element => {
          this.salesCatgoryBigOptions.push({ label: element, value: element });
        });
      }
      this.setQueryFormUILoading(bigUI, false);
    });

    const subUI = ['salesCatgorySub'];
    this.setQueryFormUILoading(subUI, true);
    /** 小类 */
    this.salesCatgorySubOptions.length = 0;
    this.innerService.getSalescatgorySub(dto).subscribe(rsp => {
      if (rsp.data !== undefined) {
        rsp.data.forEach(element => {
          this.salesCatgorySubOptions.push({ label: element, value: element });
        });
      }
      this.setQueryFormUILoading(subUI, false);
    });
  }

  /**
  * 根据选中的事业部，设置可选的工厂
  */
  public resetPlant(businessUnitCode: any): void {
    this.plantOptions.length = 0;
    this.queryParams.values.plantCode = null;
    this.commonQueryService.GetUserPlant(businessUnitCode).subscribe(ret => {
      ret.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });
  }

  public loadPeriodLevel() {
    // 查询是否是周还是月
    this.innerService.getPeriodLevel(this.queryParams.values.businessUnitCode).subscribe(result => {
      this.isMothWeek = result.data;
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesTypeOptions;
        break;
      case 2:
        options = this.approveStatus;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  /**
  * 是否新品列格式化
  */
  public isNewFormatter(data) {
    if (this.isNull(data.newProductCode)) {
      return this.appTranslationService.translate('否');
    } else {
      return this.appTranslationService.translate('是');
    }
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
      console.log(event.data.id + '_' + updateObj.fieldName);
      // 修改更新标记
      this.valueChangedItem.set(event.data.id + '_' + updateObj.fieldName, updateObj);
      this.reCountValues(event);
      // 刷新数据值
      this.gridApi.refreshCells({ rowNodes: [event.node] });
    }
  }

  /**
   * 获取单元格更新的值对象
   */
  getCellUpdateValueObj(data: any) {
    const obj = {
      id: '',
      relativeId: '',
      fieldName: '',
      value: '',
      periodIndex: -1, // -1=M月份，0=M+1月份。。。
      demandPeriod: ''
    };
    console.log('getCellUpdateValueObj:');
    console.log(data);
    const fields = ['updateOnhand', 'productionN']; // M月份的修改列
    obj.demandPeriod = data.data.demandDate;
    if (fields.findIndex(it => it === data.column.colId) >= 0) {
      obj.id = data.data.id;
      obj.relativeId = data.data.relativeId;
      obj.fieldName = data.column.colId;
      obj.value = data.newValue;
    } else {
      // M+N月份的修改列
      // 获取更新对应记录的ID
      const columnIndex = data.column.userProvidedColDef.periodIndex;
      // 寻找该月份对应的行记录ID，如果找不到，则传入相关联的本月的行ID值
      const relativeId = data.data.mnmonthInventory[columnIndex].sopUncstrForecastId;
      if (relativeId !== undefined && relativeId !== null) {
        obj.id = relativeId;
      } else {
        obj.relativeId = data.data.id;
      }
      obj.fieldName = data.column.userProvidedColDef.dbField;
      obj.value = data.newValue;
      obj.periodIndex = data.column.userProvidedColDef.periodIndex;
    }
    return obj;
  }

  /**
   * 重新计算值
   */
  reCountValues(data: any) {
    console.log('reCountValues:');
    console.log(data);
    if (data.column.colId === 'updateOnhand') {
      // M月底库存
      // 重新计算M月底库存金额
      this.countOtherValues_After_ValueChanged(data);
    } else if (data.column.colId === 'productionN') {
      // 修改 M月预计入库
      // 重新计算M月底库存（这里判断了M月底库存是否已经被修改过，如果曾经被手动修改过，则不会联动修改）
      if (Number.parseFloat(data.data.updateOnhandDbvalue) === -1) {
        data.data.updateOnhand = Number.parseFloat(data.data.onhand) + Number.parseFloat(data.data.productionN)
          - Number.parseFloat(data.data.noShipmentAndUnmet);
      }
      this.countOtherValues_After_ValueChanged(data);
    } else if (data.column.colId.startsWith('M_N_MONTH_INVENTORY_forecastUpdate_')) {
      console.log('M_N_MONTH_INVENTORY_forecastUpdate');
      const index = data.column.userProvidedColDef.periodIndex;
      data.data.mnmonthInventory[index].forecastUpdate = data.newValue;
      // 修改 M+N月销量调整
      this.countOtherValues_After_ValueChanged(data);
    } else if (data.column.colId.startsWith('M_N_MONTH_INVENTORY_productionN1_')) {
      const index = data.column.userProvidedColDef.periodIndex;
      data.data.mnmonthInventory[index].productionN1 = data.newValue;
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
    data.data.onhandAmount = Number.parseFloat(data.data.price) * Number.parseFloat(data.data.updateOnhand);

    // 重新计算修改月份后面的月份
    let index = data.column.userProvidedColDef.periodIndex;
    if (index === undefined || index === '') {
      index = 0; // 如果修改的不是M+N列的数据，则默认从M+1月开始计算
    }

    for (let i = index; i < data.data.mnmonthInventory.length; i++) {
      // M+N月末库存 = M+N-1月的库存现有量 + M+N规划生产量 - M+N销量
      // M+N月末库存 = M+N月末库存 + M+N规划生产量 - M+N销量
      let updateOnhand = 0;
      if (i === 0) {
        // M+1月份的库存余额取值M月份的库存现有量
        updateOnhand = Number.parseFloat(data.data.updateOnhand);
      } else {
        // M+N月份的库存余额取值M+N-1月份的月末库存量（N>=2）
        updateOnhand = Number.parseFloat(data.data.mnmonthInventory[i - 1].updateOnhand);
      }

      // 如果没有手工输入，则字段为空时，默认等于：M+N月销量调整
      if (data.data.mnmonthInventory[i].productionN1Dbvalue === -1) {
        data.data.mnmonthInventory[i].productionN1 = data.data.mnmonthInventory[i].forecastUpdate;
      }

      data.data.mnmonthInventory[i].updateOnhand = updateOnhand + Number.parseFloat(data.data.mnmonthInventory[i].productionN1) -
        Number.parseFloat(data.data.mnmonthInventory[i].forecastUpdate);

      // 如果计算小于0，则为0
      data.data.mnmonthInventory[i].updateOnhand = Math.max(data.data.mnmonthInventory[i].updateOnhand, 0);

      // M+N月末库存金额
      data.data.mnmonthInventory[i].onhandAmount = Number.parseFloat(data.data.mnmonthInventory[i].updateOnhand)
        * Number.parseFloat(data.data.price);

      // M+N月存销比
      if (Number.parseFloat(data.data.avgSales) !== 0) {
        data.data.mnmonthInventory[i].productionDepositratio = Number.parseFloat(data.data.mnmonthInventory[i].updateOnhand) /
          Number.parseFloat(data.data.avgSales);

        // 小数点格式化
        data.data.mnmonthInventory[i].productionDepositratio = Number.parseFloat(data.data.mnmonthInventory[i].productionDepositratio)
          .toFixed(2);
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
      const item_inventorys = rowData.mnmonthInventory;
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
    if (params.data.approveStatus === 'APPROVED') {
      params.context.gridApi.stopEditing(true);
      params.context.msgSrv.warning(params.context.appTranslationService.translate('[已审批]的记录不能编辑！'));
    }
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

  public saveVerdion(): void {
    this.innerService.saveSopUncstrForecastVersion(this.getQueryParams()).subscribe(rsp => {
      if (rsp.code === 200) {
        this.msgSrv.success('保存成功');

      } else {
        this.msgSrv.error(rsp.msg);
      }
    });
  }

  /**
   * 导入
   */
  public import() {
    this.modal.static(SupplyCustomizationImportComponent, { q: this.getQueryParams() }, 'md')
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
    this.queryCommon();
  }

  /**
 * 查询的公共方法
 */
  public queryCommon() {
    this.innerService.loadGridViewNew(
      {
        url: this.innerService.baseUrl + '/getsopsupplyforupdate',
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

  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    const action = {
      url: this.innerService.baseUrl + '/getsopsupplyforupdate',
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
        this.respDataHandle(rsp.data.content);
        this.expColumns = this.getExportColumns();
        return rsp.data.content;
      },
    );
  }

  /**
   * 构造查询参数
   * @returns 
   */
  public getQueryParams(): any {
    const queryParams = deepCopy(this.queryParams.values);
    queryParams.demandDate = this.innerService.formatDateTime2(this.queryParams.values.demandDate, 'yyyy-MM-dd');
    queryParams.itemCode = this.queryParams.values.itemCode.text;

    return queryParams;
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
 * 服务器返回数据的后处理
 */
  respDataHandle(data: any) {
    // 查询之后回调的方法
    if (data !== undefined && data !== null && data.length > 0) {
      // 先构造列
      const m_n_month_inventorys = data[0].mnmonthInventory;
      if (m_n_month_inventorys !== undefined && m_n_month_inventorys !== null && m_n_month_inventorys.length > 0) {
        this.columns = deepCopy(this.origin_columns);
        // 查询月份（也就是M+1月）
        let monthIndex = new Date(this.queryParams.values.demandDate).getMonth() + 1;
        // 替换M月份的列名
        if (this.isMothWeek === 'MONTH') {
          const columnFields = [
            {
              field: 'productionN',
              hide: false,
              headerName: '月预计入库',
              editable: false,
              cellEditorParams: {
                inputParams: {
                  numberType: 'float', // 默认为支持整型
                  // maxValue: Number.MAX_VALUE, // 限制最大值
                  // minValue: Number.MIN_VALUE, // 限制最小值
                  charPress: '1234567890.-', // 只能输入的字符
                }
              }
            },
            {
              field: 'updateOnhand',
              headerName: '月底库存',
              // cellEditor: 'AgNumberEditor2',
              // headerClass: 'demandCustomization_EditColumnHeader',
              editable: false
            },
            { field: 'onhandAmount', headerName: '月底库存金额' },
          ];
          columnFields.forEach(item => {
            // M月份为查询月份的前一个月
            const headerName = 'N0' + this.appTranslationService.translate(item.headerName);
            item.headerName = headerName;
            this.columns.push(item);
          });

          console.log('m_n_month_inventorys:');
          console.log(m_n_month_inventorys);
          // 构造M+N月份列，遍历每一个月份的列，动态构造
          let columnIndex = 0; // 代表N（M+N的N）
          m_n_month_inventorys.forEach(item => {
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_forecastQty_' + columnIndex,
              headerName: 'N' + (columnIndex + 1) + this.appTranslationService.translate('月销量')
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_manzhuQty_' + columnIndex,
              headerName: 'N' + (columnIndex + 1) + this.appTranslationService.translate('满足数量')
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_forecastUpdate_' + columnIndex,
              headerName: 'N' + (columnIndex + 1) + this.appTranslationService.translate('月销量调整'),
              headerClass: 'demandCustomization_EditColumnHeader',
              periodIndex: columnIndex,
              // cellEditor: 'AgNumberEditor2',
              editable: true,
              dbField: 'forecastUpdate'
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_productionN1_' + columnIndex,
              headerName: 'N' + (columnIndex + 1) + this.appTranslationService.translate('月规划生产量'),
              headerClass: 'demandCustomization_EditColumnHeader',
              periodIndex: columnIndex,
              // cellEditor: 'AgNumberEditor2',
              editable: true,
              dbField: 'productionN1'
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_updateOnhand_' + columnIndex,
              headerName: 'N' + (columnIndex + 1) + this.appTranslationService.translate('月末库存'),
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_onhandAmount_' + columnIndex,
              headerName: 'N' + (columnIndex + 1) + this.appTranslationService.translate('月末库存金额'),
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_productionDepositratio_' + columnIndex,
              headerName: 'N' + (columnIndex + 1) + this.appTranslationService.translate('月存销比'),
            });
            monthIndex++;
            columnIndex++;
          });
        } else {
          const columnFields = [
            {
              field: 'productionN',
              hide: false,
              headerName: '预计入库',
              // cellEditor: 'AgNumberEditor2',
              headerClass: 'demandCustomization_EditColumnHeader',
              editable: true,
              cellEditorParams: {
                inputParams: {
                  numberType: 'float', // 默认为支持整型
                  // maxValue: Number.MAX_VALUE, // 限制最大值
                  // minValue: Number.MIN_VALUE, // 限制最小值
                  charPress: '1234567890.-', // 只能输入的字符
                }
              }
            },
            {
              field: 'updateOnhand',
              headerName: '底库存',
              // cellEditor: 'AgNumberEditor2',
              headerClass: 'demandCustomization_EditColumnHeader',
              editable: true,
            },
            { field: 'onhandAmount', headerName: '底库存金额' },
          ];
          columnFields.forEach(item => {
            // M月份为查询月份的前一个月
            const headerName = 'W0' + this.appTranslationService.translate(item.headerName);
            item.headerName = headerName;
            this.columns.push(item);
          });

          console.log('m_n_month_inventorys:');
          console.log(m_n_month_inventorys);
          // 构造M+N月份列，遍历每一个月份的列，动态构造
          let columnIndex = 0; // 代表N（M+N的N）
          m_n_month_inventorys.forEach(item => {
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_forecastQty_' + columnIndex,
              headerName: 'W' + (columnIndex + 1) + this.appTranslationService.translate('销量'),
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_manzhuQty_' + columnIndex,
              headerName: 'W' + (columnIndex + 1) + this.appTranslationService.translate('满足数量'),
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_forecastUpdate_' + columnIndex,
              headerName: 'W' + (columnIndex + 1) + this.appTranslationService.translate('销量调整'),
              headerClass: 'demandCustomization_EditColumnHeader',
              periodIndex: columnIndex,
              // cellEditor: 'AgNumberEditor2',
              editable: true,
              dbField: 'forecastUpdate',
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_productionN1_' + columnIndex,
              headerName: 'W' + (columnIndex + 1) + this.appTranslationService.translate('规划生产量'),
              headerClass: 'demandCustomization_EditColumnHeader',
              periodIndex: columnIndex,
              // cellEditor: 'AgNumberEditor2',
              editable: true,
              dbField: 'productionN1',
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_updateOnhand_' + columnIndex,
              headerName: 'W' + (columnIndex + 1) + this.appTranslationService.translate('末库存'),
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_onhandAmount_' + columnIndex,
              headerName: 'W' + (columnIndex + 1) + this.appTranslationService.translate('末库存金额'),
            });
            this.columns.push({
              field: 'M_N_MONTH_INVENTORY_productionDepositratio_' + columnIndex,
              headerName: 'W' + (columnIndex + 1) + this.appTranslationService.translate('存销比'),
            });
            monthIndex++;
            columnIndex++;
          });
        }
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
    qParams.approveStatus = status;
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(tips),
      nzOnOk: () => {
        this.http.post<ResponseDto>('/api/sop/sopuncstrforecast/approvalForecase', qParams)
          .subscribe(rsp => {
            if (rsp.code === 200) {
              this.msgSrv.success(
                this.appTranslationService.translate('审批成功！'),
              );
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(rsp.msg));
            }
          });
      },
    });
  }

  /**
   * 加载物料
   */
  public loadItems({ PLANT_CODE = '', ITEM_CODE = '', PageIndex = 1, PageSize = 10 }) {
    const items = ['itemCode'];
    this.setQueryFormUILoading(items, true);
    this.innerService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize)
      .subscribe(res => {
        this.viewItems.data = res.data.content;
        this.viewItems.total = res.data.totalElements;

        this.setQueryFormUILoading(items, false);
      });
  }

  /**
   * 物料起始
   * @param e
   */
  public searchItems(e: any) {
    if (!this.queryParams.values.plantCode || this.queryParams.values.plantCode === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems({
      PLANT_CODE: this.queryParams.values.plantCode,
      ITEM_CODE: e.SearchValue,
      PageIndex: PageIndex,
      PageSize: e.PageSize,
    });
  }
}
