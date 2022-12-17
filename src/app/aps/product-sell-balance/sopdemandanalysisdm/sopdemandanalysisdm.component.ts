/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-01-16 10:22:40
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-10 15:47:07
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from './queryService';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { ProductSellBalanceSopdemandanalysisdmEditComponent } from './edit/edit.component';
import { SopDemandAnalysisdm } from 'app/modules/generated_module/services/sopdemandanalysisdm-service';
import { DemandAnalysisImportComponent } from './import/import.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopdemandanalysisdm',
  templateUrl: './sopdemandanalysisdm.component.html',
  providers: [QueryService],
})
export class ProductSellBalanceSopdemandanalysisdmComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopDemandAnalysisdm,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: apptranslate,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.headerNameTranslate(this.columns);
  }

  regionOptions: any[] = [];
  YesOrNo: any[] = [];
  context = this;
  demandOptions: any[] = [];

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
    this.plantChange(this.queryParams.values.regionCode); // jianl新增，触发变化事件，加载数据
  }

  LoadData() {
    this.commonquery.GetScheduleRegions().subscribe(res => {
      res.data.forEach(element => {
        this.regionOptions.push({
          label: element.scheduleRegionCode,
          value: element.scheduleRegionCode,
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });
  }

  httpAction = {
    url: this.querydata.url,
    method: 'GET',
  };

  public queryParams = {
    defines: [
      {
        field: 'regionCode',
        title: '事业部',
        ui: { type: UiType.select, options: this.regionOptions, eventNo: 1 },
      },
      {
        field: 'demandDivision',
        title: '需求分析维度',
        ui: { type: UiType.select, options: this.demandOptions },
      },
      {
        field: 'enableFlag',
        title: '是否有效',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
    ],
    values: {
      regionCode: this.appconfig.getActiveScheduleRegionCode(),
      demandDivision: '',
      enableFlag: '',
    },
  };

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.GetQueryParams(),
      this.context,
    );
  }

  GetQueryParams(isExport: boolean = false) {
    return {
      businessUnitCode: this.queryParams.values.regionCode,
      divisionName: this.queryParams.values.demandDivision,
      enableFlag: this.queryParams.values.enableFlag,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

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
      field: 'businessUnitCode',
      headerName: '事业部',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'divisionName',
      headerName: '需求分析维度',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'divisionValue',
      headerName: '维度值',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      headerName: '是否有效',
      valueFormatter: function (params) {
        return params.value === 'Y' ? '是' : '否';
      },
      menuTabs: ['filterMenuTab'],
    },
  ];

  expColumns = [
    { field: 'businessUnitCode', title: '事业部', width: 200, locked: false },
    {
      field: 'divisionName',
      title: '需求分析维度',
      width: 200,
      locked: false,
    },
    { field: 'divisionValue', title: '维度值', width: 200, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: false },
  ];
  expColumnsOptions = [
    { field: 'enableFlag', options: this.YesOrNo },
  ];

  clear() {
    this.queryParams.values = {
      regionCode: this.appconfig.getActiveScheduleRegionCode(),
      demandDivision: null,
      enableFlag: null,
    };
  }

  add(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopdemandanalysisdmEditComponent,
        {
          i: item === undefined ? { id: null } : item,
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  /*remove(value: any) {
    this.querydata.remove(value).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }*/

 /* RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }*/

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryService.exportAction(
      this.httpAction,
      this.GetQueryParams(true),
      this.excelexport,
      this,
    );
  }

  plantChange(value: any) {
    this.queryParams.values.demandDivision = null;
    this.querydata.GetDemand(value).subscribe(res => {
      this.demandOptions.length = 0;
      res.data.forEach(element => {
        this.demandOptions.push({
          label: element,
          value: element,
        });
      });
    });
  }

  import() {
    this.modal
      .static(DemandAnalysisImportComponent, {}, 'md')
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}
