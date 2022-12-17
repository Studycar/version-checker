import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ModelChangeTimeEditComponent } from './edit/edit.component';
import { ModelChangeTimeImportComponent } from './import/import.component';
import { ModelChangeTimeService } from '../../../modules/generated_module/services/modelchangetime-service';
/**
 * 换模换型时间
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'model-change-time-ag',
  templateUrl: './model-change-time-ag.component.html',
  providers: [QueryService]
})
export class ModelChangeTimeAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public httpAction = { url: this.commonQueryService.queryUrl, method: 'GET' };
  public languageOptions: any[] = [];
  public applicationOptions: any[] = [];
  public plantCodeOptions: any[] = [];
  public plantGroupOptions: any[] = [];
  public productLineOptions: any[] = [];
  public catOptions: any[] = []

  public enableOptions = [
    {
      label: '是',
      value: 'Y'
    },
    {
      label: '否',
      value: 'N'
    }
  ];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantCodeOptions, ngModelChange: this.onPlantChange, }, required: true },
      {
        field: 'plantGroup',
        title: '计划组',
        ui: {
          type: UiType.select,
          options: this.plantGroupOptions,
          ngModelChange: this.onGroupChange,
        },
      },
      {
        field: 'productLine',
        title: '资源',
        ui: { type: UiType.select, options: this.productLineOptions },
      },
      { field: 'category', title: '换型类型', ui: { type: UiType.select, options: this.catOptions }, required: true },
      { field: 'objectFrom', title: '因子(前)', ui: { type: UiType.string } },
      { field: 'objectTo', title: '因子(后)', ui: { type: UiType.string } },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      plantGroup: null,
      productLine: null,
      category: '1',
      objectFrom: '',
      objectTo: ''
    }
  };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'plantCode', headerName: '工厂', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'category', headerName: '换型类型', width: 100, valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'objectFrom', headerName: '因子(前)', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'descriptionsFrom', headerName: '因子描述(前)', width: 250, tooltipField: 'descriptionsFrom', menuTabs: ['filterMenuTab'] },
    { field: 'objectTo', headerName: '因子(后)', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'descriptionsTo', headerName: '因子描述(后)', width: 250, tooltipField: 'descriptionsTo', menuTabs: ['filterMenuTab'] },
    { field: 'switchTime', headerName: '切换分钟数量', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', width: 100, valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    { field: 'remark', headerName: '备注', width: 100,  menuTabs: ['filterMenuTab'] }
  ];

  onPlantChange(val: string) {
    this.queryParams.values.plantGroup = null;
    this.queryParams.values.productLine = null;
    this.loadPlantGroup();
  }

  onGroupChange(val: string) {
    this.queryParams.values.productLine = null;
    this.loadProductLine();
  }
  
  loadPlantGroup() {
    this.commonQueryService.GetUserPlantGroup(this.queryParams.values.plantCode).subscribe(res => {
      this.plantGroupOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantGroupOptions.push({
          label: `${item.scheduleGroupCode}(${item.descriptions})`,
          value: item.scheduleGroupCode
        });
      });
    });
  }

  loadProductLine() {
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plantCode, this.queryParams.values.plantGroup).subscribe(res => {
      this.productLineOptions.length = 0;
      res.Extra.forEach(item => {
        this.productLineOptions.push({
          label: `${item.resourceCode}(${item.descriptions})`,
          value: item.resourceCode
        });
      });
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.catOptions;
        break;
      case 2:
        options = this.enableOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modelChangeTimeService: ModelChangeTimeService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    this.loadPlantGroup();
    this.clear();
  }
  private loadOptions() {
    this.plantCodeOptions.length = 0;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodeOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        });
        this.queryParams.values.plantCode = this.appConfigService.getPlantCode();
        this.queryCommon();
      });
    });
    this.commonQueryService.GetLookupByTypeRefAll({
      'FND_LANGUAGE': this.languageOptions,
      'PS_SWITCH_TIME_TYPE_HW': this.catOptions,
    })
    /** 初始化 系统支持的语言类型 */
    // this.commonQueryService.GetLookupByType('FND_LANGUAGE').subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.languageOptions.push({
    //       label: d.meaning,
    //       value: d.lookupCode,
    //     });
    //   });
    // });
  }
  public query() {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择工厂'));
      return;
    }
    if (!this.queryParams.values.category) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择自制类型'));
      return;
    }
    super.query();
    this.queryCommon();
  }
  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      scheduleGroupCode: this.queryParams.values.plantGroup,
      resourceCode: this.queryParams.values.productLine,
      category: this.queryParams.values.category,
      objectFrom: this.queryParams.values.objectFrom,
      objectTo: this.queryParams.values.objectTo,
      PAGE_INDEX: this._pageNo,
      PAGE_SIZE: this._pageSize
    };
  }

  public add(item?: any) {
    this.modal
      .static(ModelChangeTimeEditComponent,
        {
          i: (item !== undefined ? item : { id: null }),
          PlantCodeOptions: this.plantCodeOptions,
          enableOptions: this.enableOptions,
          CurPlant: this.appConfigService.getPlantCode(),
          defaltOptions: this.enableOptions,
        }
      )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public remove(item: any) {
    const dto = {
      id: item.id,
      plantCode: item.plantCode,
      category: item.category,
      objectFrom: item.objectFrom,
      objectTo: item.objectTo,
      switchTime: item.switchTime,
      enableFlag: item.enableFlag
    };
    this.modelChangeTimeService.Remove(dto).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'category', options: this.catOptions },
    { field: 'enableFlag', options: this.enableOptions }
  ];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction({ url: this.commonQueryService.queryUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }
  
  public import() {
    this.modal
      .static(ModelChangeTimeImportComponent, {}, 'md')
      .subscribe(value => {
        this.query();
      });
  }

  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      plantGroup: null,
      productLine: null,
      category: '1',
      objectFrom: '',
      objectTo: ''
    };
    this.loadPlantGroup();
  }
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
