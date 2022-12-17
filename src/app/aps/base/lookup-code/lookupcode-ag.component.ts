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
import { BaseLookupCodeDetailComponent } from './detail/lookup-code-detail.component';
import { BaseLookupCodeEditComponent } from './edit/edit.component';
import { LookupCodeManageService } from '../../../modules/generated_module/services/lookup-code-manage-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { DragModalService } from '../../../modules/base_module/services/drag-modal.service';
import {BaseLookUpCodeImportComponent} from './import/import.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lookupcode-ag',
  templateUrl: './lookupcode-ag.component.html',
  providers: [QueryService],
})
export class BaseLookupAgCodeComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'lookupTypeCode';
  public languageOptions: any[] = [];
  public applicationOptions: any[] = [];
  public LngOptions: any[] = [];
  public queryParams = {
    defines: [
      { field: 'typeCode', title: '编码类型', ui: { type: UiType.string } },
      { field: 'meaning', title: '编码名称', ui: { type: UiType.string } },
      { field: 'description', title: '描述', ui: { type: UiType.string } },
      { field: 'language', title: '语言', ui: { type: UiType.select, options: this.languageOptions } },
    ],
    values: {
      typeCode: '',
      meaning: '',
      description: '',
      language: this.appConfigService.getLanguage()
    },
  };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: this.customTemplate,
        //       customTemplate: `
        //            <span title="{{ '编辑' | translate}}" (click)="ctx.add(dataItem)" class="pointer">
        //                            <i class="anticon anticon-edit"></i>
        //                         </span>
        // <nz-divider nzType="vertical"></nz-divider>
        // <span title="{{ '明细' | translate}}" (click)="ctx.detail(dataItem)" class="pointer">
        //                           <i class="anticon anticon-bars"></i>
        //                         </span>
        // <nz-divider nzType="vertical"></nz-divider>
        // <span title="{{ '删除' | translate}}" nz-popconfirm nzTitle="{{ '是否确认删除该记录?' | translate}}" (nzOnConfirm)="ctx.remove(dataItem);"
        //       class="pointer">
        //                             <i class="anticon anticon-delete"></i>
        //                         </span>
        //       `,         // Complementing the Cell Renderer parameters
      },
    },
    /*{
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },*/
    { field: 'lookupTypeCode', headerName: '编码类型', menuTabs: ['filterMenuTab'] },
    { field: 'meaning', headerName: '编码名称', tooltipField: 'meaning', menuTabs: ['filterMenuTab'] },
    {
      field: 'applicationCode', headerName: '应用模块',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'],
    },
    {
      field: 'description',
      headerName: '描述',
      tooltipField: 'description',
      menuTabs: ['filterMenuTab'],
    },
    
    {
      field: 'attribute2',
      headerName: '宏旺编码',
      tooltipField: 'attribute2',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'language', headerName: '语言',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'],
    },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationOptions;
        break;
      case 2:
        options = this.languageOptions;
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
    private dragModal: DragModalService,
    private msgSrv: NzMessageService,
    private lookupcodeManageService: LookupCodeManageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    // 自动填充列宽
    this.isSizeColumnsToFit = true;
  }

  ngOnInit() {
    this.loadOptions();
    this.clear();
    this.queryCommon();
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('lookupcode');
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

  private loadOptions() {
    this.lookupcodeManageService.GetAppliaction().subscribe(result => {
      result.data.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationName,
          value: d.applicationCode,
          type: d.applicationName,
        });
      });
    });

    /** 初始化 系统支持的语言类型 */
    this.commonQueryService.GetLookupByType('FND_LANGUAGE').subscribe(result => {
      result.Extra.forEach(d => {
        this.languageOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  httpAction = { url: this.lookupcodeManageService.queryUrl, method: 'GET' };

  public query() {
    super.query();
    // this.loadOptions();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }

  public add(item?: any) {
    this.modal.static(BaseLookupCodeEditComponent, {
      i: {
        id: (item !== undefined ? (item.id ? item.id : (item.id ? item.id : null)) : null),
        applicationCode: (item !== undefined ? item.applicationCode : null),
        description: (item !== undefined ? item.description : null),
        language: (item !== undefined ? item.language : null),
        lookupTypeCode: (item !== undefined ? item.lookupTypeCode : null),
        meaning: (item !== undefined ? item.meaning : null),
        attribute2: (item !== undefined ? item.attribute2 : null),
      },
      applicationOptions: this.applicationOptions,
      languageOptions: this.languageOptions,
      CurLng: this.appConfigService.getLanguage(),
    })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public detail(item?: any) {
    // this.dragModal.create(BaseLookupCodeDetailComponent, {
    this.modal.static(BaseLookupCodeDetailComponent, {
      code: item.lookupTypeCode,
      lookupTypeId: (item.id ? item.id : (item.id ? item.id : null)),
      lng: item.language,
      LngOptions: this.languageOptions,
    }).subscribe(() => {
    });
  }

  public remove(item: any) {
    this.lookupcodeManageService.Remove(item.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  /*
  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.lookupcodeManageService
          .removeBatch(this.selectionKeys)
          .subscribe(res => {
            if (res.Success) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.Message));
            }
          });
      },
    });
  }
  */

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'applicationCode', options: this.applicationOptions },
    { field: 'language', options: this.languageOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.commonQueryService.exportAction({
      url: this.commonQueryService.exportUrl,
      method: 'GET',
    }, this.queryParams.values, this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }

  public clear() {
    this.queryParams.values = {
      typeCode: '',
      meaning: '',
      description: '',
      language: this.appConfigService.getLanguage()
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

  /**
   * 导入
   */
  public imports() {
    this.modal.static(BaseLookUpCodeImportComponent, {}, 'md').subscribe(value => {
      this.queryCommon();
    });
  }
}
