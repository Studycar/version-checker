import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs/operators';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ConcurrentManagerService } from '../../../modules/generated_module/services/concurrent-manager-service';
import { Router } from '@angular/router';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ConcurrentRequestConcurrentManagersViewComponent } from './view/view.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-managers',
  templateUrl: './concurrent-managers.component.html',
})
export class ConcurrentRequestConcurrentManagersComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public spanStyleEx = {
    'cursor': 'Pointer'
  };



  public columns22 = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'userConcurrentManangerName', headerName: '名称', tooltipField: 'userConcurrentManangerName', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'targetNode', headerName: '节点', tooltipField: 'targetNode', menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    {
      field: 'runningProcesses', headerName: '实际进程', tooltipField: 'runningProcesses', menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    { field: 'targetProcesses', headerName: '目标进程', tooltipField: 'targetProcesses', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'controllingManagerR', headerName: '运行中请求', tooltipField: 'controllingManagerR', menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    { field: 'controllingManagerP', headerName: '待定请求', tooltipField: 'controllingManagerP', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'statusName', headerName: '状态', tooltipField: 'statusName', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'controlName', headerName: '命令', tooltipField: 'controlName', menuTabs: ['filterMenuTab', 'columnsMenuTab'] }
  ];

  public gridData: any[] = [];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private concurrentManagerService: ConcurrentManagerService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appconfig: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });

    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;
    this.Query();
  }

  Query() {
    this.gridData = [];
    this.concurrentManagerService.Query().subscribe(result => {
      if (result.code === 200 && result.data.length !== undefined) {
        this.gridData = result.data;
        this.view = {
          data: process(this.gridData, {
            sort: this.gridState.sort,
            skip: 0,
            take: this.gridData.length, // this.gridState.take,
            filter: this.gridState.filter,
          }).data,
          total: this.gridData.length,
        };
      }
    },
      errMsg => { },
      () => { }
    );
  }

  Stop(concurrentManagerId: string) {
    this.UpdateControl(concurrentManagerId, 'D', 'ACTIVATED', '此数据状态已经为停用', '状态不为Activated，无法设置为停用！', '是否将选中的数据设置为停用？', '已将选中的数据设置为停用状态！');
  }

  Activate(concurrentManagerId: string) {
    this.UpdateControl(concurrentManagerId, 'A', 'DEACTIVATED', '此数据状态已经为激活', '状态不为Deactivated，无法设置为激活!', '是否将选中的数据设置为激活？', '已将选中的数据设置为激活状态！');
  }

  Termination() {
    // this.UpdateControl('T', 'ACTIVATED', '此数据状态已经为终止', '状态不为Activated，无法设置为终止！', '是否将选中的数据设置为终止？', '已将选中的数据设置为终止状态！');
  }

  Check() {
    // this.UpdateControl('V', 'ACTIVATED', '此数据状态已经为核实', '状态不为Activated，无法设置为核实！', '是否将选中的数据设置为核实？', '已将选中的数据设置为核实状态！');
  }

  Request(concurrentManagerId: string, targetNode: string) {
    this.modal
      .static(ConcurrentRequestConcurrentManagersViewComponent,
        { Params: { controllingManager: concurrentManagerId, nodeName1: targetNode } })
      .subscribe();
  }

  Refresh() {
    this.Query();
  }

  UpdateControl(concurrentManagerId: string, controlCodeEx: string, statusEx: string, msg1: string, msg2: string, msg3: string, msg4: string) {
    this.concurrentManagerService.GetControlById(concurrentManagerId).subscribe(
      result => {
        if (result.code === 200) {
          let status = '';
          let controlCode = '';
          result.data.forEach(d => {
            status = d.status;
            controlCode = d.controlCode;
          });

          if (controlCode !== '' && controlCode !== null && controlCode !== 'undefined' && controlCode === controlCodeEx) {
            this.msgSrv.info(msg1);
            return;
          }

          if (status !== '' && status !== null && status !== 'undefined' && status !== statusEx) {
            this.msgSrv.info(msg2);
            return;
          }

          this.confirmationService.confirm({
            nzContent: this.appTranslationService.translate(msg3),
            nzOnOk: () => {
              this.concurrentManagerService.UpdateControlCodeByID(concurrentManagerId, controlCodeEx).subscribe(res => {
                if (res.code === 200) {
                  this.msgSrv.success(msg4);
                  this.Query();
                } else {
                  this.msgSrv.error(res.msg);
                }
              });
            }
          });
        } else {
          this.msgSrv.error(result.data);
          return;
        }
      });
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
