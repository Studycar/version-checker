import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { decimal } from "@shared";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService } from "ng-zorro-antd";
import { PricingSimulatorQueryService } from "./query.service";

@Component({
  selector: 'sales-pricing-simulator',
  templateUrl: './pricing-simulator.component.html',
  providers: [PricingSimulatorQueryService],
  styles: [
    `
      ::ng-deep .ant-input-group > .ant-input:first-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      
      ::ng-deep .ant-input-group-addon {
        border: none;
        background-color: transparent;
      }
    `
  ]
})
export class PricingSimulatorComponent implements OnInit {
  prodTypeOptions: any[] = [];
  pricingTypeOptions: any[] = [];
  settleStyleOptions: any[] = [];
  subsectionStateOptions: any[] = [];
  plantOptions: any[] = [];
  transportTypeOptions: any[] = [];
  YesNoOptions: any[] = [];
  packTypeOptions: any[] = [];
  gradeOptions: any[] = [];
  steelSortOptions: any[] = [];
  steelTypeOptions: any[] = [];
  surfaceOptions: any[] = [];
  materialOptions: any[] = [];
  ttTypeOptions: any[] = [];
  unitOptions: any[] = [];
  paperOptions: any[] = [];
  formatterPrecision6 = (value: number | string) => value ? decimal.roundFixed(Number(value), 6) : value;
  formatterPrecision2 = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;
  isComputed: Boolean = false; // 是否已计算总价
  computeOpt: any = {}; // 存储计算后的结果

  gridViewSaleDists: GridDataResult = {
    data: [],
    total: 0
  };
  columnsSaleDists = [
    {
      field: 'distType',
      width: 120,
      title: '分货类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'distDetailedState',
      width: 120,
      title: '分货明细状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'batchCode',
      width: 120,
      title: '批号',
    },
    {
      field: 'baleNo',
      width: 120,
      title: '捆包号',
    },
    {
      field: 'orderMonth',
      width: 120,
      title: '订单月份'
    },
    {
      field: 'plan',
      width: 120,
      title: '计划',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'productCategory',
      width: 120,
      title: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'place',
      width: 120,
      title: '目的地',
    },
    {
      field: 'warehouseCode',
      width: 120,
      title: '仓库编码',
    },
    {
      field: 'warehouseName',
      width: 120,
      title: '仓库名称',
    },
    {
      field: 'plateLength',
      width: 120,
      title: '板长',
    },
    {
      field: 'prodType',
      width: 120,
      title: '形式',
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
    {
      field: 'pricingType',
      width: 120,
      title: '计价方式',
      valueFormatter: 'ctx.optionsFind(value,11).label',
    },
    {
      field: 'labelSpecs',
      width: 120,
      title: '标签规格',
    },
    {
      field: 'plant',
      width: 120,
      title: '工厂',
    },
    {
      field: 'makeOrderNum',
      width: 120,
      title: '计划单号',
    },
    {
      field: 'formerBatchCode',
      width: 120,
      title: '原单号',
    },
    {
      field: 'transportType',
      width: 120,
      title: '运输方式',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'skuType',
      width: 120,
      title: '存货类型',
    },
    {
      field: 'subinventoryAllocation',
      width: 120,
      title: '库位编码',
    },
    {
      field: 'hardness',
      width: 120,
      title: '硬度',
    },
    {
      field: 'coatingUpName',
      width: 120,
      title: '面膜存货描述',
    },
    {
      field: 'coatingUpCode',
      width: 120,
      title: '面膜存货编码',
    },
    {
      field: 'upLabelDesc',
      width: 120,
      title: '面膜标签描述',
    },
    {
      field: 'coatingDownName',
      width: 120,
      title: '底膜存货描述',
    },
    {
      field: 'coatingDownCode',
      width: 120,
      title: '底膜存货编码',
    },
    {
      field: 'downLabelDesc',
      width: 120,
      title: '底膜标签描述',
    },
    {
      field: 'lockId',
      width: 120,
      title: '锁库标识',
    },
    {
      field: 'lockQuantity',
      width: 120,
      title: '锁库数量',
    },
    {
      field: 'lockType',
      width: 120,
      title: '锁库类型',
    },
    {
      field: 'realWhCode',
      width: 120,
      title: '实体仓库编码',
    },
    {
      field: 'theoreticalWeight',
      width: 120,
      title: '理重',
    },
    {
      field: 'trmming',
      width: 120,
      title: '是否切边',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'tolerance',
      width: 120,
      title: '公差（标签厚度减去实厚）',
      valueFormatter: 'ctx.optionsFind(value,11).label',
    },
    {
      field: 'sleeveType',
      width: 120,
      title: '套筒类型',
      valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'paperPlate',
      width: 120,
      title: '纸板',
    },
    {
      field: 'quantityUnstocked',
      width: 120,
      title: '待入库数量',
    },
    {
      field: 'quantityUnshipped',
      width: 120,
      title: '待发货数量',
    },
    {
      field: 'quantityTransferring',
      width: 120,
      title: '调拨在途数量',
    },
    {
      field: 'quantityUntransferred',
      width: 120,
      title: '调拨待发数量',
    },
    {
      field: 'boxType',
      width: 120,
      title: '箱体类型',
    },
    {
      field: 'entrustedProcessing',
      width: 120,
      title: '受托加工',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'taxPrice',
      width: 120,
      title: '含税价',
    },
    {
      field: 'fixedPrice',
      width: 120,
      title: '限价',
    },
    {
      field: 'money',
      width: 120,
      title: '无税金额',
    },
    {
      field: 'taxRate',
      width: 120,
      title: '税率',
    },
    {
      field: 'taxAmount',
      width: 120,
      title: '税额',
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      title: '含税金额',
    },
    {
      field: 'basePrice',
      width: 120,
      title: '基价',
    },
    {
      field: 'price',
      width: 120,
      title: '价格',
    },
    {
      field: 'markUp',
      width: 120,
      title: '加价',
    },
    {
      field: 'specialMarkup',
      width: 120,
      title: '特殊加价',
    },
    {
      field: 'unitOfWeight',
      width: 120,
      title: '重量单位',
    },
    {
      field: 'unitCodeWeight',
      width: 120,
      title: '重量单位编码',
    },
    {
      field: 'haveContract',
      width: 120,
      title: '是否有合同',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'cusCode',
      width: 120,
      title: '客户编码',
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      title: '客户简称',
    },
    {
      field: 'salesOrderCode',
      width: 120,
      title: '销售订单明细行号',
    },
    {
      field: 'transferOrderCode',
      width: 120,
      title: '调拨单行号',
    },
    {
      field: 'contractCode',
      width: 120,
      title: '合同号',
    },
    { field: 'paper', width: 120, title: '表面保护' },
    { field: 'plantCode', width: 120, title: '工厂编码' },
    { field: 'itemId', width: 190, title: '产品编码' },
    { field: 'skuName', width: 350, title: '产品名称', tooltipField: 'descriptionsCn' },
    { field: 'inBatchCode', width: 130, title: '来料批号' },
    { field: 'whName', width: 130, title: '仓库' },
    { field: 'inBatchCode', width: 120, title: '来料批号' },
    { field: 'onhandQuantity', width: 90, title: '现存量' },
    { field: 'unitCodee', width: 90, title: '数量单位编码' },
    { field: 'unitName', width: 90, title: '数量单位' },
    { field: 'steelGrade', width: 90, title: '钢种' },
    { field: 'surface', width: 120, title: '表面' },
    { field: 'spec', width: 120, title: '规格尺寸' },
    { field: 'grade', width: 120, title: '等级' },
    { field: 'actHeight', width: 120, title: '实厚' },
    { field: 'actWidth', width: 120, title: '实宽' },
    { field: 'weight', width: 120, title: '净重' },
    { field: 'unitWeight', width: 120, title: '单重' },
    { field: 'rollLength', width: 120, title: '卷长' },
    { field: 'quality', width: 240, title: '品质信息' },
    { field: 'avaQuantity', width: 120, title: '可用量' },
    { field: 'entryTime', width: 120, title: '入库时间' },
    { field: 'subsectionState', width: 120, title: '分卷状态', valueFormatter: 'ctx.optionsFind(value,5).label' },
    { field: 'rewinding', width: 120, title: '重卷次数', },
    { field: 'coilInnerDia', width: 120, title: '钢卷内径' },
    { field: 'packType', width: 120, title: '包装方式', valueFormatter: 'ctx.optionsFind(value,7).label' },
    { field: 'fullVolume', width: 120, title: '是否整卷', valueFormatter: 'ctx.optionsFind(value,6).label' },
    { field: 'elongation', width: 120, title: '延伸率' },
    { field: 'gloss', width: 120, title: '光泽度' },
    { field: 'ironLoss', width: 120, title: '铁损' },
    { field: 'magnetoreception', width: 120, title: '磁感' },
  ]
  saleDistOptions = {
    1: { 'PS_DIST_TYPE': [] },
    2: { 'PS_DIST_DETAILED_STATE': [] },
    3: { 'PS_PRODUCT_CATEGORY': [] },
    4: { 'PS_PLAN': [] },
    5: { 'PS_SUBSECTION_STATE': [] },
    6: { 'PS_YES_NOT': [] },
    7: { 'PS_PACK_TYPE': [] },
    8: { 'HOUBO': [] },
    9: { 'PS_TRANSPORT_TYPE': [] },
    10: { 'PS_PROD_TYPE': [] },
    11: { 'PS_PRICING_TYPE': [] },
    12: { 'GONGCHA': [] },
    13: { 'PS_TT_TYPE': [] },
  }
    
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
    public queryService: PricingSimulatorQueryService,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
  ) {

  }
  @ViewChild('f', { static: true }) f: NgForm;
  i: any = {};

  ngOnInit(): void {
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
      'PS_SETTLE_STYLE': this.settleStyleOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_GRADE': this.gradeOptions,
      'PS_STEEL_SORT': this.steelSortOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'HOUBO': this.materialOptions,
      'PS_TT_TYPE': this.ttTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_SURFACE_PROTECT': this.paperOptions,
    });
    this.queryService.GetLookupByType('PS_CONTRACT_STEEL_TYPE').subscribe(res => {
      if(res.Success && res.Extra && res.Extra.length > 0) {
        res.Extra.forEach(d => {
          this.steelTypeOptions.push({
            label: d.meaning,
            value: d.lookupCode,
            steelSort: d.attribute4
          })
        });
      }
    })
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  steelTypeChange() {
    const steelSort = this.steelSortOptions.find(d => d.value === 
      this.steelTypeOptions.find(o => o.value === this.i.steelGrade).steelSort);
    if(steelSort) {
      this.i.steelSort = steelSort.value;
    }
  }

  /**
   * 分货明细弹出查询
   * @param {any} e
   */
   public searchSaleDists(e: any, key: 'batchCode' | 'baleNo') {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadSaleDists(
      e.SearchValue,
      key,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载分货明细
   * @param {string} value  批号、捆包号
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadSaleDists(
    value: string,
    key: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getSaleDistDetaileds({
        [key]: value,
        pageIndex: pageIndex,
        pageSize: pageSize
      })
      .subscribe(res => {
        this.gridViewSaleDists.data = res.data.content;
        this.gridViewSaleDists.total = res.data.totalElements;
      });
  }

  onSaleDistTextChanged(event, key: 'batchCode' | 'baleNo') {
    const value = event.Text.trim();
    if(value) {
      this.queryService
      .getSaleDistDetaileds({
        [key]: value,
        pageIndex: 1,
        pageSize: 1
      })
      .subscribe(res => {
        if(res.code === 200) {
          if(res.data.content && res.data.content.length > 0) {
            this.saveSaleDists(res.data.content[0]);
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('查不到对应数据'));
        }
      });
    }
  }

  onSaleDistSelect(e) {
    this.saveSaleDists(e.Row);
  }

  saveSaleDists(data) {
    Object.assign(this.i, data);
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
        pageIndex: PageIndex,
        pageSize: PageSize,
        isCusCodeNotNull: true
      })
      .subscribe(res => {
        this.gridViewCustoms.data = res.data.content;
        this.gridViewCustoms.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onRowSelectCustoms(e: any) {
    this.setCus(e.Row);
  }

  setCus(data) {
    this.i.cusAbbreviation = data.cusAbbreviation;
  }

  clearCus() {
    this.i.cusAbbreviation = '';
  }

  onPopupSelectTextChanged(event: any) {
    const cusAbbreviation = event.Text.trim();
    if(cusAbbreviation !== '') {
      this.queryService
      .getCustoms({
        cusAbbreviation: cusAbbreviation,
        isCusCodeNotNull: true
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.setCus(res.data.content[0]);
        } else {
          this.clearCus();
          this.msgSrv.info(this.appTranslationService.translate('该客户名称无效！'))
        }
      });
    } else {
      this.clearCus();
    }
  }
  
  compute() {
    this.isComputed = true;
    this.queryService.compute(this.i).subscribe(res => {
      if(res.code === 200) {
        this.computeOpt = res.data;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  return() {
    this.isComputed = false;
  }

  clear() {
    this.i = {};
  }
}
