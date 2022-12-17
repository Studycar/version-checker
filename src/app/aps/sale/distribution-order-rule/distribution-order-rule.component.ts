import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { DistributionOrderRuleEditComponent } from "./edit/edit.component";
import { DistributionOrderRuleImportComponent } from "./import/import.component";
import { DistributionOrderRuleQueryService } from "./query.service";

@Component({
  selector: 'distribution-order-rule',
  templateUrl: './distribution-order-rule.component.html',
  providers: [DistributionOrderRuleQueryService]
})
export class DistributionOrderRuleComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: DistributionOrderRuleQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  YesNoOptions: any[] = [];
  plantOptions: any[] = [];
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
      field: 'plantCode',
      width: 120,
      headerName: '产地'
    },
    {
      field: 'longDistance',
      width: 120,
      headerName: '是否长途',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'ranges',
      width: 120,
      headerName: '收货范围',
    },
    {
      field: 'area',
      width: 120,
      headerName: '收货区域',
    },
    {
      field: 'place',
      width: 120,
      headerName: '配送地点',
    },
    {
      field: 'warehouse',
      width: 120,
      headerName: '配送仓库',
    },
    {
      field: 'deadWeight',
      width: 120,
      headerName: '车载吨位',
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
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.YesNoOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  
  queryParams = {
    defines: [
      { field: 'plantCode', title: '产地', ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'area', title: '收货区域', ui: { type: UiType.text } },
      { field: 'place', title: '配送地点', ui: { type: UiType.text } },
      { field: 'warehouse', title: '配送仓库', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: null,
      area: '',
      place: '',
      warehouse: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: null,
      area: '',
      place: '',
      warehouse: '',
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions()
  }

  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_YES_NOT': this.YesNoOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  })

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
    const queryParams = { ... this.queryParams.values };
    return Object.assign(queryParams, {
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    });
  }

  add(dataItem?: any) {
    this.modal.static(
      DistributionOrderRuleEditComponent,
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
  
  import() {
    this.modal.static(
      DistributionOrderRuleImportComponent,
      {
        options: {
        }
      },
      'md'
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  expColumnsOptions = [
    { field: 'longDistance', options: this.YesNoOptions },
  ]
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

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }
}