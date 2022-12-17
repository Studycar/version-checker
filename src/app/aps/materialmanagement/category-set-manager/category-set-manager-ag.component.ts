import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { CategorySetManagerEditService } from './edit.service';
import { MaterialmanagementCategorySetManagerEditComponent } from './edit/edit.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-category-set-manager-ag',
  templateUrl: './category-set-manager-ag.component.html',
  providers: [CategorySetManagerEditService],
})
export class MaterialmanagementCategorySetManagerAgComponent
  extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public selectBy = 'id';
  yesNoOptions: any[] = [];

  isLoading = false;

  public queryParams = {
    defines: [
      {
        field: 'categorySetCode',
        title: '类别集名称',
        ui: { type: UiType.string },
      },
      {
        field: 'descriptions',
        title: '类别集描述',
        ui: { type: UiType.string },
      },
      {
        field: 'enableFlag',
        title: '是否启用',
        ui: { type: UiType.select, options: this.yesNoOptions },
      },
    ],
    values: {
      categorySetCode: '',
      descriptions: '',
      enableFlag: 'Y',
    },
  };

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
      colId: 1,
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
    },
    {
      field: 'categorySetCode',
      headerName: '类别集名称',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'descriptions',
      headerName: '类别集描述',
      tooltipField: 'descriptions',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'segmentsQty',
      headerName: '段数',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'consumeSet',
      headerName: '是否冲减维度',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'enableFlag',
      headerName: '是否启用',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: CategorySetManagerEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    // 自动填充列宽
    this.isSizeColumnsToFit = true;
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.clear();
    this.getYesNoOptions();
    console.log(this.yesNoOptions.length);
    this.queryCommon();
  }

  httpAction = { url: this.editService.seachUrl, method: 'GET' };

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesNoOptions;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  getYesNoOptions() {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(res => {
      res.Extra.forEach(item => {
        this.yesNoOptions.push({
          label: item.meaning,
          value: item.lookupCode,

        });
      });
    });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      this.queryParams.values,
      this.context
    );

  }

  public add(item?: any) {
    this.modal
      .static(
        MaterialmanagementCategorySetManagerEditComponent,
        { i: { id: item !== undefined ? item.id : null } },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    this.editService.Remove([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        // this.msgSrv.error(res.Message);
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    console.log(this.selectionKeys);

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.Remove(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success('删除成功');
            this.query();
          } else {
            // this.msgSrv.error(res.Message);
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'consumeSet', options: this.yesNoOptions },
    { field: 'enableFlag', options: this.yesNoOptions }
  ];


  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }

  public clear() {
    this.queryParams.values = {
      categorySetCode: '',
      descriptions: '',
      enableFlag: 'Y',
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
