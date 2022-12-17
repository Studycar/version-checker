import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from '../../../../../../node_modules/ng-zorro-antd';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { AddStageProgArgsComponent } from './add-stage-prog-args/add-stage-prog-args.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'stage-prog-args',
  templateUrl: './stage-prog-args.component.html',
  styleUrls: ['./stage-prog-args.component.css']
})
export class StageProgArgsComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  i: any = {};
  param: any = {};
  typeOptions: any[] = [];
  public columns22 = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: { template: this.headerTemplate },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'columnSeqNum', headerName: '序号' },
    { field: 'userPromptName', headerName: '提示', tooltipField: 'userPromptName' },
    { field: 'sharedParameterName', headerName: '共享参数', tooltipField: 'sharedParameterName' },
    { field: 'defaultType', headerName: '默认值类型', tooltipField: 'defaultType', valueFormatter: 'ctx.optionsFind(value,2).label' },
    { field: 'defaultValue', headerName: '默认值', tooltipField: 'defaultValue' }
  ];

  constructor(public pro: BrandService,
    private modal: ModalHelper,
    private msg: NzMessageService,
    private requestSetsService: RequestSetsService,
    private commonQueryService: CommonQueryService,
    appconfig: AppConfigService,
    apptrans: AppTranslationService) {
    super({ pro: pro, appTranslationSrv: apptrans, msgSrv: msg, appConfigSrv: appconfig });
    this.gridHeight = 270;
    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;
    this.i = this.param.i;

    this.typeOptions.push({
      label: 'SQL',
      value: 'S'
    }, {
      label: 'Constant',
      value: 'C'
    });
    this.query();
  }

  query() {
    super.query();

    this.queryCommon();
  }

  queryCommon() {
    const httpAction = { url: '/api/admin/baseRequestSetProgArgs/queryRequestSetProgArgs', method: 'GET' };

    this.commonQueryService.loadGridViewNew(httpAction, {
      concurrentProgramId: this.i.concurrentProgramId,
      requestSetProgramId: this.i.requestSetProgramId,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: false
    }, this.context);
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 2:
        options = this.typeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
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

  edit(record: any) {
    record.requestSetId = this.i.requestSetId;
    record.requestSetStageId = this.i.requestSetStageId;
    const param = {
      i: record,
      IsRefresh: false
    };
    this.modal.static(AddStageProgArgsComponent, { param: param })
      .subscribe(() => {
        if (param.IsRefresh) {
          this.queryCommon();
        }
      });
  }

  Delete(obj: any) {
    obj.updateFlag = 'N';
    this.requestSetsService.deleteRequestSetProgArgs(obj).subscribe(res => {
      if (res.code === 200) {
        this.msg.success('删除成功');
        this.queryCommon();
      } else {
        this.msg.error(res.msg);
      }
    });
  }

}
