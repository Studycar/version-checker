import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from '../../../../../../node_modules/ng-zorro-antd';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { AddDefineStageComponent } from './add-define-stage/add-define-stage.component';
import { StageProgramComponent } from '../stage-program/stage-program.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'define-stage',
  templateUrl: './define-stage.component.html',
  styleUrls: ['./define-stage.component.css']
})
export class DefineStageComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  i: any = {};

  public columns22 = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: { template: this.headerTemplate },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,      // Complementing the Cell Renderer parameters
      }
    },
    { field: 'displaySequence', headerName: '序号' },
    { field: 'stageName', headerName: '阶段', tooltipField: 'stageName' },
    { field: 'description', headerName: '说明', tooltipField: 'description' }
  ];


  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private msg: NzMessageService,
    private requestSetsService: RequestSetsService,
    private commonQueryService: CommonQueryService,
    appconfig: AppConfigService,
    apptrans: AppTranslationService
  ) {
    super({ pro: pro, appTranslationSrv: apptrans, msgSrv: msg, appConfigSrv: appconfig });
    this.gridHeight = 270;
    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
  }

  query() {
    super.query();

    this.queryCommon();
  }

  queryCommon() {

    const httpAction = { url: '/api/admin/baseRequestSetStages/queryRequestSetsStages', method: 'GET' };

    this.commonQueryService.loadGridViewNew(httpAction, { requestSetId: this.i.requestSetId, isExport: false }, this.context);
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
        requestSetStageId: null
      }
    };
    this.modal.static(AddDefineStageComponent, { param: param }).subscribe(() => {
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
    this.modal.static(AddDefineStageComponent, { param: param }).subscribe(() => {
      if (param.IsRefresh) {
        this.queryCommon();
      }
    });
  }

  Delete(obj: any) {
    this.requestSetsService.DeleteRequestStage(obj).subscribe(res => {
      if (res.code === 200) {
        this.msg.success(res.msg);
        this.queryCommon();
      } else {
        this.msg.success(res.msg);
      }
    });
  }

  Request(record: any) {
    const param = {
      i: record,
      userRequestSetName: this.i.userRequestSetName
    };
    this.modal.static(StageProgramComponent, { param: param }).subscribe();
  }
}
