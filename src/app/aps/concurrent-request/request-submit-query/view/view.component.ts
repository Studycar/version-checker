import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { products } from './products';
import { GridDataResult, RowArgs, RowClassArgs } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EditService } from './edit.service';
import { map } from 'rxjs/operators/map';
import { Product } from './model';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { GridLookUpComponent } from '../../../../modules/base_module/components/grid-lookup.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-request-submit-query-view',
  encapsulation: ViewEncapsulation.None,
  styles: [`.gold .codeColumn { background-color: #FFBA80; }
            .green .codeColumn { background-color: #B2F699; }`],
  templateUrl: './view.component.html',
  providers: [EditService],
})
export class ConcurrentRequestRequestSubmitQueryViewComponent implements OnInit {
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  public changes: any = {};
  gridView: GridDataResult;
  Columns: any[] = [
    {
      field: 'ProductName',
      title: '产品名称',
      width: '200',
      hidden: false
    },
    {
      field: 'UnitPrice',
      title: '单价',
      width: '100',
      hidden: false
    },
    {
      field: 'QuantityPerUnit',
      title: '数量',
      width: '200',
      hidden: false
    },
    {
      field: 'SupplierID',
      title: 'SupplierID',
      width: '150',
      hidden: true
    },
    {
      field: 'CategoryID',
      title: 'CategoryID',
      width: '150',
      hidden: true
    },
    {
      field: 'ReorderLevel',
      title: 'ReorderLevel',
      width: '150',
      hidden: true
    }
  ];
  @ViewChild('selMater', {static: true}) selMater: PopupSelectComponent;
  @ViewChild('selLookUp', {static: true}) selLookUp: GridLookUpComponent;
  product = products;

  constructor(
    private formBuilder: FormBuilder, public editService: EditService, private msgSrv: NzMessageService, ) {

  }

  public ngOnInit(): void {
    this.view = this.editService.pipe(map(data => process(data, this.gridState)));
    this.editService.read();

    this.selLookUp.DataSource = this.product;
  }

  onSearch(e: any) {
    let filterRtl = [];
    if (e.SearchValue !== '' && e.SearchValue !== null && e.SearchValue !== undefined) {
      filterRtl = this.product.filter(x => x.ProductName === e.SearchValue);
    } else {
      filterRtl = this.product;
    }

    this.gridView = {
      data: filterRtl.slice(Number(e.Skip), Number(e.Skip) + Number(e.PageSize)),
      total: filterRtl.length
    };
  }

  onTextChanged(e: any) {
    this.msgSrv.success(e.Text);
  }

  onRowSelect(e) {
    this.msgSrv.success(e.Text + ' ' + e.Value);
  }

  Get() {
    this.msgSrv.success(this.selMater.Text + ' ' + this.selMater.Value);
  }

  Set() {
    this.selMater.Text = 'text';
    this.selMater.Value = 'value';
  }


  GetLookup() {
    this.msgSrv.success(this.selLookUp.Text + ' ' + this.selLookUp.Value);
  }

  SetLookUp() {
    this.selLookUp.Text = 'text';
    this.selLookUp.Value = 'value';
  }

  public onStateChange(state: State) {
    this.msgSrv.success('onStateChange');
    this.gridState = state;
    this.editService.read();
  }

  // 点击单元格时候触发
  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    this.msgSrv.success('cellClickHandler' + rowIndex + ' ' + columnIndex + ' ' + dataItem.UnitPrice);
    if (dataItem.UnitPrice === 4 && columnIndex !== 1) {
      return;
    }
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

  // 离开单元格后触发
  public cellCloseHandler(args: any) {
    this.msgSrv.success('cellCloseHandler');
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }

  // 新增空行
  public addHandler({ sender }) {
    this.msgSrv.success('add');
    sender.addRow(this.createFormGroup(new Product()));
  }

  // 取消新增行
  public cancelHandler({ sender, rowIndex }) {
    this.msgSrv.success('cancel');
    sender.closeRow(rowIndex);
  }

  // 保存新增行
  public saveHandler({ sender, formGroup, rowIndex }) {
    this.msgSrv.success('save');
    if (formGroup.valid) {
      this.editService.create(formGroup.value);
      sender.closeRow(rowIndex);
    }
  }

  // 删除记录
  public removeHandler({ sender, dataItem }) {
    this.msgSrv.success('remove');
    this.editService.remove(dataItem);
    sender.cancelCell();
  }

  // 保存修改的记录
  public saveChanges(grid: any): void {
    this.msgSrv.success('saveChanges');
    grid.closeCell();
    grid.cancelCell();

    this.editService.saveChanges();
  }

  // 取消修改的记录
  public cancelChanges(grid: any): void {
    this.msgSrv.success('cancelChanges');
    grid.cancelCell();

    this.editService.cancelChanges();
  }

  // 创建新行
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'ProductID': dataItem.ProductID,
      'ProductName': [dataItem.ProductName, Validators.required],
      'UnitPrice': dataItem.UnitPrice,
      'UnitsInStock': [dataItem.UnitsInStock, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])],
      'Discontinued': dataItem.Discontinued
    });
  }
}
