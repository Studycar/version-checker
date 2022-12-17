import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { RequisitionNoteDetailComponent } from "./detail/detail.component";
import { RequisitionNoteEditComponent } from "./edit/edit.component";
import { RequisitionNoteQueryService } from "./query.service";


@Component({
  selector: 'requisition-note',
  templateUrl: './requisition-note.component.html',
  providers: [RequisitionNoteQueryService]
})
export class RequisitionNoteComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    public queryService: RequisitionNoteQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
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
      field: 'requisitionNoteCode',
      width: 120,
      headerName: '转货单编号'
    },
    {
      field: 'transferState',
      width: 120,
      headerName: '转货单状态',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'transferCategory',
      width: 120,
      headerName: '转移类别',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'invoiceBillCode',
      width: 120,
      headerName: '发货单号',
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'summaryQuantity',
      width: 120,
      headerName: '汇总数量',
    },
    {
      field: 'carNumber',
      width: 120,
      headerName: '车牌号'
    },
    {
      field: 'requisitionDate',
      width: 120,
      headerName: '转货日期',
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码',
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
      field: 'distributionWarehouse',
      width: 120,
      headerName: '目的地'
    },
    {
      field: 'zhidan',
      width: 120,
      headerName: '制单'
    },
    {
      field: 'audit',
      width: 120,
      headerName: '审核'
    },
    {
      field: 'auditTime',
      width: 120,
      headerName: '审核时间'
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
  transferClassOptions: any[] = []; // PS_TRANSFER_CLASS
  transferStateOptions: any[] = []; // PS_TRANSFER_STATE
  plantOptions: any[] = []; // 
  productCategoryOptions: any[] = []; // 
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.transferStateOptions;
        break;
      case 2:
        options = this.transferClassOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'invoiceBillCode', title: '发货单号', ui: { type: UiType.text } },
      { field: 'dateRange', title: '转货日期', ui: { type: UiType.dateRange } },
    ],
    values: {
      invoiceBillCode: '',
      plantCode: this.appconfig.getActivePlantCode(),
      dateRange: [],
    }
  };

  clear() {
    this.queryParams.values = {
      invoiceBillCode: '',
      plantCode: this.appconfig.getActivePlantCode(),
      dateRange: [],
    }
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
      'PS_TRANSFER_CLASS': this.transferClassOptions,
      'PS_TRANSFER_STATE': this.transferStateOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
    this.productCategoryOptions.push(...await this.queryService.getUserProCates());
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
    )
  }

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values };
    params.requisitionDate = this.queryService.formatDate(this.queryParams.values.dateRange[0]);
    params.endRequisitionDate = this.queryService.formatDate(this.queryParams.values.dateRange[1]);
    delete params.dateRange;
    return {
      ...params,
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  isVisible: boolean = false;
  plantCode = this.appconfig.getActivePlantCode();
  productCategory: string;
  handleOk() {
    this.queryService.task(this.plantCode, this.productCategory).subscribe(res => {
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

  add(dataItem?: any) {
    this.modal.static(
      RequisitionNoteEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
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

  /**
   * 打开明细
   * @param dataItem 
   */
  showDetail(dataItem) {
    this.modal.static(
      RequisitionNoteDetailComponent,
      {
        requisitionNoteCode: dataItem.requisitionNoteCode,
        invoiceBillCode: dataItem.invoiceBillCode,
        distributionWarehouse: dataItem.distributionWarehouse,
      }
    ).subscribe(() => {})
  }

  /**
   * 打开修改记录
   * @param dataItem 
   */
   showChangeDetail(dataItem) {
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: 'ps_requisition_note_history',
          myAgGridRowKey: 'PS_REQUISITION_NOTE_HISTORY',
        },
        queryParamsValue: {
          requisitionNoteCode: dataItem.requisitionNoteCode,
        },
        exportFileName: '转货单',
        tableColumns: [{
          field: 'zxdz',
          headerName: '执行动作',
          width: 100
        }, ...this.columns.filter(col => col.colId === undefined)],
        tableExpColumnsOptions: this.expColumnsOptions,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

  expColumnsOptions: any[] = [
    { field: 'transferCategory', options: this.transferClassOptions },
    { field: 'transferState', options: this.transferStateOptions },
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
}
