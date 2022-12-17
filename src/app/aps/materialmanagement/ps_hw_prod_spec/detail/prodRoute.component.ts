import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { PsHwProdRouteItemComponent } from './prodRouteItem.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-hw-prod-route',
  templateUrl: './prodRoute.component.html',
  providers: [QueryService],
})
export class PsHwProdRouteComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  public selectBy = 'id';
  i: any;
  isLoading = false;


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
    { field: 'routeId', width: 120, headerName: '路径标识', },
    { field: 'prodSpecId', width: 120, headerName: '产品规范标识', },
    { field: 'tenantId', width: 120, headerName: '租户标识', },
    { field: 'listOrder', width: 120, headerName: '排序，优先顺序号', },
    { field: 'factoryCode', width: 120, headerName: '工厂', },
    { field: 'createdBy', width: 120, headerName: '创建人', },
    { field: 'creationDate', width: 240, headerName: '创建时间', },
    { field: 'lastUpdatedBy', width: 120, headerName: '修改人', },
    { field: 'lastUpdateDate', width: 240, headerName: '修改时间', },

  ];


  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private modalService: NzModalService,
    private appConfigService: AppConfigService,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  private getQueryParamsValue(): any {
    return {
      prodSpecId: this.i.prodSpecId,
      plantCode: this.i.plantCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
  }





  httpAction = { url: this.queryService.queryProdRouteUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }




  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.queryService.export({ url: this.queryService.queryProdRouteUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }

  public clear() {
    this.queryParams.values = {
      prodSpecId: this.i.prodSpecId,
      plantCode: this.i.plantCode,
    };

  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  /**
   * 产品路径
   * @param item 
   */
   public prodRouteItem(item: any) {
    this.modal
      .static(
        PsHwProdRouteItemComponent,
        {
          i: {
            routeId: item !== undefined ? item.routeId : '',
            plantCode: item !== undefined ? item.factoryCode : '',
          },
        },
        'xl',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  
}
}
