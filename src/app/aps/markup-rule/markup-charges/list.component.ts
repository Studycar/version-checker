import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { QueryService } from './queryService';
import { PsMarkupChargesEditComponent } from './edit/edit.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
/**
 * 模具信息维护
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-MarkupCharges-manager',
  templateUrl: './list.component.html',
  providers: [QueryService],
})
export class PsMarkupChargesComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  httpAction = {
    url: this.queryService.seachUrl,
    method: 'GET',
    data: false,
  };
  context = this;
  markupElementOptions: any[] = [];
  yesOrNoOptions: any[] = [];
 
  
  public queryParams = {  
    defines: [ ],
    values: {      
      pageIndex: 1,
      pageSize: this.gridState.take,
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
      field: 'markupElement',
      headerName: '加价维度',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      width: 150,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'chargesFlag',
      headerName: '是否加工费',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      width: 150,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },   
    {
      field: 'createdBy',
      headerName: '创建人',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'creationDate',
      headerName: '创建时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'lastUpdatedBy',
      headerName: '最近更新人',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'lastUpdateDate',
      headerName: '最近更新时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
  ];


  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonQuery: CommonQueryService,
    private appconfig: AppConfigService,
    private translateservice: AppTranslationService,
    private modalService: NzModalService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: translateservice,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
  }

  LoadData() { 
    this.loadYesOrNo();
    this.loadMarkupElement();
  }

  query() {
    super.query();
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.GetQueryParams(false),
      this.context,
    );
  }


  GetQueryParams(isExport: boolean) {
    return {
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  clear() {
    this.queryParams.values = {
      pageIndex: 1,
      pageSize: this.gridState.take,
    };
  }

  add(item?: any) {
    this.modal
      .static(
        PsMarkupChargesEditComponent,
        {
          i: { id: item !== undefined ? item.id : null },
        },
        'md',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }



  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.queryService.removeBatch(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.translateservice.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.translateservice.translate(res.msg));
          }
        });
      },
    });
  }

  remove(value: any) {
    this.queryService.removeBatch([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.translateservice.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg));
      }
    });
  }



  expColumns = [...this.columns];
  expColumnsOptions: any[] = [
    { field: 'chargesFlag', options: this.yesOrNoOptions },
    { field: 'markupElement', options: this.markupElementOptions },
  ];



  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    const dto = this.GetQueryParams(true);
    this.excelexport.setExportColumn(this.expColumns);   
    // super.export(); 导出网格列，如果需要导出自定义列，那么注释此行
    this.queryService.export({ url: this.httpAction.url, method: 'GET' }, dto, this.excelexport, this.context);
  }




  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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
      this.queryService.loadGridView(
        this.httpAction,
        this.GetQueryParams(false),
        this.context,
      );
    } else {
      this.setLoading(false);
    }
  }

   /**
   * 加载快码 启用禁用
   */
    public loadYesOrNo(): void {
      this.queryService.GetLookupByType('FND_YES_NO')
        .subscribe(result => {
          result.Extra.forEach(d => {
            this.yesOrNoOptions.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          });
        });
    }

   /**
   * 加载快码 加价维度
   */
    public loadMarkupElement(): void {
      this.queryService.GetLookupByType('PS_MARKUP_ELEMENT')
        .subscribe(result => {
          result.Extra.forEach(d => {
            this.markupElementOptions.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          });
        });
    }
  

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNoOptions;
        break;
      case 2:
        options = this.markupElementOptions;
        break;


    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  
  /**
   * 打开修改记录
   */
   showChangeDetail() {
    const tableName = 'PS_MARKUP_ELEMENT_HISTORY';
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: tableName.toLowerCase(),
          myAgGridRowKey: tableName,
        },
        exportFileName: '加价维度与产品大类关系',
        tableColumns: [{
          field: 'zxdz',
          headerName: '执行动作',
          width: 100
        }, ...this.columns.filter(col => col.colId === undefined)],
        tableExpColumnsOptions: this.expColumnsOptions,
        queryParams: this.queryParams,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }
 
}
