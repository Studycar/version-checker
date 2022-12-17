import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { RequisitionNoteQueryService } from "../query.service";


@Component({
  selector: 'requisition-note-edit',
  templateUrl: './edit.component.html',
  providers: [RequisitionNoteQueryService]
})
export class RequisitionNoteEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  transferClassOptions: any[] = [];
  transferStateOptions: any[] = [];
  plantOptions: any[] = [];
  @ViewChild('f', { static: true }) f: NgForm;

  // 绑定发货单
  public gridViewInvoices: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsInvoices: any[] = [
    {
      field: 'invoiceBillCode',
      width: 120,
      title: '发货单号'
    },
    {
      field: 'invoiceBillDate',
      width: 120,
      title: '发货日期'
    },
    {
      field: 'invoiceBillState',
      width: 120,
      title: '发货单状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'plantCode',
      width: 120,
      title: '工厂',
    },
    {
      field: 'cusCode',
      width: 120,
      title: '客户编码',
    },
    {
      field: 'cusName',
      width: 120,
      title: '客户名称'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      title: '客户简称'
    },
    {
      field: 'carShipNo',
      width: 120,
      title: '车（船）号',
    },
    {
      field: 'salesman',
      width: 120,
      title: '业务员',
    },
    {
      field: 'exchangeRate',
      width: 120,
      title: '汇率',
    },
    {
      field: 'currency',
      width: 120,
      title: '币种',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'salesOrderType',
      width: 120,
      title: '销售类型',
    },
    {
      field: 'salesOrderTypeRemarks',
      width: 120,
      title: '销售类型说明',
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
      field: 'summaryQuantity',
      width: 120,
      title: '汇总数量',
    },
    {
      field: 'summaryMoney',
      width: 120,
      title: '汇总金额',
    },
    {
      field: 'remarks',
      width: 120,
      title: '备注',
    },
  ];
  invoiceBillOptions = {
    1: {'PS_INVOICE_STATE' : []},
    2: {'PS_CURRENCY' : []},
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
    public queryService: RequisitionNoteQueryService,
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
      // this.i.requisitionNoteCode = this.queryService.generateCode2('ZHD', 4);
      this.i.transferState = '10';
      this.i.transferCategory = '10';
      this.i.requisitionDate = new Date();
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_TRANSFER_STATE': this.transferStateOptions,
      'PS_TRANSFER_CLASS': this.transferClassOptions,
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
      requisitionDate: this.queryService.formatDate(this.i.requisitionDate)
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

  /**
   * 发货单弹出查询
   * @param {any} e
   */
   public searchInvoices(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadInvocies(
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
  public loadInvocies(
    invoiceBillCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getInvoiceBillOrderByRequi({
        invoiceBillCode: invoiceBillCode,
        screenInvoiceBillState: '20,70',
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewInvoices.data = res.data.content;
        this.gridViewInvoices.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onInvoiceSelect(e: any) {
    this.saveInvoiceBill(e.Row);
  }

  onInvoiceTextChanged(event: any) {
    this.i.invoiceBillCode = event.Text.trim();
    if(this.i.invoiceBillCode !== '') {
      this.queryService
      .getInvoiceBillOrderByRequi({
        invoiceBillCode: this.i.invoiceBillCode,
        screenInvoiceBillState: '20,70',
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('发货单号无效'));
          this.clearInvoiceBill();
        } else {
          this.saveInvoiceBill(res.data.content[0]);
        }
      });
    } else {
      this.clearInvoiceBill();
    }
  }

  saveInvoiceBill(data) {
    this.i.invoiceBillCode = data.invoiceBillCode;
    this.i.cusCode = data.cusCode;
    this.i.plantCode = data.plantCode;
  }

  clearInvoiceBill() {
    this.i.invoiceBillCode = '';
    this.i.cusCode = '';
    this.i.plantCode = null;
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
    this.saveWares(e.Row);
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
          this.saveWares(res.data.content[0]);
        } else {
          this.clearWares();
          this.msgSrv.warning(this.appTranslationService.translate('配送仓库无效'))
        }
      });
    } else {
      this.clearWares();
    }
  }

  saveWares(data) {
    this.i.distributionWarehouse = data.warehouse;
  }
  
  clearWares() {
    this.i.distributionWarehouse = '';
  }


}