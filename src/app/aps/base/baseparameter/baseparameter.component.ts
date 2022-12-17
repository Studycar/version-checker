/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:05
 * @LastEditors: Zwh
 * @LastEditTime: 2020-08-27 20:35:22
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State } from '@progress/kendo-data-query';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BaseParameterService } from '../../../modules/generated_module/services/base-parameter-service';
import { BaseBaseparameterEditComponent } from './edit/edit.component';
import { BaseBaseparameterViewComponent } from './view/view.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { QueryService } from './queryService';
import { BrandService } from 'app/layout/pro/pro.service';
// import 'ag-grid-enterprise';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import {BaseRespsBImportComponent} from '../baserespmanager/import/import.component';
import {BaseParameterImportComponent} from './import/import.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-baseparameter',
  templateUrl: './baseparameter.component.html',
  providers: [QueryService],
})
export class BaseBaseparameterComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  expandForm = false;
  public mySelection: any[] = [];
  public applicationOptions: any[] = [];
  public languageoptions: any[] = [];
  public start: String = '请选择';
  context = this;
  YesOrNo: any[] = [];
  currentlanguage: any;

  public queryParams = {
    defines: [
      {
        field: 'txtParameterCode',
        title: '参数编码',
        ui: { type: UiType.text },
      },
      {
        field: 'txtParameterName',
        title: '参数名称',
        ui: { type: UiType.text },
      },
      {
        field: 'txtParameterDesc',
        title: '参数描述',
        ui: { type: UiType.text },
      },
      {
        field: 'txtSysEnabledFlag',
        title: '系统级别生效',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
      {
        field: 'txtRegEnabledFlag',
        title: '事业部级别生效',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
      {
        field: 'txtPlantEnabledFlag',
        title: '组织级别生效',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
      {
        field: 'txtRespEnabledFlag',
        title: '职责级别生效',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
      {
        field: 'txtUserEnabledFlag',
        title: '用户级别生效',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
      {
        field: 'txtLanguage',
        title: '语言',
        ui: { type: UiType.select, options: this.languageoptions },
      },
      /*{
        field: 'StartRange',
        title: '生效时间范围',
        ui: { type: UiType.dateRange },
      },
      {
        field: 'EndRange',
        title: '失效时间范围',
        ui: { type: UiType.dateRange },
      },*/
    ],
    values: {
      txtParameterCode: '',
      txtParameterName: '',
      txtUserEnabledFlag: '',
      txtPlantEnabledFlag: '',
      txtParameterDesc: '',
      txtSysEnabledFlag: '',
      txtRegEnabledFlag: '',
      txtRespEnabledFlag: '',
      txtLanguage: this.appService.getLanguage(),
      // StartRange: [],
      // EndRange: [],
      StartBegin: '',
      StartEnd: '',
      EndBegin: '',
      EndEnd: '',
    },
  };

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 100,
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
      field: 'parameterCode',
      headerName: '参数编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'parameterName',
      headerName: '参数名称',
      tooltipField: 'parameterName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'applicationCode',
      headerName: '应用模块',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'description',
      headerName: '参数描述',
      tooltipField: 'description',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'sysEnabledFlag',
      headerName: '系统级别生效',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'regEnabledFlag',
      headerName: '事业部级别生效',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'plantEnabledFlag',
      headerName: '组织级别生效',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'respEnabledFlag',
      headerName: '职责级别生效',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'userEnabledFlag',
      headerName: '用户级别生效',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'startDate',
      headerName: '生效时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'endDate',
      headerName: '失效时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'language',
      headerName: '语言',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
  ];

  public clear() {
    this.queryParams.values = {
      txtParameterCode: '',
      txtParameterName: '',
      txtUserEnabledFlag: null,
      txtPlantEnabledFlag: null,
      txtParameterDesc: '',
      txtSysEnabledFlag: null,
      txtRegEnabledFlag: null,
      txtRespEnabledFlag: null,
      // StartRange: [],
      // EndRange: [],
      txtLanguage: this.appService.getLanguage(),
      StartBegin: null,
      StartEnd: null,
      EndBegin: null,
      EndEnd: null
    };
  }

  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      txtParameterCode: this.queryParams.values.txtParameterCode,
      txtParameterName: this.queryParams.values.txtParameterName,
      txtUserEnabledFlag: this.queryParams.values.txtUserEnabledFlag,
      txtPlantEnabledFlag: this.queryParams.values.txtPlantEnabledFlag,
      txtParameterDesc: this.queryParams.values.txtParameterDesc,
      txtSysEnabledFlag: this.queryParams.values.txtSysEnabledFlag,
      txtRegEnabledFlag: this.queryParams.values.txtRegEnabledFlag,
      txtRespEnabledFlag: this.queryParams.values.txtRespEnabledFlag,
      txtLanguage: this.queryParams.values.txtLanguage,
      StartBegin: null,
      StartEnd: null,
      EndBegin: null,
      EndEnd: null
    };
  }

  expColumns = [
    { field: 'parameterCode', title: '参数编码', width: 200, locked: true },
    { field: 'parameterName', title: '参数名称', width: 200, locked: true },
    { field: 'applicationCode', title: '应用模块', width: 200, locked: true },
    { field: 'description', title: '参数', width: 200, locked: true },
    {
      field: 'sysEnabledFlag',
      title: '系统级别生效',
      width: 200,
      locked: true,
    },
    {
      field: 'regEnabledFlag',
      title: '事业部级别生效',
      width: 200,
      locked: true,
    },
    {
      field: 'plantEnabledFlag',
      title: '组织级别生效',
      width: 200,
      locked: true,
    },
    {
      field: 'respEnabledFlag',
      title: '职责级别生效',
      width: 200,
      locked: true,
    },
    {
      field: 'userEnabledFlag',
      title: '用户级别生效',
      width: 200,
      locked: true,
    },
    { field: 'startDate', title: '生效时间', width: 200, locked: true },
    { field: 'endDate', title: '失效时间', width: 200, locked: true },
    { field: 'language', title: '语言', width: 200, locked: true },
    // { field: 'CACHE', title: '缓存', width: 200, locked: true },
  ];
  expColumnsOptions: any[] = [
    { field: 'applicationId', options: this.applicationOptions },
  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    this.editservice.exportAction(
      this.httpAction,
      this.getQueryParamsValue(),
      this.excelexport
    );
  }

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private editservice: QueryService,
    private baseparameterservice: BaseParameterService,
    public msgSrv: NzMessageService,
    public translateservice: AppTranslationService,
    public modalService: NzModalService,
    public appService: AppConfigService,
    private commonquery: CommonQueryService,
    private appGridStateService: AppGridStateService,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: translateservice,
      msgSrv: msgSrv,
      appConfigSrv: appService,
    });
    this.headerNameTranslate(this.columns);
  }

  httpAction = {
    url: this.baseparameterservice.seachUrl,
    method: 'GET',
  };

  public query() {
    this.editservice.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this,
    );
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

      this.commonquery
      .GetLookupByTypeLang('FND_LANGUAGE', this.appService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.languageoptions.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });

    this.commonquery
      .GetLookupByTypeLang('FND_YES_NO', this.appService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.YesOrNo.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });

      this.query();

    // this.setGridWidth('BASE_PARAMETER_B');
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('BASE_PARAMETER_B');
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  parseTime(d: any) {
    const newDate =
      d.getFullYear() +
      '-' +
      (d.getMonth() + 1) +
      '-' +
      d.getDate() +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes() +
      ':' +
      d.getSeconds();
    return newDate;
  }

  add(item?: any) {
    this.modal
      .static(
        BaseBaseparameterEditComponent,
        {
          i: {
            Id: item !== undefined ? item.id : null,
            Language: item !== undefined ? item.language : null,
          },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  /**此处ID为parameter_ID */
  detail(item: any) {
    this.modal
      .static(
        BaseBaseparameterViewComponent,
        {
          j: {
            Id: item !== undefined ? item.id : null,
            language: item !== undefined ? item.language : null,
          },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  remove(item: any) {
    this.baseparameterservice.Remove(item.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  RemoveBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.baseparameterservice
          .RemoveBath(this.selectionKeys)
          .subscribe(res => {
            this.msgSrv.success('删除成功');
            this.query();
          });
      },
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.YesOrNo;
        break;
      case 2:
        options = this.languageoptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.editservice.read(
      this.httpAction,
      this.queryParams.values,
      this.context,
    );
  }

  selectKeys = 'id';

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  /**
   * 导入参数
   */
  public imports() {
    this.modal.static(BaseParameterImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }
}
