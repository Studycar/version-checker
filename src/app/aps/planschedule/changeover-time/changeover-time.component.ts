import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { QueryService } from './query.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { InjectionMoldingChangeoverTimeEditComponent } from './edit/edit.component';
import { InjectionMoldingChangeoverTimeImportComponent } from './import/import.component';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
/**
 * 换型时间
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'injection-molding-changeover-time',
  templateUrl: './changeover-time.component.html',
  providers: [QueryService],
})
export class InjectionMoldingChangeoverTimeComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  httpAction = {
    url: this.queryService.queryUrl,
    method: 'GET',
  };
  plantOptions: any[] = [];
  changeoverTypeOptions: any[] = [];
  whetherEffectiveOptions: any[] = [];
  colorTypeOptions: any[] = [];

  context = this;
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions },
        required: true,
      },
      {
        field: 'switchType',
        title: '换型类型',
        ui: { type: UiType.select, options: this.changeoverTypeOptions },
      },
      {
        field: 'enableFlag',
        title: '是否有效',
        ui: { type: UiType.select, options: this.whetherEffectiveOptions },
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      switchType: null,
      enableFlag: 'Y',
    },
  };

  columns = [
    {
      colId: 'select',
      cellClass: '',
      field: '',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      suppressSizeToFit: true,
    },
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 70,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    {
      field: 'plantCode',
      headerName: '工厂',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'switchType',
      headerName: '换型类型',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'mouldCode',
      headerName: '模具',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'colorTypeFrom',
      headerName: '颜色类型从',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'colorTypeTo',
      headerName: '颜色类型至',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'switchTime',
      headerName: '时间（H）',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      headerName: '是否有效',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'switchTypeText', title: '换型类型', width: 150, locked: false },
    { field: 'mouldCode', title: '机台吨位(T)', width: 150, locked: false },
    {
      field: 'colorTypeFrom',
      title: '颜色类型从',
      width: 180,
      locked: false,
    },
    { field: 'colorTypeTo', title: '颜色类型至', width: 180, locked: false },
    { field: 'switchTime', title: '时间（H）', width: 150, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private queryService: QueryService,
    private commonQueryService: CommonQueryService,
    private modalService: NzModalService,
    private modal: ModalHelper,
    private appGridStateService: AppGridStateService,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  date = (function () {
    const year = new Date().getFullYear();
    const month =
      new Date().getMonth() + 1 < 10
        ? `0${new Date().getMonth() + 1}`
        : new Date().getMonth() + 1;
    const day =
      new Date().getDate() < 10
        ? `0${new Date().getDate()}`
        : new Date().getDate();
    return `${year}${month}${day}`;
  })();

  /**页面初始化 */
  ngOnInit() {
    this.columns[1].cellRendererParams.customTemplate = this.customTemplate;

    this.getPlantOptions();
    this.getChangeoverTypeOptions();
    this.getWhetherEffectiveOptions();
    this.commonQueryService.GetLookupByTypeLang('PIJ_COLOR_TYPE', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(item => {
        this.colorTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
    this.query();
  }
  /**新增、编辑 */
  add(item?: any) {
    this.modal
      .static(
        InjectionMoldingChangeoverTimeEditComponent,
        {
          i: { id: item !== undefined ? item.id : null },
        },
        'lg',
      )
      .subscribe(res => {
        if (res) {
          this.query();
        }
      });
  }
  /**导出 */
  exportFile() {
    // super.export();
    this.commonQueryService.exportAction(
      { url: this.queryService.queryUrl, method: 'POST' },
      this.queryParams.values,
      this.excelexport,
      this.context,
    );
  }
  /**查询 */
  query() {
    super.query();
    this.commonQuery();
  }
  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParams(),
      this.context,
    );
  }
  /**重置 */
  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      switchType: null,
      enableFlag: 'Y',
    };
  }
  /**得到查询参数 */
  getQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      switchType: this.queryParams.values.switchType,
      enableFlag: this.queryParams.values.enableFlag,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.changeoverTypeOptions;
        break;
      case 2:
        options = this.whetherEffectiveOptions;
        break;
      case 3:
        options = this.colorTypeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  /**获取工厂 */
  getPlantOptions() {
    this.commonQueryService
      .GetUserPlantNew(this.appConfigService.getUserId())
      .subscribe(res => {
        res.data.forEach(item => {
          this.plantOptions.push({
            label: item.plantCode,
            value: item.plantCode,
          });
        });
      });
  }
  /**获取注塑排产换型时间类型 */
  getChangeoverTypeOptions() {
    this.commonQueryService
      .GetLookupByType('PIJ_SWITCH_TIME_TYPE')
      .subscribe(res => {
        res.Extra.forEach(item => {
          this.changeoverTypeOptions.push({
            label: item.meaning,
            value: item.lookupCode,
          });
        });
      });
  }
  /**获取是否快码 */
  getWhetherEffectiveOptions() {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(res => {
      res.Extra.forEach(item => {
        this.whetherEffectiveOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
      this.expColumnsOptions.push({
        field: 'enableFlag',
        options: [...this.whetherEffectiveOptions],
      });
    });
  }

  /**删除 */
  remove(value: any) {
    this.queryService.remove(value.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  /**导入 */
  importFile() {
    this.modal
      .static(InjectionMoldingChangeoverTimeImportComponent, {}, 'md')
      .subscribe(res => {
        if (res) {
          this.query();
        }
      });
  }

  // 行选中改变
  onSelectionChanged() {
    this.getGridSelectionKeys('Id');
  }
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}
