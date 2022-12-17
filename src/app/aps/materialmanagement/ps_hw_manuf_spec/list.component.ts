import { Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { PsHwManufSpecLineComponent } from './detail/manufSpecLine.component'

@Component({
  selector: 'ps-hw-manuf-spec',
  templateUrl: './list.component.html',
  providers: [QueryService],
})
export class PsHwManufSpecComponent extends CustomBaseContext implements OnInit {
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

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  isLoading = false;
  optionListPlant: any[] = [];

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.queryUrl,
    method: 'GET',
  };

  DEFAULT_QUERY_PARAMS = {
    plantCode: this.appConfigService.getPlantCode(),
    manufSpecCode: '',
  }

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
    { field:'manufSpecId', width: 120, headerName: '制造规范标识',},
    { field:'manufSpecCode', width: 120, headerName: '制造规范编码',},
    { field:'manufSpecName', width: 120, headerName: '制造规范名称',},
    { field:'steelGrade', width: 120, headerName: '钢种',},
    { field:'tenantId', width: 120, headerName: '租户标识',},
    { field:'note', width: 120, headerName: '备注',},
    { field:'listOrder', width: 120, headerName: '排序',},
    { field:'factoryCode', width: 120, headerName: '工厂',},
    { field:'createdBy', width: 120, headerName: '创建人',},
    { field:'creationDate', width: 120, headerName: '创建时间',},
    { field:'lastUpdatedBy', width: 120, headerName: '修改人',},
    { field:'lastUpdateDate', width: 120, headerName: '修改时间',},
    { field:'workcenterCode', width: 120, headerName: '工作中心编码',},
  ];

  // 查询条件配置
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        required: true,
        ui: {
          type: UiType.select,
          options: this.optionListPlant,
        },
      },
      {
        field: 'manufSpecCode',
        title: '制造规范编码',
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
    return params;
  }

  // 初始化生命周期
  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadData();
    this.query();
  }

  // 查询搜索条件
  loadData() {
    this.loadPlant()
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

  viewLine(item) {
    if (!item) {
      return
    }
    this.modal
      .static(
        PsHwManufSpecLineComponent,
        {
          i: {
            plantCode: item.factoryCode || '',
            manufSpecId: item.manufSpecId || ''
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