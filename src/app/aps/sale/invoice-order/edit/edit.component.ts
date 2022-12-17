import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { InvoiceOrderQueryService } from "../query.service";

@Component({
  selector: 'planschedule-hw-invoice-order-edit',
  templateUrl: './edit.component.html',
  providers: [InvoiceOrderQueryService]
})
export class InvoiceOrderEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  invoiceStateOptions: any = []; // PS_CONTRACT_STATE
  plantOptions: any[] = [];
  currencyOptions: any[] = [];
  prodTypeOptions: any[] = [];
  pricingTypeOptions: any[] = [];
  salesOrderTypeOptions: any[] = [];
  YesNoOptions: any[] = [];
  @ViewChild('f', {static:true}) f: NgForm;

  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
    {
      field: 'plantCode',
      title: '工厂',
      width: '100'
    },
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

  // 绑定客户
  public gridViewCustoms: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsCustoms: any[] = [
    {
      field: 'cusCode',
      width: 120,
      title: '客户编码'
    },
    {
      field: 'plantCode',
      width: 120,
      title: '所属公司'
    },
    {
      field: 'creditCus',
      width: 120,
      title: '信用单位'
    },
    {
      field: 'affiliatedCus',
      width: 120,
      title: '所属客户'
    },
    {
      field: 'cusState',
      width: 120,
      title: '客户状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cusGrade',
      width: 120,
      title: '客户等级',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'cusType',
      width: 120,
      title: '客户类型',
      valueFormatter: 'ctx.optionsFind(value,3).label',
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
      field: 'taxNum',
      width: 120,
      title: '税号'
    },
    {
      field: 'contact',
      width: 120,
      title: '联系人'
    },
    {
      field: 'region',
      width: 120,
      title: '地区分类',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'address',
      width: 120,
      title: '地址'
    },
    {
      field: 'telNum',
      width: 120,
      title: '联系电话'
    },
    {
      field: 'bank',
      width: 120,
      title: '开户银行'
    },
    {
      field: 'bankNum',
      width: 120,
      title: '银行账号'
    },
    {
      field: 'bankArchives',
      width: 120,
      title: '银行档案'
    },
    {
      field: 'initialCredit',
      width: 120,
      title: '客户初始额度'
    },
    {
      field: 'domestic',
      width: 120,
      title: '是否国内',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'currency',
      width: 120,
      title: '币种',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'credit',
      width: 120,
      title: '信用额度'
    },
    {
      field: 'zyQuota',
      width: 120,
      title: '占用额度'
    },
    {
      field: 'temCredit',
      width: 120,
      title: '临时信用额度'
    },
    {
      field: 'balance',
      width: 120,
      title: '账户余额'
    },
    {
      field: 'salesmanCode',
      width: 120,
      title: '业务员编码',
    },
    {
      field: 'salesman',
      width: 120,
      title: '业务员',
    },
    {
      field: 'departmentCode',
      width: 120,
      title: '部门编码',
    },
    {
      field: 'department',
      width: 120,
      title: '分管部门',
    },
    {
      field: 'creditControl',
      width: 120,
      title: '是否控制信用额度',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'tax',
      width: 120,
      title: '税率'
    },
    {
      field: 'disableTime',
      width: 120,
      title: '停用时间'
    },
    {
      field: 'reason',
      width: 120,
      title: '驳回原因'
    },
  ];
  customersOptions = {
    1: { 'PS_CUSTOMER_STATUS': [] },
    2: { 'PS_CUS_GRADE': [] },
    3: { 'CUS_TYPE': [] },
    4: { 'PS_CUS_REGION': [] },
    5: { 'PS_CUS_DOMESTIC': [] },
    6: { 'PS_CURRENCY': [] },
    7: { 'PS_YES_NOT': [] },
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
      // this.i.invoiceBillCode = this.queryService.generateCode2('FHD', 4);
      this.i.invoiceBillState = '10';
      this.i.invoiceBillDate = new Date();
      this.i.currency = '人民币';
      this.i.exchangeRate = 1;
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_INVOICE_STATE': this.invoiceStateOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
      'PS_YES_NOT': this.YesNoOptions,
    });
    this.queryService.GetLookupByTypeLang('PS_SALES_ORDER_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      if(res.Extra && res.Extra.length > 0) {
        res.Extra.forEach(d => {
          this.salesOrderTypeOptions.push({
            label: d.meaning,
            value: d.lookupCode,
            cklb: d.additionCode,
            cklbRemarks: d.attribute1,
          })
        })
      }
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
      invoiceFlag: 'Y'
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
    .getCustoms({
      plantCode: this.i.plantCode,
      cusAbbreviation: cusAbbreviation,
      isCusCodeNotNull: true,
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
    .getCustoms({
      plantCode: this.i.plantCode,
      cusAbbreviation: cusAbbreviation,
      isCusCodeNotNull: true,
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
  }

  clearCustomers() {
    this.i.cusCode = '';
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
    if (!this.i.plantCode) {
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
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.i.salesman = event.Text.trim();
    if(this.i.salesman !== '') {
      this.queryService
      .getSalemans({
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
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService
      .getWares({
        plantCode: this.i.plantCode,
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
    this.saveWarehouse(e.Row);
  }

  onWaresTextChanged(event: any) {
    const subinventoryCode = event.Text.trim();
    if(subinventoryCode !== '') {
      if (!this.i.plantCode) {
        this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
        return;
      }
      this.queryService
      .getWares({
        plantCode: this.i.plantCode,
        subinventoryCode: subinventoryCode,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          // 判断转入转出仓库是否相同
          this.saveWarehouse(res.data.content[0]);
        } else {
          this.clearWarehouse();
          this.msgSrv.info(this.appTranslationService.translate('仓库编码无效'))
        }
      });
    } else {
      this.clearWarehouse();
    }
  }

  saveWarehouse(data) {
    this.i.warehouse = data.subinventoryDescription;
    this.i.whCode = data.subinventoryCode;
  }

  clearWarehouse() {
    this.i.warehouse = '';
    this.i.whCode = '';
  }

}