import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { DemandclearupnoticeService } from '../../../../modules/generated_module/services/demandclearupnotice-service';
import { PsItemRoutingsService } from '../../../../modules/generated_module/services/ps-item-routings-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';
import { decimal } from '@shared';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnotice-edit',
  templateUrl: './edit.component.html',
  providers: [PsItemRoutingsService]
})
export class DemandOrderManagementDemandclearupnoticeEditComponent implements OnInit {

  title: String = '编辑信息';
  salesTypeList: any[] = [];
  isShowJC: Boolean = true; // 是否展示卷材信息，新增时显示，编辑时根据条件显示
  isShowBC: Boolean = true; // 是否展示板材信息，新增时显示，编辑时根据条件显示
  isModify: Boolean = true;
  productCategoryOptions: any[] = [];
  unitOfMeasureOptions: any[] = [];
  gongchaOptions: any[] = [];
  packTypeOptions: any[] = [];
  pricingTypeOptions: any[] = []
  sources: any[] = [];
  makebuycodes: any[] = [];
  applicationYesNo: any[] = [];
  organizationids: any[] = [];
  schedulegroupcodes: any[] = [];
  subsectionStateOptions: any[] = [];
  surfaceProtectOptions: any[] = [];
  productlines: any[] = [];
  scheduleregions: any[] = [];
  gradeList: any[] = [];
  isLoading = false;
  // tslint:disable-next-line:no-inferrable-types
  Istrue: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  IsDisable: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  IsControl: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  CancelControl: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  IsNonstd: boolean = false;

  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

  // height: number = document.documentElement.clientHeight * 0.42;
  needSiteCutOptions: any[] = [
    { 'label': '切', 'value': '1' },
    { 'label': '不切', 'value': '0' }
  ];
  surfaceOptions: any[] = [];
  steelTypeOption: any[] = [];
  YesNoOptions: any[] = [];
  unitOptions: any[] = [];
  queryParams: any[] = [];
  i: any;
  iClone: any;
  applicationReqType: any[] = [];
  public panelActive1 = true;
  public panelActive2 = false;
  public panelActive3 = false;
  public panelTitle1 = this.appTranslationService.translate('主要信息');
  public panelTitle2 = this.appTranslationService.translate('销售信息');
  public panelTitle3 = this.appTranslationService.translate('非标信息');

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: PsItemRoutingsService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: PlanscheduleHWCommonService,
    public demandclearupnoticeService: DemandclearupnoticeService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.Istrue = false;
    if (!this.i.id) {
      this.title = '新增信息';
      this.isModify = false;
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.IsDisable = false;
      this.IsControl = false;
      this.loadData();
      this.i.orderWeightUnit = '002';
    } else {
      this.loadData();
      this.IsDisable = true;
      if(this.verifyProdType('JC')) {
        this.isShowJC = true;
        this.isShowBC = false;
      }else {
        this.isShowJC = false;
        this.isShowBC = true;
      }
      if (this.i.cancelComments !== undefined && this.i.cancelComments !== null) {
        // 取消说明不为空才可以编辑取消说明字段
        this.CancelControl = false;
      }

      if (this.i.moStatus === 'A' || this.i.moStatus === null) {
        // MO状态是A或者空才可以编辑
        this.IsControl = false;
      }
      if (this.i.status === 'CANCELLED') {
        // 取消状态只有取消说明可以编辑
        this.IsControl = true;
      }

      if (this.i.standardFlag === 'Y') {
        // 标准类型不可以编辑非标
        this.IsNonstd = true;
      } else {
        this.Istrue = true;
        this.demandclearupnoticeService.GetNonStdTypeScheduleGroup(this.i.plantCode, this.i.itemId, this.i.reqType).subscribe(result => {
          this.schedulegroupcodes.length = 0;
          result.data.forEach(d => {
            this.schedulegroupcodes.push({
              label: d,
              value: d,
            });
          });
        });
        this.demandclearupnoticeService.GetNonStdTypeProductLine(this.i.plantCode, this.i.scheduleGroupCode, this.i.itemId, this.i.reqType).subscribe(result => {
          this.productlines.length = 0;
          result.data.forEach(d => {
            this.productlines.push({
              label: d,
              value: d
            });
          });
        });
      }
    }
  }

  verifyProdType(type: 'JC' | 'BC') {
    if(this.isNull(this.i.stockCode)) { return false; }
    switch (type) {
      case 'JC':
        return this.i.stockCode.slice(0,2) === '01';
      case 'BC':
        return this.i.stockCode.slice(0,2) === '02';
    
      default:
        break;
    }
  }

  onChangeScheduleGroup(): void {
    this.i.resourceCode = null;
    this.demandclearupnoticeService.GetNonStdTypeProductLine(this.i.plantCode, this.i.scheduleGroupCode, this.i.itemId, this.i.reqType).subscribe(result => {
      this.productlines.length = 0;
      result.data.forEach(d => {
        this.productlines.push({
          label: d,
          value: d
        });
      });
    });
  }

  onChangeStandardType(): void {
    if (this.i.standardFlag === 'N') {
      this.Istrue = true;
      this.i.scheduleGroupCode = null;
      this.demandclearupnoticeService.GetNonStdTypeScheduleGroup(this.i.plantCode, this.i.itemId, this.i.reqType).subscribe(result => {
        this.schedulegroupcodes.length = 0;
        result.data.forEach(d => {
          this.schedulegroupcodes.push({
            label: d,
            value: d,
          });
        });
      });

    } else {
      this.Istrue = false;
      this.schedulegroupcodes = [];
      this.productlines = [];
      this.i.scheduleGroupCode = null;
      this.i.resourceCode = null;
      this.i.uph = '';
      this.i.mrpNetFlag = null;
    }

  }
  onChangeReqType(): void {
    const StandardFlag = this.applicationReqType.find(x => x.value === this.i.reqType).other;
    if (StandardFlag !== 'N') {
      this.i.standardFlag = 'Y';
    } else {
      this.i.standardFlag = 'N';
      this.panelActive3 = true;
    }
    this.onChangeStandardType();
  }

  loadData() {
    // 内外销
    this.commonQueryService.GetLookupByTypeNew('SOP_SALES_TYPE').subscribe(res => {
      res.data.forEach(item => {
        this.salesTypeList.push({
          label: item.meaning,
          value: item.attribute1,
        });
      });
    });
    this.loadplant();
    this.loadItem();
    this.loadReqType();
    this.loadOptions();
    this.loadSteelType();
    this.loadProductCategory();
    this.loadunitOfMeasure();
    this.loadContractSurface();
    this.loadSurfaceProtect();
    /** 初始化订单来源 新增页面的只能ATTRIBUTE2 === 'MANUAL' */
    this.sources.length = 0;
    if (!this.i.id) {
      this.commonQueryService.GetLookupByTypeNew('PP_DM_SOURCE_SYSTEM').subscribe(result => {
        result.data.forEach(d => {
          if (d.attribute2 === 'MANUAL') {
            this.sources.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          }
        });
      });
    } else {
      this.iClone = Object.assign({}, this.i);
      this.commonQueryService.GetLookupByTypeNew('PP_DM_SOURCE_SYSTEM').subscribe(result => {
        result.data.forEach(d => {
          this.sources.push({
            label: d.meaning,
            value: d.lookupCode,
          });

        });
      });
    }
    /*if (this.i.id != null) {
      /!** 初始化编辑数据 *!/
      this.demandclearupnoticeService.GetInfo(this.i.ID).subscribe(result => {
        result.Extra.REQ_QTY_MODIFY = this.i.REQ_QTY_MODIFY;
        result.Extra.REQ_DATE_MODIFY = this.i.REQ_DATE_MODIFY;

        this.i = result.Extra;
        this.i.ID = result.Extra.ID;
        this.i.MRP_NET_FLAG = result.Extra.MRP_NET_FLAG;
        this.iClone = Object.assign({}, this.i);
      });
    }*/
  }

  loadOptions() {
    this.commonQueryService.GetLookupByTypeRefAll({
      'PS_ITEM_UNIT': this.unitOptions, // 单位
      'PP_PLN_CUSTOMER_DEGREE': this.gradeList,
      'FND_YES_NO': this.applicationYesNo,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
    });
  }

  public loadItem(): void {
    this.editService.SearchItemInfo(this.i.plantCode).subscribe(resultMes => {
      this.optionListItem1 = resultMes.data;
    });
  }

  public loadReqType(): void {
    this.commonQueryService.GetLookupByTypeNew('PP_PLN_ORDER_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.applicationReqType.push({
          label: d.meaning,
          value: d.lookupCode,
          other: d.attribute3
        });
      });
    });
  }

  // 绑定页面的下拉框Plant
  optionListPlant = [];
  public loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra.map(d => ({
        value: d.plantCode,
        label: `${d.plantCode}(${d.descriptions})`
      }));
    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    this.loadItem();
    this.onChangeStandardType();
  }

  // 物料的选择框
  optionListItem1 = [];

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  Columns: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '80'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '80'
    }
  ];

  // 绑定产品
  public gridViewStocks: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsStock: any[] = [
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
      field: 'unitOfMeasure',
      title: '单位',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
  ];
  stockOptions = {
    1: { 'PS_ITEM_UNIT': [] }
  };

  // 绑定路径
  public gridViewRoute: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsRoute: any[] = [
    {
      field: 'routeId',
      title: '制造路径标识',
      width: '50'
    },
    {
      field: 'routeName',
      title: '制造路径',
      width: '150'
    },
    {
      field: 'listOrder',
      title: '优先级',
      width: '100'
    },
    // {
    //   field: 'quantity',
    //   title: '现有量',
    //   width: '100'
    // },
  ];


  // 绑定原材料
  public gridViewRaw: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsRaw: any[] = [
    // 产品名称	现有量	批号	表面	规格	内控等级	实厚	库位	入库时间	化学成分	产地	存货仓库   
    { field: 'whName', title: '存货仓库', width: '120' },
    { field: 'skuName', title: '产品名称', width: '120' },
    { field: 'spec', title: '规格尺寸', width: '120' },
    { field: 'actHeight', title: '实厚', width: '100' },
    { field: 'surface', title: '表面', width: '100' },
    { field: 'batchCode', title: '批号', width: '120' },
    { field: 'quantity', title: '现存量', width: '100' },
    { field: 'whPosName', title: '库位名称', width: '120' },
    { field: 'innerGrade', title: '内控等级', width: '100' },
    { field: 'cr', title: '化学成分Cr', width: '100' },
    { field: 'producer', title: '产地', width: '120' },
    { field: 'createdTime', title: '入库时间', width: '120' },

    // { field: 'uniqueCode', title: '唯一编码', width: '50' },
    // { field: 'skuCode', title: '产品编码', width: '50' },
    // {      field: 'unitCode',      title: '单位编码',      width: '50'    },     
    // {      field: 'unitName',      title: '单位名称',      width: '50'    },     
    // { field: 'whCode', title: '仓库编码', width: '50' },
    // {      field: 'steelGrade',      title: '钢种',      width: '50'    },     
    // {      field: 'grade',      title: '等级',      width: '50'    },     
    // {      field: 'avaQuantity',      title: '可用数量',      width: '50'    },     
    // {      field: 'tenantCode',      title: '租户编码',      width: '50'    },     
    // {      field: 'lockMark',      title: '锁库摘要',      width: '50'    },     
    // {      field: 'lockQuantity',      title: '锁库数量',      width: '50'    },     
    // {      field: 'inBatchCode',      title: '来料批号',      width: '50'    },     
    // {      field: 'coating',      title: '胶膜',      width: '50'    },     
    // {      field: 'coatingUpCode',      title: '面膜',      width: '50'    },     
    // {      field: 'coatingDownCode',      title: '底膜',      width: '50'    },     
    // {      field: 'paper',      title: '是否垫纸',      width: '50'    },     
    // {      field: 'originalWeight',      title: '原重',      width: '50'    },     
    // {      field: 'unitWeight',      title: '单重',      width: '50'    },     
    // {      field: 'weight',      title: '重量',      width: '50'    },     
    // {      field: 'quality',      title: '品质信息',      width: '50'    },     
    // {      field: 'actWidth',      title: '实宽',      width: '50'    },     
    // {      field: 'rollLength',      title: '卷长',      width: '50'    },     
    // {      field: 'grossWeight',      title: '毛重',      width: '50'    },     
    // {      field: 'originalBatchCode',      title: '原批号',      width: '50'    },
    // {      field: 'nextMachineCode',      title: '后工序机台编码',      width: '50'    },     
    // { field: 'whPosCode', title: '库位编码', width: '50' },
    // {      field: 'baleNo',      title: '捆包号',      width: '50'    },     
    // {      field: 'skuStatClass',      title: '统计分类',      width: '50'    },     
    // {      field: 'hardness',      title: '硬度',      width: '50'    },     
    // {      field: 'gloss',      title: '光泽度',      width: '50'    },     
    // {      field: 'elongation',      title: '延伸率',      width: '50'    },     
    // {      field: 'ironLoss',      title: '铁损',      width: '50'    },     
    // {      field: 'magnetoreception',      title: '磁感',      width: '50'    },     
    // {      field: 'packingMethod',      title: '包装方式',      width: '50'    },     
    // {      field: 'inMatInDia',      title: '钢卷内径',      width: '50'    },     
    // { field: 'unit', title: '单位编码', width: '50' },
    // { field: 'c', title: '化学成分C', width: '50' },
    // { field: 'si', title: '化学成分Si', width: '50' },
    // { field: 'mn', title: '化学成分Mn', width: '50' },
    // { field: 'p', title: '化学成分P', width: '50' },
    // { field: 's', title: '化学成分S', width: '50' },
    // { field: 'ni', title: '化学成分Ni', width: '50' },
    // { field: 'cu', title: '化学成分Cu', width: '50' },
    // { field: 'mo', title: '化学成分Mo', width: '50' },
    // { field: 'n', title: '化学成分N', width: '50' },
  ];


  @ViewChild('selMater1', { static: true }) selMater1: PopupSelectComponent;
  @ViewChild('selStock1', { static: true }) selStock1: PopupSelectComponent;
  @ViewChild('selRoute1', { static: true }) selRoute1: PopupSelectComponent;
  @ViewChild('selRaw1', { static: true }) selRaw1: PopupSelectComponent;

  /**
* 根据工厂编码加载物料
*/
  selectMaterial(e: any): void {
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.demandclearupnoticeService.loadMaterials(e, this.i.plantCode)
      .subscribe(it => this.gridView1 = it);
  }

  onSearchMaterial(e: any) {
    const param = { Skip: e.Skip, PageSize: this.selMater1.pageSize, SearchValue: e.SearchValue };
    this.selectMaterial(param);
  }
  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.itemId = e.Value;
    this.i.itemCode = e.Text;
    this.i.unitOfMeasure = e.Row.unitOfMeasure;
    // 给物料描述赋值
    /*this.editService.SearchItemInfoByID(e.Value,this.i.PLANT_CODE).subscribe(resultMes => {
      this.i.DESCRIPTIONS = resultMes.Extra[0].DESCRIPTIONS;
      this.i.UNIT_OF_MEASURE = resultMes.Extra[0].UNIT_OF_MEASURE;
    });*/ // 迁移需要修改
  }

  change1({ sender, event, Text }) {
    const value = this.i.itemId || '';
    if (value === '') {
      // 加载物料
      this.commonQueryService.getUserPlantItemPageList(this.i.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        const selectMaterialItem = res.data.content.find(x => x.itemCode === Text);
        if (selectMaterialItem) {
          this.i.itemId = selectMaterialItem.itemId;
          this.i.descriptionsCn = selectMaterialItem.descriptionsCn;
          this.i.unitOfMeasure = selectMaterialItem.unitOfMeasure;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }

  save() {

    // if (this.i.itemCode !== '' && (this.i.itemId === undefined || this.i.itemId === '')) {
    //   this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
    //   return;
    // }

    // 编辑时是否有修改需求时间或者需求日期
    if (this.i.REQ_QTY_MODIFY !== undefined && this.i.REQ_DATE_MODIFY !== undefined) {
      if (this.i.reqQty === this.i.REQ_QTY_MODIFY || this.commonQueryService.formatDate((this.i.reqDate).toString()).toString() === this.commonQueryService.formatDate((this.i.REQ_DATE_MODIFY).toString()).toString()) {
        this.i.QTYORDATEUPDATE = 'N';
      } else {
        this.i.QTYORDATEUPDATE = 'Y';
      }
    }
    // 手工新增的订单，这两个字段都应该为是
    if (this.i.source === 'MANUAL') {
      this.i.manualEntruFlag = 'Y';
      this.i.productScheduleFlag = 'Y';
    }

    this.i.standards = decimal.roundFixed(Number(this.i.standards), 2);
    // 面膜、底膜、垫纸必有一个填写
    if (this.isNull(this.i.coatingUpCode) && this.isNull(this.i.coatingDownCode) && this.isNull(this.i.paper)) {
      this.msgSrv.warning(this.appTranslationService.translate('面膜、底膜、垫纸必有一个填写'));
      return;
    }
    this.demandclearupnoticeService.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  // 判断为空
  public isNull(data: any): boolean {
    return (data || '') === '';
  }
    
  /**
   * 保存重量
   */
   setOrderWeight() {
    if(this.verifyProdType('JC')) {
      this.i.orderWeight = this.i.reqQty;
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
    this.commonQueryService
      .getProductionsWorkBench({
        plantCode: this.i.plantCode || this.appConfigService.getActivePlantCode(),
        stockCodeOrName: stockCode,
        catId: type ? 'Y' : null,
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
    if (stockCode !== '') {
      this.commonQueryService.getProductionsWorkBench({
        plantCode: this.i.plantCode || this.appConfigService.getActivePlantCode(),
        stockCodeOrName: stockCode,
        catId: type ? 'Y' : null,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if (res.data.content.length > 0) {
          this.saveStocks(res.data.content[0], type);
        } else {
          this.clearStocks(type);
          this.msgSrv.info(this.appTranslationService.translate('编码或名称无效'));
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
    if (!type) {
      // 保存存货编码、名称、单位
      this.i.stockCode = data.stockCode;
      this.i.stockName = data.stockName;
      this.i.unitOfMeasure = data.unitOfMeasure;
      if(this.verifyProdType('JC')) {
        this.i.prodType = 'JC';
      } else {
        this.i.prodType = 'BC';
      }
      this.setOrderWeight();
      this.setLength();
      this.setManufRoute();
    } else {
      // 保存面膜/底膜编码、描述
      this.i[`coating${type}Code`] = data.stockCode;
      this.i[`coating${type}Name`] = data.stockDesc;
    }
  }

  clearStocks(type?: 'Up' | 'Down') {
    if (!type) {
      // 清空存货编码、名称、单位
      this.i.stockCode = '';
      this.i.stockName = '';
      this.i.unitOfMeasure = null;
    } else {
      // 清空面膜/底膜编码、描述
      this.i[`coating${type}Code`] = '';
      this.i[`coating${type}Name`] = '';
    }
  }

  setLength() {
    // 单位为 公斤 时，对应 产品长 为0
    if (this.i.unitOfMeasure === '002') {
      this.i.length = 0;
    }
  }
  public loadRoute(plantCode: string, stockCode: string, routeId: string, steelType: string, surface: string,
    standards: number, width: number, length: number, needSideCut: string, PageIndex: number, PageSize: number) {
    this.gridViewRoute.data.length = 0;
    // 加载产品编码
    this.commonQueryService.getPsRouteList(plantCode || '', stockCode || '', routeId || '', steelType || '', surface || '',
      standards || 0, width || 0, length || 0, needSideCut || '0', PageIndex, 1000).subscribe(res => {
        if (res.code === 200) {
          this.gridViewRoute.data = res.data;
          this.gridViewRoute.total = res.data.length;
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  }
  // 产品编码弹出查询
  public searchRoute(e: any) {
    if (!this.i.stockCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择产品编码'));
      return;
    }
    if (!this.i.steelType) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择钢种'));
      return;
    }
    if (!this.i.surface) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择产品表面'));
      return;
    }
    if (!this.i.needSideCut) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择切边标识'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadRoute(this.i.plantCode, this.i.stockCode, e.SearchValue, this.i.steelType, this.i.surface, this.i.standards, this.i.width, this.i.length, this.i.needSideCut, PageIndex, e.PageSize);
  }
  //  行点击事件， 给参数赋值
  onRowSelectRoute(e: any) {
    console.log('--------------------', e);
    this.i.routeId = e.Row.routeId;
    this.i.manufRoute = e.Row.routeName;
  }


  onTextChangedRoute({ sender, event, Text }) {
    if (Text.trim() === '') {
      return;
    }
    if (!this.i.stockCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择产品编码'));
      return;
    }
    if (!this.i.steelType) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择钢种'));
      return;
    }
    if (!this.i.surface) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择产品表面'));
      return;
    }
    if (!this.i.needSideCut) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择切边标识'));
      return;
    }
    this.i.manufRoute = null;
    // 加载产品信息
    this.commonQueryService.getPsRouteList(this.i.plantCode || '', this.i.stockCode || '', Text, this.i.steelType || '',
      this.i.surface || '', this.i.standards || 0, this.i.width || 0, this.i.length || 0, this.i.needSideCut, 1, sender.PageSize).subscribe(res => {
        if (res.code === 200) {
          const stockInfo = res.data.find(x => x.routeId === Text);
          if (stockInfo) {
            this.i.routeId = stockInfo.routeId;
            this.i.manufRoute = stockInfo.routeName;
          } else {
            this.i.routeId = '';
            this.i.manufRoute = '';
            this.msgSrv.warning(this.appTranslationService.translate('路径信息无效'));
          }
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });

  }

  /**
   * 匹配制造路径、路径标识
   * 匹配规则：制造路径节点最长的
   * 触发：产品编码、钢种、表面修改后
   */
  setManufRoute() {
    if (!this.i.stockCode || !this.i.steelType || !this.i.surface || !this.i.needSideCut) {
      this.i.routeId = '';
      this.i.manufRoute = '';
      return;
    }
    this.commonQueryService.getPsRouteList(this.i.plantCode || '',
      this.i.stockCode || '',
      '',
      this.i.steelType || '',
      this.i.surface || '',
      this.i.standards || 0,
      this.i.width || 0,
      this.i.length || 0,
      this.i.needSideCut || ''
    ).subscribe(res => {
      if (res.code === 200) {
        if (res.data.length > 0) {
          let listOrderMin = res.data[0].listOrder;
          let routeMinIndex = 0;
          res.data.forEach((d, index) => {
            if (d.listOrder < listOrderMin) {
              listOrderMin = d.listOrder;
              routeMinIndex = index;
            }
          });
          this.i.routeId = res.data[routeMinIndex].routeId;
          this.i.manufRoute = res.data[routeMinIndex].routeName;
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  /**
     * 加载快码 产品表面
     */
  public loadContractSurface(): void {
    this.commonQueryService.GetLookupByType('PS_CONTRACT_SURFACE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.surfaceOptions.push({
            label: d.meaning,
            value: d.lookupCode,
            attribute2: d.attribute2,
          });
        });
        this.commonQueryService.getArrBySort(this.surfaceOptions, 'attribute2', 'asc');
      });
  }
  /**
     * 加载快码 表面保护
     */
  public loadSurfaceProtect(): void {
    this.commonQueryService.GetLookupByType('PS_SURFACE_PROTECT')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.surfaceProtectOptions.push({
            label: d.meaning,
            value: d.lookupCode,
            attribute2: d.attribute2,
          });
        });
      });
  }


  /**
   * 加载快码 钢种
   */
  public loadSteelType(): void {
    this.commonQueryService.GetLookupByType('PS_CONTRACT_STEEL_TYPE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.steelTypeOption.push({
            label: d.meaning,
            value: d.lookupCode,
            attribute2: d.attribute2,
          });
        });
        this.commonQueryService.getArrBySort(this.steelTypeOption, 'attribute2', 'asc');
      });
  }


  public loadProductCategory(): void {
    this.commonQueryService.GetLookupByType('PS_PRODUCT_CATEGORY')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.productCategoryOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  public loadunitOfMeasure(): void {
    this.commonQueryService.GetLookupByType('PS_ITEM_UNIT')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.unitOfMeasureOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  // 产品编码弹出查询
  public searchRaw(e: any) {
    if (!this.i.stockCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择产品编码'));
      return;
    }
    if (!this.i.steelType) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择钢种'));
      return;
    }
    if (!this.i.surface) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择产品表面'));
      return;
    }
    if (!this.i.needSideCut) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择切边标识'));
      return;
    }
    if (!this.i.routeId) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择路径'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadRaw(this.i.plantCode, this.i.stockCode, this.i.routeId, this.i.steelType, this.i.surface, this.i.standards, this.i.width, this.i.length, this.i.needSideCut, PageIndex, e.PageSize);
  }
  //  行点击事件， 给参数赋值
  onRowSelectRaw(e: any) {
    console.log('e-----', e);
    this.setRawData(e.Row);
  }

  setRawData(data) {
    this.i.rawUniqueCode = data.uniqueCode;
    this.i.rawBatchCode = data.batchCode;
    this.i.rawSkuCode = data.skuCode;
    this.i.rawSteelGrade = data.steelGrade;
    this.i.rawSurface = data.surface;
    this.i.rawSpec = data.spec;
    this.i.rawGrade = data.grade;
  }

  public loadRaw(plantCode: string, stockCode: string, routeId: string, steelType: string, surface: string,
    standards: number, width: number, length: number, needSideCut: string, PageIndex: number, PageSize: number) {
    this.gridViewRaw.data.length = 0;
    // 加载产品编码
    this.commonQueryService.getPsMesRawInfoList(plantCode || '', stockCode || '', routeId || '', steelType || '', surface || '',
      standards || 0, width || 0, length || 0, needSideCut || '0', PageIndex, 1000).subscribe(res => {
        if (res.code === 200) {
          this.gridViewRaw.data = res.data;
          this.gridViewRaw.total = res.data.length;
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  }


}
