import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { NoticeQueryCancelService } from '../../../modules/generated_module/services/notice-query-cancel-service';
import { PopupSelectComponent } from 'app/modules/base_module/components/popup-select.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { PreparationPlatformDeliveryViewComponent } from './view/delivery-view.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { formatDate } from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-notice-query-cancel',
  templateUrl: './notice-query-cancel.component.html',
  providers: [NoticeQueryCancelService],
  styles: [`.editCellStyle {color:#F6A52C;}`]
})
export class PreparationPlatformNoticeQueryCancelComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplate2', { static: true }) customTemplate2: TemplateRef<any>;

  addressOptions: any[] = [];
  public gridData: any[] = [];
  public totalCount = 0;
  public selectionKeys: any[] = [];
  dtPlant: any[] = [];
  dtBuyer: any[] = [];
  dtStatus: any[] = [];
  dtDeliveryRegion: any[] = [];
  dtSave: any[] = [];
  context = this;
  formGroup: FormGroup;
  private template =
    `<div class="ag-cell-label-container" role="presentation">
        <div ref="eLabel" class="ag-header-cell-label" role="presentation">
          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
        </div>
      </div>`;
  public extendColumns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.template
      }
    },
    { field: 'plantCode', title: '工厂', headerName: '工厂', width: 70, locked: false },
    { field: 'notifyNumber', title: '送货通知', headerName: '送货通知', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', headerName: '物料编码', width: 130, locked: false },
    { field: 'itemDesc', title: '物料描述', headerName: '物料描述', width: 120, locked: false, tooltipField: 'itemDesc' },
    {
      field: 'needByDate', title: '到货时间', headerName: '到货时间', width: 200, locked: false,
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: this.customTemplate          // Complementing the Cell Renderer parameters
      }
    },
    { field: 'deliveryRegion', title: '送货区域', headerName: '送货区域', width: 120, locked: false },
    {
      field: 'attribute5', title: '送货地址', headerName: '送货地址', width: 180, locked: false, tooltipField: 'attribute5',
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,          // Complementing the Cell Renderer parameters
      }
    },
    { field: 'vendorShortName', title: '供应商', headerName: '供应商', width: 120, locked: false, tooltipField: 'VENDOR_SHORT_NAME', },
    { field: 'vendorSiteName', title: '供应商地址', headerName: '供应商地址', width: 120, locked: false },
    {
      field: 'quantity', title: '送货通知数量', headerName: '送货通知数量', width: 120, locked: false
    },
    { field: 'deliveryQuantity', title: '制单数', headerName: '制单数', width: 100, locked: false },
    { field: 'onWayQuantity', title: '在途数', headerName: '在途数', width: 100, locked: false },
    { field: 'receivedQuantity', title: '接收数', headerName: '接收数', width: 100, locked: false },
    { field: 'acceptQuantity', title: '入库数', headerName: '入库数', width: 100, locked: false },
    { field: 'returnedQuantity', title: '判退数量', headerName: '判退数量', width: 120, locked: false },
    { field: 'statusDesc', title: '状态', headerName: '状态', width: 90, locked: false },
    {
      field: 'comments', title: '备注', headerName: '备注', width: 150, locked: false,
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'moNumber', title: '工单号', headerName: '工单号', width: 120, locked: false },
    { field: 'publishDesc', title: '发布状态', headerName: '发布状态', width: 120, locked: false },
    { field: 'publishComment', title: '发布说明', headerName: '发布说明', width: 120, locked: false },
    { field: 'releasedDate', title: '发布时间', headerName: '发布时间', width: 150, locked: false },
    { field: 'creationDate', title: '创建时间', headerName: '创建时间', width: 150, locked: false }
  ];
  public applicationOptions: any[] = [];
  expColumnsOptions: any[] = [{ field: 'APPLICATION_ID', options: this.applicationOptions }];
  gridViewItem: GridDataResult = {
    data: [],
    total: 0
  };
  columnItem: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];
  gridViewVendor: GridDataResult = {
    data: [],
    total: 0
  };
  columnVendor: any[] = [
    {
      field: 'vendorNumber',
      title: '供应商编码',
      width: '100'
    },
    {
      field: 'vendorShortName',
      title: '供应商简称',
      width: '100'
    }
  ];
  releaseStatus: any[] = [
    { label: '已发布', value: 'Y' },
    { label: '发布中', value: 'B' },
    { label: '发布失败', value: 'C' },
    { label: '未发布', value: 'N' },
  ];
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.dtPlant, ngModelChange: this.plantChange }, required: true },
      {
        field: 'itemCode',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItem,
          columns: this.columnItem,
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2
          }
        }
      },
      {
        field: 'vendorName',
        title: '供应商',
        ui: {
          type: UiType.popupSelect,
          valueField: 'vendorShortName',
          textField: 'vendorShortName',
          gridView: this.gridViewVendor,
          columns: this.columnVendor,
          eventNo: 3,
          extraEvent: {
            RowSelectEventNo: 4
          }
        }
      },
      { field: 'buyer', title: '采购员', ui: { type: UiType.select, options: this.dtBuyer } },
      { field: 'status', title: '状态', ui: { type: UiType.select, options: this.dtStatus } },
      { field: 'deliveryRegionCode', title: '送货区域', ui: { type: UiType.select, options: this.dtDeliveryRegion } },
      { field: 'notifyNumber', title: '送货通知', ui: { type: UiType.text } },
      { field: 'publishFlag', title: '发布状态', ui: { type: UiType.select, options: this.releaseStatus } },
      { field: 'creationDate', title: '创建日期', ui: { type: UiType.dateRange } },
      { field: 'needByDate', title: '到货日期', ui: { type: UiType.dateRange } },
      { field: 'moNumber', title: '工单号', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { text: '', value: '' },
      vendorName: { text: '', value: '' },
      buyer: null,
      status: null,
      deliveryRegionCode: null,
      notifyNumber: '',
      publishFlag: null,
      creationDate: [],
      needByDate: [],
      moNumber: '',
    }
  };

  httpAction = { url: '/api/pc/noticeQueryCancel/pageNoticeData', method: 'GET' };

  @ViewChild('selMaterItem', { static: true }) selMaterItem: PopupSelectComponent;
  @ViewChild('selMaterVendor', { static: true }) selMaterVendor: PopupSelectComponent;
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private route: ActivatedRoute,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private formBuilder: FormBuilder,
    private noticeQueryCancelService: NoticeQueryCancelService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.extendColumns[5].cellRendererParams.customTemplate = this.customTemplate;
    this.extendColumns[7].cellRendererParams.customTemplate = this.customTemplate1;
    this.extendColumns[17].cellRendererParams.customTemplate = this.customTemplate2;

    this.noticeQueryCancelService.loadQueryData().subscribe(res => {
      res.data.dtPlant.forEach(item => {
        this.dtPlant.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
      res.data.dtBuyer.forEach(item => {
        this.dtBuyer.push({
          label: item.fullName,
          value: item.employeeNumber
        });
      });
      res.data.dtStatus.forEach(item => {
        this.dtStatus.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
    this.plantChange(this.appConfigService.getPlantCode());
    this.query();
  }

  private initAddressOptions() {
    this.noticeQueryCancelService.listDeliveryAddress(this.queryParams.values.plantCode, this.queryParams.values.deliveryRegionCode).subscribe(res => {
      this.addressOptions.length = 0;
      if (res.code === 200) {
        this.addressOptions = res.data;
      }
    });
  }
  // 重置
  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { text: '', value: '' },
      vendorName: { text: '', value: '' },
      buyer: null,
      status: null,
      deliveryRegionCode: null,
      notifyNumber: '',
      publishFlag: null,
      creationDate: [],
      needByDate: [],
      moNumber: ''
    };
    this.plantChange(this.appConfigService.getPlantCode());
  }

  plantChange(strValue: any) {
    this.queryParams.values.deliveryRegionCode = null;
    this.dtDeliveryRegion.length = 0;
    if (strValue) {
      this.noticeQueryCancelService.listDeliveryRegion(this.queryParams.values.plantCode || this.appConfigService.getPlantCode()).subscribe(res => {
        res.data.forEach(item => {
          this.dtDeliveryRegion.push({
            label: item.deliveryRegionCode,
            value: item.deliveryRegionCode
          });
        });
      });

      this.initAddressOptions();
    }
  }

  searchItem(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadItems(plantCode: string, itemCode: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.noticeQueryCancelService.pagePurchaseItem(plantCode, itemCode, pageIndex, pageSize).subscribe(res => {
      this.gridViewItem.data = res.data.content;
      this.gridViewItem.total = res.data.totalElements;
      console.log('加载物料');
      console.log(res.data);
    });
  }

  searchVendor(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(e.SearchValue, PageIndex, e.PageSize);
  }

  public loadVendor(vendor: string, pageIndex: number, pageSize: number) {
    // 加载供应商
    this.noticeQueryCancelService.pageVendor(vendor, pageIndex, pageSize).subscribe(res => {
      this.gridViewVendor.data = res.data.content;
      this.gridViewVendor.total = res.data.totalElements;
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getQueryParams(isExport: boolean) {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode.text,
      vendorName: this.queryParams.values.vendorName.text,
      buyer: this.queryParams.values.buyer,
      deliveryRegionCode: this.queryParams.values.deliveryRegionCode,
      notifyNumber: this.queryParams.values.notifyNumber,
      publishFlag: this.queryParams.values.publishFlag,
      creationDateArray: this.queryParams.values.creationDate.length > 0 ? [this.commonQueryService.formatDate(this.queryParams.values.creationDate[0]), this.commonQueryService.formatDate(this.queryParams.values.creationDate[1])] : [],
      needByDateArray: this.queryParams.values.needByDate.length > 0 ? [this.commonQueryService.formatDate(this.queryParams.values.needByDate[0]), this.commonQueryService.formatDate(this.queryParams.values.needByDate[1])] : [],
      moNumber: this.queryParams.values.moNumber,
      export: isExport,
      status: this.queryParams.values.status,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  queryCommon() {
    this.dtSave = [];
    this.selectionKeys = [];
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParams(false), this.context);
  }

  // 导出
  public export() {
    super.export();
    this.commonQueryService.export(this.httpAction, this.getQueryParams(true), this.excelexport, this.context);
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  public onStateChange({ pageNo, pageSize }) {
    // this.gridState = state;
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.queryCommon();
    }
  }
  // 行选中改变
  onSelectionChanged() {
    this.getGridSelectionKeys('notifyNumber');
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

  // 返回选中行对象
  public mySelectionKey(context: RowArgs): string {
    return context.dataItem.notifyNumber;
  }

  // 取消
  public cancel() {
    const check = this.checkSelect();
    if (!check)
      return;

    const plantCode = this.gridData[0].plantCode;
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要取消吗？'),
      nzOnOk: () => {
        this.noticeQueryCancelService
          .cancelNotice(plantCode, this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('取消成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }

  // 释放
  public release() {
    const check = this.checkSelect();
    if (!check)
      return;

    const plantCode = this.gridData[0].plantCode;
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要释放吗？'),
      nzOnOk: () => {
        this.noticeQueryCancelService
          .releaseNotice(plantCode, this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('释放成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }

  checkSelect(): boolean {
    let ret = true;
    if (this.gridData == null || this.gridData.length === 0) {
      ret = false;
      return ret;
    }
    const msg = this.appTranslationService.translate('请勾选数据！');
    if (this.selectionKeys.length === 0) {
      this.msgSrv.info(msg);
      ret = false;
      return ret;
    }
    let errorNumber = '';
    this.selectionKeys.forEach(dn => {
      const row = this.gridData.find(p => p.notifyNumber === dn);
      if (row.status === 'CANCEL' || row.status === 'CLOSED') {
        errorNumber = errorNumber + ',' + dn;
      }
    });
    if (errorNumber !== '') {
      this.msgSrv.info(this.appTranslationService.translate('送货通知【' + errorNumber + '】已取消或关闭，不能取消，释放或发布'));
      ret = false;
      return ret;
    }
    return ret;
  }

  // 单元格点击事件
  public cellClickHandler({ sender, isEdited, dataItem, rowIndex, column, columnIndex }) {
    if (!isEdited && this.planEditState(column.field, dataItem)) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

  // 判断单元格是否可编辑
  public planEditState(strfield: string, dataItem: any) {
    const editStatus = dataItem.status !== 'CLOSE' && dataItem.status !== 'CANCEL';
    const editCol = strfield === 'needByDate' || strfield === 'quantity' || strfield === 'comments' || strfield === 'attribute5';
    return editStatus && editCol;
  }

  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      const field = args.column.field; // 列名
      const orgValue = dataItem[field]; // 旧值
      let newValue = args.formGroup.controls[field].value; // 新值
      if (field === 'needByDate') {
        // 时间格式化
        newValue = this.commonQueryService.formatDateTime(newValue);
      }
      if (orgValue !== newValue) {
        const strMsg = this.checkSaveData(dataItem, newValue, field);
        if (strMsg.length > 0) {
          this.msgSrv.info(strMsg);
        } else {
          dataItem[args.column.field] = newValue;
          this.setSaveData(dataItem);
        }
      }
    }
  }

  checkSaveData(dataItem: any, newValue: any, field: string): string {
    let strMsg = '';
    if (field === 'needByDate') {
      if (newValue < new Date()) {
        strMsg = '到货时间不能小于当前时间';
      }
    } else if (field === 'QUANTITY') {
      if (!Number(newValue) || Number(newValue) < 0) {
        strMsg = '请输入大于0的数字';
      } else {
        if (newValue > dataItem.ORG_QUANTITY) {
          strMsg = '送货通知数量不能大于原数量(' + dataItem.ORG_QUANTITY + ')';
        }
        if (newValue < dataItem.DELIVERY_QUANTITY) {
          strMsg = '送货通知数量不能小于已产生的送货单数量(' + dataItem.deliveryQuantity + ')';
        }
      }
    }
    return this.appTranslationService.translate(strMsg);
  }

  setSaveData(dataItem: any) {
    // 默认给复选框勾上
    const num = this.selectionKeys.find(p => p === dataItem.notifyNumber);
    if (num === undefined || num === null) {
      this.selectionKeys.push(dataItem.notifyNumber);
    }
  }

  createFormGroup(dataItem: any): FormGroup {
    const editRow = {};
    this.extendColumns.forEach(dr => {
      editRow[dr.field] = new FormControl(dataItem[dr.field]); // , Validators.pattern('^[1-9][0-9]+'));
    });
    editRow['needByDate'] = new Date(dataItem.needByDate.toString().replace(/-/g, '/'));
    return this.formBuilder.group(editRow);
  }

  save() {
    if (this.gridData == null || this.gridData.length === 0) {
      return;
    }

    this.dtSave = [];
    this.selectionKeys.forEach(p => {
      const row = this.gridData.find(gd => gd.notifyNumber === p);
      row.needByDate = this.formatDate(row.needByDate);
      this.dtSave.push(row);
    });

    const msg = this.appTranslationService.translate('请勾选数据！');
    if (this.dtSave.length === 0) {
      this.msgSrv.info(msg);
      return;
    }

    this.noticeQueryCancelService.saveNotice(this.dtSave)
      .subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('保存成功'));
          this.queryCommon();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  }

  public getCellClass(field: string, colType: string) {
    if (colType === 'header' && (field === 'needByDate' || field === 'quantity' || field === 'comments' || field === 'attribute5')) {
      // 可编辑列显示红色
      return { 'editCellStyle': true };
    }
    return '';
  }

  // 发布
  publish() {
    const check = this.checkSelect();
    if (!check)
      return;

    const plantCode = this.gridData[0].plantCode;
    this.dtSave = [];
    this.selectionKeys.forEach(p => {
      const row = this.gridData.find(gd => gd.notifyNumber === p);
      row.needByDate = this.formatDate(row.needByDate);
      this.dtSave.push(row);
    });

    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要发布吗？'),
      nzOnOk: () => {
        this.noticeQueryCancelService
          .publishNotice(plantCode, this.dtSave) // this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('送货通知发布请求已提交，请等候处理'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }

  formatDate(date?: Date): string {
    // if (!date) return '';
    // return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    // return this.queryService.formatDate(date);
    if (date === undefined) {
      return '';
    }
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'zh-cn');
  }


  // 单元格内容改变
  onCellValueChanged(event) {
    if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString()) {

    }
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['到货时间', '备注', '送货地址'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged() {
    const gridDom = document.querySelectorAll('#dnGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }

  // 单元格双击
  onCellDoubleClicked(event) {
    if (event.colDef.field === 'deliveryQuantity') {
      if (this.checkEventTriggered()) return;
      // 双击制单数弹出送货单明细
      this.modal.static(PreparationPlatformDeliveryViewComponent, { plantCode: event.data.plantCode, notifyNumber: event.data.notifyNumber }, 'lg')
        .subscribe(() => {
          this.hasEventTriggered = false;
        });
    }
  }
}
