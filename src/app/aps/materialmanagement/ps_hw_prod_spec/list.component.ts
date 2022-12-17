import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { PsHwSpecIndexApplyComponent } from './detail/specIndexApply.component';
import { PsHwProdRouteComponent } from './detail/prodRoute.component';
/**
 * 产品产线
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-hw-prod-spec',
  templateUrl: './list.component.html',
  providers: [QueryService],
})
export class PshwprodspecComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';

  isLoading = false;
  public optionListPlant: any[] = [];
  constructor(
    public pro: BrandService,
    public appTranslationService: AppTranslationService,
    public appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public modal: ModalHelper,
    public queryService: QueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.queryUrl,
    method: 'GET',
  };

  // 表格列配置
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
    { field: 'prodSpecId', width: 120, headerName: '产品规范标识', },
    { field: 'prodSpecCode', width: 120, headerName: '产品规范编码', },
    { field: 'prodSpecName', width: 120, headerName: '产品规范名称', },
    { field: 'skuCode', width: 120, headerName: 'SKU编码', },
    { field: 'skuName', width: 120, headerName: 'SKU名称', },
    { field: 'steelGrade', width: 120, headerName: '钢种', },
    { field: 'surface', width: 120, headerName: '表面', },
    { field: 'tenantId', width: 120, headerName: '租户标识', },
    { field: 'listOrder', width: 120, headerName: '排序', },
    { field: 'factoryCode', width: 120, headerName: '工厂', },
    { field: 'createdBy', width: 120, headerName: '创建人', },
    { field: 'creationDate', width: 120, headerName: '创建时间', },
    { field: 'lastUpdatedBy', width: 120, headerName: '修改人', },
    { field: 'lastUpdateDate', width: 120, headerName: '修改时间', },
    { field: 'workcenterCode', width: 300, headerName: '产品归属的工作中心编码', },
  ];

  DEFAULT_QUERY_PARAMS = {
    factoryCode: this.appConfigService.getPlantCode(),
    surface: '',
    steelGrade: '',
    skuCode: '',
  }

  // 查询条件配置
  queryParams: { defines: any; values: any } = {
    defines: [
      {
        field: 'factoryCode',
        title: '工厂',
        required: true,
        ui: {
          type: UiType.select,
          options: this.optionListPlant,
        },
      },
      {
        field: 'skuCode',
        title: 'SKU编码',
        ui: { type: UiType.text },
      },
      {
        field: 'steelGrade',
        title: '钢种',
        ui: { type: UiType.text },
      },
    ],
    values: this.DEFAULT_QUERY_PARAMS,
  };

  // 获取查询条件
  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      params.isExport = true;
    } else {
      params.isExport = false;
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    params.plantCode = this.queryParams.values.factoryCode;
    return params;
  }

  // 初始化生命周期
  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadData();
    this.queryParams.values.factoryCode = this.appConfigService.getPlantCode();
    this.query();
  }

  // 查询搜索条件
  loadData() {
    this.loadPlant();
  }
  loadPlant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.optionListPlant.length = 0;
    this.queryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        });
      });
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // 查询方法
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParams(),
      this.context,
    );
  }

  // 重置
  public clear() {
    this.queryParams.values = this.DEFAULT_QUERY_PARAMS;
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

  // 导出
  expColumns: any[] = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.exportAction(
      this.httpAction,
      params,
      this.excelexport,
      this.context,
    );
  }

  /**
   * 产品适用尺寸
   * @param item 
   */
  public specIndexApply(item: any) {
    this.modal
      .static(
        PsHwSpecIndexApplyComponent,
        {
          i: {
            objId: item !== undefined ? item.prodSpecId : '',
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

  /**
   * 产品路径
   * @param item 
   */
  public prodRoute(item: any) {
    this.modal
      .static(
        PsHwProdRouteComponent,
        {
          i: {
            prodSpecId: item !== undefined ? item.prodSpecId : '',
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



