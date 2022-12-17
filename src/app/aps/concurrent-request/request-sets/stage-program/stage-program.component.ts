import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from '../../../../../../node_modules/ng-zorro-antd';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { StageProgArgsComponent } from '../stage-prog-args/stage-prog-args.component';
import { AddStageProgramComponent } from './add-stage-program/add-stage-program.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'stage-program',
  templateUrl: './stage-program.component.html',
  styleUrls: ['./stage-program.component.css']
})
export class StageProgramComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  i: any = {};
  param: any = {};
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: { template: this.headerTemplate },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,        // Complementing the Cell Renderer parameters
      }
    },
    { field: 'sequence', headerName: '序号' },
    { field: 'userConcurrentProgramName', headerName: '程序', tooltipField: 'userConcurrentProgramName' },
    { field: 'description', headerName: '说明', tooltipField: 'description' }
  ];

  constructor(public pro: BrandService,
    private modal: ModalHelper,
    private msg: NzMessageService,
    private requestSetsService: RequestSetsService,
    private commonQueryService: CommonQueryService,
    appconfig: AppConfigService,
    apptrans: AppTranslationService) {
    super({ pro: pro, appTranslationSrv: apptrans, msgSrv: msg, appConfigSrv: appconfig });
    this.gridHeight = 262;
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.i = this.param.i;
    this.query();
  }

  query() {
    super.query();

    this.queryCommon();
  }

  queryCommon() {
    const httpAction = { url: '/api/admin/baseRequestSetPrograms/queryRequestSetPrograms', method: 'GET' };

    this.commonQueryService.loadGridViewNew(httpAction, {
      requestSetId: this.i.requestSetId,
      requestSetStageId: this.i.requestSetStageId,
      isExport: false
    }, this.context);
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

  add() {
    const param = {
      operType: '新增',
      IsRefresh: false,
      i: {
        requestSetId: this.i.requestSetId,
        requestSetStageId: this.i.requestSetStageId,
        requestSetProgramId: null,
        sequence: null,
        concurrentProgramId: null
      }
    };
    this.modal.static(AddStageProgramComponent, { param: param }).subscribe(() => {
      if (param.IsRefresh) {
        this.queryCommon();
      }
    });
  }

  edit(record: any) {
    const param = {
      operType: '编辑',
      i: record,
      IsRefresh: false,
      Istrue: true
    };
    this.modal.static(AddStageProgramComponent, { param: param }).subscribe(() => {
      if (param.IsRefresh) {
        this.queryCommon();
      }
    });
  }

  Delete(obj: any) {
    this.requestSetsService.DeleteStageProgram(obj).subscribe(res => {
      if (res.code === 200) {
        this.msg.success(res.msg);
        this.queryCommon();
      } else {
        this.msg.success(res.msg);
      }
    });
  }

  Argument(record: any) {
    const param = {
      i: record,
      stageName: this.i.stageName,
      userRequestSetName: this.param.userRequestSetName
    };
    this.modal.static(StageProgArgsComponent, { param: param }).subscribe();
  }

}
