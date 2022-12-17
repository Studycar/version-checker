import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService1 } from './queryService1';
import { MoProcessMaintenanceService } from '../../../../modules/generated_module/services/moprocess-maintenance-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'process-schedule-moprocess-maintenance-view',
  templateUrl: './view.component.html',
  providers: [QueryService1]
})
export class ProcessScheduleMoprocessMaintenanceViewComponent extends CustomBaseContext implements OnInit {

  i: any;
  context = this;
  plantCode: any;
  processMakeOrderNum: any;
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryservice1: QueryService1,
    private querydata: MoProcessMaintenanceService,
    private appconfig: AppConfigService,
    private apptrans: AppTranslationService
  ) {
    super({ appTranslationSrv: apptrans, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 270;
  }

  httpAction = {
    url: this.querydata.baseUrl1,
    method: 'GET'
  };
  queryParams = {
    plantCode: '',
    processMakeOrderNum: ''
  };

  public columns = [
    { field: 'level', headerName: 'MO层次' },
    { field: 'processMakeOrderNum', headerName: '工序工单' },
    { field: 'resourceCode', headerName: '资源' },
    { field: 'itemCode', headerName: '物料编码' },
    { field: 'description', headerName: '物料描述' },
    { field: 'processCode', headerName: '工序编码' },
    { field: 'demandDate', headerName: '需求时间' },
    { field: 'fpcTime', headerName: '计划开始时间', tooltipField: 'DESCRIPTIONS_CN' },
    { field: 'lpcTime', headerName: '计划完成时间' },
    { field: 'moQty', headerName: '任务数量' },
    { field: 'issuedQty', headerName: '发料数量' },
    { field: 'completedQty', headerName: '已完成量' },
    { field: 'scrapQty', headerName: '工序报废' },
    { field: 'scheduleGroupCode', headerName: '计划组' },
    { field: 'processMakeOrderStatus', headerName: '工单状态' },
    { field: 'backlogFlag', headerName: '尾单标识' }
  ];

  ngOnInit(): void {
    this.queryParams.plantCode = this.i.plantCode;
    this.queryParams.processMakeOrderNum = this.i.processMakeOrderNum;
    this.query();
  }

  export() {

  }

  query() {
    super.query();
    this.queryservice1.loadGridView(this.httpAction, this.queryParams, this.context);
  }

  close() {
    this.modal.destroy();
  }
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
