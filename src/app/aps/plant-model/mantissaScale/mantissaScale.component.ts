import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { PlanscheduleHWChangeDetailComponent } from 'app/modules/base_module/components/change-detail/change-detail.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PsMantissaScaleEditComponent } from './edit/edit.component';
import { PsMantissaScaleService } from './query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'PsMantissaScaleList',
  templateUrl: './mantissaScale.component.html',
  providers: [PsMantissaScaleService]
})
export class PsMantissaScaleComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: PsMantissaScaleService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

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
      headerName: '工厂',
    },
    {
      field: 'productCategory',
      width: 120,
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'mantissaScale',
      width: 120,
      headerName: '尾数处理比例',
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

  prodTypeOptions: any[] = [];
  productCategoryOptions: any[] = [];
  plantOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.prodTypeOptions;
        break;
      case 2:
        options = this.productCategoryOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'productCategory', title: '产品大类', ui: { type: UiType.select, options: this.productCategoryOptions } },
      { field: 'prodType', title: '形式', ui: { type: UiType.select, options: this.prodTypeOptions } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      productCategory: null,
      prodType: null,
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      productCategory: null,
      prodType: null,
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions();
  }

  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
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

  getQueryParamsValue(isExport = false) {
    const params: any = { ...this.queryParams.values, export: isExport };
    if (!isExport) {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  add(dataItem?: any) {
    this.modal.static(
      PsMantissaScaleEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem
      }
    ).subscribe((value) => {
      if (value) {
        this.query();
      }
    })
  }

  remove(dataItem?: any) {
    const ids = this.getGridSelectionKeys('id');
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if (dataItem === undefined) {
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
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }




  // import() {
  //   this.modal.static(
  //     MarkupElement6ImportComponent,
  //     {
  //       options: {
  //         unitOptions: this.unitOptions,
  //       }
  //     },
  //     'md'
  //   ).subscribe((value) => {
  //     if (value) {
  //       this.query();
  //     }
  //   })
  // }

  expColumnsOptions: any[] = [
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
  ];
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
