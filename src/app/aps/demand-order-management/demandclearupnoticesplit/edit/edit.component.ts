
import { DemandorderclearnoticeEditService } from 'app/aps/demand-order-management/demandclearupnoticesplit/edit.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators/map';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { MessageManageService } from '../../../../modules/generated_module/services/message-manage-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnoticesplit-edit',
  templateUrl: './edit.component.html',
  providers: [DemandorderclearnoticeEditService],
})
export class DemandOrderManagementDemandclearupnoticesplitEditComponent implements OnInit {
  expandForm = false;
  selectItems: any[] = [];
  params: any = {};
  public languages: any[] = [];
  public applications: any[] = [];
  i: any ;
  public view: Observable<GridDataResult>;
  public spanStyle = {
    'cursor': 'Pointer',
    'padding-left': '4px',
    'padding-right': '4px'
  };
  kendoHeight = document.body.clientHeight - 302;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 50,
  };
  public mySelection: any[] = [];
  public queryParams: any = {};
  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: DemandorderclearnoticeEditService,
    private messageManageService: MessageManageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }
  public query() {
    this.editService.readhistory(this.queryParams);
  }
  ngOnInit() {
    this.queryParams = { REQ_NUMBER: this.i.REQ_NUMBER, REQ_LINE_NUM: this.i.REQ_LINE_NUM };
    this.view = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.query();
  }

  expColumns = [
    { field: 'REQ_NUMBER', title: '需求订单号', width: 100, locked: true },
    { field: 'REQ_LINE_NUM', title: '需求订单行号', width: 200, locked: true },
    { field: 'CHANGE_FIELD', title: '变更字段', width: 200, locked: false },
    { field: 'BEFORE_OF_CHANGE', title: '变更前', width: 100, locked: false },
    { field: 'AFTER_OF_CHANGE', title: '变更后', width: 100, locked: false },
    { field: 'CHANGE_REASON', title: '变更原因', width: 100, locked: false }
  ];


  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.editService.export(
      this.queryParams,
      this.excelexport
    );
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.editService.read();
  }

  close() {
    // this.modal.destroy();

  }
}
