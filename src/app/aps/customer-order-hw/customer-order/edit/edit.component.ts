import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { decimal } from "@shared";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { CustomerOrderQueryService } from "../query.service";

@Component({
  selector: 'customer-order-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerOrderQueryService]
})
export class CustomerOrderEditComponent implements OnInit {
  /**false：新增信息，true：编辑信息 */
  isModify: boolean = false;
  isWeightRequired: boolean = false;
  isQuantityRequired: boolean = false;
  i: any; 
  iClone: any;
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

  cusOrderStateOptions: any = []; 
  planOptions: any = [];
  pricingTypeOptions: any = [];
  contractSteelTypeOptions: any = [];
  processingTypeOptions: any = []; // PS_PROCESSING_TYPE
  subsectionStateOptions: any = []; // PS_SUBSECTION_STATE
  transportTypeOptions: any = []; // PS_TRANSPORT_TYPE
  unitOptions: any = []; // PS_ITEM_UNIT
  unitOfMeasureOptions: any = [{
    label: '吨',
    value: '003'
  }]; //  重量单位只能为吨
  packTypeOptions: any = []; // PS_PACK_TYPE
  prodTypeOptions: any[] = [];
  YesNoOptions: any = [];
  gongchaOptions: any = [];
  contractSurfaceOptions: any = [];
  orderStateOptions: any = [];
  salesOrderTypeOptions: any = [];
  settleStyleOptions: any = [];
  paperOptions: any = [];
  cusOrderTypeOptions: any = []; // PS_CUS_ORDER_TYPE
  productCategoryOptions: any = []; // PS_PRODUCT_CATEGORY

  plantOptions: any = [];
  @ViewChild('f', {static: true}) f: NgForm;

  // 绑定存货
  public gridViewStocks: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsStocks: any[] = [
    {
      field: 'stockCode',
      title: '产品编码',
      width: '100'
    },
    {
      field: 'stockName',
      title: '产品名称',
      width: '100'
    },
    {
      field: 'stockDesc',
      title: '产品描述',
      width: '100'
    },
    {
      field: 'labelDesc',
      title: '标签描述',
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

  constructor(
    private modal: NzModalRef,
    private queryService: CustomerOrderQueryService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getById(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      })
    } else {
      this.i.cusOrderState = '10';
      this.i.cusOrderType = '10';
      this.i.orderDate = new Date();
      this.i.unitOfMeasure = '003';
      this.i.paper = '无';
      this.i.packType = '330'; // 普通包
      this.i.subsectionState = '20'; // 20-2
      this.i.pricingType = '20'; // 按理重计价
      this.i.entrustedProcessing = '0';
      this.i.trmming = '0'; // 是否切边默认否
      this.i.fullVolume = '1'; // 是否整卷默认是
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CUS_ORDER_STATE': this.cusOrderStateOptions,
      'PS_PLAN': this.planOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
      'PS_ORDER_STATE': this.orderStateOptions,
      'PS_CUS_ORDER_TYPE': this.cusOrderTypeOptions,
      'PS_PROCESSING_TYPE': this.processingTypeOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_SETTLE_STYLE': this.settleStyleOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_SALES_ORDER_TYPE': this.salesOrderTypeOptions,
      'PS_SURFACE_PROTECT': this.paperOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
    });
    // 包装方式根据产品大类过滤
    // this.queryService.GetLookupByType('PS_PACK_TYPE').subscribe(res => {
    //   if(res.Success && res.Extra.length > 0) {
    //     res.Extra.forEach(d => {
    //       this.packTypeChangeOptions.push({
    //         label: d.meaning,
    //         value: d.lookupCode,
    //         attribute1: d.attribute1
    //       });
    //       this.packTypeOptions.push({
    //         label: d.meaning,
    //         value: d.lookupCode,
    //         attribute1: d.attribute1
    //       });
    //     })
    //   }
    // })
    // this.packTypeChangeOptions = [...this.packTypeOptions];
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        })
      })
    });
    this.productCategoryOptions.push(...await this.queryService.getUserProCates());
  }

  save(value) {
    if(this.i.prodType === 'BC') {
      if((!this.i.weight || !this.i.unitOfMeasure) && (!this.i.quantity || !this.i.unit)) {
        this.msgSrv.warning(this.appTranslationService.translate('请先填写数量、数量单位或重量、重量单位'));
        return;
      }
    }
    const params = Object.assign({}, this.i, {
      orderDate: this.queryService.formatDate(this.i.orderDate),
      orderMonth: this.queryService.formatDateTime2(this.i.orderMonth, 'yyyy-MM'),
      cusDeliveryDate: this.queryService.formatDate(this.i.cusDeliveryDate),
      plannedDeliveryDate: this.queryService.formatDate(this.i.plannedDeliveryDate),
      deliveryDate: this.queryService.formatDate(this.i.deliveryDate),
      standards: Number(this.i.standards).toFixed(2),
    })
    this.queryService.edit(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  lastProductCategory: string = '';
  productCategoryChange(e) {
    if(this.i.productCategory === this.lastProductCategory) {
      return;
    }
    if(this.i.productCategory === '20') {
      // 精加工触发是否切边修改
      this.setTrmming();
    }
    // 包装方式根据产品大类过滤
    // if(this.i.productCategory) {
    //   const productCategory = this.productCategoryOptions.find(d => d.value === this.i.productCategory).label;
    //   this.packTypeChangeOptions.length = 0;
    //   this.packTypeOptions.forEach(d => {
    //     if(d.attribute1 === productCategory) {
    //       this.packTypeChangeOptions.push(d);
    //     }
    //   });
    //   if(this.i.packType && this.packTypeChangeOptions.every(d => d.value !== this.i.packType)) {
    //     this.msgSrv.info(this.appTranslationService.translate('产品大类改变，请重新选择包装方式'));
    //     this.i.packType = null;
    //   }
    // } else {
    //   this.packTypeChangeOptions = [...this.packTypeOptions];
    // }
    this.lastProductCategory = this.i.productCategory;
  }

  widthChange() {
    // 宽度触发规格尺寸修改
    this.generateStandardsType();
    // 宽度触发是否切边修改
    this.setTrmming();
  }

  // 是否切边修改
  setTrmming() {
    if(this.i.productCategory && this.i.productCategory === '20') {
      if(this.i.width === 0 || this.i.width) {
        this.i.trmming = Number(this.i.width) >= 1240 ? '0' : '1';
      }
    }
  }

  // 规格尺寸形式：规格*宽度*长度
  generateStandardsType() {
    const standards = this.formatterPrecision(this.i.standards) || 0;
    const width = this.i.width || 0;
    const prodLength = Number(this.i.prodLength) || 'C';
    this.i.standardsType = `${standards}*${width}*${prodLength}`;
  }

  prodTypeChange(e) {
    if(this.i.prodType === 'JC') {
      // 卷材：重量、重量单位必填，数量、数量单位非必填
      this.isWeightRequired = true;
      this.isQuantityRequired = false;
    } else {
      // 板材：重量、重量单位或数量、数量单位要求必填一组，在保存时提示
      this.isWeightRequired = false;
      this.isQuantityRequired = false;
    }
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
    this.queryService
      .getCustoms({
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
    this.i.cusAbbreviation = e.Value;
    this.i.cusCode = e.Row.cusCode;
  }

  onPopupSelectTextChanged(event: any) {
    this.i.cusAbbreviation = event.Text.trim();
    console.log(this.i.cusAbbreviation);
    if(this.i.cusAbbreviation == '') { 
      this.i.cusCode = '';
      return; 
    } else {
      this.queryService
      .getCustoms({
        cusAbbreviation: this.i.cusAbbreviation,
        isCusCodeNotNull: true,
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.i.cusAbbreviation = res.data.content[0].cusAbbreviation;
          this.i.cusCode = res.data.content[0].cusCode;
        } else {
          this.msgSrv.error(this.appTranslationService.translate('客户简称无效'))
          this.i.cusAbbreviation = '';
          this.i.cusCode = '';
        }
      });
    }
  }

  /**
   * 存货弹出查询
   * @param {any} e
   */
   public searchStocks(e: any, type?: 'Up' | 'Down') {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadStocks(
      e.SearchValue,
      PageIndex,
      e.PageSize,
      type
    );
  }

  /**
   * 加载存货
   * @param {string} stockCode  存货编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadStocks(
    stockCode: string,
    pageIndex: number,
    pageSize: number,
    type?: 'Up' | 'Down'
  ) {
    let searchFunc = 'getProductions';
    if(type) {
      searchFunc = 'getProductionsCusOrder';
    }
    this.queryService
      [searchFunc]({
        plantCode: this.appconfig.getActivePlantCode(),
        stockCodeOrName: stockCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewStocks.data = res.data.content;
        this.gridViewStocks.total = res.data.totalElements;
      });
  }

  onStockTextChanged(e: any, type?: 'Up' | 'Down') {
    const stockCode = e.Text.trim();
    let searchFunc = 'getProductions';
    if(type) {
      searchFunc = 'getProductionsCusOrder';
    }
    if(stockCode !== '') {
      this.queryService[searchFunc]({
        plantCode: this.appconfig.getActivePlantCode(),
        stockCodeOrName: stockCode,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveStocks(res.data.content[0], type);
        } else {
          this.clearStocks(type);
          this.msgSrv.info(this.appTranslationService.translate('存货编码无效'));
        }
      });
    } else {
      this.clearStocks(type);
    }
  }

  onStocksSelect(e, type?: 'Up' | 'Down') {
    this.saveStocks(e.Row, type);
  }

  saveStocks(data, type?: 'Up' | 'Down') {
    if(!type) {
      // 保存存货编码、名称
      this.i.stockCode = data.stockCode;
      this.i.stockName = data.stockName;
    } else {
      // 保存面膜/底膜存货编码、描述
      this.i[`coating${type}Code`] = data.stockCode;
      this.i[`coating${type}Name`] = data.stockDesc;
      this.i[`${type.toLowerCase()}LabelDesc`] = data.labelDesc;
    }
  }

  clearStocks(type?: 'Up' | 'Down') {
    if(!type) {
      // 清空存货编码、名称
      this.i.stockCode = '';
      this.i.stockName = '';
    } else {
      // 清空面膜/底膜存货编码、描述
      this.i[`coating${type}Code`] = '';
      this.i[`coating${type}Name`] = '';
      this.i[`${type.toLowerCase()}LabelDesc`] = '';
    }
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}