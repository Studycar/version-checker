import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { CustomerComplaintDetailComponent } from "./detail/detail.component";
import { CustomerComplaintEditComponent } from "./edit/edit.component";
import { CustomerComplaintQueryService } from "./query.service";
import { ActivatedRoute } from '@angular/router';
import { CustomerComplaintImportComponent } from "./import/import.component";
import { PlanscheduleHWChangeDetailComponent } from 'app/modules/base_module/components/change-detail/change-detail.component';

@Component({
  selector: 'customer-complaint',
  templateUrl: './customer-complaint.component.html',
  providers: [CustomerComplaintQueryService]
})
export class CustomerComplaintComponent extends CustomBaseContext implements OnInit {

  isResolve: boolean = false;
  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerComplaintQueryService,
    private router: ActivatedRoute,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    if(this.router.snapshot.data.isResolve) {
      this.isResolve = true;
    }
  }

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
      field: 'orno',
      width: 120,
      headerName: '客诉申请单号'
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'dlslxr',
      width: 120,
      headerName: '代理商联系人',
    },
    {
      field: 'lxdh',
      width: 120,
      headerName: '联系电话',
    },
    {
      field: 'receiveCnaps',
      width: 120,
      headerName: '收款银行联行号',
    },
    {
      field: 'receiveAccountName',
      width: 120,
      headerName: '收款银行名称',
    },
    {
      field: 'receiveAccountNo',
      width: 120,
      headerName: '收款银行账户',
    },
    {
      field: 'receiveBankName',
      width: 120,
      headerName: '收款账户户名',
    },
    {
      field: 'personnel',
      width: 120,
      headerName: '对公标识',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'ksdt',
      width: 120,
      headerName: '客诉日期',
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '选择处理公司',
    },
    {
      field: 'clzt',
      width: 120,
      headerName: '处理状态',
      valueFormatter: 'ctx.optionsFind(value,1).label'
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
  clztOptions: any[] = []; // PS_KSCLZT
  plantOptions: any[] = [];
  personnelOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.clztOptions;
        break;
      case 2:
        options = this.personnelOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '选择处理公司', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'orno', title: '客诉申请单号', ui: { type: UiType.text } },
      { field: 'cusCode', title: '客户名称', ui: { type: UiType.text } },
      { field: 'dlslxr', title: '代理商联系人', ui: { type: UiType.text } },
      { field: 'ksdt', titshile: '客诉日期', ui: { type: UiType.date } },
    ],
    values: {
      orno: '',
      cusCode: '',
      plantCode: this.appconfig.getActivePlantCode(),
      dlslxr: '',
      ksdt: '',
    }
  };

  clear() {
    this.queryParams.values = {
      orno: '',
      cusCode: '',
      plantCode: this.appconfig.getActivePlantCode(),
      dlslxr: '',
      ksdt: '',
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions()
  }

  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_KSCLZT': this.clztOptions,
      'PS_PERSONNEL': this.personnelOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  })

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
    )
  }

  getQueryParamsValue(isExport=false) {
    return {
      orno: this.queryParams.values.orno,
      ksdt: this.queryService.formatDate(this.queryParams.values.ksdt),
      plantCode: this.queryParams.values.plantCode,
      cusCode: this.queryParams.values.cusCode,
      dlslxr: this.queryParams.values.dlslxr,
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      CustomerComplaintEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }
  
  /**
   * 提交审批
   */
  apply(dataItem?: any) {
    // 客诉申请提交流程P9
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if(dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要提交审批吗？'),
          nzOnOk: () => {
            this.applyData(ids);
          },
        });
      } else {
        this.applyData(ids);
      }
    }
    
  }

  applyData(ids) {
    this.queryService.submit(ids).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('提交成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
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

  import() {
    this.modal.static(
      CustomerComplaintImportComponent,
      {
        options: {
        }
      },
      'md'
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  showDetail(dataItem) {
    this.modal.static(
      CustomerComplaintDetailComponent,
      {
        orno: dataItem.orno,
        isResolve: this.isResolve,
        complaintItem: dataItem
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  showHistoryRecord(dataItem) {
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryHistoryUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: 'ps_complaint_history',
          myAgGridRowKey: 'PS_COMPLAINT_HISTORY',
        },
        queryParamsValue: {
          orno: dataItem.orno,
        },
        exportFileName: '客诉',
        tableColumns: [
          {
            field: 'zxdz',
            headerName: '执行动作',
            width: 100
          },
          ...this.columns.filter(col => col.colId === undefined),
        ],  
        tableExpColumnsOptions: this.expColumnsOptions,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }

  expColumnsOptions = [
    { field: 'clzt', options: this.clztOptions },
  ]
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
