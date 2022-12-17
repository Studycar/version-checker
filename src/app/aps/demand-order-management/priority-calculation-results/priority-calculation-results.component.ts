import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { BrandService } from '../../../layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from '../../../modules/base_module/components/custom-operatecell-render.component';
import { PriorityCalculationResultsService } from './priority-calculation-results.service';
import { PcrUpdateComponent } from './update/pcr-update.component';
import { PcrDetailComponent } from './detail/pcr-detail.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'priority-calculation-results',
  templateUrl: './priority-calculation-results.component.html',
  styleUrls: ['./priority-calculation-results.component.css'],
})
export class PriorityCalculationResultsComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  batchOptions: any[] = [];
  versionOptions: any[] = [];
  queryParams = {
    defines: [
      {
        field: 'batchNumber',
        title: '批次号',
        ui: { type: UiType.select, options: this.batchOptions },
      },
      {
        field: 'versionName',
        title: '优先级规则',
        ui: { type: UiType.select, options: this.versionOptions },
      },
      {
        field: 'reqNumber',
        title: '订单号',
        ui: { type: UiType.text },
      },
      {
        field: 'lineNumber',
        title: '行号',
        ui: { type: UiType.text },
      },
      {
        field: 'itemCode',
        title: '产品编码',
        ui: { type: UiType.textarea },
      }
    ],
    values: {
      batchNumber: null,
      versionName: null,
      reqNumber: null,
      lineNumber: null,
      itemCode: null
    },
  };
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private pcrService: PriorityCalculationResultsService,
    private queryService: CommonQueryService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
  }

  ngOnInit() {
    this.columns = [
      {
        colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
        headerComponentParams: {
          template: this.headerTemplate,
        },
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate,
        },
      },
      { field: 'batchNumber', headerName: '批次号', width: 120 },
      { field: 'versionName', headerName: '优先级规则', width: 120 },
      { field: 'reqNumber', headerName: '订单号', width: 120 },
      { field: 'lineNumber', headerName: '行号', width: 80 },
      { field: 'itemCode', headerName: '产品编码', width: 150 },
      { field: 'itemName', headerName: '产品名称', width: 170 },
      { field: 'demandDate', headerName: '需求日期', width: 170 },
      { field: 'grade', headerName: '得分', width: 80 },
      { field: 'priority', headerName: '优先级', width: 80 },
    ];
    // 获取批次号
    this.pcrService.getBatchNoList().subscribe(res => {
      res.data.forEach(item => {
        this.batchOptions.push({ value: item, label: item });
      });
    });
    // 获取优先级规则
    this.pcrService.getRuleList().subscribe(res => {
      res.data.forEach(item => {
        this.versionOptions.push({ value: item.versionName, label: item.versionName });
      });
    });
    this.query();
  }
  query() {
    super.query();
    this.queryCommon();
  }
  queryCommon() {
    const dto = this.getDto(false);
    this.pcrService.query(dto, this);
  }
  edit(item): void {
    this.modal.static(PcrUpdateComponent, { item }).subscribe(() => this.query());
  }

  queryDetail(item): void {
    this.modal.static(PcrDetailComponent, { item }).subscribe(() => this.query());
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getDto(true);
    this.queryService.export({ url: `/api/ps/ppOrderPriority/query`, method: 'GET' }, dto, this.excelexport, this.context);
  }
  private getDto(isExport: boolean) {
    const dto = this.clone(this.queryParams.values);
    // dto.QueryParams = { PageIndex: this._pageNo, PageSize: this._pageSize };
    dto.pageIndex = this._pageNo
    dto.pageSize = this._pageSize
    dto.isExport = isExport;
    return dto;
  }

  clear() {
    this.queryParams.values = {
      batchNumber: null,
      versionName: null,
      reqNumber: null,
      lineNumber: null,
      itemCode: null
    };
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
}
