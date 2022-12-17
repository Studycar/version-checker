import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { PendingDeliveryOrderQueryService } from "../query.service";

@Component({
  selector: 'delivery-order-detail-edit',
  templateUrl: './edit.component.html',
  providers: [PendingDeliveryOrderQueryService]
})
export class PendingDeliveryOrderEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  YesNoOptions: any = []; // PS_YES_NOT
  detailedStateOptions: any[] = []; // PS_INVOICE_DETAILED_STATE
  deliveryTypeOptions: any[] = [];
  transportTypeOptions: any[] = [];
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

  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
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

  // 绑定目的地
  public gridViewDistrs: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsDistrs: any[] = [
    {
      field: 'warehouse',
      width: 120,
      title: '配送仓库',
    },
    {
      field: 'place',
      width: 120,
      title: '配送地点',
    },
    {
      field: 'area',
      width: 120,
      title: '送货区域',
    },
    {
      field: 'ranges',
      width: 120,
      title: '送货范围',
    },
  ];

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: PendingDeliveryOrderQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      });
    } else {
      // this.i.detailedNum = this.queryService.generateCode2('PSDMX', 4);
      this.i.pendingState = '10';
      this.i.deliveryDate = new Date();
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_YES_NOT': this.YesNoOptions,
      'PS_PENDING_STATE': this.detailedStateOptions,
      'PS_DELIVERY_TYPE': this.deliveryTypeOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
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
    this.queryService.save(params).subscribe(res => {
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
          invoiceBillCode: invoiceBillCode,
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
      this.i.docCode = data.invoiceBillCode;
      this.i.docDetailCode = data.detailedNum;
      this.i.plantCode = data.plantCode;
      this.i.cusCode = data.cusCode || ''; 
      this.i.cusAbbreviation = data.cusAbbreviation || ''; 
      this.i.stockName = data.stockName || '';
      this.i.batchCode = data.batchNum || ''; 
      this.i.standardsType = data.steelStandart || '';
      this.i.steelType = data.steelType || '';
      this.i.surface = data.surface || '';
      this.i.grade = data.grade || '';
      this.i.quantity = data.quantity || '';
      this.i.weightKg = data.weigthKg || '';
      this.i.unitOfMeasure = data.unit || '';
      this.i.whCode = data.whCode || '';
      this.i.whName = data.warehouse || '';
      this.i.location = data.location || '';
      this.i.haveContract = data.haveContract;
      this.f.control.markAsDirty();
    }

    clearInvoiceDetail() {
      this.i.docCode = '';
      this.i.docDetailCode = '';
      this.i.plantCode = '';
      this.i.cusCode = ''; 
      this.i.cusAbbreviation = ''; 
      this.i.stockName = '';
      this.i.batchCode = ''; 
      this.i.standardsType = '';
      this.i.steelType = '';
      this.i.surface = '';
      this.i.grade = '';
      this.i.quantity = '';
      this.i.weightKg = '';
      this.i.unitOfMeasure = '';
      this.i.whCode = '';
      this.i.whName = '';
      this.i.location = '';
      this.i.haveContract = null;
    }
  
    onInvoiceDetailTextChanged(event: any) {
      this.i.docCode = event.Text.trim();
      if(this.i.docCode !== '') {
        this.queryService
        .getInvoiceBillOrderDetail({
          invoiceBillCode: this.i.docCode,
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
          code: code,
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
      this.i.docCode = data.code;
      this.i.docDetailCode = data.pono;
      this.i.plantCode = data.plantCode;
      this.i.stockName = data.stockName || '';
      this.i.batchCode = data.batchNum || ''; 
      this.i.standardsType = data.steelStandart || '';
      this.i.steelType = data.steelType || '';
      this.i.surface = data.surface || '';
      this.i.grade = data.grade || '';
      this.i.quantity = data.quantity || '';
      this.i.weigthKg = data.weigthKg || '';
      this.i.unitOfMeasure = data.unit || '';
      this.i.whCode = data.whCode || '';
      this.i.whName = data.warehouse || '';
      this.i.location = data.location || '';
      this.f.control.markAsDirty();
    }

    clearTransferDetail() {
      this.i.docCode = '';
      this.i.docDetailCode = '';
      this.i.plantCode = '';
      this.i.stockName = '';
      this.i.batchCode = ''; 
      this.i.standardsType = '';
      this.i.steelType = '';
      this.i.surface = '';
      this.i.grade = '';
      this.i.quantity = '';
      this.i.weigthKg = '';
      this.i.unitOfMeasure = '';
      this.i.whCode = '';
      this.i.whName = '';
      this.i.location = '';
    }
  
    onTransferDetailTextChanged(event: any) {
      const code = event.Text.trim();
      if(code !== '') {
        this.queryService
        .getTransferOrderDetail({
          code: code,
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
    this.queryService
      .getWares({
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
    this.saveWares(e.Row);
  }

  onWaresTextChanged(event: any) {
    const subinventoryCode = event.Text.trim();
    if(subinventoryCode !== '') {
      this.queryService
      .getWares({
        subinventoryCode: subinventoryCode,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveWares(res.data.content[0]);
        } else {
          this.clearWares();
          this.msgSrv.info(this.appTranslationService.translate('仓库编码无效'))
        }
      });
    } else {
      this.clearWares();
    }
  }

  saveWares(data) {
    this.i.distributionWarehouse = data.subinventoryDescription;
    this.i.distributionWarehouseCode = data.subinventoryCode;
  }

  clearWares() {
    this.i.distributionWarehouse = '';
    this.i.distributionWarehouseCode = '';
  }

   /**
   * 仓库弹出查询
   * @param {any} e
   */
  public searchDistrs(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadDistrs(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载仓库
   * @param {string} warehouse  仓库
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
    public loadDistrs(
    warehouse: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂'));
      return;
    }
    this.queryService
      .getDistributions({
        plantCode: this.i.plantCode,
        warehouse: warehouse,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewDistrs.data = res.data.content;
        this.gridViewDistrs.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onDistrsSelect(e: any) {
    this.saveDistrs(e.Row);
  }

  onDistrsTextChanged(event: any) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂'));
      return;
    }
    const warehouse = event.Text.trim();
    if(warehouse !== '') {
      this.queryService
      .getDistributions({
        plantCode: this.i.plantCode,
        warehouse: warehouse,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveDistrs(res.data.content[0]);
        } else {
          this.clearDistrs();
          this.msgSrv.warning(this.appTranslationService.translate('目的地无效'))
        }
      });
    } else {
      this.clearDistrs();
    }
  }

  saveDistrs(data) {
    this.i.place = data.warehouse;
    this.i.shippingAddress = data.place;
    this.i.area = data.area;
    this.i.ranges = data.ranges;
  }
  
  clearDistrs() {
    this.i.place = '';
    this.i.shippingAddress = '';
    this.i.area = '';
    this.i.ranges = '';
  }
}