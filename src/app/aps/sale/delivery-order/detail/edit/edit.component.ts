import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { DeliveryOrderQueryService } from "../../query.service";

@Component({
  selector: 'delivery-order-detail-edit',
  templateUrl: './edit.component.html',
  providers: [DeliveryOrderQueryService]
})
export class DeliveryOrderDetailEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  plantCode: string = '';
  shippingAddress: string = '';
  YesNoOptions: any = []; // PS_YES_NOT
  detailedStateOptions: any[] = []; // PS_INVOICE_DETAILED_STATE
  deliveryTypeOptions: any[] = [];
  plantOptions: any[] = [];

  @ViewChild('f', { static: true }) f: NgForm;

  // 绑定发货单明细
  public gridViewInvoicesDetail: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsInvoicesDetail: any[] = [
    {
      field: 'invoiceBillCode',
      width: 120,
      title: '发货单号'
    },
    {
      field: 'detailedNum',
      width: 120,
      title: '明细行号'
    },
    {
      field: 'state',
      width: 120,
      title: '发货单行状态',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'salesOrderType',
      width: 120,
      title: '销售类型',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'batchNum',
      width: 120,
      title: '批号',
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'standardsType',
      width: 120,
      title: '规格尺寸',
    },
    {
      field: 'distributionWarehouse',
      width: 120,
      title: '配送公仓',
    },
    {
      field: 'quantity',
      width: 120,
      title: '数量',
    },
    {
      field: 'cusCode',
      width: 120,
      title: '客户编码'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      title: '客户简称'
    },
    {
      field: 'stockCode',
      width: 120,
      title: '存货编码'
    },
    {
      field: 'shippingAddress',
      width: 120,
      title: '送货地址'
    },
  ];
  invoiceDetailedOptions = {
    1: { 'PS_INVOICE_DETAILED_STATE': [] },
    2: { 'PS_SALES_ORDER_TYPE': [] },
    3: { 'PS_CONTRACT_STEEL_TYPE': [] },
  }

  // 绑定调拨单明细
  public gridViewTransfersDetail: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsTransfersDetail: any[] = [
    {
      field: 'code',
      width: 120,
      title: '调拨单号'
    },
    {
      field: 'pono',
      width: 120,
      title: '调拨单行号'
    },
    {
      field: 'state',
      width: 120,
      title: '调拨单行状态',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'batchNum',
      width: 120,
      title: '批号',
    },
    {
      field: 'quantity',
      width: 120,
      title: '数量',
    },
    {
      field: 'taxPrice',
      width: 120,
      title: '单价',
    },
    {
      field: 'money',
      width: 120,
      title: '金额',
    },
    {
      field: 'stockCode',
      width: 120,
      title: '存货编码',
    },
    {
      field: 'stockName',
      width: 120,
      title: '存货名称',
    },
    {
      field: 'unit',
      width: 120,
      title: '单位',
    },
    {
      field: 'steelStandart',
      width: 120,
      title: '规格尺寸'
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'surface',
      width: 120,
      title: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'grade',
      width: 120,
      title: '等级',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'thickness',
      width: 120,
      title: '实厚'
    },
    {
      field: 'cwar',
      width: 120,
      title: '货位'
    },
    {
      field: 'weigth',
      width: 120,
      title: '实宽'
    },
    {
      field: 'grossWeight',
      width: 120,
      title: '毛重'
    },
    {
      field: 'length',
      width: 120,
      title: '长度'
    },
    {
      field: 'qualityInformation',
      width: 120,
      title: '品质信息'
    },
    {
      field: 'coating',
      width: 120,
      title: '保护材料',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'batchNumRemarks',
      width: 120,
      title: '批号备注'
    },
    {
      field: 'haulWay',
      width: 120,
      title: '运输路线'
    },
    {
      field: 'transportationEnterprise',
      width: 120,
      title: '目的地'
    },
  ];
  transferDetailedOptions = {
    1: { 'PS_CONTRACT_STEEL_TYPE': [] },
    2: { 'PS_CONTRACT_SURFACE': [] },
    3: { 'PS_GRADE': [] },
    4: { 'PS_ALLOT_DETAILED_STATE': [] },
    5: { 'PS_COATING': [] },
  }

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: DeliveryOrderQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getDetailedOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      });
    } else {
      // this.i.detailedNum = this.queryService.generateCode2('PSDMX', 4);
      this.i.state = '10';
      this.i.invoiceBillDate = new Date();
      this.i.shippingAddress = this.shippingAddress;
      this.i.plantCode = this.plantCode;
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_YES_NOT': this.YesNoOptions,
      'PS_DELIVERY_DETAILED_TYPE': this.detailedStateOptions,
      'PS_DELIVERY_TYPE': this.deliveryTypeOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
      invoiceBillDate: this.queryService.formatDate(this.i.invoiceBillDate),
    });
    this.queryService.saveDetailed(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }
  
  typeChange() {
    if(this.i.type === '10') {
      this.clearInvoiceDetail();
    } else {
      this.clearTransferDetail();
    }
  }

   /**
   * 发货单弹出查询
   * @param {any} e
   */
    public searchInvoicesDetail(e: any) {
      const PageIndex = e.Skip / e.PageSize + 1;
      this.loadInvociesDetail(
        e.SearchValue,
        PageIndex,
        e.PageSize,
      );
    }
  
    /**
     * 加载发货单
     * @param {string} invoiceBillCode  发货单号
     * @param {number} pageIndex  页码
     * @param {number} pageSize   每页条数
     */
    public loadInvociesDetail(
      invoiceBillCode: string,
      pageIndex: number,
      pageSize: number,
    ) {
      this.queryService
        .getInvoiceBillOrderDetail({
          plantCode: this.plantCode,
          invoiceBillCode: invoiceBillCode,
          shippingAddress: this.shippingAddress,
          pageIndex: pageIndex,
          pageSize: pageSize,
        })
        .subscribe(res => {
          this.gridViewInvoicesDetail.data = res.data.content;
          this.gridViewInvoicesDetail.total = res.data.totalElements;
        });
    }
  
    //  行点击事件， 给参数赋值
    onInvoiceDetailSelect(e: any) {
      this.saveInvoiceDetail(e.Row);
    }

    saveInvoiceDetail(data) {
      this.i.invoiceBillCode = data.invoiceBillCode;
      this.i.invoiceBillDetailedNum = data.detailedNum;
      this.i.stockCode = data.stockCode || '';
      this.i.quantity = data.quantity; 
      this.i.shippingAddress = data.shippingAddress;
      this.f.control.markAsDirty();
    }

    clearInvoiceDetail() {
      this.i.invoiceBillCode = '';
      this.i.invoiceBillDetailedNum = '';
      this.i.stockCode = '';  
      this.i.quantity = null;  
      this.i.shippingAddress = '';
    }
  
    onInvoiceDetailTextChanged(event: any) {
      this.i.invoiceBillCode = event.Text.trim();
      if(this.i.invoiceBillCode !== '') {
        this.queryService
        .getInvoiceBillOrderDetail({
          plantCode: this.plantCode,
          invoiceBillCode: this.i.invoiceBillCode,
          shippingAddress: this.shippingAddress,
          pageIndex: 1,
          pageSize: 1
        })
        .subscribe(res => {
          if(res.data.content.length === 0) {
            this.msgSrv.info(this.appTranslationService.translate('发货单号无效'));
            this.clearInvoiceDetail();
          } else {
            this.saveInvoiceDetail(res.data.content[0]);
          }
        });
      } else {
        this.clearInvoiceDetail();
      }
      
    }

   /**
   * 调拨单弹出查询
   * @param {any} e
   */
    public searchTransferDetail(e: any) {
      const PageIndex = e.Skip / e.PageSize + 1;
      this.loadTransferDetail(
        e.SearchValue,
        PageIndex,
        e.PageSize,
      );
    }
  
    /**
     * 加载调拨单
     * @param {string} code  调拨单号
     * @param {number} pageIndex  页码
     * @param {number} pageSize   每页条数
     */
    public loadTransferDetail(
      code: string,
      pageIndex: number,
      pageSize: number,
    ) {
      this.queryService
        .getTransferOrderDetail({
          plantCode: this.plantCode,
          code: code,
          transportationEnterprise: this.shippingAddress,
          pageIndex: pageIndex,
          pageSize: pageSize,
        })
        .subscribe(res => {
          this.gridViewTransfersDetail.data = res.data.content;
          this.gridViewTransfersDetail.total = res.data.totalElements;
        });
    }
  
    //  行点击事件， 给参数赋值
    onTransferDetailSelect(e: any) {
      this.saveTransferDetail(e.Row);
    }

    saveTransferDetail(data) {
      this.i.code = data.code;
      this.i.pono = data.pono;
      this.i.stockCode = data.stockCode || '';
      this.i.quantity = data.quantity; 
      this.i.shippingAddress = data.transportationEnterprise;
      this.f.control.markAsDirty();
    }

    clearTransferDetail() {
      this.i.code = '';
      this.i.pono = '';
      this.i.stockCode = '';
      this.i.quantity = null;
      this.i.shippingAddress = '';
    }
  
    onTransferDetailTextChanged(event: any) {
      this.i.code = event.Text.trim();
      if(this.i.code !== '') {
        this.queryService
        .getTransferOrderDetail({
          plantCode: this.plantCode,
          code: this.i.code,
          transportationEnterprise: this.shippingAddress,
          pageIndex: 1,
          pageSize: 1
        })
        .subscribe(res => {
          if(res.data.content.length === 0) {
            this.msgSrv.info(this.appTranslationService.translate('调拨单号无效'));
            this.clearTransferDetail();
          } else {
            this.saveTransferDetail(res.data.content[0]);
          }
        });
      } else {
        this.clearTransferDetail();
      }
      
    }

}