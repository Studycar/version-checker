/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:05
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-02 16:10:08
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './viewservice';
import { getDate } from 'date-fns';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'SearchEndMoComponent',
  templateUrl: './searchEndMo.component.html',
  providers: [QueryService]
})
export class SearchEndMoComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  record: any = {};
  scheduleGroup: any;
  title: String = '置尾单查询';
  context = this;
  statusOptions: any[] = [];
  public gridView: GridDataResult;
  public gridData: any[] = [];
  public pageSize = 10;
  public skip = 0;
  public mySelection: any[] = [];
  public mydate: any;
  public applicationOptions: any[] = [];
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 20,
  };

  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private viewservice: QueryService,
    public translateservice: AppTranslationService,
    public appService: AppConfigService,
    private commonquery: CommonQueryService
  ) {
    super({ appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 303;
  }
  expColumns = [
    { field: 'scheduleGroupCode', title: '计划组', width: 200, locked: true },
    { field: 'makeOrderNum', title: '工单号', width: 200, locked: true },
    { field: 'itemCode', title: '物料编码', width: 200, locked: true },
    { field: 'descriptions', title: '物料描述', width: 200, locked: true },
    { field: 'demandDate', title: '需求时间', width: 200, locked: true },
    { field: 'fpcTime', title: '开始时间', width: 200, locked: true },
    { field: 'makeOrderStatus', title: '工单状态', width: 200, locked: true },
    { field: 'resourceCode', title: '生产线', width: 200, locked: true },
    { field: 'moQty', title: 'MO数量', width: 200, locked: true },
    { field: 'completeQty', title: '完工数量', width: 200, locked: true },
    { field: 'comment', title: '备注', width: 200, locked: true }
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.viewservice.exportAction(
      this.httpAction,
      this.queryParams,
      this.excelexport
    );
  }

  public columns = [
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderNum', headerName: '工单号', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码',  menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '物料描述', tooltipField: 'descriptions', menuTabs: ['filterMenuTab']},
    { field: 'demandDate', headerName: '需求时间', menuTabs: ['filterMenuTab']},
    { field: 'fpcTime', headerName: '开始时间', menuTabs: ['filterMenuTab']},
    { field: 'makeOrderStatus', headerName: '工单状态', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1).label'},
    { field: 'resourceCode', headerName: '生产线', menuTabs: ['filterMenuTab']},
    { field: 'moQty', headerName: 'MO数量', menuTabs: ['filterMenuTab']},
    { field: 'completeQty', headerName: '完工数量', menuTabs: ['filterMenuTab']},
    { field: 'comment', headerName: '备注信息', menuTabs: ['filterMenuTab']}
  ];

  ngOnInit(): void {
    this.queryParams = {
      scheduleGroup: this.scheduleGroup
    };

    this.commonquery
    .GetLookupByTypeLang('PS_MAKE_ORDER_STATUS', this.appService.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.statusOptions.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });
    this.query();
  }

  private httpAction = {
    url: '/api/ps/digitalizationworkbenchrs/queryEndMo',
    method: 'GET'
  };

  query() {
    this.viewservice.loadGridViewNew(this.httpAction, this.queryParams, this.context);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.statusOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }
}
