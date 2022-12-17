import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { RespmanagerService } from '../../../../modules/generated_module/services/respmanager-service';
import { State, process } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators/map';
import { MessageManageService } from '../../../../modules/generated_module/services/message-manage-service';
import { DemandclearupnoticeService } from '../../../../modules/generated_module/services/demandclearupnotice-service';
import { DemandorderclearnoticeEditService } from 'app/aps/demand-order-management/demandclearupnoticesplit/edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnotice-view',
  templateUrl: './view.component.html',
  // styleUrls: ['./view.component.css'],
  providers: [DemandorderclearnoticeEditService]

})
export class DemandOrderManagementDemandclearupnoticeViewComponent {

  selectItems: any[] = [];
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];
  public createdItemsR: any[] = [];
  params: any = {};
  splitline: any = 1;
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 15,
  };

  ngStyle = {
  };

  i: any;

  total: any = 0;

  fathertotal = 0;
  p: any = {};
  public mySelection: any[] = [];

  constructor(
    private http: _HttpClient,
    // private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private formBuilder: FormBuilder,
    private modalS: NzModalRef,
    private demandclearupnoticeService: DemandclearupnoticeService,
    private respmanagerService: RespmanagerService,
    public editService: DemandorderclearnoticeEditService,
    private messageManageService: MessageManageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.view = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    // this.editService.readhistory(this.i);
  }

  queryParams: any = {};


  public onStateChange(state: State) {
    this.gridState = state;
    this.editService.readhistory();
  }

  save() {
    this.demandclearupnoticeService.cancelOrder(this.i.id, this.i.plantCode, this.i.reqNumber, this.i.reqLineNum, this.i.cancelComments).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('取消订单成功'));
        this.modalS.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
      // this.modalS.destroy();
    });
  }

  close() {
    this.modalS.destroy();
  }
}
