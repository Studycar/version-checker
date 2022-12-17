import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-hw-spec-Index-Apply',
  templateUrl: './specIndexApply.component.html',
  providers: [QueryService],
})
export class PsHwSpecIndexApplyComponent extends CustomBaseContext implements OnInit {

  public selectBy = 'id';
  i: any;
  isLoading = false;


  public columns = [
    { field: 'applyId', width: 120, headerName: '使用标识', },
    { field: 'objId', width: 120, headerName: '对象标识', },
    { field: 'indexCode', width: 120, headerName: '索引编码', },
    { field: 'indexNo', width: 120, headerName: '索引序号', },
    { field: 'tenantId', width: 120, headerName: '租户标识', },
    { field: 'listOrder', width: 120, headerName: '排序', },
    { field: 'factoryCode', width: 120, headerName: '工厂', },
    { field: 'createdBy', width: 120, headerName: '创建人', },
    { field: 'creationDate', width: 240, headerName: '创建时间', },
    { field: 'lastUpdatedBy', width: 120, headerName: '修改人', },
    { field: 'lastUpdateDate', width: 240, headerName: '修改时间', },
  ];


  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private modalService: NzModalService,
    private appConfigService: AppConfigService,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  private getQueryParamsValue(): any {
    return {
      objId: this.i.objId,
      plantCode: this.i.plantCode,
      type: '1',
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  ngOnInit() {
    this.query();
  }





  httpAction = { url: this.queryService.querySpecIndexApplyUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }




  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.queryService.export({ url: this.queryService.querySpecIndexApplyUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }

  public clear() {
    this.queryParams.values = {
      objId: this.i.objId,
      plantCode: this.i.plantCode,
    };

  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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
}
