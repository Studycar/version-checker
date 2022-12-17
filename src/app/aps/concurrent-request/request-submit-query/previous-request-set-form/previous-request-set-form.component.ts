import { Component, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'previous-request-set-form',
  templateUrl: './previous-request-set-form.component.html',
  styleUrls: ['./previous-request-set-form.component.css'],
  providers: [AppConfigService]
})
export class ConcurrentRequestPreviousRequestSetFormComponent extends CustomBaseContext implements OnInit {
  gridHeight = 250;
  public selectBy = 'requestId';
  i: any;
  Filter_Value: string;
  UserId = this.appConfigService.getUserId(); // 当前用户,暂时写死
  RespId = this.appConfigService.getRespCode(); // 当前职责，暂时写死
  mySelection: string[] = [];

  public columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: false, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    {
      field: 'userConcurrentProgramName', headerName: '名称',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'creationDate',
      headerName: '提交日期',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'requestId',
      headerName: '请求id',
      menuTabs: ['filterMenuTab'],
    }

  ];


  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  public lastColumnName: string;
  constructor(
    public pro: BrandService,
    private modal: NzModalRef,
    private openDiag: ModalHelper,
    private requestSubmitQueryService: RequestSubmitQueryService,
    private appConfigService: AppConfigService,
    private apptrans: AppTranslationService,
    private appconfig: AppConfigService,
    private http: _HttpClient,
    private msgSrv: NzMessageService) {
    super({ pro: pro, appTranslationSrv: apptrans, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.lastColumnName = this.columns[this.columns.length - 1].field;
    this.Filter_Value = '';
    this.skip = 0;
    this.pageSize = 20;
    this.loadItems(this.skip / this.pageSize + 1, this.pageSize);
  }

  // // 分页事件
  // public pageChange({ skip, take }): void {
  //   this.skip = skip; // event.skip;
  //   this.pageSize = take;
  //   this.loadItems();
  // }
  // 分页事件
  public pageChange({ skip, take }): void {
    this.skip = skip; // event.skip;
    this.pageSize = take;
    this.loadItems(this.skip / this.pageSize + 1, this.pageSize);
  }

  loadItems(pageIndex: number, pageSize: number) {
    this.requestSubmitQueryService.getPreviousRequestSet(this.RespId, this.UserId, this.Filter_Value, pageIndex, pageSize).subscribe(result => {
      this.gridData = [];
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

  // 选中行事件
  private onSelectedKeysChange(e) {
    /* const requestId = this.mySelection[0];
     this.i.Request_Id = requestId;
     this.i.IsRefresh = true;
     this.modal.destroy();*/
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  Find() {
    this.skip = 0;
    this.pageSize = 20;
    this.loadItems(this.skip / this.pageSize + 1, this.pageSize);
  }

  Confrim() {
    // if (this.mySelection === undefined || this.mySelection === null || this.mySelection.length === 0) {
    //   this.msgSrv.success('请选择请求集记录');
    //   return;
    // }

    // const requestId = this.mySelection[0];

    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择请求记录');
      return;
    }

    const requestId = this.selectionKeys[0];

    this.i.Request_Id = requestId;
    this.i.IsRefresh = true;
    this.modal.destroy();
  }

  close() {
    this.modal.destroy();
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.loadItems(pageNo, pageSize);
    this.setLoading(false);
  }

}
