import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
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
import { PlanscheduleHWContractEditComponent } from "./edit/edit.component";
import { PlanscheduleHWContractModifyComponent } from "./modify/modify.component";
import { PlanscheduleHWContractCancelComponent } from "./cancel/cancel.component";
import { PlanscheduleHWContractService } from "./query.service";
import { PlanscheduleHWContractSplitComponent } from "./split/split.component";
import { decimal } from "@shared";


@Component({
  selector: 'planschedule-hw-contract',
  templateUrl: './contract.component.html',
  providers: [PlanscheduleHWContractService]
})
export class PlanscheduleHWContractComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: PlanscheduleHWContractService,
    public http: _HttpClient,
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
  productCategoryOptions = [];
  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 130,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
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
      field: 'cusAbbreviation',
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
      headerName: '数量（张）'
    },
    {
      field: 'weightTon',
      width: 120,
      headerName: '重量（吨）'
    },
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
      field: 'quantityShipped',
      width: 120,
      headerName: '已发量'
    },
    {
      field: 'quantityUnshipped',
      width: 120,
      headerName: '剩余量'
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
      field: 'priceTime',
      width: 120,
      headerName: '计价日期'
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
      { field: 'contractType', title: '合同类型', ui: { type: UiType.select, options: this.contractTypeOptions } },
      { field: 'affiliatedContract', title: '所属合同', ui: { type: UiType.text, } },
      { field: 'cusAbbreviation', title: '客户简称', ui: { type: UiType.text, } },
      { field: 'signingDate', title: '签订日期', ui: { type: UiType.date, } },
      { field: 'affiliatedMonth', title: '合同所属月份', ui: { type: UiType.monthPicker, } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.contractSteelTypeOptions } },
    ],
    values: {
      contractCode: '',
      affiliatedContract: '',
      contractState: null,
      contractType: null,
      cusAbbreviation: '',
      signingDate: '',
      affiliatedMonth: '',
      plantCode: this.appconfig.getActivePlantCode(),
      steelType: null,
    }
  };

  clear() {
    this.queryParams.values = {
      contractCode: '',
      affiliatedContract: '',
      contractState: null,
      contractType: null,
      cusAbbreviation: '',
      signingDate: '',
      affiliatedMonth: '',
      plantCode: this.appconfig.getActivePlantCode(),
      steelType: null,
    };
  }
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
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
    this.queryService.GetLookupByType('PS_PRODUCT_CATEGORY').subscribe(res => {
      if(res.Success && res.Extra && res.Extra.length > 0) {
        res.Extra.forEach(d => {
          this.productCategoryOptions.push({
            label: d.meaning,
            value: d.lookupCode,
            attribute2: d.attribute2,
          });
        });
      }
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
      affiliatedContract: this.queryParams.values.affiliatedContract,
      contractState: this.queryParams.values.contractState,
      contractType: this.queryParams.values.contractType,
      cusAbbreviation: this.queryParams.values.cusAbbreviation,
      plantCode: this.queryParams.values.plantCode,
      steelType: this.queryParams.values.steelType,
      signingDate: this.queryService.formatDate(this.queryParams.values.signingDate),
      affiliatedMonth: affiliatedMonth,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport
    }
  }

  add(dataItem?:any) {
    this.modal
    .static(
      PlanscheduleHWContractEditComponent,
      { i: (dataItem !== undefined ? dataItem : { id: null }) },
    )
    .subscribe((value) => {
      this.query();
    });
  }

  /**
   * 启用定金计算
   * @param dataItem
   */
  calculationDeposit(dataItem) {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要启用定金计算吗？'),
      nzOnOk: () => {
        this.queryService.calculationDeposit(dataItem.id, 'Y').subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
   
  }

  splitContract(dataItem) {
    this.modal.static(
      PlanscheduleHWContractSplitComponent,
      { sourceContract: dataItem },
    ).subscribe((value) => {
      this.query();
    })
  }

  contractClose(dataItem) {
    this.queryService.contractClose(dataItem.id, '110').subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  contractReopen(dataItem) {
    this.queryService.contractReopen(dataItem.id, '30').subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  modify(dataItem) {
    this.modal.static(
      PlanscheduleHWContractModifyComponent,
      { sourceContract: dataItem },
    ).subscribe((value) => {
      this.query();
    });
  }

  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if(dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要删除吗？'),
          nzOnOk: () => {
            this.delete(ids);
          },
        });
      } else {
        this.delete(ids);
      }
    }
  }

  delete(ids) {
    this.queryService.delete(ids).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  isVisible: boolean = false;
  plantCode = this.appconfig.getActivePlantCode();
  productCategory: string;
  
  refresh() {
    this.isVisible = true;
  }
  
  handleOk() {
    this.queryService.refresh(this.plantCode, this.productCategory).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.isVisible = false;
        this.plantCode = this.appconfig.getActivePlantCode();
        this.productCategory = null;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  handleCancel() {
    this.isVisible = false;
    this.plantCode = this.appconfig.getActivePlantCode();
    this.productCategory = null;
  }

  refreshSend () {
    const gridSelectRows = this.gridApi.getSelectedRows();
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要刷新吗？'),
      nzOnOk: () => {
        let contractIdList = gridSelectRows.map(item => item.id)
        let data:any = {}
        if (contractIdList.length) {
          data.contractIdList = contractIdList
        }
        this.queryService.refreshSend(data).subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  // 已完结状态：合同已分货量未超过合同可交最大上限值（合同重量+产品大类对应ATTRIBUTE2），需有手动打开合同的按钮
  verifyOpenManual(dataItem) {
    if(dataItem.contractState !== '110') {
      return false;
    }
    const productCategory = this.productCategoryOptions.find(d => d.value === dataItem.categoryCode);
    if(!productCategory) {
      return false;
    }
    if(decimal.minus(decimal.minus(dataItem.quantityDj, dataItem.weightTon), productCategory.attribute2) <= 0) {
      return true;
    }
    return false;
  }

  contractOpenManual(dataItem) {
    this.queryService.contractOpenManual(dataItem.id).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  download(dataItem) {
    this.queryService.pageDownload('down', dataItem);
  }

  preview(dataItem) {
    this.queryService.pageDownload('pre', dataItem);
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
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
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
    const fields = ['quantityDj', 'quantitySy', 'quantityShipped', 'quantityUnshipped', 'money', 'weightTon', 'quantity', 'deposit'];
    super.setTotalBottomRow(data, totalField, fields);
  }
  showChangeDetail(dataItem) {
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: 'ps_contract_modify_record',
          myAgGridRowKey: 'PS_CONTRACT_MODIFY_RECORD',
        },
        queryParamsValue: {
          contractCode: dataItem.contractCode,
        },
        exportFileName: '合同信息',
        tableColumns: this.columns.filter(col => col.colId === undefined),
        tableExpColumnsOptions: this.expColumnsOptions,
        isShowQuery: false,
        isShowExport: false,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }

  cancelContract(dataItem) {
    this.modal.static(
      PlanscheduleHWContractCancelComponent,
      { sourceContract: dataItem },
    ).subscribe((value) => {
      this.query();
    });
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }
}
