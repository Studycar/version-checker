import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { PlanscheduleHWCustomerService } from "../query.service";

@Component({
  selector: 'planschedule-hw-customer-state-modify-detail',
  templateUrl: './modify-detail.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerStateModifyDetailComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public http: _HttpClient,
    private appconfig: AppConfigService,
    public queryService: PlanscheduleHWCustomerService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  columns = [
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
    },
    {
      field: 'cusStateOld',
      width: 120,
      headerName: '旧客户状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cusStateNew',
      width: 120,
      headerName: '新客户状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cusChangeState',
      width: 120,
      headerName: '变更记录状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'auditResult',
      width: 120,
      headerName: '审核结果'
    },
    {
      field: 'reason',
      width: 120,
      headerName: '变更原因'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ]
  cusStateOptions: any[] = [];
  cusChangeStateOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.cusStateOptions;
        break;
      case 2:
        options = this.cusChangeStateOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  ngOnInit() {
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRef('PS_CUSTOMER_STATUS', this.cusStateOptions);
    await this.queryService.GetLookupByTypeRef('PS_CUS_CHANGE_STATE', this.cusChangeStateOptions);
  }

  queryParams = {
    defines: [
      { field: 'cusCode', title: '客户编码', ui: { type: UiType.text } },
    ],
    values: {
      cusCode: '',
    }
  };

  httpAction = { url: '/api/ps/pscustomerhwstatechange/list', method: 'GET' }
  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    return {
      cusCode: this.queryParams.values.cusCode
    }
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.exportFile();
  }

  exportFile() {
    this.queryService.exportAction(
      this.httpAction,
      this.getQueryParamsValue(true),
      this.excelexport,
      this.context
    );
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }
}