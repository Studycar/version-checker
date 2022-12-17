import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from '../../../../modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from '../../../../layout/pro/pro.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { UiType } from '../../../../modules/base_module/components/custom-form-query.component';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { JobInfoService } from './job-info.service';
import { StatusRendererComponent } from './status-renderer/status-renderer.component';
import { EditJobInfoComponent } from './edit-job-info/edit-job-info.component';
import { Router } from '@angular/router';
import { JobAdminMessageApiData, SN } from '../../aps-job-admin.type';

@Component({
  selector: 'job-info',
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.css'],
})

export class JobInfoComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('tplTitle', { static: false }) tplTitle: TemplateRef<{}>;
  @ViewChild('tplContent', { static: false }) tplContent: TemplateRef<{}>;
  @ViewChild('tplFooter', { static: false }) tplFooter: TemplateRef<{}>;

  jobGroupOptions = [];
  triggerStatusOptions = [];

  columns: any[];
  queryParams = {
    defines: [
      {
        field: 'jobGroup',
        title: '执行器',
        ui: { type: UiType.select, options: this.jobGroupOptions },
      },
      {
        field: 'triggerStatus',
        title: '状态',
        ui: { type: UiType.select, options: this.triggerStatusOptions },
      },
      {
        field: 'jobDesc',
        title: '任务描述',
        ui: { type: UiType.text },
      },
      {
        field: 'executorHandler',
        title: '任务',
        ui: { type: UiType.text },
      },
      {
        field: 'author',
        title: '负责人',
        ui: { type: UiType.text },
      },
    ],
    values: {
      jobGroup: 5,
      triggerStatus: -1,
      jobDesc: '',
      executorHandler: '',
      author: '',
    },
  };
  frameworkComponents;

  page = {
    start: 0,
    length: 10,
  };

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appService: AppConfigService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private modalService: NzModalService,
    private jiService: JobInfoService,
    private router: Router,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appService,
    });
  }

  view2: { data: any[], total: SN } = { data: [], total: 0 };

  ngOnInit() {
    this.columns = [
      {
        field: 'action',
        headerName: '操作',
        width: 200,
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
        headerName: '任务ID',
      },
      {
        field: 'jobDesc',
        headerName: '任务描述',
      },
      {
        field: 'glueType',
        headerName: '运行模式',
        valueGetter: (param) => `${param.data.glueType}:${param.data.executorHandler}`,
      },
      {
        field: 'jobCron',
        headerName: 'Cron',
      },
      {
        field: 'author',
        headerName: '负责人',
      },
      {
        field: 'triggerStatus',
        headerName: '状态',
        cellRenderer: 'statusRenderer',
      },
    ];
    // In18列
    this.headerNameTranslate(this.columns);
    this.query();

    this.frameworkComponents = {
      ...this.gridOptions.frameworkComponents,
      statusRenderer: StatusRendererComponent,
    };
    this.gridOptions = { ...this.gridOptions, frameworkComponents: this.frameworkComponents };

    /**
     * 查询参数下拉初始化
     */
    this.jiService.getJobGroup().subscribe(res => this.jobGroupOptions.push(...res));
    this.jiService.getTriggerStatus().subscribe(res => this.triggerStatusOptions.push(...res));

  }

  query(): void {
    const param = { ...this.queryParams.values, ...this.page };
    this.jiService.search(param).subscribe(res => {
      this.gridData = res.data;
      this.view2 = { data: res.data, total: res.recordsTotal };
    });
  }

  addTarget(): void {
    this.modal.static(EditJobInfoComponent, { edit: false }).subscribe(res => this.query());
  }

  start(item) {
    const id = { id: item.id };
    this.jiService.start(id, item.triggerStatus).subscribe((res: JobAdminMessageApiData) => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(`${item.triggerStatus === 0 ? '启动' : '停止'}成功`));
      } else {

      }
      this.query();
    });
  }

  getLog(item) {
    this.router.navigateByUrl('/aps-job-admin/job-log');
  }

  /**
   * 下次执行时间
   */
  nextExecuteTime(item): void {
    this.jiService.nextExecuteTime({ cron: item.jobCron }).subscribe(res => {
      if (res && res.length > 0) {
        this.modalService.create({
          nzTitle: '下次执行时间',
          nzContent: res.join('<br/>'),
          nzFooter: null,
        });
      }
    });
  }

}
