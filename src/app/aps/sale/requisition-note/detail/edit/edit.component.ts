import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { RequisitionNoteQueryService } from "../../query.service";

@Component({
  selector: 'requisition-note-detailed-edit',
  templateUrl: './edit.component.html',
  providers: [RequisitionNoteQueryService]
})
export class RequisitionNoteDetailedEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  detailedStateOptions: any[] = []; // PS_TRANSFER_DETAILED_STATE
  plantOptions: any[] = []; // 
  @ViewChild('f', { static: true }) f: NgForm;
  distributionWarehouse: string = ''; // 配送公仓编码

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
      field: 'plantCode',
      width: 120,
      title: '工厂',
    },
    {
      field: 'cklb',
      width: 120,
      title: '出库类别',
    },
    {
      field: 'cklbRemarks',
      width: 120,
      title: '出库类别说明',
    },
    {
      field: 'salesOrderType',
      width: 120,
      title: '销售类型',
      valueFormatter: 'ctx.optionsFind(value,1).label'
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
      valueFormatter: 'ctx.optionsFind(value,2).label'
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
      field: 'shippingAddress',
      width: 120,
      title: '送货地址'
    },
    {
      field: 'transportEnterprise',
      width: 120,
      title: '运输企业',
    },
    {
      field: 'luno',
      width: 120,
      title: '炉号',
    },
    {
      field: 'remark',
      width: 120,
      title: '备注',
    },
  ];
  invoiceBillDetailedOptions = {
    1: { 'PS_SALES_ORDER_TYPE': [] },
    2: { 'PS_CONTRACT_STEEL_TYPE': [] },
  }

  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
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
      field: 'warehouse',
      width: 120,
      title: '配送仓库',
    },
    {
      field: 'place',
      width: 120,
      title: '配送地点',
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
    public queryService: RequisitionNoteQueryService,
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
      // this.i.detailedNum = this.queryService.generateCode2('ZHDMX', 4);
      this.i.state = '10';
      this.i.printed = 0; // 默认为否
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_TRANSFER_DETAILED_STATE': this.detailedStateOptions,
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
      contact: this.i.contact || '',
      phone: this.i.phone || ''
    });
    this.queryService.detailSave(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  /**
   * 发货单弹出查询
   * @param {any} e
   */
   public searchInvoicesDetail(e: any, key: string) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadInvociesDetail(
      key,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载发货单
   * @param {string} key  搜索条件
   * @param {string} value  搜索条件对应值
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadInvociesDetail(
    key: string,
    value: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getInvoiceBillOrderDetail({
        invoiceBillCode: this.i.invoiceBillCode,
        [key]: value,
        shippingAddress: this.distributionWarehouse,
        filterBatchCode: true,
        filterSalesDist: true,
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
    this.saveInvoiceDetailed(e.Row);
  }

  saveInvoiceDetailed(data) {
    this.i.invoiceBillDetailedNum = data.detailedNum;
    this.i.batchNum = data.batchNum || '';
    this.i.steelType = data.steelType || '';
    this.i.standardsType = data.steelStandart || '';
    this.i.quantity = data.quantity;
    this.i.distributionWarehouse = data.distributionWarehouse || '';
    this.i.distributionWarehouseCode = data.distributionWarehouseCode || '';
    this.i.cusCode = data.cusCode || '';
    this.i.shipper = data.shipper || '';
    this.i.shippingAddress = data.shippingAddress || '';
    this.i.plantCode = data.plantCode || null;
    this.i.haveContract = data.haveContract || null;
  }

  clearInvoiceDetailed() {
    this.i.invoiceBillDetailedNum = '';
    this.i.batchNum = '';
    this.i.steelType = '';
    this.i.standardsType = '';
    this.i.quantity = null;
    this.i.distributionWarehouse = '';
    this.i.distributionWarehouseCode = '';
    this.i.cusCode = '';
    this.i.shipper = '';
    this.i.shippingAddress = '';
    this.i.plantCode = null;
    this.i.haveContract = null;
  }

  onInvoiceDetailTextChanged(event: any, key: string) {
    const value = event.Text.trim();
    if(value !== '') {
      this.queryService
      .getInvoiceBillOrderDetail({
        invoiceBillCode: this.i.invoiceBillCode,
        [key]: value,
        shippingAddress: this.distributionWarehouse,
        filterBatchCode: true,
        filterSalesDist: true,
        pageIndex: 1,
        pageSize: 1
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('发货单号无效'));
          this.clearInvoiceDetailed();
        } else {
          this.saveInvoiceDetailed(res.data.content[0])
        }
      });
    } else {
      this.clearInvoiceDetailed();
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
   * @param {string} warehouse  仓库
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadWares(
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
        this.gridViewWares.data = res.data.content;
        this.gridViewWares.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onWaresSelect(e: any) {
    this.i.distributionWarehouse = e.Row.warehouse;
  }

  onWaresTextChanged(event: any) {
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
          this.i.distributionWarehouse = res.data.content[0].warehouse;
        } else {
          this.i.distributionWarehouse = '';
          this.msgSrv.warning(this.appTranslationService.translate('配送仓库无效'))
        }
      });
    } else {
      this.i.distributionWarehouse = '';
    }
  }
}