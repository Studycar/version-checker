import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from '../../../../../../node_modules/ng-zorro-antd';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { AddLinkStageComponent } from './add-link-stage/add-link-stage.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'link-stage',
  templateUrl: './link-stage.component.html',
  styleUrls: ['./link-stage.component.css']
})
export class LinkStageComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  i: any = {};
  public columns22 = [
    {
      colId: 0, field: '', headerName: '操作', width: 50, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: { template: this.headerTemplate },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'displaySequence', headerName: '序号' },
    { field: 'stageName', headerName: '阶段', tooltipField: 'stageName' },
    { field: 'successLinkName', headerName: '成功', tooltipField: 'successLinkName' },
    { field: 'warningLinkName', headerName: '警告', tooltipField: 'warningLinkName' },
    { field: 'errorLinkName', headerName: '错误', tooltipField: 'errorLinkName' }
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
    this.gridHeight = 263;
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

    this.commonQueryService.loadGridViewNew(httpAction, { requestSetId: this.i.requestSetId, isExport: false }, this.context,
      result => result,
      () => {
        for (let i = 0; i < this.gridData.length; i++) {
          this.gridData[i].successLinkName = this.getStageName(this.gridData[i].successLink);
          this.gridData[i].warningLinkName = this.getStageName(this.gridData[i].warningLink);
          this.gridData[i].errorLinkName = this.getStageName(this.gridData[i].errorLink);
        }
      });
  }

  getStageName(stageId: string): string {
    let stageName = '';
    const stageRow = this.gridData.find(x => x.requestSetStageId === stageId);
    if (stageRow !== undefined) {
      stageName = stageRow.stageName;
    }
    return stageName;
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

  save() {
    this.requestSetsService.UpdateStartStage(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msg.success('保存成功');
      } else {
        this.msg.success(res.msg);
      }
    });
  }

  edit(record: any) {
    const param = {
      i: record,
      data: this.gridData,
      IsRefresh: false,
      Istrue: true
    };
    this.modal.static(AddLinkStageComponent, { param: param }).subscribe(() => {
      if (param.IsRefresh) {
        this.queryCommon();
      }
    });
  }
}
