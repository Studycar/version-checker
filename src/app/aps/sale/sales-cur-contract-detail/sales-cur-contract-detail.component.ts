import { AfterViewInit, Component, OnInit, ViewChild, } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper, TitleService, _HttpClient } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SalesCurContractQueryService } from '../sales-cur-contract/query.service';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ReuseTabService } from "@delon/abc";

@Component({
  selector: 'sales-cur-contract-detail',
  templateUrl: './sales-cur-contract-detail.component.html',
  providers: [SalesCurContractQueryService],
})
export class SalesCurContractDetailComponent extends CustomBaseContext implements OnInit, AfterViewInit {
  constructor(
    public pro: BrandService,
    public appTranslationService: AppTranslationService,
    public appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public modal: ModalHelper,
    public queryService: SalesCurContractQueryService,
    private routerInfo: ActivatedRoute,
    public router: Router,
    public http: _HttpClient,
    protected titleSrv: TitleService,
    protected reuseTabService: ReuseTabService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }
  salesCurContract: any = {};
  salesCurContractClone: any = {};
  isChanging: boolean = false; // 是否正在变更
  isGridDataChange: boolean = false; // 表格数据是否更新
  isVisible: boolean = false; 
  newDetail: any = {}; // 新增的数据
  
  // 绑定现货销售
  public gridViewSalesDistCurs: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsSalesDistCurs: any[] = [
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
      field: 'baleNo',
      width: 120,
      title: '捆包号',
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
      field: 'theoreaticalWeight',
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
    {
      field: 'batchCode',
      width: 120,
      title: '批号',
    },
    { field: 'coating', width: 120, title: '表面保护' },
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
  ];
  salesDistCursOptions = {
    1: { 'PS_DIST_TYPE': [] },
    2: { 'PS_DIST_DETAILED_STATE': [] },
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
  };
  
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

  // 绑定合同
  public gridViewContracts: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsContracts: any[] = [
    {
      field: 'contractCode',
      title: '合同编码',
      width: '100'
    },
    {
      field: 'contractState',
      title: '合同状态',
      width: '100'
    }
  ];

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.getOneUrl,
    method: 'GET',
  };
  plantOptions: any[] = [];
  materialOptions: any[] = [];
  prodNameOptions: any[] = [];
  prodTypeOptions: any[] = [];
  contractStateOptions: any[] = [];
  contractTypeOptions: any[] = [];
  attachInfoList: any[] = [];
  // 表格列配置
  columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    {
      field: 'contractCode',
      width: 120,
      headerName: '合同编码'
    },
    {
      field: 'batchCode',
      width: 120,
      headerName: '批号'
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种'
    },
    {
      field: 'standards',
      width: 120,
      headerName: '规格'
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面'
    },
    {
      field: 'surfaceState',
      width: 120,
      headerName: '表面状态',
      editable: true, 
      cellEditor: 'agTextCellEditor' 
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级'
    },
    {
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'material',
      width: 120,
      headerName: '厚/薄料',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'prodName',
      width: 180,
      headerName: '产品名称',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      editable: true, 
      cellEditor: 'AgRichSelectCellEditor',
      cellEditorParams: {
        options: this.prodNameOptions,
        isShowValue: false,
      }
    },
    {
      field: 'basePrice',
      width: 120,
      headerName: '基（单）价'
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量（张）'
    },
    {
      field: 'weight',
      width: 120,
      headerName: '重量（吨）'
    },
    {
      field: 'money',
      width: 120,
      headerName: '含税金额'
    },
    {
      field: 'taxRate',
      width: 120,
      headerName: '税率'
    },
    {
      field: 'amountWithoutTax',
      width: 120,
      headerName: '未税金额货款'
    },
    {
      field: 'taxAmount',
      width: 120,
      headerName: '税额'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '供方'
    },
    {
      field: 'remarks',
      width: 120,
      headerName: '备注'
    },
    {
      field: 'quantityDj',
      width: 120,
      headerName: '合同已分货量'
    },
    {
      field: 'quantitySy',
      width: 120,
      headerName: '合同待分货量'
    },
    {
      field: 'quantityShipped',
      width: 120,
      headerName: '合同已发量'
    },
    {
      field: 'quantityUnshipped',
      width: 120,
      headerName: '合同剩余量'
    },
    {
      field: 'changeRemarks',
      width: 120,
      headerName: '变更备注'
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建时间'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.materialOptions;
        break;
      case 2:
        options = this.prodNameOptions;
        break;
      case 3:
        options = this.prodTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  // 查询条件配置
  queryParams = {
    defines: [
      { field: 'contractCode', title: '合同编号', ui: { type: UiType.text } },
    ],
    values: {
      contractCode: ''
    }
  };

  // 获取查询条件
  getQueryParams(): any {
    const params: any = { ...this.queryParams.values };
    return params;
  }

  @ViewChild('f', { static: true }) f: NgForm;

  // 初始化生命周期
  ngOnInit(): void {
    this.setTitle();
    this.loadOptions();
    this.initData();
    // this.router.events.subscribe((event: RouterEvent) => {
    //   if(event.url && event.url.startsWith('/sale/salesCurContractDetail')) {
    //     if(event instanceof NavigationEnd) {
    //       setTimeout(() => {
    //         this.initData();
    //       }, 0);
    //     }
    //   }
    // });
  }

  setTitle() {
    const title = '现货合同明细';
    this.titleSrv.setTitle(title);
    this.reuseTabService.title = title;
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onVirtualColumnsChanged(null);
    });
  }

  initData() {
    this.queryParams.values.contractCode = localStorage.getItem('SALES_CUR_CONTRACT_CODE');
    if(this.queryParams.values.contractCode) {
      this.query();
    }
  }

  // 查询搜索条件
  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'HOUBO': this.materialOptions,
      'PS_PROD_NAME': this.prodNameOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_CONTRACT_STATE': this.contractStateOptions,
      'PS_CONTRACT_TYPE': this.contractTypeOptions,
    });
    const plantRes = await this.queryService.GetAppliactioPlant().toPromise();
    plantRes.data.forEach(d => {
      this.plantOptions.push({
        label: `${d.plantCode}(${d.descriptions})`,
        value: d.plantCode,
        descriptions: d.descriptions,
      })
    });
    this.queryService.findAttachList('', 'PS_CONTRACT', 'xhht').subscribe(res1 => {
      if(res1.code === 200 && res1.data && res1.data.length > 0) {
        res1.data.forEach(d => {
          this.attachInfoList.push({
            label: d.fileName,
            value: d.id,
            fileUrl: d.fileUrl
          })
        });
      }
    });
  });

  verifyEdit() {
    // 待审核、审核驳回、变更驳回
    return ['10', '40', '70'].includes(this.salesCurContract.contractState) || this.isChanging;
  }

  equalLastSave() {
    for(let key in this.salesCurContract) {
      if(key === 'contractStockDetailDTOList' || key === 'salesDistDetailedDTOList') { continue; }
      if(!this.salesCurContractClone.hasOwnProperty(key)) {
        if((this.salesCurContract[key] || '') === '') { continue; }
        else { return false; }
      } else if ((this.salesCurContract[key] || '') !== (this.salesCurContractClone[key] || '')) {
        return false;
      }
    }
    return true;
  }
  
   verifySubmit(f: NgForm) {
    // 如果还未保存则置灰
    if(this.equalLastSave()) {
      return false;
    }
    return !f.pristine || f.invalid;
  }

  query() {
    this.queryCommon();
  }

  // 查询方法
  queryCommon() {
    this.context.setLoading(true);
    if(this.queryParams.values.contractCode) {
      this.queryService.queryWithDetailsByContractCode(this.queryParams.values.contractCode).subscribe(res => {
        if(res.code === 200) {
          this.salesCurContract = res.data;
          this.salesCurContractClone = Object.assign({}, res.data);
          this.queryService.setContextData(this.context, {
            data: this.salesCurContract.contractStockDetailDTOList || []
          });
          this.loadGridDataCallback(res.data);
        } else {
          this.msgSrv.error(this.appTranslationService.translate('获取合同信息失败'));
          this.salesCurContract = {};
          this.salesCurContractClone = {};
          this.gridData = [];
        }
        this.context.setLoading(false);
      })
    }
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['表面状态', '产品名称'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#digitalGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }
  
  attachChange(e) {
    this.salesCurContract.attachInfoPath = this.attachInfoList.find(item => item.value === this.salesCurContract.attachInfoId).fileUrl;
  }

  plantChange(e) {
    this.salesCurContract.plantName = this.plantOptions.find(item => item.value === this.salesCurContract.plantCode).descriptions;
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      contractCode: localStorage.getItem('SALES_CUR_CONTRACT_CODE'),
    };
  }

  /**
   * 合同弹出查询
   * @param {any} e
   */
   public searchContracts(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadContracts(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }
  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.contractStockDetailDTOList) {
          data = result.contractStockDetailDTOList;
        } 
      }
      this.setTotalBottomRow(data);
    });
  }
  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'contractCode';
    // 需要统计的列数组
    const fields = ['quantityDj', 'quantitySy', 'quantityShipped', 'amountWithoutTax', 'taxAmount', 'quantityUnshipped', 'money','weight', 'quantity'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  /**
   * 加载合同
   * @param {string} CONTRACT_CODE  合同编码
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
   public loadContracts(
    CONTRACT_CODE: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.queryService
      .getContracts({})
      .subscribe(res => {
        this.gridViewContracts.data = res.data.content;
        this.gridViewContracts.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onRowSelectContracts(e: any) {
    this.salesCurContract.affiliatedContract = e.Value;
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
   * @param {string} cusName  客户名称
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadCustoms(
    cusName: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.queryService
      .getCustoms({
        cusName: cusName,
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
    this.salesCurContract.cusCode = data.cusCode;
    this.salesCurContract.cusAbbreviation = data.cusAbbreviation;
    this.salesCurContract.plantCode = data.plantCode;
    this.plantChange(null)
  }

  clearCus() {
    this.salesCurContract.cusCode = '';
    this.salesCurContract.cusAbbreviation = '';
    this.salesCurContract.plantCode = null;
    this.salesCurContract.plantName = null;
  }
  
  onPopupSelectTextChanged(event: any) {
    const cusName = event.Text.trim();
    if(cusName !== '') {
      this.queryService
      .getCustoms({
        cusName: cusName,
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

  /**
   * 分货明细弹出查询
   * @param {any} e
   */
   public searchSalesDistCurs(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadSalesDistCurs(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载分货明细
   * @param {string} batchCode  批号
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadSalesDistCurs(
    batchCode: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.queryService
      .getSaleDistDetaileds({
        batchCode: batchCode,
        contractCodeIsNull: 'Y', // 只显示合同号为空的数据
        stockSaleFlag: 'N',
        pageIndex: PageIndex,
        pageSize: PageSize,
      })
      .subscribe(res => {
        this.gridViewSalesDistCurs.data = res.data.content;
        this.gridViewSalesDistCurs.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onRowSelectSalesDistCurs(e: any) {
    this.setNewDetails(e.Row);
  }

  setNewDetails(data) {
    this.newDetail = Object.assign({}, data, {
      standards: data.spec,
      steelType: data.steelGrade,
      material: data.houbo
    });
  }

  clearNewDetails() {
    this.newDetail = {};
  }

  onSalesDistCursTextChanged(event: any) {
    const batchCode = event.Text.trim();
    if(batchCode !== '') {
      this.queryService
      .getSaleDistDetaileds({
        batchCode: batchCode,
        stockSaleFlag: 'N',
        contractCodeIsNull: 'Y' // 只显示合同号为空的数据
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.setNewDetails(res.data.content[0]);
        } else {
          this.clearNewDetails();
          this.msgSrv.info(this.appTranslationService.translate('该批号无效！'))
        }
      });
    } else {
      this.clearNewDetails();
    }
  }

  changeContract: any = {};
  save() {
    if(this.gridData.some(item => !item.prodName)) {
      this.msgSrv.warning(this.appTranslationService.translate('请先补充产品名称！'));
      return;
    }
    if(this.isChanging) {
      // 变更保存
      this.changeContract = Object.assign({}, this.salesCurContract, {
        contractCode: this.salesCurContract.contractCode + this.queryService.generateSerial(2),
        affiliatedContract: this.salesCurContract.contractCode,
        contractState: '10',
        salesDistDetailedDTOList: this.gridData.map(d => Object.assign({}, d, {
          standards: d.spec,
          steelType: d.steelGrade,
          material: d.houbo
        })),
        id: null
      });
      this.queryService.changeSave(this.changeContract).subscribe(res => {
        if(res.code === 200) {
          this.isChanging = false;
          if(this.isGridDataChange) {
            this.isGridDataChange = false;
          }
          // 更新状态
          this.salesCurContract.contractState = '60';
          // 跳转到新页面-》变更合同
          localStorage.setItem('SALES_CUR_CONTRACT_CODE', this.changeContract.contractCode);
          this.router.navigateByUrl(`/sale/salesCurContractDetail`);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    } else {
      // 普通保存
      const params = Object.assign({}, this.salesCurContract, {
        salesDistDetailedDTOList: this.gridData,
      })
      this.queryService.save(params).subscribe(res => {
        if(res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('保存成功'));
          this.query();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      })
    }
  }

  cancel() {
    if(this.isChanging) {
      this.isChanging = false;
    }
    if(this.isGridDataChange) {
      this.isGridDataChange = false;
    }
    this.initData();
  }

  change() {
    this.isChanging = true;
    this.salesCurContract.attachInfoId = '';
    this.salesCurContract.attachInfoPath = '';
  }

  applyAudit() {
    const id = this.salesCurContract.id;
    const contractCode = this.salesCurContract.contractCode;
    const businessType = this.salesCurContract.affiliatedContract ? 'change' : 'add';
    this.queryService.goToIdeCurContractFlow(
      id,
      {
        contractCode: contractCode,
        businessType: businessType
      }
    );
  }

  remove() {
    const ids = this.getGridSelectionKeys();
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的数据！'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.gridData = this.gridData.filter(item => !ids.includes(item.id));
        this.setTotalBottomRow(this.gridData);
        this.isGridDataChange = true;
      },
    });
  }

  add() {
    this.isVisible = true;
    this.newDetail = {};
  }

  handleOk() {
    this.gridData.push(this.newDetail);
    this.gridApi.setRowData(this.gridData);
    this.setTotalBottomRow(this.gridData);
    this.isVisible = false;
    this.isGridDataChange = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'material', options: this.materialOptions },
    { field: 'prodName', options: this.prodNameOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    if(this.queryParams.values.contractCode) {
      this.queryService.queryWithDetailsByContractCode(this.queryParams.values.contractCode).subscribe(res => {
        if(res.code === 200) {
          this.excelexport.export(res.data.contractStockDetailDTOList || []);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      })
    }
  }
}