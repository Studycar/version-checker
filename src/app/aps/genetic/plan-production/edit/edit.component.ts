import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { process } from '@progress/kendo-data-query';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from '.././query.service';
import { UiType } from '../../../../modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { MessageManageService } from '../../../../modules/generated_module/services/message-manage-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'genetic-plan-production-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService],
})

export class GeneticPlanProductionEditComponent extends CustomBaseContext implements OnInit {
  public columns = [
    { field: 'plantCode', headerName: '工厂', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'version', headerName: '版本号', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'performanceName', headerName: '绩效方案', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'gaPopuGrade', headerName: '方案分数', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'gaUnitGrade', headerName: '工单评分', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'priority', headerName: '顺序', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'scheduleGroupCode', headerName: ' 计划组', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'resourceCode', headerName: '资源', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'attribute1', headerName: '资源描述', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'makeOrderNum', headerName: '工单号', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'itemModel', headerName: '模具-机型', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'attribute2', headerName: '装配件', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'attribute3', headerName: '装配件描述', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'moQty', headerName: '工单数量', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'attribute5', headerName: '完工数量', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'planQty', headerName: '排产数量', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'rate', headerName: '小时产出', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'fpcTime', headerName: '工单开始时间', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'lpcTime', headerName: '工单结束时间', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'demandDate', headerName: '需求时间', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'makeOrderType', headerName: '工单类型', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqNumber', headerName: '需求订单号', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqLineNum', headerName: '需求订单行号', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'makeOrderStatus',
      width: 120,
      headerName: '工单状态',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    { field: 'createdBy', headerName: '发布人', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'creationDate', headerName: ' 发布时间', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  ];
  i: any;
  moStatusOption: any[] = [];
  yesNoOption: any[] = [];
  public totalCount = 0;
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private commonqueryService: CommonQueryService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public pro: BrandService,
    private messageManageService: MessageManageService,
    private appConfigService: AppConfigService,
    private queryService: CommonQueryService,
    private appGridStateService: AppGridStateService,
    private appconfig: AppConfigService
  )  // tslint:disable-next-line:one-line
  {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  expData: any[] = [];
  expColumns = this.columns;
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const queryValues = this.cloneParam();
    queryValues.IsExport = true;
    this.commonQueryService.SearchVersionDtl(queryValues).subscribe(result => {
      this.excelexport.export(result.data);
    });
  }

  public queryParams = {
    defines: [
      { field: 'reqNumber', title: '需求订单号', ui: { type: UiType.textarea } },
      { field: 'reqLineNum', title: '需求订单行号', ui: { type: UiType.textarea } },
      { field: 'makeOrderNum', title: '工单号', ui: { type: UiType.textarea } },
    ],
    values: {
      reqNumber: '',
      reqLineNum: '',
      makeOrderNum: ''
    }
  };

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.moStatusOption;
        break;
      case 2:
        options = this.yesNoOption;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  public ngOnInit(): void {
    this.loadOptions();
    this.query();
  }

  private loadOptions() {
    this.commonqueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      this.moStatusOption.length = 0;
      result.Extra.forEach(d => {
        this.moStatusOption.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonqueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.yesNoOption.length = 0;
      result.Extra.forEach(d => {
        this.yesNoOption.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  private cloneParam(): any {
    const dto = {
      version: this.i.version,
      popuId: this.i.popuId,
      reqNumber: this.queryParams.values.reqNumber,
      reqLineNum: this.queryParams.values.reqLineNum,
      makeOrderNum: this.queryParams.values.makeOrderNum
    };
    return dto;
  }

  private queryCommon() {
    const queryValues = this.cloneParam();
    queryValues.pageIndex = this._pageNo;
    queryValues.pageSize = this._pageSize;
    queryValues.IsExport = false;
    this.commonQueryService.SearchVersionDtl(queryValues).subscribe(result => {
      //  this.gridData.length = 0;
      this.gridData = result.data.content;
      this.totalCount = result.data.totalCount;
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length, // this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };
    }
    );
  }

  public clear() {
    this.queryParams.values = {
      reqNumber: '',
      reqLineNum: '',
      makeOrderNum: ''
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
