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
import { BaseTranslstorService } from '../../../modules/generated_module/services/basetranslator-service';
import { ERPJobTypeEditComponent } from './edit/edit.component';
import { ERPJobTypeService } from '../../../modules/generated_module/services/erpjobtype-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
/**
 * 工单类型
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'erpjobtype-ag',
  templateUrl: './erpjobtype-ag.component.html',
  providers: [QueryService]
})
export class ERPJobTypeAgCodeComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public languageOptions: any[] = [];
  public applicationOptions: any[] = [];
  public moTypeOptions: any[] = [];
  public plantCodeOptions: any[] = [];
  public enableOptions: any[] = [];
  public autoadjustmentflags: any[] = [];
  /**默认工厂 */
  private DefaultPlant: string;
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantCodeOptions}, required: true },
      { field: 'moType', title: '工单类型', ui: { type: UiType.string } },
      { field: 'descriptions', title: '工单类型描述', ui: { type: UiType.string } },
      { field: 'enabledFlag', title: '是否有效', ui: { type: UiType.select, options: this.enableOptions } },
      { field: 'standardFlag', title: '工单标准类型', ui: { type: UiType.select, options: this.autoadjustmentflags } },
    ],
    values: {
      moType: '',
      descriptions: '',
      plantCode: this.appConfigService.getPlantCode(),
      enabledFlag: '',
      standardFlag: ''
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
        customTemplate: null,
      }
    },
    { field: 'scheduleRegionCode', headerName: '事业部' },
    { field: 'plantCode', headerName: '工厂' },
    { field: 'moType', headerName: '工单类型' },
    { field: 'descriptions', headerName: '工单类型描述', tooltipField: 'descriptions'},
    { field: 'standardFlag', headerName: '工单标准类型', valueFormatter: 'ctx.optionsFind(value,1).label' },
    { field: 'enabledFlag', headerName: '是否有效', valueFormatter: 'ctx.optionsFind(value,2).label' },
    { field: 'defaultFlag', headerName: '默认工单类型', valueFormatter: 'ctx.optionsFind(value,2).label' }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.autoadjustmentflags;
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
    private erpJobTypeService: ERPJobTypeService,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private comQueryService: CommonQueryService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadOptions();
    this.clear();
    this.queryCommon();
  }
  private loadOptions() {
    this.erpJobTypeService.GetMo_Type(this.queryParams.values).subscribe(result => {
      result.data.forEach(d => {
        this.moTypeOptions.push({
          label: d.moType,
          value: d.moType,
        });
      });
    });

    this.comQueryService.GetLookupByTypeLang('PS_DISCRETE_JOB_TYPE', this.appConfigService.getLanguage()).subscribe(result => {
      result.Extra.forEach(d => {
        this.autoadjustmentflags.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.comQueryService.GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage()).subscribe(result => {
      result.Extra.forEach(d => {
        this.enableOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.comQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodeOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
        // 判断默认组织是否在权限内
        this.DefaultPlant = this.appConfigService.getPlantCode();
        console.log('DefaultPlant:' + this.DefaultPlant);
        this.plantChange(this.DefaultPlant);
      });
    });
  }
  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  public query() {
    super.query();
    this.queryCommon();
  }
  private queryCommon() {
    this.queryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }

  /**工厂切换 */
  plantChange(event: string) {
    this.moTypeOptions.length = 0;
    this.erpJobTypeService.GetMo_Type(this.queryParams.values).subscribe(result => {
      result.data.forEach(d => {
        this.moTypeOptions.push({
          label: d.moType,
          value: d.moType,
        });
      });
    });
  }

  public add(item?: any) {
    this.modal
      .static(ERPJobTypeEditComponent,
        {
          i: {
            id: (item !== undefined ? item.id : null),
            scheduleRegionCode: (item !== undefined ? item.scheduleRegionCode : null),
            plantCode: (item !== undefined ? item.plantCode : null),
            moType: (item !== undefined ? item.moType : null),
            standardFlag: (item !== undefined ? item.standardFlag : null),
            descriptions: (item !== undefined ? item.descriptions : null),
            enabledFlag: (item !== undefined ? item.enabledFlag : null),
            defaultFlag: (item !== undefined ? item.defaultFlag : null),
            operationFlag: (item !== undefined ? 'N' : 'Y'),
          },
          enableOptions: this.enableOptions,
          CurPlant: this.appConfigService.getPlantCode(),
          autoadjustmentflags: this.autoadjustmentflags,
          defaltOptions: this.enableOptions,
        })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  /**删除 */
  public remove(item: any) {
    this.erpJobTypeService.Remove(item.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '删除成功'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'standardFlag', options: this.autoadjustmentflags },
    { field: 'enabledFlag', options: this.enableOptions },
    { field: 'defaultFlag', options: this.enableOptions },
  ];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.queryService.exportAction({ url: this.queryService.exportUrl, method: 'GET' }, this.queryParams.values, this.excelexport, this.context);
  }

  public clear() {
    this.queryParams.values = {
      moType: '',
      descriptions: '',
      plantCode: this.appConfigService.getPlantCode(),
      enabledFlag: null,
      standardFlag: null
    };
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
