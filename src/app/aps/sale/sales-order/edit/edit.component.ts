import { Component, OnInit } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { SalesOrderQueryService } from "../query.service";

@Component({
  selector: 'planschedule-hw-sales-order-edit',
  templateUrl: './edit.component.html',
  providers: [SalesOrderQueryService]
})
export class SalesOrderEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  salesOrderTypeOptions: any = []; // PS_SALES_ORDER_TYPE
  salesOrderStateOptions: any = []; // PS_SALES_ORDER_STATE
  salesOrderDetailedStateOptions: any = [];  // PS_SALES_ORDER_DETAILED_STATE
  currencyOptions: any = []; // PS_CURRENCY
  cusTypeOptions: any = []; // CUS_TYPE
  YesNoOptions: any = []; // PS_YES_NOT
  contractStateOptions: any = []; // PS_CONTRACT_STATE
  productCategoryOptions: any[] = [];
  plantOptions: any[] = [];
  prodTypeOptions: any[] = [];
  pricingTypeOptions: any[] = [];

  newStockCode: string = ''; // 保存需要新增的存货编码

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
    public queryService: SalesOrderQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.salesOrderCode) {
      this.isModify = true;
      this.queryService.getOne(this.i.salesOrderCode).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      });
    } else {
      // this.i.salesOrderCode = this.generateSalesOrderCode();
      this.i.salesOrderDate = new Date();
      this.i.salesOrderType = '10';
      this.i.salesOrderState = '10';
      this.i.currency = '人民币';
      this.i.exchangeRate = 1;
      this.i.pickUp = '0';
      this.i.taxIncluded = '1';
    }
    this.loadOptions();
  }

  salesOrderTypeChange(e) {
    const option = this.salesOrderTypeOptions.find(o => o.value === e);
    if(option) {
      this.i.cklb = option.cklb;
      this.i.cklbRemarks = option.cklbRemarks;
    }
  }

  generateSalesOrderCode() {
    const today = new Date();
    const year = today.getFullYear().toString().slice(2);
    const month = today.getMonth() < 9 ? ('0' + (today.getMonth() + 1).toString()) : (today.getMonth() + 1).toString()
    const salesOrderCode = year + month + this.queryService.generateSerial(5);
    return salesOrderCode;
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_SALES_ORDER_STATE': this.salesOrderStateOptions,
      'PS_SALES_ORDER_DETAILED_STATE': this.salesOrderDetailedStateOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'CUS_TYPE': this.cusTypeOptions,
      'PS_CONTRACT_STATE': this.contractStateOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
          value: d.plantCode,
        })
      })
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
          this.salesOrderTypeChange(this.i.salesOrderType);
        })
      }
    })
    this.productCategoryOptions.push(...await this.queryService.getUserProCates());
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
      salesOrderDate: this.queryService.formatDate(this.i.salesOrderDate),
      saleFlag: 'Y'
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
   * @param {string} cusCode  客户编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadCustoms(
    cusCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService
      .getCustoms({
        plantCode: this.i.plantCode,
        cusCode: cusCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
        isCusCodeNotNull: true,
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
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      this.clearCustomers();
      return;
    }
    this.i.cusCode = event.Text.trim();
    if(this.i.cusCode !== '' && this.i.plantCode) {
      this.queryService
      .getCustoms({
        plantCode: this.i.plantCode,
        cusCode: this.i.cusCode,
        isCusCodeNotNull: true,
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('客户编码无效'));
          this.clearCustomers();
        } else {
          this.setCustomers(res.data.content[0]);
        }
      });
    } else {
      this.clearCustomers();
    }
  }

  setCustomers(data) {
    this.i.cusAbbreviation = data.cusAbbreviation;
    this.i.cusCode = data.cusCode;
    this.i.cusType = data.cusType;
  }

  clearCustomers() {
    this.i.cusAbbreviation = '';
    this.i.cusCode = '';
    this.i.cusType = null;
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
    this.i.department = data.depName;
    this.i.departmentCode = data.depCode;
  }

  clearSalesMan() {
    this.i.salesman = '';
    this.i.salesmanCode = '';
    this.i.department = '';
    this.i.departmentCode = '';
  }

}