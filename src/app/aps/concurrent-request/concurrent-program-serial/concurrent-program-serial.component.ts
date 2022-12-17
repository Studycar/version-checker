import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ConcurrentRequestConcurrentProgramSerialEditComponent } from './edit/edit.component';
import { ConcurrentProgramManageService } from '../../../modules/generated_module/services/concurrent-program-manage-service';
import { NzMessageBaseService, NzMessageService } from '../../../../../node_modules/ng-zorro-antd';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-program-serial',
  templateUrl: './concurrent-program-serial.component.html',
})
export class ConcurrentRequestConcurrentProgramSerialComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public gridView: GridDataResult = { data: [], total: 0 };
  i: any = {};

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public msg: NzMessageService,
    private concurrentProgramManageService: ConcurrentProgramManageService,
    private apptrans: AppTranslationService,
    private msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    public pro: BrandService,
  ) {
    super({ pro: pro, appTranslationSrv: apptrans, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.gridHeight = 270;
    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
  }

  add() {
    this.modal
      .static(ConcurrentRequestConcurrentProgramSerialEditComponent,
        {
          i: {
            runningConcurrentProgramId: this.i.runningConcurrentProgramId,
            id: null // 表示新增
          }
        }).subscribe((res) => {
          if (res) {
            this.query();
          }
    });
  }

  edit(record: any) {
    this.modal.static(ConcurrentRequestConcurrentProgramSerialEditComponent, { i: record }, 'lg')
      .subscribe((res) => {
        if (res) {
          this.query();
        }
      });

  }

  query() {
    super.query();
    this.loadData();
  }

  loadData() {
    this.concurrentProgramManageService.Getprogramserialquery(this.i.runningConcurrentProgramId, this._pageNo, this._pageSize).subscribe(result => {
      this.gridView = {
        data: result.data.content,
        total: result.data.totalElements
      };
      this.view = {
        data: result.data.content,
        total: result.data.totalElements
      };
    });
  }

  Delete(record: any) {
    this.concurrentProgramManageService.DeleteSerial(record).subscribe(res => {
      if (res.code === 200) {
        this.msg.success('删除成功');
        this.query();
      } else {
        this.msg.error(res.msg);
      }

    });
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
      this.loadData();
    } else {
      this.setLoading(false);
    }
  }

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
    { field: 'userConcurrentProgramName', headerName: '不兼容程序', tooltipField: 'USER_CONCURRENT_PROGRAM_NAME', menuTabs: ['filterMenuTab'] },
    {
      field: 'applicationName', headerName: '应用模块', tooltipField: 'APPLICATION_NAME', menuTabs: ['filterMenuTab']
    },
    {
      field: 'meaning', headerName: '不兼容类型', tooltipField: 'MEANING', menuTabs: ['filterMenuTab']
    }
  ];

}
