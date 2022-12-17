import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { process } from '@progress/kendo-data-query';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from '.././query.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { MessageManageService } from '../../../../modules/generated_module/services/message-manage-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'genetic-plan-production-view',
  templateUrl: './view.component.html',
  providers: [QueryService],
})
export class GeneticPlanProductionViewComponent extends CustomBaseContext implements OnInit {

  i: any;
  operatingunits: any[] = [];
  enableflags: any[] = [];
  buorgids: any[] = [];
  masterorganizationids: any[] = [];
  scheduleregions: any[] = [];
  organizationids: any[] = [];
  extendColunmTitle = null;
  public totalCount = 0;

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private commonqueryService: CommonQueryService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public pro: BrandService,
    private messageManageService: MessageManageService,
    private appConfigService: AppConfigService,
    private queryService: CommonQueryService,
    private appGridStateService: AppGridStateService,
    private appconfig: AppConfigService
  )  // tslint:disable-next-line:one-line
  {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  // public queryParams = {
  //   defines: [
  //     { field: 'REQ_NUMBER', title: '订单号', ui: { type: UiType.textarea } },
  //     { field: 'REQ_LINE_NUM', title: '订单行号', ui: { type: UiType.textarea } },
  //   ],
  //   values: {
  //     REQ_NUMBER: '',
  //     REQ_LINE_NUM: ''
  //   }
  // };

  public query() {
    super.query();
    this.queryCommon();
  }

  public ngOnInit(): void {
    this.query();
  }

  private cloneParam(): any {
    const dto = {
      performanceSubItem: this.i.performanceSubItem,
      popuId: this.i.popuId,
      lookupvalue: this.i.lookupvalue,
      // REQ_NUMBER: this.queryParams.values.REQ_NUMBER ,
      // REQ_LINE_NUM: this.queryParams.values.REQ_LINE_NUM
    };
    return dto;
  }

  private queryCommon() {
    const queryValues = this.cloneParam();
    queryValues.pageIndex = this._pageNo;
    queryValues.pageSize = this._pageSize;
    queryValues.IsExport = false;
    this.commonQueryService.SearchScoreDtl(queryValues).subscribe(result => {
     // this.gridData.length = 0;
      this.gridData = result.data.content;
      this.extendColunmTitle = result.extra.content;
      this.totalCount = result.data.totalCount;
      this.columns = [];
      for (let a = 0; a < this.extendColunmTitle.length; a++) {
        let col = null;
        console.log(this.extendColunmTitle[a].lookupCode);
        if (this.extendColunmTitle[a].lookupCode === null) {
          this.extendColunmTitle[a].lookupCode = 'SUB_ITEM_GRADE';
        }
        col = { field: this.extendColunmTitle[a].lookupCode, headerName: this.extendColunmTitle[a].additionCode, width: 180, locked: false };
        this.columns.push(col);
      }
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length, // this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };
    }
    );
  }


  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
