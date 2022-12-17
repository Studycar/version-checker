import { Component, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { Router } from '@angular/router';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'viewrequest-form',
  templateUrl: './viewrequest-form.component.html',
  styleUrls: ['./viewrequest-form.component.css'],
  providers: [AppConfigService]
})
export class ConcurrentRequestViewrequestFormComponent extends CustomBaseContext implements OnInit {
  Params: any = {};
  gridHeight = 300;
  public columns = [
    { headerName: '请求编号', width: 120, field: 'requestId' },
    { headerName: '并发请求名称', width: 220, field: 'userConcurrentProgramName' },
    { headerName: '参数', width: 180, field: 'argumentText' },
    { headerName: '请求开始时间', width: 180, field: 'requestedStartDate' },
    { headerName: '提交人', width: 120, field: 'requestedBy' },
    { headerName: '状态', width: 120, field: 'phaseName' }];

  public gridView: GridDataResult;
  public pageSize = 20;
  public skip = 0;
  public lastColumnName: string;

  constructor(public msgSrv: NzMessageService,
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private requestSubmitQueryService: RequestSubmitQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.lastColumnName = this.columns[this.columns.length - 1].field;
    this.skip = 0;
    this.pageSize = 20;
    this.loadItems(this.skip / this.pageSize + 1, this.pageSize);
  }


  // onPageChanged({ pageNo, pageSize }) {
  //   this.gridApi.paginationSetPageSize(pageSize);
  //   this.gridApi.paginationGoToPage(pageNo - 1);
  //   this.loadItems(pageNo, pageSize);
  //   this.setLoading(false);
  // }
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.loadItems(pageNo, pageSize);
    } else {
      this.setLoading(false);
    }
  }


  loadItems(pageIndex: number, pageSize: number) {
    this.requestSubmitQueryService.getManagerRequest(this.Params.controllingManager, pageIndex, pageSize).subscribe(result => {
      let totalCount = 0;
      if (result.data != null && result.data.content !== null && result.data.content.length > 0) {
        this.gridData = result.data.content;
        totalCount = result.data.totalElements;
      }
      this.gridView = {
        data: this.gridData,
        total: totalCount
      };
    },
      errMsg => { },
      () => { }
    );
  }

}
