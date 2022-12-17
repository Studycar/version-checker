import { Component, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ConcurrentManagerService } from '../../../../modules/generated_module/services/concurrent-manager-service';
import { Router } from '@angular/router';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-managers-view',
  templateUrl: './view.component.html',
})
export class ConcurrentRequestConcurrentManagersViewComponent implements OnInit {
  Params: any = {};

  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;

  constructor(
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private concurrentManagerService: ConcurrentManagerService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
  ) { }

  ngOnInit(): void {
    this.skip = 0;
    this.pageSize = 10;
    this.loadItems();
  }

  // 分页事件
  public pageChange({ skip, take }): void {
    this.skip = skip; // event.skip;
    this.pageSize = take;
    this.loadItems();
  }

  loadItems() {
    this.concurrentManagerService.QueryRequest(this.Params.controllingManager, this.Params.nodeName1, this.skip / this.pageSize + 1, this.pageSize).subscribe(result => {
      let gridData = [];
      let totalCount = 0;
      if (result.Result != null && result.Result.length !== undefined && result.Result.length > 0) {
        gridData = result.Result;
        totalCount = result.TotalCount;
      }
      this.gridView = {
        data: gridData,
        total: totalCount
      };
    },
      errMsg => { },
      () => { }
    );
  }
}
