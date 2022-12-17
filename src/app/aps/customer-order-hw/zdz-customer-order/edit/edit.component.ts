import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class ZdzCustomerOrderEditComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
  ) {

  }

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
      field: 'unitName',
      title: '单位',
      width: '100'
    },
    {
      field: 'standards',
      title: '规格',
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
  
  loading = false;
  isModify = false;
  i: any;
  iClone: any;
  plantOptions: any[] = [];
  cusOrderStateOptions: any = [];
  contractSteelTypeOptions: any = [];
  YesNoOptions: any = [];
  salesOrderTypeOptions: any = [];
  gongchaOptions: any = [];
  planOptions: any = [];
  transportTypeOptions: any = []; // PS_TRANSPORT_TYPE
  unitOptions: any = []; // PS_ITEM_UNIT
  packTypeOptions: any = []; // PS_PACK_TYPE
  processingTypeOptions: any = []; // PS_PROCESSING_TYPE

  // 初始化
  ngOnInit(): void {
    if (this.i.id !== null) {
      this.isModify = true;
      this.queryService.getById(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = Object.assign({}, res.data);
        }
      });
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i.orderDate = new Date();
      this.i.prodType = 'ZDZ';
    }
    this.loadOptions();
  }

  // 加载搜索项
  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_BRANCH_CUS_ORDER_STATE': this.cusOrderStateOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_PROCESSING_TYPE': this.processingTypeOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_SALES_ORDER_TYPE': this.salesOrderTypeOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_PLAN': this.planOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
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
   public searchStocks(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadStocks(
      e.SearchValue,
      PageIndex,
      e.PageSize,
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
  ) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService.getProductions({
        plantCode: this.i.plantCode,
        stockCodeOrName: stockCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewStocks.data = res.data.content;
        this.gridViewStocks.total = res.data.totalElements;
      });
  }

  onStockTextChanged(e: any) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const stockCode = e.Text.trim();

    if(stockCode !== '') {
      this.queryService.getProductions({
        plantCode: this.i.plantCode,
        stockCodeOrName: stockCode,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveStocks(res.data.content[0]);
        } else {
          this.clearStocks();
          this.msgSrv.info(this.appTranslationService.translate('存货编码或名称无效'));
        }
      });
    } else {
      this.clearStocks();
    }
  }

  onStocksSelect(e) {
    this.saveStocks(e.Row);
  }

  saveStocks(data) {
    // 保存存货编码、名称
    this.i.stockCode = data.stockCode;
    this.i.stockName = data.stockName;
    this.i.standards = data.standards;
    this.i.unit = data.unitOfMeasure;
  }

  clearStocks() {
    this.i.stockCode = '';
    this.i.stockName = '';
    this.i.standards = '';
    this.i.unit = null;
  }


  // 保存
  save(value: any) {
    const params = Object.assign({}, this.i, {
      cusDeliveryDate: this.queryService.formatDate(this.i.cusDeliveryDate),
      orderMonth: this.queryService.formatDateTime2(this.i.orderMonth, 'yyyy-MM'),
      plannedDeliveryDate: this.queryService.formatDate(this.i.plannedDeliveryDate),
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

  // 关闭
  close() {
    this.modal.destroy();
  }

  // 重置
  clear() {
    this.i = Object.assign({}, this.iClone);
  }

}