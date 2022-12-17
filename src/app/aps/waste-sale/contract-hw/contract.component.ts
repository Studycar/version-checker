import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { PlanscheduleHWContractService } from "./query.service";


@Component({
  selector: 'planschedule-hw-contract',
  templateUrl: './contract.component.html',
  providers: [PlanscheduleHWContractService]
})
export class PlanscheduleHWContractWasteComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: PlanscheduleHWContractService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  /**客户状态类型 */
  contractStateOptions = [];
  contractTypeOptions = [];
  contractSteelTypeOptions = [];
  contractSurfaceOptions = [];
  materialOptions = [];
  prodNameOptions = [];
  wasteContractStates = [];
  columns = [
    // {
    //   colId: 0,
    //   field: '',
    //   headerName: '操作',
    //   width: 130,
    //   pinned: this.pinnedAlign,
    //   lockPinned: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate,
    //   },
    //   cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
    //   cellRendererParams: {
    //     customTemplate: null, // Complementing the Cell Renderer parameters
    //   },
    // },
    // {
    //   colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
    //   checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate
    //   }
    // },
    {
      field: 'contractCode',
      width: 120,
      headerName: '合同编号'
    },
    {
      field: 'contractState',
      width: 120,
      headerName: '合同状态',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'contractType',
      width: 120,
      headerName: '合同类型',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'affiliatedContract',
      width: 120,
      headerName: '所属合同'
    },
    {
      field: 'cusCode',
      headerName: '客户编码',
      width: '100'
    },
    {
      field: 'attribute4',
      headerName: '客户简称',
      width: '100'
    },
    {
      field: 'signingDate',
      width: 120,
      headerName: '签订日期',
    },
    {
      field: 'affiliatedMonth',
      width: 120,
      headerName: '合同所属月份'
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'standards',
      width: 120,
      headerName: '规格',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'basePrice',
      width: 120,
      headerName: '基价'
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量'
    },
    // {
    //   field: 'weightTon',
    //   width: 120,
    //   headerName: '重量（吨）'
    // },
    {
      field: 'money',
      width: 120,
      headerName: '金额'
    },
    {
      field: 'remarks',
      width: 120,
      headerName: '锁价备注'
    },
    {
      field: 'deposit',
      width: 120,
      headerName: '锁价定金'
    },
    {
      field: 'depositRatio',
      width: 120,
      headerName: '定金比例（%）'
    },
    {
      field: 'plantCode',
      width: 200,
      headerName: '供方',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'prodName',
      width: 120,
      headerName: '产品名称',
      valueFormatter: 'ctx.optionsFind(value,6).label',
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
      field: 'surfaceState',
      width: 120,
      headerName: '表面状态'
    },
    {
      field: 'deliveryDate',
      width: 120,
      headerName: '交货日期'
    },
    {
      field: 'deliveryPlace',
      width: 120,
      headerName: '交货地点'
    },
    {
      field: 'cusContractCode',
      width: 120,
      headerName: '客户合同号'
    },
    {
      field: 'signPlace',
      width: 120,
      headerName: '签订地点'
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
      field: 'attribute3',
      width: 120,
      headerName: '存货编码'
    },
    {
      field: 'attribute5',
      width: 120,
      headerName: '等级'
    },
    // {
    //   field: 'rebateMarkup',
    //   width: 120,
    //   headerName: '返利加价'
    // },
    {
      field: 'material',
      width: 120,
      headerName: '厚/薄料',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'changeRemarks',
      width: 120,
      headerName: '变更备注'
    },
    {
      field: 'reason',
      width: 120,
      headerName: '驳回原因'
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建日期'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新日期'
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
        options = this.contractSteelTypeOptions;
        break;
      case 2:
        options = this.contractSurfaceOptions;
        break;
      case 3:
        options = this.contractStateOptions;
        break;
      case 4:
        options = this.contractTypeOptions;
        break;
      case 5:
        options = this.materialOptions;
        break;
      case 6:
        options = this.prodNameOptions;
        break;
      case 7:
        options = this.plantOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  // 绑定客户
  public gridViewContracts: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsContracts: any[] = [
    {
      field: 'cusCode',
      title: '合同编码',
      width: '100'
    },
    {
      field: 'cusName',
      title: '客户名称',
      width: '100'
    }
  ];
  plantOptions = [];
  queryParams = {
    defines: [
      { field: 'plantCode', title: '供方', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'contractCode', title: '合同编号', ui: { type: UiType.text } },
      { field: 'contractState', title: '合同状态', ui: { type: UiType.select, options: this.contractStateOptions } },
      // { field: 'contractType', title: '合同类型', ui: { type: UiType.select, options: this.contractTypeOptions } }, 
      { field: 'attribute4', title: '客户简称', ui: { type: UiType.text, } }, 
      { field: 'signingDate', title: '签订日期', ui: { type: UiType.date, } },
      { field: 'affiliatedMonth', title: '合同所属月份', ui: { type: UiType.monthPicker, } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.contractSteelTypeOptions } },
    ],
    values: {
      contractCode: '',
      contractState: null,
      contractType: null,
      attribute4: '',
      signingDate: '',
      affiliatedMonth: '',
      plantCode: this.appconfig.getActivePlantCode(),
      steelType: null,
    }
  };

  clear() {
    this.queryParams.values = {
      contractCode: '',
      contractState: null,
      contractType: null,
      attribute4: '',
      signingDate: '',
      affiliatedMonth: '',
      plantCode: this.appconfig.getActivePlantCode(),
      steelType: null,
    };
  }
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STATE': this.contractStateOptions,
      'PS_CONTRACT_TYPE': this.contractTypeOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_PROD_NAME': this.prodNameOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
      'HOUBO': this.materialOptions,
    });
    await this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    );
  }

  getQueryParamsValue(isExport=false) {
    const affiliatedMonth = this.queryParams.values.affiliatedMonth ? this.queryService.formatDateTime2(this.queryParams.values.affiliatedMonth, 'yyyy-MM') : '';
    return {
      contractCode: this.queryParams.values.contractCode,
      contractState: this.queryParams.values.contractState,
      contractType: this.queryParams.values.contractType,
      attribute4: this.queryParams.values.attribute4,
      plantCode: this.queryParams.values.plantCode,
      steelType: this.queryParams.values.steelType,
      signingDate: this.queryService.formatDate(this.queryParams.values.signingDate),
      affiliatedMonth: affiliatedMonth,
      contractFlag: 'N',
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport
    }
  }

  expColumnsOptions: any[] = [
    { field: 'contractState', options: this.contractStateOptions },
    { field: 'contractType', options: this.contractTypeOptions },
    { field: 'steelType', options: this.contractSteelTypeOptions },
    { field: 'surface', options: this.contractSurfaceOptions },
    { field: 'material', options: this.materialOptions },
    { field: 'prodName', options: this.prodNameOptions },
    { field: 'plantCode', options: this.plantOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.exportFile();
  }

  exportFile() {
    this.queryService.exportAction(
      this.httpAction,
      this.getQueryParamsValue(true),
      this.excelexport,
      this.context
    );
  }
  
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }
}