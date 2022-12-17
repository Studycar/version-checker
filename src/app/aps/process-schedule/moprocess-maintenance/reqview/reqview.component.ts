import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { map } from 'rxjs/operators';
import { process } from '@progress/kendo-data-query';
import { QueryService } from './queryService1';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { MoProcessMaintenanceService } from '../../../../modules/generated_module/services/moprocess-maintenance-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';


/**
 * @zwh 2018-12-04
 * 构造函数-----
 * queryservice: 公共查询
 * querydata: 服务
 * ------------
 */

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'process-schedule-moprocess-maintenance-reqview',
  templateUrl: './reqview.component.html',
  providers: [QueryService]
})
export class ProcessScheduleMoprocessMaintenanceReqviewComponent extends CustomBaseContext implements OnInit {
  record: any = {};
  i: any;
  context = this;
  mooptions: any[] = [];
  plantoptions: any[] = [];
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private queryService: QueryService,
    private querydata: MoProcessMaintenanceService,
    private commonquery: CommonQueryService
  ) { super({ appTranslationSrv: null, msgSrv: msgSrv, appConfigSrv: null }); }

  private httpAction = {
    url: '',
    method: 'GET',
    data: false
  };

  queryParams = {
    defines: [
      { field: 'PlANT_CODE', title: '工序工单', ui: { type: UiType.select, options: this.mooptions, eventNo: 1 } },
      { field: 'SCHEDULE_GROUP_CODE', title: '装配件', ui: { type: UiType.text } },
      { field: 'RESOURCE_CODE', title: '需求数量', ui: { type: UiType.text } },
      { field: 'SOURCE_MAKE_ORDER_NUM', title: '供应数量', ui: { type: UiType.text } },
      { field: 'PROJECT_NUMBER', title: '组织', ui: { type: UiType.select, options: this.plantoptions } },
      { field: 'PROCESS_MAKE_ORDER_NUM', title: '生产线', ui: { type: UiType.text } },
      { field: 'PROCESS_CODE', title: '机型', ui: { type: UiType.text } },
      { field: 'ITEM_CODE', title: '需求时间', ui: { type: UiType.text } },
      { field: 'DESCRIPTIONS_CN', title: '物料描述', ui: { type: UiType.text } }
    ],
    values: {
      PlANT_CODE: '',
      SCHEDULE_GROUP_CODE: '',
      RESOURCE_CODE: '',
      SOURCE_MAKE_ORDER_NUM: '',
      PROJECT_NUMBER: '',
      PROCESS_MAKE_ORDER_NUM: '',
      PROCESS_CODE: '',
      ITEM_CODE: '',
      DESCRIPTIONS_CN: ''
    }
  };

  ngOnInit(): void {
    this.viewAsync = this.queryService.pipe(
      map(data => process(data, this.gridState))
    );


    this.query();

    this.LoadData();

  }


  LoadData() {
    this.querydata.GetMoNum().subscribe(res => {
      res.Extra.forEach(element => {
        this.mooptions.push({
          label: element.PROCESS_MAKE_ORDER_NUM,
          value: element.PROCESS_MAKE_ORDER_NUM
        });
      });
    });

    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.PlANT_CODE,
          value: element.PlANT_CODE
        });
      });
    });
  }

  query() {
    super.query();
    this.queryService.read(this.httpAction, this.queryParams.values);
  }

  close() {
    this.modal.destroy();
  }
}
