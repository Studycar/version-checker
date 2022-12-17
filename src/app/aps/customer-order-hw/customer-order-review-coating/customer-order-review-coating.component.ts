import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { CustomerOrderReviewCoatingEditComponent } from "./edit/edit.component";
import { CustomerOrderReviewCoatingImportComponent } from "./import/import.component";
import { CustomerOrderReviewCoatingQueryService } from "./query.service";

@Component({
  selector: 'customer-order-review-coating',
  templateUrl: './customer-order-review-coating.component.html',
  providers: [CustomerOrderReviewCoatingQueryService]
})
export class CustomerOrderReviewCoatingComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerOrderReviewCoatingQueryService,
    public http: _HttpClient,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  paperOptions: any[] = [];
  labelDescOptions: any[] = [];

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
      headerName: '工厂'
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '存货名称'
    },
    {
      field: 'width',
      width: 120,
      headerName: '宽度'
    },
    {
      field: 'labelDesc',
      width: 120,
      headerName: '标签描述',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    // {
    //   field: 'coatingUpName',
    //   width: 120,
    //   headerName: '面膜存货描述'
    // },
    // {
    //   field: 'coatingDownCode',
    //   width: 120,
    //   headerName: '底膜存货编码'
    // },
    // {
    //   field: 'coatingDownName',
    //   width: 120,
    //   headerName: '底膜存货描述'
    // },
    {
      field: 'paper',
      width: 120,
      headerName: '表面保护',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建时间'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间'
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.paperOptions;
        break;
      case 2:
        options = this.labelDescOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'stockName', title: '存货名称', ui: { type: UiType.text } },
      { field: 'width', title: '宽度', ui: { type: UiType.text } },
    ],
    values: {
      stockName: '',
      width: '',
    }
  };

  clear() {
    this.queryParams.values = {
      stockName: '',
      width: '',
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions()
  }

  loadOptions = super.wrapLoadOptionsFn(async () => {
    const res = await this.queryService.GetLookupByType('PS_SURFACE_PROTECT').toPromise();
    if(res.Extra && res.Extra.length > 0) {
      res.Extra.forEach(d => {
        // if(['无', '垫纸'].includes(d.lookupCode)) {
        // }
        this.paperOptions.push({
          label: d.lookupCode,
          value: d.meaning
        });
      });
    }
  })

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    return {
      stockName: this.queryParams.values.stockName,
      width: this.queryParams.values.width,
      // coatingUpName: this.queryParams.values.coatingUpName,
      // coatingDownName: this.queryParams.values.coatingDownName,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      CustomerOrderReviewCoatingEditComponent,
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
    this.modal
      .static(CustomerOrderReviewCoatingImportComponent, 
        {
          options: {
            paperOptions: this.paperOptions,
            labelDescOptions: this.labelDescOptions,
          }
        }, 'md')
      .subscribe((value) => {
        if(value) {
          this.query();
        }
      });
  }

  expColumnsOptions = [
    { field: 'paper', options: this.paperOptions }, 
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
