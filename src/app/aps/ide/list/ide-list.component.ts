import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { IdeListQueryService } from "./query.service";

@Component({
  selector: 'pi-ide-list',
  templateUrl: './ide-list.component.html',
  providers: [IdeListQueryService]
})
export class IdeListComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: IdeListQueryService,
    private routerInfo: Router,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  columns = [
    {
      field: 'procTitle',
      headerName: '流程标题',
      width: 300,
      cellStyle: { color: '#1890FF' }
    },
    {
      field: 'modelCategoryName',
      headerName: '流程类别',
      width: 120,
    },
    {
      field: 'templateCode',
      headerName: '模板编码',
      width: 300,
    },
    {
      field: 'actInstanceId',
      headerName: '流程ID',
      width: 180,
    },
    {
      field: 'instanceCreateName',
      headerName: '发起人',
      width: 120,
    },
    {
      field: 'assigneeName',
      headerName: '审核人',
      width: 120,
    },
    {
      field: 'taskName',
      headerName: '当前审批节点',
      width: 120,
    },
    {
      field: 'sendTime',
      headerName: '流程发起时间',
      width: 120,
    },
    {
      field: 'instanceCreateTime',
      headerName: '流程创建时间',
      width: 120,
    },
  ]

  ngOnInit() {
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
      this.dataPreFilter
    );
  }

  dataPreFilter = (res) => {
    if (res.data) {
      res.data = res.data.data;
      res.data.content = res.data.records;
    } else {
      res.data = {}
      res.data.content = []
      // this.msgSrv.error(this.appTranslationService.translate('请求待办列表时出错'))
    }
    return res;
  }

  getQueryParamsValue() {
    return {
      userCode: this.appconfig.getUserName(),
    }
  }

  onCellClicked(event) {
    if(event.colDef.field !== 'procTitle') { return; }
    const data = event.data
    this.routerInfo.navigateByUrl(`/ide/idePortal?instanceId=${data.actInstanceId || ''}&modelId=${data.templateCode || ''}&taskId=${data.taskId || ''}&taskKey=${data.taskKey || ''}&id=${data.id || ''}`);
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
