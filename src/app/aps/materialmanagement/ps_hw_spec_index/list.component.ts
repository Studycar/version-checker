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
import { PsHwManufLineSpecDefComponent } from './detail/manufLineSpecDef.component';
import { PsHwProdSpecDefComponent } from './detail/prodSpecDef.component';
/**
 * 产品产线
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-hw-spec-index',
  templateUrl: './list.component.html',
  providers: [QueryService],
})
export class PsHwSpecIndexComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';

  isLoading = false;
  public optionListPlant: any[] = [];
  typeOptions: any[] = [
    { label: '产品', value: '1' },
    { label: '产线', value: '2' },
  ];
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
    // { field: 'id', width: 120, headerName: '行号' },
    { field: 'indexId', width: 120, headerName: '索引标识' },
    // { field: 'basicTableCode', width: 120, headerName: '基本表代码' },
    { field: 'indexCode', width: 120, headerName: '索引编码' },
    { field: 'steelGrade', width: 120, headerName: '钢种' },
    { field: 'note', width: 120, headerName: '备注' },
    { field: 'tenantId', width: 120, headerName: '租户标识' },
    { field: 'listOrder', width: 120, headerName: '排序' },
    // { field: 'status', width: 120, headerName: '状态' },
    { field: 'factoryCode', width: 120, headerName: '工厂' },
    { field: 'createdBy', width: 120, headerName: '创建人' },
    { field: 'creationDate', width: 120, headerName: '创建时间' },
    { field: 'lastUpdatedBy', width: 120, headerName: '修改人' },
    { field: 'lastUpdateDate', width: 120, headerName: '修改时间' },
    { field: 'catCode', width: 120, headerName: 'SKU类目' },
  ];

  DEFAULT_QUERY_PARAMS = {
    factoryCode: this.appConfigService.getPlantCode(),
    surface: '',
    steelGrade: '',
    type: '1',
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
        field: 'indexCode',
        title: '索引编码',
        ui: { type: UiType.text },
      },
      {
        field: 'steelGrade',
        title: '钢种',
        ui: { type: UiType.text },
      },
      {
        field: 'type',
        title: '类型',
        ui: { type: UiType.select, options: this.typeOptions },
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
  expColumns: any[] = [];
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
   * 查看详情
   * @param item 
   */
  public detail(item: any) {
    if (item.basicTableCode === 'MM_MANUF_LINE_SPEC_DEF') {
      this.modal
        .static(
          PsHwManufLineSpecDefComponent,
          {
            i: {
              indexCode: item !== undefined ? item.indexCode : '',
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
    } else if (item.basicTableCode === 'MM_PROD_SPEC_DEF') {
      this.modal
        .static(
          PsHwProdSpecDefComponent,
          {
            i: {
              indexCode: item !== undefined ? item.indexCode : '',
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
}



