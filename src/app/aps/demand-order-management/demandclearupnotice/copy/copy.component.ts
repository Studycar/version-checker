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
  selector: 'demand-order-management-demandclearupnotice-copy',
  templateUrl: './copy.component.html',
  providers: [PsItemRoutingsService]
})
export class DemandOrderManagementDemandclearupnoticeCopyComponent implements OnInit {

  title: String = '复制信息';
  salesTypeList: any[] = [];
  productCategoryOptions: any[] = [];
  unitOfMeasureOptions: any[] = [];
  sources: any[] = [];
  makebuycodes: any[] = [];
  applicationYesNo: any[] = [];
  organizationids: any[] = [];
  schedulegroupcodes: any[] = [];
  subsectionStateOptions: any[] = [];
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
    this.loadData();
    this.IsDisable = true;

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
      this.optionListPlant = result.Extra;
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
      field: 'quantity',
      title: '现有量',
      width: '100'
    },
  ];


  @ViewChild('selMater1', { static: true }) selMater1: PopupSelectComponent;
  @ViewChild('selStock1', { static: true }) selStock1: PopupSelectComponent;
  @ViewChild('selRoute1', { static: true }) selRoute1: PopupSelectComponent;

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
    this.demandclearupnoticeService.Copy(this.i, '').subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('复制成功');
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
    this.commonQueryService
      .getProductions({
        plantCode: this.i.plantCode || this.appConfigService.getActivePlantCode(),
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
    if (stockCode !== '') {
      this.commonQueryService.getProductions({
        plantCode: this.i.plantCode || this.appConfigService.getActivePlantCode(),
        stockCodeOrName: stockCode,
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
      standards || 0, width || 0, length || 0, needSideCut || '', PageIndex, 1000).subscribe(res => {
        this.gridViewRoute.data = res.data;
        this.gridViewRoute.total = res.data.length;
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
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadRoute(this.i.plantCode, this.i.stockCode, e.SearchValue, this.i.steelType, this.i.surface, this.i.standards, this.i.width, this.i.length, this.i.needSideCut, PageIndex, e.PageSize);

    // this.loadRoute(this.i.plantCode, this.i.stockCode, e.SearchValue, this.i.steelType, this.i.surface, PageIndex, e.PageSize);
  }
  //  行点击事件， 给参数赋值
  onRowSelectRoute(e: any) {
    this.i.routeId = e.Value;
    this.i.manufRoute = e.Text;
  }


  onTextChangedRoute({ sender, event, Text }) {
    this.i.manufRoute = null;
    // 加载产品信息
    this.commonQueryService.getPsRouteList(this.i.plantCode || '', this.i.stockCode || '', Text, this.i.steelType || '',
      this.i.surface || '', this.i.standards || 0, this.i.width || 0, this.i.length || 0, this.i.needSideCut || '', 1, sender.PageSize).subscribe(res => {
        this.gridViewRoute.data = res.data;
        this.gridViewRoute.total = res.data.length;
        // console.log('res.data', res.data)
        const stockInfo = res.data.find(x => x.routeId === Text);
        if (stockInfo) {
          this.i.routeId = stockInfo.routeId;
          this.i.manufRoute = stockInfo.routeName;
        } else {
          this.i.routeId = '';
          this.i.manufRoute = '';
          this.msgSrv.warning(this.appTranslationService.translate('路径信息无效'));
        }
      });

  }

  /**
   * 匹配制造路径、路径标识
   * 匹配规则：制造路径节点最长的
   * 触发：产品编码、钢种、表面修改后
   */
  setManufRoute() {
    if (!this.i.stockCode || !this.i.steelType || !this.i.surface) {
      this.i.routeId = '';
      this.i.manufRoute = '';
      return;
    }
    this.commonQueryService.getPsRouteList(this.i.plantCode || '', this.i.stockCode || '', '', this.i.steelType || '',
      this.i.surface || '', this.i.standards || 0, this.i.width || 0, this.i.length || 0, this.i.needSideCut).subscribe(res => {
        this.gridViewRoute.data = res.data;
        this.gridViewRoute.total = res.data.length;
        if (res.data.length > 0) {
          let routerIdMax = res.data[0].routeId;
          let manufRouteMax = res.data[0].routeName.split('->');
          res.data.forEach(d => {
            const manufRoute = d.routeName.split('->');
            if (manufRoute.length > manufRouteMax.length) {
              routerIdMax = d.routeId;
              manufRouteMax = manufRoute;
            }
          });
          this.i.routeId = routerIdMax;
          this.i.manufRoute = manufRouteMax.join('->');
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
          });
        });
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

}
