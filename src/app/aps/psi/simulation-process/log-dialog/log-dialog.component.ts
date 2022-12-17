import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

@Component({
  selector: 'simulation-process-log-dialog',
  templateUrl: './log-dialog.component.html',
  styles: [
    `
      .table-container { width: 100%; height: 300px; margin-bottom: 10px; }
      .table-row { display: flex; align-items: baseline; margin-bottom: 10px; }
      .table-label { width: 130px; }
      .table-description { width: calc(100% - 130px); word-break: break-all; }
    `
  ],
  providers: [QueryService]
})
export class SimulationProcessLogDialogComponent extends CustomBaseContext implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {
    super({ appTranslationSrv: appTranslationService });
  }

  i: any;

  tableData: any[] = [];

  ngOnInit(): void {
    this.getSmltLog();
  }

  getQueryParams(): any {
    const params: any = { ...this.i, };
    params.pageIndex = this._pageNo;
    params.pageSize = this._pageSize;
    return params;
  }

  getSmltLog() {
    const params = this.getQueryParams();
    this.tableData.length = 0;
    this.queryService.getSmltLog(params).subscribe(res => {
      const data = res.data && res.data.records && Array.isArray(res.data.records) ? res.data.records : [];
      const total = res.data && res.data.total ? res.data.total : 0;
      this.tableData = data;
      this.view = {
        data: this.gridData,
        total: total,
      };
    });
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
      this.getSmltLog();
    } else {
      this.setLoading(false);
    }
  }

  // 关闭
  close() {
    this.modal.destroy();
  }
}
