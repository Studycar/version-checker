import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomOperateCellRenderComponent } from '../../../../modules/base_module/components/custom-operatecell-render.component';
import { UiType } from '../../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { BrandService } from '../../../../layout/pro/pro.service';
import { JobGroupService } from './job-group.service';
import { RegistryListRendererComponent } from './registry-list-renderer/registry-list-renderer.component';
import { EditJobGroupComponent } from './edit-job-group/edit-job-group.component';
import { JobAdminMessageApiData } from '../../aps-job-admin.type';


@Component({
  selector: 'job-group',
  templateUrl: './job-group.component.html',
  styleUrls: ['./job-group.component.css'],
})
export class JobGroupComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  columns: any[];
  queryParams = {
    defines: [
      {
        field: 'appname',
        title: 'AppName',
        ui: { type: UiType.text },
      },
      {
        field: 'title',
        title: '名称',
        ui: { type: UiType.text },
      },
    ],
    values: {
      appname: '',
      title: '',
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
    private modal: ModalHelper,
    private jobGroupService: JobGroupService,
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
        field: 'appname',
        headerName: 'AppName',
      },
      {
        field: 'title',
        headerName: '名称',
      },
      {
        field: 'addressType',
        headerName: '注册方式',
        valueFormatter: params => params.value === 0 ? '自动注册' : '手动录入',
      },
      {
        field: 'addressList',
        headerName: 'OnLine 机器地址',
        cellRenderer: 'registryListRenderer',
      },
      {
        field: 'registryList',
        headerName: '注册节点',
        hide: true,
      },
    ];
    // In18列
    this.headerNameTranslate(this.columns);
    this.query();

    this.frameworkComponents = {
      ...this.gridOptions.frameworkComponents,
      registryListRenderer: RegistryListRendererComponent,
    };
    this.gridOptions = { ...this.gridOptions, frameworkComponents: this.frameworkComponents };
  }

  query(): void {
    const param = { ...this.queryParams.values, ...this.page };
    this.jobGroupService.search(param).subscribe(res => {
      this.gridData = res.data;
    });
  }

  addExecutor(): void {
    this.modal.static(EditJobGroupComponent, { edit: false }).subscribe(res => {
      this.handleSaveAndEdit(res, '保存');
      this.query();
    });
  }

  edit(item): void {
    this.modal.static(EditJobGroupComponent, { edit: true, item }).subscribe(res => {
      this.handleSaveAndEdit(res, '编辑');
      this.query();
    });
  }

  remove(item): void {
    this.jobGroupService.remove({ id: item.id }).subscribe(res => {
      this.handleSaveAndEdit(res, '删除');
      this.query();
    });
  }

  /**
   * 处理结果回调，决定提示框内容
   * @param {JobAdminMessageApiData} res
   * @param {"保存" | "编辑" | "删除"} behavior
   */
  handleSaveAndEdit(res: JobAdminMessageApiData, behavior: '保存' | '编辑' | '删除'): void {
    if (res.code === 200) {
      this.msgSrv.success(`${behavior}成功`);
    } else if (res.code === 500) {
      this.msgSrv.error(`${behavior}失败:${ res.msg }`);
    }
  }
}
