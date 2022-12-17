import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MessageManageService } from 'app/modules/generated_module/services/message-manage-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { DigitalOperationsService } from '../digital-operations-service';
import { deepCopy } from '@delon/util';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'digital-operations-form-division',
  templateUrl: './digital-operations-form-division.component.html',
  styleUrls: ['./digital-operations-form-division.component.css'],
})
export class DigitalOperationsFormDivisionComponent extends CustomBaseContext implements OnInit {
  @ViewChild('kpi_division_customTemplate', { static: true }) kpi_division_customTemplate: TemplateRef<any>;

  /**报表维度输入框 */
  public kpiDivision: any = { formsDivision: '' }; // 维度值对象
  public loading = false; // 是否加载中
  public selectedDivision: string; // 选中的维度
  public gridOptions_division: any; // 维度
  public gridOptions_forms: any; // 报表
  public gridOptions_formsDivision: any; // 报表
  public kpi_division_cols = []; // 维度的aggrid列定义
  public kpi_forms_cols = []; // 报表的aggrid列定义
  public kpi_forms_division_cols = []; // 维度关联报表的aggrid列定义
  public kpi_forms = []; // 报表

  constructor(public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public messageManageService: MessageManageService,
    public appTranslationService: AppTranslationService,
    public modalService: NzModalService,
    public appGridStateService: AppGridStateService,
    public appConfigService: AppConfigService,
    public digitalOperationsService: DigitalOperationsService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService, appGridStateService: appGridStateService });
  }

  ngOnInit() {
    // 维度
    this.initDivisionAgOptions();
    this.initDivisionCols();
    // 报表
    this.initFormsAgOptions();
    this.initFormsCols();
    // 维度关联报表
    this.initFormsDivisionAgOptions();
    this.initFormsDivisionCols();
  }

  /**初始化aggrid的选项 */
  initDivisionAgOptions() {
    this.gridOptions_division = Object.assign(deepCopy(this.gridOptions), {
      rowSelection: 'single' /* 行多选/单选 */,
      suppressRowClickSelection: true /* 启用行单击选择 */,
      onRowSelected: function (e) {
        console.log(e, 'e');
        if (e.node.selected) {
          this.context.selectedDivision = e.data.formsDivision;
          this.context.queryFormsDivision(e.data.formsDivision);
        }
      },
      onGridReady: function (e) {
        e.api.hideOverlay();
        this.context.gridOptions_division.gridApi = e.api;
        this.context.queryDivision();
      },
    });
  }

  /**初始化维度的grid */
  initDivisionCols() {
    this.kpi_division_cols = [
      {
        field: 'check',
        headerName: '',
        width: 40,
        pinned: 'left',
        resizable: false,
        checkboxSelection: function (params) {
          return true;
        },
        headerCheckboxSelection: false,
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        headerName: this.appTranslationService.translate('报表维度'),
        field: 'formsDivision',
        sortable: true,
        menuTabs: ['filterMenuTab'],
      },
      {
        colId: 0,
        field: '',
        headerName: '操作',
        width: 90,
        pinned: this.pinnedAlign,
        lockPinned: true,
        headerComponentParams: {
          template: this.headerTemplate,
        },
        cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
        cellRendererParams: {
          customTemplate: this.kpi_division_customTemplate,
        },
      },
    ];
  }

  /**查询维度 */
  queryFormsDivision(divisionName: string) {
    this.loading = true;
    this.digitalOperationsService.queryFormsDivision({ formsDivision: divisionName }).subscribe(res => {
      this.loading = false;
      const formDivision = [];
      if (res.code === 200) {
        res.data.forEach(element => {
          for (let index = 0; index < this.kpi_forms.length; index++) {
            const form = this.kpi_forms[index];
            if (form.code === element.selectedReports) {
              formDivision.push(form);
              break;
            }
          }
        });
      }
      // 首先把待保存的移回到待选报表
      this.removeAllReport();
      // 同时，要把待选的报表移除
      this.addReports(formDivision);
    });
  }

  /**查询维度 */
  queryDivision() {
    this.selectedDivision = '';
    this.gridOptions_division.gridApi.showLoadingOverlay();
    this.digitalOperationsService.queryDivision().subscribe(res => {
      this.gridOptions_division.gridApi.hideOverlay();
      this.gridOptions_division.rowData = res.data;
    });
  }

  /**新增维度 */
  addDivision() {
    this.gridOptions_division.gridApi.showLoadingOverlay();
    console.log(this.kpiDivision, 'this.kpiDivision');
    this.digitalOperationsService.saveDivision(this.kpiDivision).subscribe(res => {
      this.gridOptions_division.gridApi.hideOverlay();
      if (res.code === 200) {
        this.kpiDivision.formsDivision = '';
        this.queryDivision();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '操作失败！'));
      }
    });
  }

  /**初始化aggrid的选项 */
  initFormsAgOptions() {
    this.gridOptions_forms = Object.assign(deepCopy(this.gridOptions), {
      onGridReady: function (e) {
        e.api.hideOverlay();
        this.context.gridOptions_forms.gridApi = e.api;
        this.context.queryForms();
      },
    });
  }

  /**初始化维度的grid */
  initFormsCols() {
    this.kpi_forms_cols = [
      {
        field: 'check',
        headerName: '',
        width: 40,
        pinned: 'left',
        resizable: false,
        checkboxSelection: function (params) {
          return true;
        },
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        headerName: this.appTranslationService.translate('待选报表'),
        field: 'text',
        sortable: true,
        menuTabs: ['filterMenuTab'],
      },
    ];
  }

  /**查询报表 */
  queryForms() {
    this.gridOptions_forms.gridApi.showLoadingOverlay();
    this.digitalOperationsService.GetLookupByTypeLang('KPI_REPORTS', this.appConfigService.getLanguage()).subscribe(res => {
      this.gridOptions_forms.gridApi.hideOverlay();
      console.log(res.Extra, 'res.Extra');
      res.Extra.forEach(element => {
        this.kpi_forms.push({
          code: element.lookupCode,
          text: element.meaning,
        });
      });
      this.gridOptions_forms.rowData = this.kpi_forms;
    });
  }

  /**初始化aggrid的选项 */
  initFormsDivisionAgOptions() {
    this.gridOptions_formsDivision = deepCopy(this.gridOptions);
    this.gridOptions_formsDivision.onGridReady = e => {
      e.api.hideOverlay();
      this.context.gridOptions_formsDivision.gridApi = e.api;
    };
  }

  /**初始化维度的grid */
  initFormsDivisionCols() {
    this.kpi_forms_division_cols = [
      {
        field: 'check',
        headerName: '',
        width: 40,
        pinned: 'left',
        resizable: false,
        checkboxSelection: function (params) {
          return true;
        },
        headerCheckboxSelection: false,
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        headerName: this.appTranslationService.translate('已选报表'),
        field: 'text',
        sortable: true,
        menuTabs: ['filterMenuTab'],
      },
    ];
  }

  /**删除维度 */
  deleteDivision(divisionName: string) {
    this.loading = true;
    this.digitalOperationsService.deleteDivision({ formsDivision: divisionName }).subscribe(res => {
      this.loading = false;
      this.gridOptions_division.gridApi.hideOverlay();
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '删除成功'));
        this.queryDivision();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '删除失败！'));
      }
    });
    return;
  }

  /**保存 */
  saveFormDivision() {
    if (!this.selectedDivision) {
      this.msgSrv.error(this.appTranslationService.translate('请选中报表维度'));
      return;
    }
    const rowData = this.gridOptions_formsDivision.rowData;
    if (!rowData || rowData.length === 0) {
      // 这种情况下是执行删除的
      this.loading = true;
      this.digitalOperationsService.deleteFormsDivision({ formsDivision: this.selectedDivision }).subscribe(res => {
        this.loading = false;
        this.gridOptions_division.gridApi.hideOverlay();
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg || '保存成功'));
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg || '操作失败！'));
        }
      });
      return;
    }
    this.loading = true;
    const data = [];
    rowData.forEach(element => {
      console.log(element, 'element');
      data.push({
        formsDivision: this.selectedDivision,
        selectedReports: element.code,
      });
    });
    this.digitalOperationsService.saveFormsDivision(data).subscribe(res => {
      this.loading = false;
      this.gridOptions_division.gridApi.hideOverlay();
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '保存成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '操作失败！'));
      }
    });
  }

  /**添加报表 */
  addSelectedReport() {
    const selectedFormRows = this.context.gridOptions_forms.gridApi.getSelectedRows();
    this.addReports(selectedFormRows);
  }

  /**添加所有 */
  addAllReport() {
    this.addReports(this.context.gridOptions_forms.rowData);
  }

  /** 添加报表 */
  addReports(formRows: any) {
    if (this.isNull(formRows)) {
      return;
    }

    this.gridOptions_formsDivision.rowData = this.gridOptions_formsDivision.rowData || [];
    formRows.forEach(element => {
      console.log(element, 'element');
      this.gridOptions_formsDivision.rowData.push(element);
    });
    // 添加到待保存的队列中
    const api = this.gridOptions_formsDivision.gridApi;
    api.setRowData(this.gridOptions_formsDivision.rowData);
    // 从待选队列中移除数据
    const api2 = this.gridOptions_forms.gridApi;
    const newData = this.gridOptions_forms.rowData.filter(function (val, index, arr) {
      // 被选中的记录itemIndex不为-1
      const itemIndex = formRows.findIndex(function (value) {
        return val.code === value.code;
      });
      return itemIndex === -1; // true的记录被留下，false的被过滤
    });
    this.gridOptions_forms.rowData = newData;
    api2.setRowData(newData);
  }

  /**移除报表 */
  removeReports(formRows: any) {
    if (this.isNull(formRows)) {
      return;
    }
    this.gridOptions_forms.rowData = this.gridOptions_forms.rowData || [];
    formRows.forEach(element => {
      console.log(element, 'element');
      this.gridOptions_forms.rowData.push(element);
    });
    // 恢复回待选的队列中
    const api = this.gridOptions_forms.gridApi;
    api.setRowData(this.gridOptions_forms.rowData);
    // 从待保存的队列中移除数据
    const api2 = this.gridOptions_formsDivision.gridApi;
    const newData = this.gridOptions_formsDivision.rowData.filter(function (val, index, arr) {
      // 被选中的记录itemIndex不为-1
      const itemIndex = formRows.findIndex(function (value) {
        return val.code === value.code;
      });
      return itemIndex === -1; // true的记录被留下，false的被过滤
    });
    this.gridOptions_formsDivision.rowData = newData;
    api2.setRowData(newData);
  }

  /**移除选中 */
  removeSelectedReport() {
    const selectedFormRows = this.context.gridOptions_formsDivision.gridApi.getSelectedRows();
    this.removeReports(selectedFormRows);
  }

  /**移除所有 */
  removeAllReport() {
    this.removeReports(this.context.gridOptions_formsDivision.rowData);
  }

}
