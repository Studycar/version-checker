import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { MaterialmanagementCategorySetManagerEditComponent } from './edit/edit.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategorySetManagerEditService } from './edit.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-category-set-manager',
  templateUrl: './category-set-manager.component.html',
  providers: [CategorySetManagerEditService],
})
export class MaterialmanagementCategorySetManagerComponent implements OnInit {


  // kendo ui 使用的新方法
  public kendoHeight = document.body.clientHeight - 220;
  public form_marginTop = 5;
  expandForm = false;

  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 50,
  };
  applicationOptions: any[] = [];
  applications: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];


  constructor(
    public http: _HttpClient,
    private formBuilder: FormBuilder,
    public editService: CategorySetManagerEditService,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
  ) { }

  searchExpand() {
    this.expandForm = !this.expandForm;
    this.resetGridHeight();
  }
  /* #customForm height */
  private formHeight = 0;
  /* 重设grid height */
  private resetGridHeight() {
    // if (this.context.gridHeightArg.topMargin) {
    /* 方法一：查询区一行行高粗算按39，不会闪烁 */
    // const rows = Math.ceil((this.queryParams.defines.length + 1) / this.columnCount);
    this.formHeight = 1 * 39;
    if (this.expandForm) {
      this.kendoHeight = this.kendoHeight - (1 * 39) - 5;
    } else {
      this.kendoHeight = this.kendoHeight + (1 * 39) + 5;
    }
  }

  queryParams: any = {};


  public clear() {
    this.queryParams = {
      CategorySetName: '',
      Description: '',

    };
  }

  public query() {
    this.editService.read(this.queryParams);
  }

  expColumns = [
    { title: '类别集名称', field: 'CATEGORY_SET_CODE', width: '200px', locked: true },
    { title: '类别级描述', field: 'DESCRIPTIONS', width: '200px', locked: false },
    { title: '段数', field: 'SEGMENTS_QTY', width: '200px', locked: false }
  ];


  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    // this.gridData.length = 0;
    this.editService.export(
      this.queryParams,
      this.excelexport
    );
  }


  public add(item: any) {
    this.modal
      .static(
        MaterialmanagementCategorySetManagerEditComponent,
        { i: { Id: (item !== undefined ? item.Id : null) } },
        'lg', )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    this.editService.Remove(item).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  removeBath() {
    if (this.mySelection.length < 1) {

      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    console.log(this.mySelection);

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.RemoveBath(this.mySelection).subscribe(res => {


          if (res.Success === true) {
            this.msgSrv.success('删除成功');
            this.query();
          } else {
            this.msgSrv.error(res.Message);
          }

        });
      },
    });
  }

  // 列头排序
  public onStateChange(state: State) {
    this.gridState = state;
    console.log(state);
    this.editService.read();
  }

  ngOnInit() {
    // console.log(this.mySelection);
    this.view = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.query();
  }

}


