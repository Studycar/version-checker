import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { filter } from 'rxjs/operators';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators/map';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { DemandclearupnoticeService } from '../../../modules/generated_module/services/demandclearupnotice-service';
import { DemandclearupnoticeInputDto } from 'app/modules/generated_module/dtos/Demandclearupnotice-input-dto';
import { DemandorderclearnoticeEditService } from 'app/aps/demand-order-management/demandclearupnoticesplit/edit.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CommonService } from 'app/aps/concurrent-request/request-submit-query/model/CommonService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnoticesplit',
  templateUrl: './demandclearupnoticesplit.component.html',
  providers: [DemandorderclearnoticeEditService, CommonQueryService, CommonService]// modify by garfield 20190119
})
export class DemandOrderManagementDemandclearupnoticesplitComponent implements OnInit {
  expandForm = false;
  disabled = false;
  selectItems: any[] = [];
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];
  public createdItemsR: any[] = [];
  params: any = {};
  splitline: any = 1;
  submitdata: any;
  public view: Observable<GridDataResult>;
  i: any;
  total: any = 0;
  reqyear: any = 0;
  reqmonth: any = 0;
  reqdate: any = 0;
  reqyearmonthdate: any = '';
  nonSplitQty: number; // modify by garfield 20190119
  preEditReqQty: number; // add by garfield 20190130
  queryParams: any = {};
  fathertotal = 0;
  p: any = {};
  public mySelection: any[] = [];
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 15,
  };
  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalS: NzModalRef,
    private formBuilder: FormBuilder,
    public editService: DemandorderclearnoticeEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService,
    private commonService: CommonService // add by garfield 20190119
  ) {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.view = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.editService.read(this.i);
    this.nonSplitQty = this.i.REQ_QTY;
    // 默认子订单的需求日期等于父订单
    this.i.REQ_DATE = this.commonQueryService.formatDate(this.i.REQ_DATE);
    this.reqyear = + this.i.REQ_DATE.substr(0, 4);
    this.reqmonth = +  this.i.REQ_DATE.substr(5, 2);
    this.reqdate = + this.i.REQ_DATE.substr(8, 2);
    this.reqyearmonthdate = this.i.REQ_DATE.substr(0, 4) + ',' + this.i.REQ_DATE.substr(5, 2) + ',' + this.i.REQ_DATE.substr(8, 2);
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.editService.read();
  }

  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {

    if (!isEdited) {
      this.preEditReqQty = 0; // 记录编辑前的需求数量
      if (columnIndex === 2) {// 点击第3列【需求数量】时记录
        this.preEditReqQty = parseInt(dataItem.REQ_QTY, 0);
      }

      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem, 'U'));
    }
  }

  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {

      this.nonSplitQty = this.nonSplitQty + this.preEditReqQty - parseInt(formGroup.value.REQ_QTY, 0); // modify by garfield 20190130
      formGroup.value.REQ_DATE = this.commonService.formatDate(formGroup.value.REQ_DATE);

      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }

  public addHandler({ sender }) {
    sender.addRow(this.createFormGroup(new DemandclearupnoticeInputDto()));
  }

  public cancelHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex);
  }

  public saveHandler({ sender, formGroup, rowIndex }) {
    if (formGroup.valid) {
      // tslint:disable-next-line:no-unused-expression
      formGroup.value.REQ_DATE = this.commonQueryService.formatDate(formGroup.value.REQ_DATE);
      this.editService.create(formGroup.value);
      this.nonSplitQty = this.nonSplitQty - parseInt(formGroup.value.REQ_QTY, 0); // modify by garfield 20190119
      sender.closeRow(rowIndex);
    }
  }

  public removeHandler({ sender, dataItem }) {
    this.editService.remove(dataItem);
    this.nonSplitQty = this.nonSplitQty + parseInt(dataItem.REQ_QTY, 0);
    sender.cancelCell();
  }

  public saveChanges(grid: any): void {
    // tslint:disable-next-line:no-unused-expression
    this.disabled = true;
    grid.closeCell();
    grid.cancelCell();
    this.total = 0;
    this.fathertotal = 0;
    if (grid.data.total === 1) {
      this.msgSrv.success(this.appTranslationService.translate('拆分行数需要大于一行'));
      this.disabled = false;
      return;
    }
    for (let n = 0; n < grid.data.total; n++) {
      // tslint:disable-next-line:radix
      this.total = parseInt(this.total) + parseInt(grid.data.data[n].REQ_QTY);
      // tslint:disable-next-line:radix
      this.fathertotal = parseInt(grid.data.data[n].REQ_QTY_MODIFY);
    }
    // tslint:disable-next-line:no-non-null-assertion
    if (this.fathertotal === this.total) {
      this.editService.saveChanges().then(m => {
        if (m.code === 200) {
          this.editService.read(this.i);
          this.msgSrv.success(this.appTranslationService.translate('拆分成功'));
          // this.modalS.destroy();
          this.modalS.close(true);
        } else {
          this.msgSrv.success(this.appTranslationService.translate('拆分失败'));
          this.disabled = false;
        }
      });


    } else {
      this.msgSrv.success(this.appTranslationService.translate('拆分的需求数量汇总和父订单需求数量需要一致'));
      this.disabled = false;

    }
  }

  public cancelChanges(grid: any): void {
    grid.cancelCell();
    this.editService.cancelChanges();
  }

  public createFormGroup(dataItem: any, crud: string = 'C'): FormGroup {
    return this.formBuilder.group({
      ID: dataItem.ID,
      REQ_NUMBER: this.i.REQ_NUMBER,
      REQ_QTY_MODIFY: this.i.REQ_QTY,
      REQ_LINE_NUM: this.i.REQ_LINE_NUM,
      REQ_QTY: crud === 'C' ? this.nonSplitQty : dataItem.REQ_QTY, // modify by garfield 20190131
      REQ_DATE: new Date(this.reqyearmonthdate)
    });

  }

  close() {
    this.modalS.destroy();
  }

}
