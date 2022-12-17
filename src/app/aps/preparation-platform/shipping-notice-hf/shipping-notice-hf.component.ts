import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent } from '@delon/abc';
import { process } from '@progress/kendo-data-query';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { ShippingNoticeHfService } from '../../../modules/generated_module/services/shipping-notice-hf-service';
import { PreparationPlatformShippingNoticeHfViewComponent } from './view/view.component';
import { PreparationPlatformShippingNoticeHfQueryComponent } from './view/query.component';
import { PreparationPlatformShippingNoticeHfPoLackMaterialComponent } from './view/po-lack-material.component';
import { PreparationPlatformShippingNoticeHfDataCheckComponent } from './view/data-check.component';
import { PreparationPlatformShippingNoticeHfPlanReleaseComponent } from './edit/plan-release.component';
import { PreparationPlatformNoticeQueryCancelComponent } from '../notice-query-cancel/notice-query-cancel.component';
// import { FormGroup, FormBuilder } from '@angular/forms';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppComponent } from 'app/app.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PreparationPlatformNoticeQueryCancelAnComponent } from '../notice-query-cancel-an/notice-query-cancel-an.component';
import { PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent } from './view/auto-calculate-choose.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-shipping-notice-hf',
  templateUrl: './shipping-notice-hf.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [QueryService, ShippingNoticeHfService],
  styles: [`.k-grid .no-padding{padding:0}
          .whole-cell{display:block;padding:0;margin:0;}
          .redCellStyle {color:red;}
          .blueCellStyle {color:blue;}
          .yellowCellStyle {color:#EAC100}
          .backColor0 {background-color:#ffffff !important}
          .backColor1 {background-color:#F5F0F0 !important}
          .show-cell {
                background: white;
                border-left: 0.5px lightgrey solid !important;
                border-right: 0.5px lightgrey solid !important;
                border-bottom: 0.5px lightgrey solid !important;
            }`]
})
export class PreparationPlatformShippingNoticeHfComponent extends CustomBaseContext implements OnInit {

  queryParams: any;
  retParams: any = { load: true };
  public selectionKeys: any[] = [];
  public components;
  T_MINIMUN_PACKAGE: any;
  selectRow: any;
  dtdisplayday:number = 0;
  selectColumn: any;
  private template =
  `<div class="ag-cell-label-container" role="presentation">
        <div ref="eLabel" class="ag-header-cell-label" role="presentation">
          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
        </div>
      </div>`;
  public staticColumns: any[] = [
    {
      colId: 1, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.template
      },
      rowSpan: function (params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell': function (params) { return params.data.showCell; },
        'backColor0': function (params) { return params.data.showCell && params.data.itemIndex % 2 === 0; },
        'backColor1': function (params) { return params.data.showCell && params.data.itemIndex % 2 !== 0; }
      },
    },
    // {
    //   field: 'plantCodeShow',
    //   cellRenderer: 'showCellRenderer',
    //   rowSpan: function (params) {
    //     return params.data.rowSpan;
    //   },
    //   cellClassRules: {
    //     'show-cell': function (params) { return params.data.showCell; },
    //     'backColor0': function (params) { return params.data.showCell && params.data.itemIndex % 2 === 0; },
    //     'backColor1': function (params) { return params.data.showCell && params.data.itemIndex % 2 !== 0; }
    //   },
    //   title: '组织', headerName: '组织', width: 70, pinned: 'left', lockPinned: true,
    // },

    // {
    //   field: 'deliveryRegionCodeShow',
    //   cellRenderer: 'showCellRenderer',
    //   rowSpan: function (params) {
    //     return params.data.rowSpan;
    //   },
    //   cellClassRules: {
    //     'show-cell': function (params) { return params.data.showCell; },
    //     'backColor0': function (params) { return params.data.showCell && params.data.itemIndex % 2 === 0; },
    //     'backColor1': function (params) { return params.data.showCell && params.data.itemIndex % 2 !== 0; }
    //   },
    //   title: '送货区域', headerName: '送货区域', width: 120, pinned: 'left', lockPinned: true,
    // },
    // {
    //   field: 'itemCodeShow',
    //   cellRenderer: 'showCellRenderer',
    //   rowSpan: function (params) {
    //     return params.data.rowSpan;
    //   },
    //   cellClassRules: {
    //     'show-cell': function (params) { return params.data.showCell; },
    //     'backColor0': function (params) { return params.data.showCell && params.data.itemIndex % 2 === 0; },
    //     'backColor1': function (params) { return params.data.showCell && params.data.itemIndex % 2 !== 0; }
    //   },
    //   title: '物料', headerName: '物料', width: 150, pinned: 'left', lockPinned: true
    // },
    { field: 'plantCodeShow', headerName: '组织', width: 110, lockPinned: true, pinned: 'left', menuTabs: ['filterMenuTab'] },
    { field: 'itemCodeShow', headerName: '物料', width: 150, lockPinned: true, pinned: 'left', menuTabs: ['filterMenuTab'] },
    {
      field: 'rowTypeDesc', headerName: '行类型', width: 100, lockPinned: true, pinned: 'left', menuTabs: ['filterMenuTab'],
      cellClass: function (params) { return params.context.getCellClass(params.data, 'rowTypeDesc', 'line'); }
    },
    // { field: 'poAvailable', headerName: 'PO可用量', width: 110, lockPinned: false, menuTabs: ['filterMenuTab'] },
    // { field: 'onhand', headerName: '现有量', width: 90, lockPinned: false, menuTabs: ['filterMenuTab'] },
   { field: 'executePercent', headerName: '分配/执行(%)', width: 120, lockPinned: false, menuTabs: ['filterMenuTab'] },
    { field: 'expiredNotify', headerName: '过期', width: 100, lockPinned: true, pinned: 'left', menuTabs: ['filterMenuTab'] },
    {
      field: 'subTotal', headerName: '小计', width: 70, lockPinned: true, menuTabs: ['filterMenuTab'], pinned: 'left',
      cellClass: function (params) { return params.context.getCellClass(params.data, 'subTotal', 'line'); }
    }];

  public extendColumns: any[] = []; // 日期扩展列
  columns = [];
  expColumns = [];
  // gridRowStyle = { 'border-bottom': '1px solid #d9d9d9' };
  totalCount = 0;
  displayCols = '';
  // formGroup: FormGroup;
  dtSave: any[] = [];
  displayPlantCode = '';
  dtDeliveryPlan: any[] = [];
  redColumnHeaders: any[] = [];
  @ViewChild('st', { static: true }) st: STComponent;
  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    public shippingNoticeHfService: ShippingNoticeHfService,
    public pro: BrandService,
    private confirmationService: NzModalService,
    public appConfig: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfig });
    this.headerNameTranslate(this.columns);
    this.defaultColDef.sortable = false;;
    this.components = { showCellRenderer: this.mergeCellRenderer() };
  }

  mergeCellRenderer() {
    function ShowCellRenderer() { }
    ShowCellRenderer.prototype.init = function (params) {
      this.ui = document.createElement('div');
      // if (params.colDef.field === 'itemCodeShow') {
      //   this.ui.innerHTML = '<div>' + params.data.itemCodeShow + '</div>' +
      //     '<div style="white-space: normal;"><span>' + params.data.itemDesc + '</span></div>';
      // } else if (params.colDef.field === 'plantCodeShow') {
      //   this.ui.innerHTML = '<div>' + params.data.plantCodeShow + '</div>' +
      //     '<div style="white-space: normal;"><span>' + params.data.deliveryRegionCodeShow + '</span></div>';
      // } else {
      //   this.ui.innerHTML = '<div>' + params.value + '</div>';
      // }
    };
    ShowCellRenderer.prototype.getGui = function () {
      return this.ui;
    };
    return ShowCellRenderer;
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  ngOnInit() {
    this.gridData = [];
    // this.gridOptions.enableSorting = false;
    this.setGridColumn();
  }

  setGridColumn() {
    this.columns = [];
    this.staticColumns.forEach(col => {
      this.columns.push(col);
    });
    this.extendColumns.forEach(col => {
      this.columns.push(col);
    });
  }

  query() {
    this.retParams.refresh = false;
    this.modal
      .static(PreparationPlatformShippingNoticeHfQueryComponent, { queryParams: this.retParams }, 'lg')
      .subscribe(() => {
        this.retParams.load = false;
        if (this.retParams.refresh) {
          this.queryParams = Object.assign({}, this.retParams);
          super.query();
          this.queryCommon();
        }
      });
  }

  // 查询
  queryCommon() {
    if (this.queryParams === undefined) return;
    this.setLoading(true);
    this.dtSave = [];
    this.queryParams.export = false;
    this.queryParams.pageIndex = this._pageNo; // this.gridState.skip / this.gridState.take + 1;
    this.queryParams.pageSize = this._pageSize; // this.gridState.take;
    this.commonQueryService.pageMainData(this.queryParams).subscribe(result => {
      this.gridData.length = 0;
      this.totalCount = result.extra.totalCount; // this.isNull(result.data.totalElements) ? 0 : result.data.totalElements;
      this.gridApi.paginationSetPageSize(result.data.content.length);
      this.selectionKeys = [];
      this.createExtendColumns(result.extra.pcDisplayDays, result.extra.pcDeliveryCalendarLineList);
      this.gridData = result.data.content;
      this.dtDeliveryPlan = result.extra.pcDeliveryPlanList;
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length, // this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };
      this.setLoading(false);
    });
  }

  // 创建扩展列
  createExtendColumns(displayCols: number, calendarLine: any) {
    const display = displayCols.toString() + '-' + this.queryParams.calendarType;
    // 如果扩展天数有变更，则重新创建扩展列
    // if (this.displayCols !== display) {
    this.displayCols = display;
    this.extendColumns = [];
    this.redColumnHeaders = [];
    // 列头样式：MM-DD班次号(星期)，如：04-10天(一)
    const weekDays = this.appTranslationService.translate('日一二三四五六');
    for (let i = 0; i < displayCols; i++) {
      // 获取当前日期，并递增
      const dt = new Date();
      dt.setDate(dt.getDate() + i);
      const days = dt.getDay();
      const str = this.getDateFormat(dt);
      const dtnowdate=  new Date();
      const dtnowday =  dtnowdate.getDate();
      const displayplant=this.queryParams.PlantCode;
      const reg = new RegExp('-', 'g'); // 创建正则RegExp对象
      // 按照班次添加列
      //if (calendarLine != null) {
        if (this.displayCols !== display || this.dtdisplayday !== dtnowday ||  this.displayPlantCode !== displayplant) {
        calendarLine.forEach(cl => {
          const field = 'COL' + cl.shiftCode + str.replace(reg, ''); // + cl.SHIFT_CODE;
          const title = str.substring(5) + cl.shiftCode + '(' + weekDays.charAt(dt.getDay()) + ')';
          // 班次开始时间，结束时间
          const fieldTime = str + ' ' + cl.shiftStartTime;
          let fieldTimeTo = str + ' ' + cl.shiftEndTime;
          if (new Date(fieldTime) >= new Date(fieldTimeTo)) {
            // 如果开始时间大于等于结束时间，则结束时间加一天
            const dtAddDay = dt;
            dtAddDay.setDate(dtAddDay.getDate() + 1);
            fieldTimeTo = this.getDateFormat(dtAddDay) + ' ' + cl.shiftEndTime;
          }
          // 构造列
          const col = {
            field: field,
            // title: title,
            headerName: title,
            width: 120,
            lockPinned: false,
            // 列编辑模式
            editable: (params) => {
              return this.planEditState(field, params.data);
            },
            fieldTime: fieldTime,
            fieldTimeTo: fieldTimeTo,
            cellClass: function (params) { return params.context.getCellClass(params.data, field, 'line'); }
          };
          this.extendColumns.push(col);
          // 列头星期六星期天显示红色
          if (days === 0 || days === 6) {
            this.redColumnHeaders.push(title);
          }
        });
      }
    }

    this.setGridColumn();
    // }
  }

  getDateFormat(dt: Date) {
    return this.commonQueryService.formatDate(dt);
  }

  // 单元格双击
  onCellDoubleClicked(event) {
    const rowType = event.data.rowType;
    // EXPIRED_NOTIFY_QTY
    if (event.value && (rowType === 'DEMAND' || rowType === 'DELIVERY_NOTIFY') && (event.colDef.field === 'onhand' || event.colDef.field === 'expiredNotify' || event.colDef.field.indexOf('COL') > -1)) {
      // 双击需求或送货计划弹出明细
      if (rowType === 'DEMAND') {
        const param = {
          rowType: rowType,
          plantCode: event.data.plantCode,
          itemId: event.data.itemId,
          fieldName: event.colDef.field,
          deliveryCalendar: event.data.deliveryCalendarCode,
          deliveryRegion: event.data.deliveryRegionCode
        };
        if (this.checkEventTriggered()) return;
        this.modal.static(PreparationPlatformShippingNoticeHfViewComponent, { iParam: param }, 'lg')
          .subscribe(() => {
            this.hasEventTriggered = false;
            // this.query();
          });
      }
      if (rowType === 'DELIVERY_NOTIFY' && event.colDef.field !== 'onhand') {
        const param = {
          plantCode: event.data.plantCode,
          buyer: event.data.buyer,
          deliveryRegionCode: event.data.deliveryRegionCode,
          itemId: event.data.itemId,
          popForm: true,
          notifyMode: '0',
          rowTypeTitle: event.colDef.field,
          deliveryCalendarCode: event.data.deliveryCalendarCode,
          refresh: false
        };
        if (this.checkEventTriggered()) return;
        this.modal.static(PreparationPlatformNoticeQueryCancelAnComponent, { showSearch: false, queryParams: param, waixie_flag: 'N' }, 'lg')
          .subscribe(() => {
            this.hasEventTriggered = false;
            if (param.refresh) {
              // 取消或释放了 刷新数据
              const selectItem = [];
              selectItem.push(event.data.itemCode);
              this.RefreshDataFun(selectItem);
            }
          });
      }
    }
  }

  // 判断单元格是否可编辑
  public planEditState(strfield: string, dataItem: any) {
    const col = this.extendColumns.find(p => p.field === strfield);
    return this.cellEditState(dataItem, col);
  }

  cellEditState(dataItem: any, column: any) {
    let flag = false;

    if (column !== undefined) {
      // 供应商送货计划可编辑 dataItem['CAN_EDIT'] ,非自动计算产生的可以编辑
      if (dataItem['rowType'] === 'VENDOR_DELIVERY_PLAN') {
        //flag = !this.planSystemFlag(dataItem, column);
        flag = true;
      }
    }
    return flag;
  }

  // 判断计划单是否是自动计算的
  planSystemFlag(dataItem: any, column: any) {
    const deliveryPlan = this.dtDeliveryPlan.findIndex(p => p.plantCode === dataItem.plantCode && p.itemId === dataItem.itemId
      && p.vendorNumber === dataItem.vendorNumber && p.vendorSiteCode === dataItem.vendorSiteCode && p.systemFlag === 'Y'
      && p.demandDate >= column.fieldTime && p.demandDate < column.fieldTimeTo);
    return deliveryPlan > -1;
  }

  // 计算预计可用量
  public calDeduce(changeRow: any) {
    if (this.gridData == null || this.gridData.length === 0) return;
    let lastDeduce = 0;
    let rowIndex = 0;
    this.gridData.forEach(gd => {// 循环数据
      if (changeRow === null || (gd.itemId === changeRow.itemId && gd.deliveryRegionCode === changeRow.deliveryRegionCode)) {
        if (gd.rowType === 'VENDOR_DELIVERY_PLAN' && gd.vendorNumber === changeRow.vendorNumber) {
          // 供应商送货计划
          let subtotal = 0;
          this.extendColumns.forEach(ec => {// 循环日期
            subtotal = subtotal + this.strToNumber(gd[ec.field]);
          });
          gd.subTotal = subtotal;
        }
        // 预计可用量
        if (gd.rowType === 'AVAILABLE_QUANTITY') {
          // 需求行
          const dataDemand = this.gridData.find(p => p.itemId === gd.itemId && p.deliveryRegionCode === gd.deliveryRegionCode && p.rowType === 'DEMAND');
          // 供应行
          const dataSupply = this.gridData.find(p => p.itemId === gd.itemId && p.deliveryRegionCode === gd.deliveryRegionCode && p.rowType === 'DELIVERY_NOTIFY');
          // 送货计划量
          const dataPlan = this.gridData.filter(p => p.itemId === gd.itemId && p.deliveryRegionCode === gd.deliveryRegionCode && p.rowType === 'VENDOR_DELIVERY_PLAN');
          // 期初 = 现有量+过期通知-过期需求
          lastDeduce = this.strToNumber(gd.onhand) + this.strToNumber(dataSupply.expiredNotifyQty) - this.strToNumber(dataDemand.expiredNotifyQty);
          // 总可用量
          let totalUse = 0;
          this.extendColumns.forEach(ec => {// 循环日期
            // 预计可用量 = 前一日预计可用量 + 送货通知 + 送货计划量 - 需求量
            let val = this.strToNumber(lastDeduce) + this.strToNumber(dataSupply[ec.field]) - this.strToNumber(dataDemand[ec.field]);
            dataPlan.forEach(dp => {
              val = val + this.strToNumber(dp[ec.field]);
            });
            gd[ec.field] = val;
            lastDeduce = val;
            totalUse = val;
          });
          gd.subTotal = totalUse;
        }
      }
      rowIndex = rowIndex + 1;
    });
    this.gridApi.refreshCells();
  }

  public getCellClass(dataItem: any, field: string, colType: string) {
    if (colType === 'header') {
      // 列头星期六星期天显示红色
      const str = this.getDataStrFromTitle(field);
      const days = new Date(str).getDay();
      if (days === 0 || days === 6)
        return 'redCellStyle'; // { 'redCellStyle': true };
    }
    if (colType === 'line') {
      // 负数显示红色
      if (this.strToNumber(dataItem[field]) < 0) {
        return 'redCellStyle'; // { 'redCellStyle': true };
      }

      // 供应商显示蓝色
      if (dataItem.rowType === 'VENDOR_DELIVERY_PLAN' && field === 'rowTypeDesc') {
        return 'blueCellStyle'; // { 'blueCellStyle': true };
      }

      // 送货计划不可编辑的显示蓝色
      if (dataItem['rowType'] === 'VENDOR_DELIVERY_PLAN') {
        const col = this.extendColumns.find(p => p.field === field);
        if (col !== undefined && this.planSystemFlag(dataItem, col)) {
          // 供应商送货计划可编辑 dataItem['CAN_EDIT'] ,非自动计算产生的可以编辑
          return 'yellowCellStyle'; // { 'yellowCellStyle': true };
        }
      }
    }
    return '';
  }

  getDataStrFromTitle(colValue: string) {
    const col = this.extendColumns.find(p => p.field === colValue);
    if (col === undefined)
      return '-1';
    else
      return col.fieldTime;
  }

  strToNumber(str: any) {
    if (str == null || str.length === 0) return 0;
    return Number(str);
  }

  // 导出
  public export() {
    super.export();
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }

    this.queryParams.export = true;
    this.commonQueryService.pageMainData(this.queryParams).subscribe(result => {
      this.excelexport.export(result.data.content);
    });
  }

  // 保存
  public save() {
    // 获取变更的数据
    const msg = this.appTranslationService.translate('没有要保存的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    if (this.dtSave.length === 0) {
      this.msgSrv.info(msg);
      return;
    }

    this.shippingNoticeHfService.saveDeliveryPlanData(this.dtSave, this.queryParams.buyer).subscribe(res => {
      if (res.code === 200) {
        this.dtSave = [];
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  // 数据刷新
  RefreshData() {
    if (this.gridData == null || this.gridData.length === 0 || this.selectionKeys.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请勾选物料数据！'));
      return;
    }

    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要刷新吗？'),
      nzOnOk: () => {
        this.RefreshDataFun(this.selectionKeys);
      },
    });
  }

  RefreshDataFun(selectItem: any) {
    this.setLoading(true);
    this.shippingNoticeHfService.refreshData(this.queryParams.plantCode, this.queryParams.buyer, selectItem).subscribe(res => {
      if (res.code === 200) {
        this.queryCommon();
        this.msgSrv.success(this.appTranslationService.translate('刷新成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
      this.setLoading(false);
    });
  }

  // 清除送货计划
  clearPlan() {
    if (this.gridData == null || this.gridData.length === 0) {
      // this.msgSrv.info(msg);
      return;
    }
    const msg = this.appTranslationService.translate('请勾选物料数据！');
    if (this.selectionKeys.length === 0) {
      this.msgSrv.info(msg);
      return;
    }

    const listPlan = []; // 清除数据列表，物料，送货区域，供应商
    this.selectionKeys.forEach(ms => {
      const listFilter = this.gridData.filter(p => p.itemCode === ms && p.rowType === 'VENDOR_DELIVERY_PLAN');
      listFilter.forEach(dr => {
        const row = {
          plantCode: dr.plantCode,
          itemId: dr.itemId,
          itemCode: dr.itemCode,
          deliveryRegionCode: dr.deliveryRegionCode,
          vendorNumber: dr.vendorNumber,
          vendorSiteCode: dr.vendorSiteCode,
          deliveryCalendarCode: dr.deliveryCalendarCode
        };
        listPlan.push(row);
      });
    });

    if (listPlan.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('没有要清除的送货计划'));
      return;
    }

    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要清除计划吗？'),
      nzOnOk: () => {
        this.setLoading(true);
        this.shippingNoticeHfService.clearDeliveryPlan(listPlan, this.queryParams.buyer).subscribe(res => {
          if (res.code === 200) {
            this.queryCommon();
            this.msgSrv.success(this.appTranslationService.translate('清除送货计划成功'));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
          this.setLoading(false);
        });
      },
    });
  }

  // 自动计算
  autoCalculate() {
    if (this.selectionKeys.length<=0) {
      this.msgSrv.success(this.appTranslationService.translate('请选择需要计算的物料数据'));
      return;
    }

    this.modal.static(PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent, { queryParams: this.queryParams }, 'lg')
          .subscribe(() => {
            this.hasEventTriggered = false;
            if (this.queryParams.refresh) {
              // 取消或释放了 刷新数据
              this.queryParams = Object.assign({}, this.retParams);
              super.query();
              this.queryCommon();
            }
          });

    // 弹出确认框
    // this.confirmationService.confirm({
    //   nzContent: this.appTranslationService.translate('确定要计算吗？'),
    //   nzOnOk: () => {
    //     this.setLoading(true);
    //     this.shippingNoticeHfService.autoCalculate(this.queryParams.plantCode, this.queryParams.buyer, this.selectionKeys, this.queryParams.calendarType, this.queryParams.fdStatus).subscribe(res => {
    //       if (res.code === 200) {
    //         this.queryCommon();
    //         this.msgSrv.success(this.appTranslationService.translate('自动计算成功，' + res.msg));
    //       } else {
    //         this.msgSrv.error(this.appTranslationService.translate(res.msg));
    //       }
    //       this.setLoading(false);
    //     });
    //   },
    // });
  }

  // po缺料查询
  PoLackMaterial() {
    if (!this.queryParams) {
      this.msgSrv.success(this.appTranslationService.translate('请先查询数据'));
      return;
    }
    this.modal
      .static(PreparationPlatformShippingNoticeHfPoLackMaterialComponent, {plantCode: this.queryParams.plantCode,  buyer: this.queryParams.buyer }, 'lg')
      .subscribe(() => {

      });
  }

  // 批量下达
  noticeRelease() {
    if (!this.queryParams) {
      this.msgSrv.success(this.appTranslationService.translate('请先查询数据'));
      return;
    }

    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要下达吗？'),
      nzOnOk: () => {
        this.setLoading(true);
        this.shippingNoticeHfService.noticeRelease(this.queryParams.plantCode, this.queryParams.buyer, this.selectionKeys, this.queryParams.calendarType, this.dtSave, this.queryParams.fdStatus).subscribe(res => {
          if (res.code === 200) {
            this.queryCommon();
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
          this.setLoading(false);
        });
      },
    });
  }

  // 单元格单击
  onCellClick(event) {
    this.selectRow = event.data;
    this.T_MINIMUN_PACKAGE = this.selectRow.minimunPackage;
    this.selectColumn = event.colDef;
  }

  // 单元格下达
  oneNoticeRelease() {
    if (!this.queryParams) {
      this.msgSrv.info(this.appTranslationService.translate('请先查询数据'));
      return;
    }

    if (!this.selectRow || !this.selectColumn) {
      this.msgSrv.info(this.appTranslationService.translate('请点击需要下达的单元格'));
      return;
    }

    if (this.selectRow.rowType !== 'VENDOR_DELIVERY_PLAN') {
      this.msgSrv.info(this.appTranslationService.translate('请点可以下达的单元格'));
      return;
    }

    const col = this.extendColumns.find(p => p.field === this.selectColumn.field);
    if (!col) {
      this.msgSrv.info(this.appTranslationService.translate('请点可以下达的单元格'));
      return;
    }

    const strValue = this.strToNumber(this.selectRow[this.selectColumn.field]);
    if (!strValue) {
      this.msgSrv.info(this.appTranslationService.translate('单元格的数量不正确'));
      return;
    }

    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要下达吗？'),
      nzOnOk: () => {
        this.setLoading(true);
        const saveData = this.getSaveData(this.selectRow, this.selectColumn);
        this.shippingNoticeHfService.oneNoticeRelease(this.queryParams.plantCode, this.queryParams.buyer, this.queryParams.calendarType, saveData, this.queryParams.fdStatus).subscribe(res => {
          if (res.code === 200) {
            this.queryCommon();
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
          this.setLoading(false);
        });
      },
    });
  }

  // 设置保存数据
  setSaveData(dataItem: any, column: any) {
    // 查找保存数据
    const strDate = this.getDataStrFromTitle(column.field);
    const data = this.dtSave.find(p => p.plantCode === dataItem.plantCode && p.itemId === dataItem.itemId && p.plantDate === strDate
      && p.deliveryRegionCode === dataItem.deliveryRegionCode && p.vendorNumber === dataItem.vendorNumber && p.vendorSiteCode === dataItem.vendorSiteCode);
    if (data !== undefined) {
      // 已经存在
      data.planQty = dataItem[column.field];
    } else {
      const saveData = this.getSaveData(dataItem, column);
      this.dtSave.push(saveData);
    }
  }

  getSaveData(dataItem: any, column: any) {
    const col = this.extendColumns.find(p => p.field === column.field);
    return {
      plantCode: dataItem.plantCode,
      itemId: dataItem.itemId,
      itemCode: dataItem.itemCode,
      deliveryRegionCode: dataItem.deliveryRegionCode,
      vendorNumber: dataItem.vendorNumber,
      vendorSiteCode: dataItem.vendorSiteCode,
      deliveryCalendarCode: dataItem.deliveryCalendarCode,
      planDate: col.fieldTime,
      planDateTo: col.fieldTimeTo,
      planQty: dataItem[column.field],
      fdStatus: this.queryParams.fdStatus
    };
  }

  // 送货计划发布
  planRelease() {
    if (!this.queryParams) {
      this.msgSrv.success(this.appTranslationService.translate('请先查询数据'));
      return;
    }

    const params = this.clone(this.queryParams);
    if (this.selectionKeys.length > 0) {
      params.itemCode = '';
      this.selectionKeys.forEach(p => {
        if (params.itemCode.length > 0)
          params.itemCode = params.itemCode + ',';
        params.itemCode = params.itemCode + p;
      });
    }
    this.modal
      .static(PreparationPlatformShippingNoticeHfPlanReleaseComponent, { queryParams: params }, 'lg')
      .subscribe(() => {

      });
  }

  // 显示列变更（列头样式）
  onVirtualColumnsChanged() {
    const gridDom = document.querySelectorAll('#dnGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.redColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: red');
        }
      });
    }
  }

  // grid 设置行样式
  public getRowClass = function (params) {
    // 根据物料隔行变色
    if (params.data.itemIndex % 2 === 0) {
      return 'backColor0';
    } else {
      return 'backColor1';
    }
  };

  // 单元格内容改变
  onCellValueChanged(event) {
    if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString()) {
      if (event.newValue.length > 0 && (this.strToNumber(event.newValue).toString() === 'NaN' || this.strToNumber(event.newValue) < 0)) {
        this.msgSrv.info(this.appTranslationService.translate('请输入不小于0的数字'));
        this.gridData[event.rowIndex][event.column.colId] = event.oldValue;
      } else {
        // 保存送货计划
        this.setSaveData(this.gridData[event.rowIndex], event.colDef);
        this.save();
      }
      this.calDeduce(event.data);
    }
  }

  // 行选中改变
  onSelectionChanged() {
    const gridSelectRows = this.gridApi.getSelectedRows();
    this.selectionKeys = [];
    if (!this.isNull(gridSelectRows) && gridSelectRows.length > 0) {
      gridSelectRows.forEach(d => {
        if (this.selectionKeys.filter(p => p === d['itemCode']).length === 0)
          this.selectionKeys.push(d['itemCode']);
      });
    }
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  public onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      if (this.queryParams !== undefined) {
        this.queryCommon();
      }
    } else {
      this.setLoading(false);
    }
  }

  // 数据检查
  dataCheck() {
    if (!this.queryParams) {
      this.msgSrv.success(this.appTranslationService.translate('请先查询数据'));
      return;
    }

    const params = this.clone(this.queryParams);
    if (this.selectionKeys.length > 0) {
      params.itemCode = '';
      this.selectionKeys.forEach(p => {
        if (params.itemCode.length > 0)
          params.itemCode = params.itemCode + ',';
        params.itemCode = params.itemCode + p;
      });
    }
    this.modal
      .static(PreparationPlatformShippingNoticeHfDataCheckComponent, { queryParams: params }, 'lg')
      .subscribe(() => {

      });
  }

  demandDetail() {
    if (!this.queryParams) {
      this.msgSrv.success(this.appTranslationService.translate('请先查询数据'));
      return;
    }

    const params = this.clone(this.queryParams);
    if (this.selectionKeys.length > 0) {
      params.itemCode = '';
      this.selectionKeys.forEach(p => {
        if (params.itemCode.length > 0)
          params.itemCode = params.itemCode + ',';
        params.itemCode = params.itemCode + p;
      });
    }
    params['rowType'] = 'DEMAND';
    this.modal
      .static(PreparationPlatformShippingNoticeHfViewComponent, { iParam: params }, 'lg')
      .subscribe(() => {

      });
  }
}
