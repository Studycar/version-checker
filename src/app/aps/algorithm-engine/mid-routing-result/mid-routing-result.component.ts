import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { MidRoutingResultService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  selector: 'algorithm-engine-mid-routing-result',
  templateUrl: './mid-routing-result.component.html',
  providers: [MidRoutingResultService]
})
export class AlgorithmEngineMidRoutingResultComponent extends CustomBaseContext
  implements OnInit {
  // @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public plantCodeList: any[] = [];
  public modelNameList: any[] = [];
  public checkFlagNameList: any[] = [];
  public queryParams = {
    defines: [
      {
        field: 'modelName',
        title: '模型名称',
        ui: {
          type: UiType.select,
          options: this.modelNameList
        },
      },
      {
        field: 'plantCode',
        title: '组织',
        required: true,
        ui: {
          type: UiType.select,
          options: this.plantCodeList
        },
      },
      {
        field: 'itemCode',
        title: '物料编码',
        ui: { type: UiType.text },
      },
      {
        field: 'checkFlag',
        title: '审核状态',
        ui: {
          type: UiType.select,
          options: this.checkFlagNameList
        },
      },
    ],
    values: {
      modelName: '',
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: '',
      checkFlag: ''
    },
  };

  public columns = [
    //   {
    //   colId: 0,
    //   field: '',
    //   headerName: '操作',
    //   width: 80,
    //   pinned: this.pinnedAlign,
    //   lockPinned: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate,
    //   },
    //   cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
    //   cellRendererParams: {
    //     customTemplate: null, // Complementing the Cell Renderer parameters
    //   },
    // },
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
      field: 'checkFlagDesc',
      width: 120,
      headerName: '审核状态'
    },
    {
      field: 'modelName',
      width: 120,
      headerName: '模型名称'
    },
    {
      field: 'plantCode',
      width: 60,
      headerName: '组织'
    },
    {
      field: 'scheduleGroupCode',
      width: 120,
      headerName: '计划组'
    },
    {
      field: 'resourceCode',
      width: 120,
      headerName: '资源'
    },
    {
      field: 'resourceType',
      width: 120,
      headerName: '资源类型',
    },
    {
      field: 'itemCode',
      width: 120,
      headerName: '物料编码',
    },
    {
      field: 'descriptionsCn',
      width: 120,
      headerName: '物料描述'
    },
    {
      field: 'rateTypeDesc',
      width: 180,
      headerName: '速率类型'
    },
    {
      field: 'rate',
      width: 120,
      headerName: '速率'
    },
    {
      field: 'priority',
      width: 180,
      headerName: '优先级'
    },
    {
      field: 'scheduleFlag',
      width: 120,
      headerName: '参与排产标识'
    },
    {
      field: 'selectResourceFlag',
      width: 180,
      headerName: '参与选线标识'
    },
    {
      field: 'checkDate',
      width: 120,
      headerName: '审核时间'
    },
    {
      field: 'checkErrorLogs',
      width: 180,
      headerName: '审核异常信息'
    }
  ];

  constructor(public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: MidRoutingResultService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private exportImportService: ExportImportService
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

  ngOnInit() {
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadInitData();
    this.query();
  }
  // 初始数据加载
  private loadInitData() {

    this.checkFlagNameList.push(...[{ label: '未审核', value: '' }, { label: '已审核', value: 'Y' }, { label: '审核失败', value: 'N' }]);

    this.editService.getPlantCode()
      .subscribe(result => {
        result.data.forEach(d => {
          this.plantCodeList.push({
            label: d,
            value: d,
          });
        });
      });

    this.editService.getModelName()
      .subscribe(result => {
        result.data.forEach(d => {
          this.modelNameList.push({
            label: d,
            value: d,
          });
        });
      });

  }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      modelName: this.queryParams.values.modelName,
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode,
      checkFlag: this.queryParams.values.checkFlag,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  httpAction = { url: this.editService.queryUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridView(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }

  public reviewed() {
    const rows = this.gridApi.getSelectedRows();
    if (rows.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选行记录!'));
      return;
    }
    this.editService.reviewed(rows).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
      this.query();
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.editService.exportAction({ url: this.editService.exportUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }
  public clear() {
    this.queryParams.values = {
      modelName: '',
      plantCode: '',
      itemCode: '',
      checkFlag: ''
    };
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.queryCommon();
  }
}
