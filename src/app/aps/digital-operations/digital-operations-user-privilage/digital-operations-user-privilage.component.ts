import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ModalHelper } from '@delon/theme';
import { MessageManageService } from 'app/modules/generated_module/services/message-manage-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { DigitalOperationsService } from '../digital-operations-service';
import { deepCopy } from '@delon/util';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'digital-operations-user-privilage',
  templateUrl: './digital-operations-user-privilage.component.html',
  styleUrls: ['./digital-operations-user-privilage.component.css'],
})
export class DigitalOperationsUserPrivilageComponent extends CustomBaseContext implements OnInit {
  constructor(public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public messageManageService: MessageManageService,
    public appTranslationService: AppTranslationService,
    public modalService: NzModalService,
    public appGridStateService: AppGridStateService,
    public appConfigService: AppConfigService,
    public digitalOperationsService: DigitalOperationsService,
    public commonQuerySrv: CommonQueryService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService, appGridStateService: appGridStateService });
  }

  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  public users = []; // 用户
  public gridOptions_plants: any; // 工厂
  public kpi_plants_cols = []; // 工厂
  public gridOptions_division: any; // 维度
  public kpi_division_cols = []; // 维度
  public kpi_forms = []; // 报表
  public gridOptions_userPrivilage: any; // 用户权限
  public kpi_user_privilage_cols = []; // 维度关联报表的aggrid列定义
  public selectedPlant = ''; // 选中的工厂
  public selectedDivision = ''; // 选中的维度
  public selectedUserName = ''; // 选中的用户名

  ngOnInit() {
    this.queryUser();
    this.queryForms();
    // 工厂
    this.initPlantAgOptions();
    this.initPlantCols();
    // 维度
    this.initDivisionAgOptions();
    this.initDivisionCols();
    // 维度报表
    this.initUserPrivilageAgOptions();
    this.initUserPrivilageCols();
  }

  /**查询用户 */
  queryUser() {
    this.commonQuerySrv.GetUserInfos().subscribe(result => {
      result.data.forEach(d => {
        this.users.push({
          label: d.userName,
          value: d.userName,
        });
      });
    });
  }

  /**查询报表 */
  queryForms() {
    this.digitalOperationsService.GetLookupByTypeLang('KPI_REPORTS', this.appConfigService.getLanguage()).subscribe(res => {
      console.log(res.Extra, 'res.Extra');
      if (!this.isNull(res.Extra)) {
        res.Extra.forEach(element => {
          this.kpi_forms.push({
            code: element.lookupCode,
            text: element.meaning,
          });
        });
      }
    });
  }

  /**初始化aggrid的选项 */
  initPlantAgOptions() {
    this.gridOptions_plants = Object.assign(deepCopy(this.gridOptions), {
      rowSelection: 'single' /* 行多选/单选 */,
      suppressRowClickSelection: true /* 启用行单击选择 */,
      onRowSelected: function (e) {
        if (e.node.selected) {
          this.context.selectedPlant = e.data.plantCode;
          this.context.queryUserPrivilage();
        }
      },
      onGridReady: function (e) {
        e.api.hideOverlay();
        this.context.gridOptions_plants.gridApi = e.api;
        this.context.queryPlant();
      },
    });
  }

  /**初始化维度的grid */
  initPlantCols() {
    this.kpi_plants_cols = [
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
        headerName: this.appTranslationService.translate('工厂'),
        field: 'plantCode',
        sortable: true,
        menuTabs: ['filterMenuTab'],
      },
    ];
  }

  /**查询工厂 */
  queryPlant() {
    this.commonQuerySrv.GetAllPlant('').subscribe(res => {
      this.gridOptions_plants.rowData = [];
      res.data.forEach(item => {
        this.gridOptions_plants.rowData.push(item);
      });
    });
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
          this.context.queryUserPrivilage();
        }
      },
      onGridReady: function (e) {
        e.api.hideOverlay();
        this.context.gridOptions_division.gridApi = e.api;
        this.context.queryDivision();
      },
    });
  }

  /**查询维度 */
  queryDivision() {
    this.gridOptions_division.gridApi.showLoadingOverlay();
    this.digitalOperationsService.queryDivision().subscribe(res => {
      this.gridOptions_division.gridApi.hideOverlay();
      this.gridOptions_division.rowData = res.data;
    });
  }

  /**查询维度 */
  queryFormsDivision(divisionName: string) {
    this.loading = true;
    this.digitalOperationsService.queryFormsDivision({ formsDivision: divisionName }).subscribe(res => {
      this.loading = false;
      const formDivision = [];
      if (res.data) {
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
    });
  }

  /**查询用户权限 */
  queryUserPrivilage() {
    console.log(this.selectedDivision, this.selectedUserName, this.selectedPlant, 'selected_plant');
    if (!this.selectedDivision || !this.selectedUserName || !this.selectedPlant) {
      return;
    }
    this.loading = true;
    this.digitalOperationsService.queryUserPrivilage({ formsDivision: this.selectedDivision, userName: this.selectedUserName, plantCode: this.selectedPlant }).subscribe(res => {
      this.loading = false;
      const formDivision = [];
      if (res.data) {
        res.data.forEach(element => {
          element.checked = element.sensitiveColumn === 'Y';
          for (let index = 0; index < this.kpi_forms.length; index++) {
            const form = this.kpi_forms[index];
            if (form.code === element.selectedReports) {
              element.text = form.text;
              formDivision.push(element);
              break;
            }
          }
        });
      }
      const api2 = this.gridOptions_userPrivilage.gridApi;
      this.gridOptions_userPrivilage.rowData = formDivision;
      api2.setRowData(formDivision);
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
    ];
  }

  /**初始化aggrid的选项 */
  initUserPrivilageAgOptions() {
    this.gridOptions_userPrivilage = deepCopy(this.gridOptions);
    this.gridOptions_userPrivilage.onGridReady = e => {
      e.api.hideOverlay();
      this.context.gridOptions_userPrivilage.gridApi = e.api;
    };
  }

  /**切换工厂 */
  onChangePlant(e: any) {
    this.queryUserPrivilage();
  }

  /**保存用户权限 */
  saveKpiUserPrivilage() {
    if (!this.selectedDivision) {
      this.msgSrv.error(this.appTranslationService.translate('请选中报表维度'));
      return;
    }
    this.loading = true;
    const rowData = this.gridOptions_userPrivilage.rowData;
    const data = [];
    rowData.forEach(element => {
      console.log(element, 'element');
      data.push({
        formsDivision: this.selectedDivision,
        selectedReports: element.selectedReports,
        userName: this.selectedUserName,
        plantCode: this.selectedPlant,
        sensitiveColumn: element.checked ? 'Y' : 'N',
      });
    });
    this.digitalOperationsService.saveUserPrivilage(data).subscribe(res => {
      this.loading = false;
      this.gridOptions_division.gridApi.hideOverlay();
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '保存成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '操作失败！'));
      }
    });
  }

  /**初始化维度的grid */
  initUserPrivilageCols() {
    this.kpi_user_privilage_cols = [
      {
        headerName: this.appTranslationService.translate('报表名称'),
        field: 'text',
        sortable: true,
        menuTabs: ['filterMenuTab'],
      },
      {
        headerName: '是否显示敏感列',
        field: 'sensitiveColumn',
        width: 150,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate1,
        },
        menuTabs: ['filterMenuTab'],
      },
    ];
  }
}
