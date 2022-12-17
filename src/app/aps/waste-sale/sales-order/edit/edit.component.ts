import { Component, OnInit } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { WasteSaleService } from "../../waste-sale.service";
import { SalesOrderQueryService } from "../query.service";

@Component({
  selector: 'planschedule-hw-sales-order-edit',
  templateUrl: './edit.component.html',
  providers: [SalesOrderQueryService]
})
export class SalesOrderEditWasteComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  salesOrderTypeOptions: any = []; // PS_SALES_ORDER_TYPE
  salesOrderStateOptions: any = []; // PS_SALES_ORDER_STATE
  salesOrderDetailedStateOptions: any = [];  // PS_SALES_ORDER_DETAILED_STATE
  currencyOptions: any = []; // PS_CURRENCY
  YesNoOptions: any = []; // PS_YES_NOT
  contractStateOptions: any = []; // PS_CONTRACT_STATE
  productCategoryOptions: any[] = [];
  plantOptions: any[] = [];

  newStockCode: string = ''; // 保存需要新增的存货编码

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
    public queryService: SalesOrderQueryService,
    public wasteSaleService: WasteSaleService,
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
      // this.i.salesOrderCode = this.queryService.generateCode2('XSD', 4);
      this.i.salesOrderDate = new Date();
      // this.i.salesOrderType = '10';
      this.i.salesOrderState = '10';
      this.i.currency = '人民币';
      this.i.exchangeRate = 1;
      this.i.pickUp = '0';
      this.i.taxIncluded = '1';
      this.i.plantCode = this.appconfig.getActivePlantCode();
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
      'PS_CONTRACT_STATE': this.contractStateOptions,
    });
    this.queryService.GetLookupByTypeLang('PS_SALES_ORDER_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      this.wasteSaleService.getSaleType(res.Extra, this.salesOrderTypeOptions);
      this.salesOrderTypeChange(this.i.salesOrderType);
    });
    this.productCategoryOptions.push(...await this.queryService.getUserProCates());
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
      salesOrderDate: this.queryService.formatDate(this.i.salesOrderDate),
      saleFlag: 'N'
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
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadCustoms(
    cusAbbreviation: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService
      .getWasteContracts({
        plantCode: this.i.plantCode,
        attribute4: cusAbbreviation,
        pageIndex: pageIndex,
        pageSize: pageSize,
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
    this.i.cusAbbreviation = event.Text.trim();
    if(this.i.cusAbbreviation !== '' && this.i.plantCode) {
      this.queryService
      .getWasteContracts({
        plantCode: this.i.plantCode,
        attribute4: this.i.cusAbbreviation,
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
    this.i.cusAbbreviation = data.attribute4;
    this.i.cusCode = data.cusCode;
  }

  clearCustomers() {
    this.i.cusAbbreviation = '';
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