import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BrandService } from '../../../../layout/pro/pro.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { UiType } from '../../../../modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from '../../../../modules/base_module/components/custom-operatecell-render.component';
import { JobLogService } from './job-log.service';
import { MessageRendererComponent } from './message-renderer/message-renderer.component';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { formatDate } from '@angular/common';
import { isArray } from 'util';

@Component({
  selector: 'job-log',
  templateUrl: './job-log.component.html',
  styleUrls: ['./job-log.component.css'],
})
export class JobLogComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  jobGroupOptions = [];
  jobIdOptions = [];
  logStatusOptions = [];

  columns: any[];
  queryParams = {
    defines: [
      {
        field: 'jobGroup',
        title: '执行器',
        ui: { type: UiType.select, options: this.jobGroupOptions },
      },
      {
        field: 'jobId',
        title: '任务',
        ui: { type: UiType.select, options: this.jobIdOptions },
      },
      {
        field: 'logStatus',
        title: '状态',
        ui: { type: UiType.select, options: this.logStatusOptions },
      },
      {
        field: 'filterTime',
        title: '调度时间',
        ui: { type: UiType.dateTimeRange },
      },
    ],
    values: {
      jobGroup: 0,
      jobId: 0,
      logStatus: -1,
      filterTime: '',
    },
  };

  frameworkComponents;
  page = {
    start: 0,
    length: 10,
  };

  constructor(
    private pro: BrandService,
    private translateService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appService: AppConfigService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private jlService: JobLogService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: translateService,
      msgSrv: msgSrv,
      appConfigSrv: appService,
    });
  }

  ngOnInit() {
    this.columns = [
      {
        field: 'action',
        headerName: '操作',
        width: 100,
        pinned: this.pinnedAlign,
        lockPinned: true,
        headerComponentParams: {
          template: this.headerTemplate,
        },
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate,
        },
      },
      {
        field: 'id',
        headerName: 'ID',
      },
      {
        field: 'jobId',
        headerName: '任务ID',
      },
      {
        field: 'triggerTime',
        headerName: '调度时间',
        valueFormatter: ({ data }) => {
          if (data.triggerTime) {
            return formatDate(data.triggerTime, 'yyyy-MM-dd hh:mm:ss', 'en-US');
          } else {
            return data.triggerTime;
          }
        },
      },
      {
        field: 'triggerCode',
        headerName: '调度结果',
        cellStyle: params => params.value === 500 ? { color: 'red' } : { color: 'green' },
        valueFormatter: params => params.value === 500 ? '失败' : '成功',
      },
      {
        field: 'triggerMsg',
        headerName: '调度备注',
        cellRenderer: 'messageRenderer',
      },
      {
        field: 'handleTime',
        headerName: '执行时间',
        valueFormatter: ({ data }) => {
          if (data.handleTime) {
            return formatDate(data.handleTime, 'yyyy-MM-dd hh:mm:ss', 'en-US');
          } else {
            return data.handleTime;
          }
        },
      },
      {
        field: 'handleCode',
        headerName: '执行结果',
        cellStyle: params => params.value === 500 ? { color: 'red' } : { color: 'green' },
        valueFormatter: params => params.value === 500 ? '失败' : '成功',
      },
      {
        field: 'handleMsg',
        headerName: '执行备注',
        cellRenderer: 'messageRenderer',
      },
    ];
    // In18列
    this.headerNameTranslate(this.columns);
    this.query();

    this.frameworkComponents = {
      ...this.gridOptions.frameworkComponents,
      messageRenderer: MessageRendererComponent,
    };
    this.gridOptions = {
      ...this.gridOptions,
      frameworkComponents: this.frameworkComponents,
    };

    this.jlService.getJobGroup().subscribe(res => this.jobGroupOptions.push(...res));
    this.jlService.getJobId().subscribe(res => this.jobIdOptions.push(...res));
    this.jlService.getLogStatus().subscribe(res => this.logStatusOptions.push(...res));
  }

  query(): void {
    const param = { ...this.queryParams.values, ...this.page };
    if (isArray(param.filterTime)) {
      param.filterTime = param.filterTime.map(time => formatDate(time, 'yyyy-MM-dd hh:mm:ss', 'en-US')).join(' - ');
    }

    this.jlService.search(param).subscribe(res => {
        this.gridData = res.data;
      },
    );
  }

  clear(): void {

  }

  clean(): void {

  }

}
