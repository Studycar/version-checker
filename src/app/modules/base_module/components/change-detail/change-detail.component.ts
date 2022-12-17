import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";

@Component({
  selector: 'planschedule-hw-change-detail',
  templateUrl: './change-detail.component.html',
})
export class PlanscheduleHWChangeDetailComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    private modal: NzModalRef,
    private queryService: CommonQueryService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
  }
  
  httpAction = { url: '', method: 'GET' }
  myAgGrid = {
    myAgGridState: '',
    myAgGridRowKey: '',
  };
  queryParamsValue: any = {};
  exportFileName: string = '';
  tableColumns = [];
  tableExpColumnsOptions = [];

  isShowExport: boolean = true;
  isShowQuery: boolean = false;
  
  defineQueryParams: { defines: any, values: any} = {
    defines: [

    ],
    values: {

    }
  };
  ngOnInit() {
    this.queryParams.defines = [...this.queryParams.defines, ...this.defineQueryParams.defines];
    this.queryParams.values = Object.assign({}, this.queryParams.values, this.defineQueryParams.values);
    this.columns = [
      ...this.tableColumns,
      {
        field: 'operateBy',
        width: 100,
        headerName: '操作人',
      },
      {
        field: 'operateDate',
        width: 100,
        headerName: '操作时间',
      },
    ];
    this.expColumnsOptions = [...this.tableExpColumnsOptions];
    this.query();
  }

  public optionsFind = (value, index) => {

  };

  queryParams = {
    defines: [
    ],
    values: {
    }
  };

  clear() {
    this.queryParams.values = Object.assign({}, {
    }, this.defineQueryParams.values)
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    const queryParams = this.getQueryParamsValue();
    this.queryService.loadGridViewNew(
      this.httpAction,
      queryParams,
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    const params = Object.assign({}, this.queryParamsValue, {
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }, this.queryParams.values);
    if(this.queryParams) {
      this.queryParams.defines.forEach(param => {
        if(param.ui.type === UiType.popupSelect) {
          params[param.field] = this.queryParams.values[param.field].value;
        }
        if(param.ui.type === UiType.date) {
          params[param.field] = this.queryService.formatDate(this.queryParams.values[param.field]);
        }
      });
    }
    return params;
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