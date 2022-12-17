import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { WasteSaleService } from "../../waste-sale.service";
import { InvoiceOrderQueryService } from "../query.service";

@Component({
  selector: 'planschedule-hw-invoice-order-edit',
  templateUrl: './edit.component.html',
  providers: [InvoiceOrderQueryService]
})
export class InvoiceOrderEditWasteComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  invoiceStateOptions: any = []; // PS_CONTRACT_STATE
  plantOptions: any[] = [];
  currencyOptions: any[] = [];
  salesOrderTypeOptions: any[] = [];
  @ViewChild('f', {static:true}) f: NgForm;

  // 绑定客户
  public gridViewCustoms: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsCustoms: any[] = [
    {
      field: 'contractCode',
      width: 120,
      title: '合同编号'
    },
    {
      field: 'contractState',
      width: 120,
      title: '合同状态',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'contractType',
      width: 120,
      title: '合同类型',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'affiliatedContract',
      width: 120,
      title: '所属合同'
    },
    {
      field: 'cusCode',
      title: '客户编码',
      width: '100'
    },
    {
      field: 'attribute4',
      title: '客户简称',
      width: '100'
    },
    {
      field: 'signingDate',
      width: 120,
      title: '签订日期',
    },
    {
      field: 'affiliatedMonth',
      width: 120,
      title: '合同所属月份'
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种',
    },
    {
      field: 'standards',
      width: 120,
      title: '规格',
    },
    {
      field: 'surface',
      width: 120,
      title: '表面',
    },
    {
      field: 'basePrice',
      width: 120,
      title: '基价'
    },
    {
      field: 'quantity',
      width: 120,
      title: '数量（张）'
    },
    {
      field: 'weightTon',
      width: 120,
      title: '重量（吨）'
    },
    {
      field: 'money',
      width: 120,
      title: '金额'
    },
    {
      field: 'remarks',
      width: 120,
      title: '锁价备注'
    },
    {
      field: 'deposit',
      width: 120,
      title: '锁价定金'
    },
    {
      field: 'depositRatio',
      width: 120,
      title: '定金比例（%）'
    },
    {
      field: 'plantCode',
      width: 200,
      title: '供方',
    },
    {
      field: 'prodName',
      width: 120,
      title: '产品名称',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'quantityDj',
      width: 120,
      title: '合同已分货量'
    },
    {
      field: 'quantitySy',
      width: 120,
      title: '合同待分货量'
    },
    {
      field: 'surfaceState',
      width: 120,
      title: '表面状态'
    },
    {
      field: 'deliveryDate',
      width: 120,
      title: '交货日期'
    },
    {
      field: 'deliveryPlace',
      width: 120,
      title: '交货地点'
    },
    {
      field: 'cusContractCode',
      width: 120,
      title: '客户合同号'
    },
    {
      field: 'signPlace',
      width: 120,
      title: '签订地点'
    },
    {
      field: 'amountWithoutTax',
      width: 120,
      title: '未税金额货款'
    },
    {
      field: 'taxAmount',
      width: 120,
      title: '税额'
    },
    {
      field: 'attribute3',
      width: 120,
      title: '存货编码'
    },
    {
      field: 'attribute5',
      width: 120,
      title: '等级'
    },
    // {
    //   field: 'rebateMarkup',
    //   width: 120,
    //   title: '返利加价'
    // },
    {
      field: 'material',
      width: 120,
      title: '厚/薄料',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'changeRemarks',
      width: 120,
      title: '变更备注'
    },
    {
      field: 'reason',
      width: 120,
      title: '驳回原因'
    },
  ];
  customersOptions = {
    3: { 'PS_CONTRACT_STATE': [] },
    4: { 'PS_CONTRACT_TYPE': [] },
    5: { 'HOUBO': [] },
    6: { 'PS_PROD_NAME': [] },
  };

  // 绑定业务员
  public gridViewUsers: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsUsers: any[] = [
    {
      field: 'plantCode',
      title: '工厂编码',
      width: '100'
    },
    {
      field: 'personCode',
      title: '人员编码',
      width: '100'
    },
    {
      field: 'personName',
      title: '人员名称',
      width: '100'
    },
    {
      field: 'depCode',
      title: '部门编码',
      width: '100'
    },
    {
      field: 'depName',
      title: '部门名称',
      width: '100'
    }
  ];

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: InvoiceOrderQueryService,
    public wasteSaleService: WasteSaleService,
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
      // this.i.invoiceBillCode = this.queryService.generateCode('FHD', 3);
      this.i.invoiceBillState = '10';
      this.i.invoiceBillDate = new Date();
      this.i.currency = '人民币';
      this.i.exchangeRate = 1;
      this.i.plantCode = this.appconfig.getActivePlantCode();
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_INVOICE_STATE': this.invoiceStateOptions,
      'PS_CURRENCY': this.currencyOptions,
    });
    this.queryService.GetLookupByTypeLang('PS_SALES_ORDER_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      this.wasteSaleService.getSaleType(res.Extra, this.salesOrderTypeOptions);
    })
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  salesOrderTypeChange(e) {
    const option = this.salesOrderTypeOptions.find(o => o.value === e);
    if(option) {
      this.i.salesOrderTypeRemarks = option.label;
      this.i.cklb = option.cklb;
      this.i.cklbRemarks = option.cklbRemarks;
    }
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
      invoiceFlag: 'N'
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
  
  plantChange(newValue) {
    if(this.i.plantCode === newValue) {
      // 工厂没有改变时直接返回
      return;
    }
    // 工厂改变：清除通过工厂查询的其他信息
    this.clearCustomers();
  }

/**
   * 客户弹出查询
   * @param {any} e
   */
 public searchCustoms(e: any) {
  const PageIndex = e.Skip / e.PageSize + 1;
  this.loadCustoms(
    e.SearchValue,
    PageIndex,
    e.PageSize,
  );
}

/**
 * 加载客户
 * @param {string} cusAbbreviation  客户简称
 * @param {number} PageIndex  页码
 * @param {number} PageSize   每页条数
 */
public loadCustoms(
  cusAbbreviation: string,
  PageIndex: number,
  PageSize: number,
) {
  if(!this.i.plantCode) {
    this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
    return;
  }
  this.queryService
    .getWasteContracts({
      plantCode: this.i.plantCode,
      attribute4: cusAbbreviation,
      pageIndex: PageIndex,
      pageSize: PageSize,
    })
    .subscribe(res => {
      this.gridViewCustoms.data = res.data.content;
      this.gridViewCustoms.total = res.data.totalElements;
    });
}

//  行点击事件， 给参数赋值
onRowSelect(e: any) {
  this.setCustomers(e.Row);
}

onPopupSelectTextChanged(event: any) {
  const cusAbbreviation = event.Text.trim();
  if(!this.i.plantCode) {
    this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
    this.clearCustomers();
    return;
  }
  if(cusAbbreviation == '') { 
    this.clearCustomers();
    return; 
  } else {
    this.queryService
    .getWasteContracts({
      plantCode: this.i.plantCode,
      attribute4: cusAbbreviation,
      pageIndex: 1,
      pageSize: 1,
    })
    .subscribe(res => {
      if(res.data.content.length > 0) {
        this.setCustomers(res.data.content[0]);
      } else {
        this.msgSrv.error(this.appTranslationService.translate('客户简称无效'));
        this.clearCustomers();
      }
    });
  }
}

  setCustomers(data) {
    this.i.cusCode = data.cusCode;
    this.i.cusAbbreviation = data.attribute4;
  }

  clearCustomers() {
    this.i.cusCode = '';
    this.i.cusAbbreviation = '';
  }

  /**
   * 业务员弹出查询
   * @param {any} e
   */
   public searchUsers(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadUsers(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载客户
   * @param {string} userName  用户名
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadUsers(
    userName: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService.getSalemans({
      plantCode: this.i.plantCode,
      personName: userName,
      pageIndex: pageIndex,
      pageSize: pageSize
    }).subscribe(res => {
      this.gridViewUsers.data = res.data.content;
      this.gridViewUsers.total = res.data.totalElements;
    })
  }

  //  行点击事件， 给参数赋值
  onUsersSelect(e: any) {
    this.setSalesMan(e.Row);
  }

  onUsersTextChanged(event: any) {
    this.i.salesman = event.Text.trim();
    if(this.i.salesman !== '') {
      if(!this.i.plantCode) {
        this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
        return;
      }
      this.queryService.getSalemans({
        plantCode: this.i.plantCode,
        personName: this.i.salesman,
        pageIndex: 1,
        pageSize: 1 
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('业务员无效'));
          this.clearSalesMan();
        } else {
          this.setSalesMan(res.data.content[0]);
        }
      });
    } else {
      this.clearSalesMan();
    }
  }

  setSalesMan(data) {
    this.i.salesman = data.personName;
    this.i.salesmanCode = data.personCode;
  }

  clearSalesMan() {
    this.i.salesman = '';
    this.i.salesmanCode = '';
  }

}