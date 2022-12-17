import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomerReturnQueryService } from '../../query.service';

@Component({
  selector: 'customer-return-detail-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerReturnQueryService],
})
export class CustomerReturnDetailEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  steelTypeOptions: any[] = []; 
  surfaceOptions: any[] = [];
  salesOrderTypeOptions: any[] = [];
  detailedStateOptions: any[] = [];
  businessTypeOptions: any[] = [];
  thTypeOptions: any[] = [];
  gradeOptions: any[] = [];
  lastBatchNum: string = ''; // 保存最后一次批号的查询
  // 绑定销售订单明细
  public gridViewSaleOrderDetaileds: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsSaleOrderDetaileds: any[] = [
    {
      field: 'salesOrderCode',
      width: 120,
      title: '销售订单号'
    },
    {
      field: 'detailedNum',
      width: 120,
      title: '明细行号'
    },
    {
      field: 'cusOrderCode',
      width: 120,
      title: '客户订单号'
    },
    {
      field: 'orderDate',
      width: 120,
      title: '下单日期'
    },
    {
      field: 'contractCode',
      width: 120,
      title: '合同号',
    },
    {
      field: 'salesOrderDetailedState',
      width: 120,
      title: '明细状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'reason',
      width: 120,
      title: '驳回原因',
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
      field: 'distributionWarehouse',
      width: 120,
      title: '配送公仓'
    },
    {
      field: 'batchNum',
      width: 120,
      title: '批号'
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种'
    },
    {
      field: 'standardsType',
      width: 120,
      title: '规格型号',
    },
    {
      field: 'steelStandart',
      width: 120,
      title: '钢材规格尺寸',
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      title: '单位',
    },
    {
      field: 'quantity',
      width: 120,
      title: '数量',
    },
    {
      field: 'taxPrice',
      width: 120,
      title: '含税价',
    },
    {
      field: 'fixedPrice',
      width: 120,
      title: '限价'
    },
    {
      field: 'money',
      width: 120,
      title: '金额',
    },
    {
      field: 'taxRate',
      width: 120,
      title: '税率'
    },
    {
      field: 'taxAmount',
      width: 120,
      title: '税额',
    },
    {
      field: 'coating',
      width: 120,
      title: '胶膜（垫纸）',
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      title: '含税金额',
    },
    {
      field: 'processingReq',
      width: 120,
      title: '加工要求'
    },
    {
      field: 'plantCode',
      width: 120,
      title: '产地',
    },
    {
      field: 'sample',
      width: 120,
      title: '样本'
    },
    {
      field: 'surface',
      width: 120,
      title: '表面',
    },
    {
      field: 'label',
      width: 120,
      title: '标签规格'
    },
    {
      field: 'grade',
      width: 120,
      title: '等级',
    },
    {
      field: 'plannedDeliveryDate',
      width: 120,
      title: '计划交期'
    },
    {
      field: 'thickness',
      width: 120,
      title: '实厚',
    },
    {
      field: 'unitWeigthKg',
      width: 120,
      title: '单重（KG）'
    },
    {
      field: 'weigthKg',
      width: 120,
      title: '重量（KG）',
    },
    {
      field: 'priceByWeight',
      width: 120,
      title: '按重量计价',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'priceKg',
      width: 120,
      title: '价格（KG）'
    },
    {
      field: 'deliveryMethod',
      width: 120,
      title: '提货方式'
    },
    {
      field: 'packingMethod',
      width: 120,
      title: '装箱方式',
    },
    {
      field: 'pickWarehouse',
      width: 120,
      title: '提货仓库'
    },
    {
      field: 'basePrice',
      width: 120,
      title: '基价'
    },
    {
      field: 'remarks',
      width: 120,
      title: '备注'
    },
    {
      field: 'depositRatio',
      width: 120,
      title: '定金比率'
    },
    {
      field: 'deposit',
      width: 120,
      title: '定金'
    },
    {
      field: 'description',
      width: 120,
      title: '内部说明'
    },
    {
      field: 'cusAddress',
      width: 120,
      title: '客户地址'
    },
    {
      field: 'toleranceThickness',
      width: 120,
      title: '厚度下工差'
    },
    {
      field: 'poundsLost',
      width: 120,
      title: '已输磅重'
    },
    {
      field: 'warehouse',
      width: 120,
      title: '仓库'
    },
    {
      field: 'location',
      width: 120,
      title: '仓位'
    },
    {
      field: 'width',
      width: 120,
      title: '实宽',
    },
    {
      field: 'poundWeugthKg',
      width: 120,
      title: '磅重（KG）'
    },
    {
      field: 'lilunWeigthKg',
      width: 120,
      title: '理重（KG）',
    },
    {
      field: 'markup',
      width: 120,
      title: '加价',
    },
    {
      field: 'processFee',
      width: 120,
      title: '加工费',
    },
    {
      field: 'specialMarkup',
      width: 120,
      title: '特殊加价',
    },
    {
      field: 'subsectionState',
      width: 120,
      title: '分卷状态',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'rewinding',
      width: 120,
      title: '是否重卷',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'entrustedProcessing',
      width: 120,
      title: '受托加工',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'transportType',
      width: 120,
      title: '运输方式',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'coilInnerDia',
      width: 120,
      title: '钢卷内径',
    },
    {
      field: 'packType',
      width: 120,
      title: '包装方式',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'prodType',
      width: 120,
      title: '形式',
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
    {
      field: 'fullVolume',
      width: 120,
      title: '是否重卷',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'slittingQuantity',
      width: 120,
      title: '分条数量',
    },
    {
      field: 'cccd',
      width: 120,
      title: '超长超短',
    },
    {
      field: 'cusGrade',
      width: 120,
      title: '客户等级',
      valueFormatter: 'ctx.optionsFind(value,6).label'
    },
    {
      field: 'settleStyle',
      width: 120,
      title: '结算方式',
    },
    {
      field: 'salesStrategy',
      width: 120,
      title: '销售策略',
    },
  ];
  salesOrderDetailedOptions = {
    1: { 'PS_SALES_ORDER_DETAILED_STATE': [] },
    2: { 'PS_YES_NOT': [] },
    3: { 'PS_SUBSECTION_STATE': [] },
    4: { 'PS_TRANSPORT_TYPE': [] },
    5: { 'PS_PACK_TYPE': [] },
    6: { 'PS_CUS_GRADE': [] },
    7: { 'PS_PROD_TYPE': [] },
    8: { 'PS_COATING': [] },
  }

  // 绑定销售订单明细
  public gridViewKSDetaileds: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsKSDetaileds: any[] = [
    {
      field: 'orno',
      width: 120,
      title: '客诉申请单号'
    },
    {
      field: 'pono',
      width: 120,
      title: '客诉申请单行号'
    },
    {
      field: 'state',
      width: 120,
      title: '客诉申请单行状态',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'batchNum',
      width: 120,
      title: '钢卷号',
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'standardsType',
      width: 120,
      title: '规格尺寸',
    },
    {
      field: 'surface',
      width: 120,
      title: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'gjlx',
      width: 120,
      title: '钢卷状态',
    },
    {
      field: 'gjszd',
      width: 120,
      title: '钢卷所在地',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'weigthKg',
      width: 120,
      title: '净重',
    },
    {
      field: 'blp',
      width: 120,
      title: '不良量',
    },
    {
      field: 'qxms',
      width: 120,
      title: '缺陷描述',
    },
    {
      field: 'qhsq',
      width: 120,
      title: '客户诉求',
    },
    {
      field: 'thType',
      width: 120,
      title: '退换货类型',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
  ];
  KSDetailedOptions = {
    1: { 'PS_CONTRACT_STEEL_TYPE': [] },
    2: { 'PS_CONTRACT_SURFACE': [] },
    3: { 'PS_GJSZD': [] },
    4: { 'PS_KSCLZT_DETAILED': [] },
    5: { 'TH_TYPE': [] },
  }

  @ViewChild('f', { static: true }) f: NgForm;

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerReturnQueryService,
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
      this.i.pono = this.queryService.generateCode('THDD',0);
      this.i.state = '10';
    }
    this.loadOptions();
  }

  loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_SALES_ORDER_TYPE': this.salesOrderTypeOptions,
      'PS_RETURN_DETAILED_STATE': this.detailedStateOptions,
      'TH_TYPE': this.thTypeOptions,
      'PS_BUSINESS_TYPES': this.businessTypeOptions,
      'PS_GRADE': this.gradeOptions,
    });
  }

  generateMoney() {
    this.i.money = (this.i.fixedPrice * this.i.quantity) || 0;
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
    });
    this.queryService.saveDetailed(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        if(!this.isModify) {
          this.i.id = res.data;
        }
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  // searchSalesOrderDetailed(e) {
  //   const PageIndex = e.Skip / e.PageSize + 1;
  //   this.loadSalesOrderDetailed(
  //     e.SearchValue,
  //     PageIndex,
  //     e.PageSize,
  //   );
  // }

  // loadSalesOrderDetailed(
  //   detailedNum: string,
  //   pageIndex: number,
  //   pageSize: number,
  // ) {
  //   this.queryService.getSalesOrderDetailed({
  //     detailedNum: detailedNum,
  //     batchNum: this.i.batchNum,
  //     pageIndex: pageIndex,
  //     pageSize: pageSize
  //   }).subscribe(res => {
  //     if(res.code === 200) {
  //       this.gridViewSaleOrderDetaileds.data = res.data.content;
  //       this.gridViewSaleOrderDetaileds.total = res.data.totalElements;
  //     }
  //   })
  // }

  // onRowSelectSalesOrderDetailed(e) {
  //   this.saveSalesOrderDetailed(e.Row);
  // }

  searchSalesOrderDetailed() {
    this.queryService.getSalesOrderDetailed({
      batchNum: this.i.batchNum,
      pageIndex: 1,
      pageSize: 1
    }).subscribe(res => {
      if(res.code === 200) {
        if(res.data.content.length > 0) {
          this.saveSalesOrderDetailed(res.data.content[0]);
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('此批号没有对应的销售订单明细'));
          this.clearSalesOrderDetailed();
        }
      }
    })
  }

  clearSalesOrderDetailed() {
    // this.i.salesOrderType = null;
    // this.i.department = null;
    // this.i.salesman = null;
    this.i.salesOrderCode = null;
    this.i.salesOrderNum = null;
    this.i.contractCode = null;
    this.i.stockCode = null;
    this.i.stockName = null;
    this.i.steelStandart = null;
    this.i.grade = null;
    this.i.surface = null;
    this.i.steelType = null;
    this.i.unit = null;
    // this.i.quantity = null;
    this.i.fixedPrice = null;
    this.i.money = null;
    this.i.taxAmount = null;
    this.i.taxPrice = null;
  }

  saveSalesOrderDetailed(data) {
    this.i.salesOrderCode = data.salesOrderCode;
    this.i.salesOrderNum = data.detailedNum;
    this.i.contractCode = data.contractCode;
    this.i.stockCode = data.stockCode;
    this.i.stockName = data.stockName;
    this.i.steelStandart = data.steelStandart;
    this.i.grade = data.grade;
    this.i.surface = data.surface;
    this.i.steelType = data.steelType;
    this.i.unit = data.unitOfMeasure;
    // this.i.quantity = data.quantity;
    this.i.fixedPrice = data.fixedPrice;
    this.i.money = data.money || (data.quantity*data.fixedPrice) || 0;
    this.i.taxAmount = data.taxAmount;
    this.i.taxPrice = data.taxPrice;
  }

  /**
   * 搜索客诉申请单明细
   * @param e 
   */
  searchKSDetailed(e) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadKSDetailed(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  loadKSDetailed(
    batchNum: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService.getKSDetailed({
      batchNum: batchNum,
      state: '30',
      pageIndex: pageIndex,
      pageSize: pageSize
    }).subscribe(res => {
      if(res.code === 200) {
        this.gridViewKSDetaileds.data = res.data.content;
        this.gridViewKSDetaileds.total = res.data.totalElements;
      }
    })
  }

  onRowSelectKSDetailed(e) {
    this.i.batchNum = e.Value;
    this.saveKSDetailed(e.Row);
    if(this.i.batchNum !== this.lastBatchNum) {
      // 当批号改变时，需要清空根据批号得到的其他结果
      this.clearSalesOrderDetailed();
      this.lastBatchNum = this.i.batchNum;
    }
  }

  saveKSDetailed(data) {
    this.i.batchNum = data.batchNum;
    this.i.ksorno = data.orno;
    this.i.kspono = data.pono;
    this.i.thType = data.thType;
    this.i.quantity = data.blpKg;
    this.searchSalesOrderDetailed();
  }

  clearKSDetailed() {
    this.i.batchNum = ''
    this.i.ksorno = '';
    this.i.kspono = '';
    this.i.thType = '';
    this.i.quantity = '';
    this.clearSalesOrderDetailed();
  }

  onBatchNumTextChanged(event) {
    const batchNum = event.Text.trim();
    if(batchNum !== '') {
      this.queryService.getKSDetailed({
        batchNum: batchNum,
        state: '30',
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveKSDetailed(res.data.content[0]);
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('此批号无效'));
          this.clearKSDetailed();
        }
      });
    } else {
      this.clearKSDetailed();
    }
    if(this.i.batchNum !== this.lastBatchNum) {
      // 当批号改变时，需要清空根据批号得到的其他结果
      this.clearSalesOrderDetailed();
      this.lastBatchNum = this.i.batchNum;
    }
  }

}