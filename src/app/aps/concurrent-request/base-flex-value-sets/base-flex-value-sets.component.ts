import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FormBuilder } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators/map';
import { BaseFlexValueSetsEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { QueryService } from './queryService';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-flex-value-sets',
  templateUrl: './base-flex-value-sets.component.html',
  providers: [QueryService],
})
export class BaseFlexValueSetsComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  context = this;
  public viewEx: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 8,
  };
  public mySelection: any[] = [];
  flexValueSets: any[] = [];
  flexValueSetOptions: any[] = [];
  validationTypes: any[] = [];
  validationTypeOptions: any[] = [];
  formatTypes: any[] = [];
  formatTypeOptions: any[] = [];
  enableflags: any[] = [];

  constructor(
    public pro: BrandService,
    private formBuilder: FormBuilder,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private editService: QueryService,
    private commonQueryService: CommonQueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.autoGroupColumnDef = {
      headerName: 'Athlete',
      field: 'athlete',
      width: 200,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: { checkbox: true },
    };
    this.isRowSelectable = function (rowNode) {
      return (rowNode.data.numberOnlyFlag !== null || rowNode.data.uppercaseOnlyFlag !== null || rowNode.data.numericModeEnabledFlag !== null);
    };
    this.rowSelection = 'multiple';

    this.headerNameTranslate(this.columns);
  }

  public isRowSelectable;
  public rowSelection;

  public queryParams = {
    flexValueSetId: '',
    validationType: '',
    formatType: '',
  };

  public clear() {
    this.queryParamsEx.values = {
      flexValueSetId: null,
      validationType: null,
      formatType: null,
    };
  }

  public queryParamsEx = {
    defines: [
      { field: 'flexValueSetId', title: '值集名', ui: { type: UiType.select, options: this.flexValueSetOptions } },
      { field: 'validationType', title: '验证类型', ui: { type: UiType.select, options: this.validationTypeOptions } },
      { field: 'formatType', title: '格式类型', ui: { type: UiType.select, options: this.formatTypeOptions } },
    ],
    values: {
      flexValueSetId: '',
      validationType: '',
      formatType: '',
    },
  };

  httpAction = {
    url: '/api/admin/baseflexvaluesets/searchGet',
    method: 'POST',
  };

  public query() {
    this.queryParams.flexValueSetId = this.queryParamsEx.values.flexValueSetId;
    this.queryParams.validationType = this.queryParamsEx.values.validationType;
    this.queryParams.formatType = this.queryParamsEx.values.formatType;
    this.editService.loadGridViewNew(this.httpAction, this.queryParams, this);
  }

  expColumns = [
    { field: 'flexValueSetName', title: '值集名', width: 200, locked: true },
    { field: 'description', title: '说明', width: 200, locked: false },
    { field: 'formatType', title: '格式类型', width: 100, locked: false },
    { field: 'maximumSize', title: '最大尺寸', width: 300, locked: false },
    { field: 'numberPrecision', title: '精确度', width: 200, locked: false },
    {
      field: 'numberOnlyFlag',
      title: '仅限于数字(0-9)',
      width: 100,
      locked: false,
    },
    {
      field: 'uppercaseOnlyFlag',
      title: '仅限于大写字母',
      width: 300,
      locked: false,
    },
    {
      field: 'numericModeEnabledFlag',
      title: '右对齐和填0编号',
      width: 200,
      locked: false,
    },
    { field: 'minimumValue', title: '最小值', width: 100, locked: false },
    { field: 'maximumValue', title: '最大值', width: 300, locked: false },
    { field: 'validationType', title: '验证类型', width: 300, locked: false },
  ];
  expColumnsOptions: any[] = [
    { field: 'validationType', options: this.validationTypeOptions },
    { field: 'formatType', options: this.formatTypeOptions },
    { field: 'numberOnlyFlag', options: this.enableflags },
    { field: 'uppercaseOnlyFlag', options: this.enableflags },
    { field: 'numericModeEnabledFlag', options: this.enableflags }
  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    this.queryParams.flexValueSetId = this.queryParamsEx.values.flexValueSetId;
    this.queryParams.validationType = this.queryParamsEx.values.validationType;
    this.queryParams.formatType = this.queryParamsEx.values.formatType;
    this.editService.exportAction(
      this.httpAction,
      this.queryParams,
      this.excelexport,
      this,
    );
  }

  public flexValueSet(id: string): any {
    return this.flexValueSets.find(x => x.flexValueSetId === id);
  }

  public formatType(id: string): any {
    return this.formatTypes.find(x => x.formatType === id);
  }

  public validationType(id: string): any {
    return this.validationTypes.find(x => x.validationType === id);
  }

  public add(item?: any) {
    this.modal
      .static(
        BaseFlexValueSetsEditComponent,
        {
          i: {
            flexValueSetId:
              item !== undefined ? item.flexValueSetId : null,
          },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
          this.editService.GetFlexValueSets().subscribe(result => {
            this.flexValueSetOptions.length = 0;
            this.flexValueSets = result.data;
            result.data.forEach(d => {
              this.flexValueSetOptions.push({
                label: d.flexValueSetName,
                value: d.flexValueSetId,
              });
            });
          });
        }
      });
  }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.clear();

    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO2', this.enableflags);
    this.commonQueryService.GetLookupByTypeRef('FND_VALUE_SETS_FORMAT_TYPE', this.formatTypeOptions);
    this.commonQueryService.GetLookupByTypeRef('FND_VALUE_SETS_VALIDATION_TYPE', this.validationTypeOptions);

    // /** 初始化 是否有效  下拉框*/
    // this.editService.GetYesNos().subscribe(result => {
    //   this.enableflags.length = 0;
    //   result.Extra.forEach(d => {
    //     this.enableflags.push({
    //       label: d.LOOKUPNAME,
    //       value: d.LOOKUPCODE,
    //     });
    //   });
    // });

    // this.editService.GetFormatType().subscribe(result => {
    //   this.formatTypes = result.Extra;
    //   result.Extra.forEach(d => {
    //     this.formatTypeOptions.push({
    //       label: d.FORMAT_NAME,
    //       value: d.formatType,
    //     });
    //   });
    // });

    // this.editService.GetValidationType().subscribe(result => {
    //   this.validationTypes = result.Extra;
    //   result.Extra.forEach(d => {
    //     this.validationTypeOptions.push({
    //       label: d.VALIDATION_NAME,
    //       value: d.validationType,
    //     });
    //   });
    // });

    this.editService.GetFlexValueSets().subscribe(result => {
      this.flexValueSets = result.data;
      result.data.forEach(d => {
        this.flexValueSetOptions.push({
          label: d.flexValueSetName,
          value: d.flexValueSetId,
        });
      });
    });

    this.viewEx = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.query();
  }

  // public reload(grid: any): void {
  //   this.editService.reset();
  //   this.editService.read();
  // }

  public remove(item: any) {
    const dto = {
      flexValueSetId: item.flexValueSetId,
      flexValueSetName: item.flexValueSetName,
      description: item.description,
      formatType: item.formatType,
      maximumSize: item.maximumSize,
      numberPrecision: item.numberPrecision,
      numberOnlyFlag: item.numberOnlyFlag,
      uppercaseOnlyFlag: item.uppercaseOnlyFlag,
      numericModeEnabledFlag: item.numericModeEnabledFlag,
      minimumValue: item.minimumValue,
      maximumValue: item.maximumValue,
      validationType: item.validationType,
    };
    this.editService.Remove(dto).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  public columns = [
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
      field: 'flexValueSetName',
      headerName: '值集名',
      tooltipField: 'flexValueSetName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'description',
      headerName: '说明',
      tooltipField: 'description',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'formatType',
      headerName: '格式类型',
      width: 120,
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'maximumSize',
      headerName: '最大尺寸',
      width: 100,
      tooltipField: 'maximumSize',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'numberPrecision',
      headerName: '精确度',
      width: 100,
      tooltipField: 'numberPrecision',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'numberOnlyFlag',
      width: 140,
      headerName: '仅限于数字(0-9)',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'uppercaseOnlyFlag',
      width: 140,
      headerName: '仅限于大写字母',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'numericModeEnabledFlag',
      width: 140,
      headerName: '右对齐和填0编号',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'numberOnlyFlag1', headerName: '仅限于数字(0-9)', tooltipField: 'numberOnlyFlag',
    //   checkboxSelection: true, menuTabs: ['filterMenuTab']
    // },
    // { field: 'uppercaseOnlyFlag', headerName: '仅限于大写字母', tooltipField: 'uppercaseOnlyFlag', cellRendererParams: { checkbox: true }, menuTabs: ['filterMenuTab'] },
    // { field: 'numericModeEnabledFlag', headerName: '右对齐和填0编号', tooltipField: 'numericModeEnabledFlag', cellRendererParams: { checkbox: true }, menuTabs: ['filterMenuTab'] },
    {
      field: 'minimumValue',
      headerName: '最小值',
      width: 90,
      tooltipField: 'minimumValue',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'maximumValue',
      headerName: '最大值',
      width: 90,
      tooltipField: 'maximumValue',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'validationType',
      headerName: '验证类型',
      width: 100,
      tooltipField: 'validationType',
      valueFormatter: 'ctx.optionsFind(value,3).label',
      menuTabs: ['filterMenuTab'],
    },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.flexValueSetOptions;
        break;
      case 2:
        options = this.formatTypeOptions;
        break;
      case 3:
        options = this.validationTypeOptions;
        break;
      case 4:
        options = this.enableflags;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  public autoGroupColumnDef;
}
