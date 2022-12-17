import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalComponent, NzModalService } from "ng-zorro-antd";
import { PlanscheduleHWCustomerNewEditComponent } from "../edit-new/edit.component";
// import { PlanscheduleHWCustomerEditComponent } from "../edit/edit.component";
import { PlanscheduleHWCustomerImportComponent } from "../import/import.component";
import { PlanscheduleHWCustomerService } from "../query.service";
// import { PlanscheduleHWCustomerStateChangeComponent } from "../state-change/change.component";
import { PlanscheduleHWCustomerTempCreditComponent } from "./temp-credit/temp-credit.component";
import { PlanscheduleHWCustomerDetailInfoChangeComponent } from "./detail-info-change/detail-info-change.component";
import { PlanscheduleHWCustomerAnnualTempCreditComponent } from "./annual-temp-credit/annual-temp-credit.component";

@Component({
  selector: 'planschedule-hw-customer-detail',
  templateUrl: './detail.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerDetailedComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public http: _HttpClient,
    private appconfig: AppConfigService,
    private router: Router,
    public queryService: PlanscheduleHWCustomerService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  isVisible: Boolean = false;
  header: any = null;

  /**客户状态类型 */
  cusStateOptions = [];
  cusGradeOptions = [];
  cusTypeOptions = [];
  regionOptions = [];
  domesticOptions = [];
  YesNoOptions = [];
  currencyOptions = [];

  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
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
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '所属公司'
    },
    {
      field: 'creditCus',
      width: 120,
      headerName: '信用单位'
    },
    {
      field: 'affiliatedCus',
      width: 120,
      headerName: '所属客户'
    },
    {
      field: 'cusState',
      width: 120,
      headerName: '客户状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cusGrade',
      width: 120,
      headerName: '客户等级',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'cusType',
      width: 120,
      headerName: '客户类型',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'cusName',
      width: 120,
      headerName: '客户名称'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
    },
    {
      field: 'taxNum',
      width: 120,
      headerName: '税号'
    },
    {
      field: 'contact',
      width: 120,
      headerName: '联系人'
    },
    {
      field: 'region',
      width: 120,
      headerName: '地区分类',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'address',
      width: 120,
      headerName: '地址'
    },
    {
      field: 'telNum',
      width: 120,
      headerName: '联系电话'
    },
    {
      field: 'bank',
      width: 120,
      headerName: '开户银行'
    },
    {
      field: 'bankNum',
      width: 120,
      headerName: '银行账号'
    },
    {
      field: 'bankArchives',
      width: 120,
      headerName: '银行档案'
    },
    {
      field: 'initialCredit',
      width: 120,
      headerName: '客户初始额度'
    },
    {
      field: 'domestic',
      width: 120,
      headerName: '是否国内',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'currency',
      width: 120,
      headerName: '币种',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      // field: 'creditSum',
      field: 'credit',
      width: 120,
      headerName: '信用额度'
    },
    {
      field: 'zyQuota',
      width: 120,
      headerName: '占用额度'
    },
    {
      field: 'temCreditSum',
      width: 120,
      headerName: '临时信用额度'
    },
    {
      field: 'annualCreditOngoing',
      width: 120,
      headerName: '年度额度审批中',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'applicationDateAnnual',
      width: 120,
      headerName: '年度额度通过时间'
    },
    {
      field: 'balance',
      width: 120,
      headerName: '账户余额'
    },
    {
      field: 'annex',
      width: 120,
      headerName: '附件信息',
      valueFormatter: 'ctx.formatAnnex(value)'
    },
    {
      field: 'salesmanCode',
      width: 120,
      headerName: '业务员编码',
    },
    {
      field: 'salesman',
      width: 120,
      headerName: '业务员',
    },
    {
      field: 'departmentCode',
      width: 120,
      headerName: '部门编码',
    },
    {
      field: 'department',
      width: 120,
      headerName: '分管部门',
    },
    {
      field: 'creditControl',
      width: 120,
      headerName: '是否控制信用额度',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'tax',
      width: 120,
      headerName: '税率'
    },
    {
      field: 'disableTime',
      width: 120,
      headerName: '停用时间'
    },
    {
      field: 'reason',
      width: 120,
      headerName: '驳回原因'
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
        options = this.cusStateOptions;
        break;
      case 2:
        options = this.cusGradeOptions;
        break;
      case 3:
        options = this.cusTypeOptions;
        break;
      case 4:
        options = this.regionOptions;
        break;
      case 5:
        options = this.domesticOptions;
        break;
      case 6:
        options = this.currencyOptions;
        break;
      case 7:
        options = this.YesNoOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  public formatAnnex(value) {
    return Object.values(JSON.parse(value)).map((doc: any) => `${doc.fileName || doc}`).join(', ');
  }

  // 绑定客户
  public gridViewCustoms: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsCustoms: any[] = [
    {
      field: 'cusCode',
      title: '客户编码',
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
      // { field: 'taxNum', title: '税号', ui: { type: UiType.text } },
      { field: 'cusName', title: '客户名称', ui: { type: UiType.text } },
      // { field: 'cusAbbreviation', title: '客户简称', ui: { type: UiType.text } },
      {
        field: 'affiliatedCus',
        title: '所属客户',
        ui: {
          type: UiType.text,
        },
      },
      { field: 'cusState', title: '客户状态', ui: { type: UiType.select, options: this.cusStateOptions } },
    ],
    values: {
      taxNum: '',
      cusName: '',
      cusAbbreviation: '',
      plantCode: null,
      affiliatedCus: '',
      cusState: null,
    }
  };

  clear() {
    this.queryParams.values = {
      taxNum: this.header.taxNum,
      cusName: '',
      cusAbbreviation: '',
      plantCode: null,
      affiliatedCus: '',
      cusState: null,
    };
  }
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    if(!this.header.taxNum) {
      this.columns.splice(0,1);
    }
    this.queryParams.values.taxNum = this.header.taxNum;
    this.getColumns();
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  // 获取动态列
  getColumns() {
    this.queryService.GetLookupByType('PS_CUS_CUSTOMIZATION').subscribe(res => {
      if(res.Success && res.Extra.length > 0) {
        this.columns.splice(this.columns.length - 4, 0, ...res.Extra.map(d => ({
          field: d.lookupCode,
          width: 120,
          headerName: d.meaning,
        })));
        this.gridApi.setColumnDefs(this.columns as any);
      }
    })
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CUSTOMER_STATUS': this.cusStateOptions,
      'PS_CUS_GRADE': this.cusGradeOptions,
      'CUS_TYPE': this.cusTypeOptions,
      'PS_CUS_DOMESTIC': this.domesticOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_CUS_REGION': this.regionOptions,
      'PS_YES_NOT': this.YesNoOptions,
    })
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    );
  }

  getQueryParamsValue(isExport=false) {
    const params = {
      taxNum: this.queryParams.values.taxNum,
      cusName: this.queryParams.values.cusName,
      cusState: this.queryParams.values.cusState || '',
      cusAbbreviation: this.queryParams.values.cusAbbreviation,
      plantCode: this.queryParams.values.plantCode || '',
      affiliatedCus: this.queryParams.values.affiliatedCus,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: isExport,
      isCusCodeNotNull: false,
    };
    return params;
  }

  add(dataItem?:any) {
    this.modal
    .static(PlanscheduleHWCustomerNewEditComponent, {
      i: (dataItem !== undefined ? dataItem : { id: null } ),
      head: (dataItem !== undefined ? { taxNum: null } : this.header )
    } )
    .subscribe((value) => {
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
   * @param {string} CUS_NAME  客户名称
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
   public loadCustoms(
    CUS_NAME: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.queryService
      .getCustoms({
        cusName: CUS_NAME,
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
    // this.queryParams.values.strCusCodeFrom.value = e.Value;
  }

  onPopupSelectTextChanged(event: any) {
    // const itemCode = event.Text.trim();
    // if(itemCode == '') {
    //   this.i.itemId = '';
    //   this.i.descriptions = '';
    //   this.i.unitOfMeasure = '';
    //   return;
    // }
    // // 加载物料
    // this.editService.getUserPlantItemPageList(plantCode, itemCode, '').subscribe(res => {
    //   if (res.data.content.length > 0) {
    //     this.i.itemId = res.data.content[0].itemId;
    //     this.i.descriptions = res.data.content[0].descriptionsCn;
    //     this.i.unitOfMeasure = res.data.content[0].unitOfMeasure;
    //   }
    // });
  }

  import() {
    this.modal
    .static(PlanscheduleHWCustomerImportComponent, {}, 'md')
    .subscribe(() => {
      this.query();
    });
  }

  expColumnsOptions: any[] = [
    { field: 'cusState', options: this.cusStateOptions },
    { field: 'cusGrade', options: this.cusGradeOptions },
    { field: 'cusType', options: this.cusTypeOptions },
    { field: 'region', options: this.regionOptions },
    { field: 'domestic', options: this.domesticOptions },
    { field: 'currency', options: this.currencyOptions },
    { field: 'creditControl', options: this.YesNoOptions },
    { field: 'annualCreditOngoing', options: this.YesNoOptions },
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

  queryLimit() {
    const cusCodes = [...this.gridApi.getSelectedRows().filter(item => item.cusState !== '60').map(item => ({
      cusCode: item.cusCode,
      plantCode: item.plantCode,
    }))];
    if(cusCodes.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选客户数据'));
      return;
    }
    this.queryService.queryLimit(cusCodes).subscribe(res => {
      if(res.code === 200) {
        this.context.gridApi.forEachLeafNode(node => {
          const index = res.data.findIndex(d => d.id === node.data.id);
          const data = node.data;
          if(index !== -1) {
            data.credit = res.data[index].credit;
            data.balance = res.data[index].balance;
            node.setData(data);
          }
        });
        this.msgSrv.success(this.appTranslationService.translate('更新成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  /**
   * 状态变更
   * 只有已确认状态下客户可以变更
   * @returns
   */
  // onCusStateChange(dataItem) {
  //   const cusStateNew = dataItem.cusState === '50' ? '70' : '50';
  //   let stateOption = this.cusStateOptions.find(d => d.value === cusStateNew) || { label: cusStateNew };
  //   const cusStateNewLabel = stateOption.label;
  //   this.modal.static(
  //     PlanscheduleHWCustomerStateChangeComponent,
  //     {
  //       stateChange: {
  //         id: dataItem.id,
  //         cusCode: dataItem.cusCode,
  //         reason: '',
  //         cusStateNew: cusStateNew
  //       },
  //       cusStateNewLabel: cusStateNewLabel
  //     },
  //     'md'
  //   ).subscribe(value => {
  //     if(value) {
  //       this.query();
  //     }
  //   })
  // }

  generateCreditTitle(dataItem) {
    const { temCreditCount, temCreditSum } = dataItem
    return `今日已提交临时额度审批 ${temCreditCount || 0} 笔，申请总额 ${temCreditSum || 0} 元，是否继续提交申请？`
  }

  openTempCredit(dataItem) {
    this.modal.static(
      PlanscheduleHWCustomerTempCreditComponent,
      {
        i: dataItem
      },
    ).subscribe(value => {
      // if(value) {
      //   this.query();
      // }
    })
  }

  openAnnualCredit(dataItem) {
    this.modal.static(
      PlanscheduleHWCustomerAnnualTempCreditComponent,
      {
        i: dataItem
      },
    ).subscribe(value => {
      // if(value) {
      //   this.query();
      // }
    })
  }

  openDetailInfoChangeModal(dataItem) {
    this.modal
    .static(
      PlanscheduleHWCustomerDetailInfoChangeComponent,
      {
        i: dataItem,
        head: { taxNum: null }
      }
    )
    .subscribe((value) => {
      // this.query();
    });
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }
}
