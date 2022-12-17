import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from '../../../layout/pro/pro.service';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from '../../../modules/base_module/components/custom-operatecell-render.component';
import { StockPlanParametersService } from './stock-plan-parameters.service';
import { StockPlanParametersDetailComponent } from './detail/stock-plan-parameters-detail.component';
import { UpdateStockPlanParametersComponent } from './update/update-stock-plan-parameters.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'StockPlanParameters',
  templateUrl: './stock-plan-parameters.component.html',
  styleUrls: ['./stock-plan-parameters.component.css'],
  providers: [StockPlanParametersService],
})
export class StockPlanParametersComponent extends CustomBaseContext implements OnInit {

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  yesNo: { label: string, value: any }[] = [];
  scheduleRegionCodeList: { label: string, value: string }[] = [];
  selectBy="id";

  httpAction = {
    url: '/api/ps/commodityindex/getData',
    method: 'POST',
    data: false
  };

  queryParams = {
    defines: [
      {
        field: 'scheduleRegionCode',
        title: '事业部',
        ui: { type: UiType.select, options: this.scheduleRegionCodeList },
      },
      {
        field: 'versionName',
        title: '方案号',
        ui: { type: UiType.text },
      },
      { field: 'enableFlag', title: '启用', ui: { type: UiType.select, options: this.yesNo } },
    ],
    values: {
      scheduleRegionCode: this.appconfig.getActiveScheduleRegionCode(),
      versionName: null,
      enableFlag: null,
    },
  };

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appconfig: AppConfigService,
    private commonQueryService: CommonQueryService,
    private oprService: StockPlanParametersService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
  }

  ngOnInit() {
    this.cloneQueryParams();
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.yesNo);

    this.columns = [
      {
        colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
        headerComponentParams: {
          template: this.headerTemplate,
        },
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate,
        },
      },
      {
        colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
        checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
        headerComponentParams: { template: this.headerTemplate },
      },
      { field: 'scheduleRegionCode', headerName: '事业部' },
      { field: 'versionName', headerName: '方案号' },
      { field: 'versionDesc', headerName: '方案描述' },
      {
        field: 'enableFlag', headerName: '启用',
        valueFormatter: 'ctx.optionsFind(value,1).label',
      },
    ];


    this.oprService.getAllScheduleRegion().subscribe(result => {
      this.scheduleRegionCodeList.length = 0;
      result.data.forEach(d => {
        this.scheduleRegionCodeList.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });

    this.query();
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesNo;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  businessUnitChange(): void {
  }


  query(): void {
    super.query();
    this.queryCommon();
  }
  queryCommon(): void {
    // this.oprService.query(this.getDto(false), this);
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getDto(false), this.context);
  }
  private getDto(isExport: boolean) {
    const dto = this.clone(this.queryParams.values);
    // dto.QueryParams = { PageIndex: this._pageNo, PageSize: this._pageSize };
    dto.pageIndex=this.lastPageNo;
    dto.pageSize=this.lastPageSize;
    dto.isExport = isExport;
    return dto;
  }

  add(): void {
    this.modal.static(UpdateStockPlanParametersComponent, {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      editType: 'add',
    }).subscribe(() => this.query());
  }

  edit(item): void {
    this.modal.static(UpdateStockPlanParametersComponent, {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      editType: 'update',
      item,
    }).subscribe(() => this.query());
  }

  queryDetail(item): void {
    this.modal.static(StockPlanParametersDetailComponent, { item }, 'lg', { nzWidth: 1000 }).subscribe(() => this.queryCommon());
  }

  delete(item): void {
    this.oprService.delete([item[this.selectBy]]).subscribe(res => {
      if (res.code == 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  deleteMultiple(): void {
    const selectionKeys = this.getGridSelectionKeys();
    if (selectionKeys.length === 0) {
      this.msgSrv.success('请选择要删除的数据!');
      return;
    } else {
      this.oprService.delete(selectionKeys).subscribe(res => {
        if (res.code == 200) {
          this.msgSrv.success(this.appTranslationService.translate('删除成功'));
          this.query();
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'enableFlag', options: this.yesNo }];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    // const dto = this.getDto(true);
    this.commonQueryService.exportAction(this.httpAction, this.getDto(true), this.excelexport, this);
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
