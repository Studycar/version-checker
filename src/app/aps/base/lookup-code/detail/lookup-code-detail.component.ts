import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { BaseLookupCodeDetailEditService } from './edit.service';
import { LookupCodeDetail } from './model';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { BrandService } from '../../../../layout/pro/pro.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { LookCodeDetailService } from './look-code-detail.service';
import { CustomOperateCellRenderComponent } from '../../../../modules/base_module/components/custom-operatecell-render.component';
import { AgDatePickerComponent } from './ag-date-picker.component';
import { AgFormCellComponent } from './ag-form-cell.component';
import { Column, GridReadyEvent, RowNode } from 'ag-grid-community';
import { AddLookCodeComponent } from './add-look-code/add-look-code.component';
/**
 * 快速编码明细
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lookup-code-detail',
  templateUrl: './lookup-code-detail.component.html',
  styles: [`
    .operatable-area {
      margin-bottom: 16px;
    }
  `],
  providers: [
    BaseLookupCodeDetailEditService,
  ],
})
export class BaseLookupCodeDetailComponent extends CustomBaseContext implements OnInit {
  @Input() private code: string;
  @Input() private lookupTypeId: string;
  @Input() private lng: string;
  @Input() private LngOptions: any[];

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  view2: Observable<GridDataResult>;
  gridState: State = {
    sort: [],
    skip: 0,
    take: 15,
  };
  applications: any[] = [];
  changes: any = {};
  updateRowData: RowNode[] = [];
  // 表格height
  gridHeight: any = 300;
  // 列定义
  columnsDef = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      type: 'nonEditableColumn',
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: this.customTemplate,
      },
    },
    { field: 'lookupCode', headerName: '编码类型', width: 100 },
    { field: 'meaning', headerName: '编码名称', width: 100 },
    { field: 'startDate', headerName: '生效日期', width: 150 },
    { field: 'endDate', headerName: '失效日期', width: 150 },
    { field: 'description', headerName: '描述', width: 150 },
    { field: 'orderSeq', headerName: '序号', width: 80 },
    { field: 'additionCode', headerName: 'ADDITION_CODE', width: 150 },
    { field: 'attribute1', headerName: 'ATTRIBUTE1', width: 120 },
    { field: 'attribute2', headerName: 'ATTRIBUTE2', width: 120 },
    { field: 'attribute3', headerName: 'ATTRIBUTE3', width: 120 },
    { field: 'attribute4', headerName: 'ATTRIBUTE4', width: 120 },
    { field: 'attribute5', headerName: 'ATTRIBUTE5', width: 120 },
    { field: 'attribute6', headerName: 'ATTRIBUTE6', width: 120 },
    { field: 'attribute7', headerName: 'ATTRIBUTE7', width: 120 },
    { field: 'attribute8', headerName: 'ATTRIBUTE8', width: 120 },
    { field: 'attribute9', headerName: 'ATTRIBUTE9', width: 120 },
    { field: 'attribute10', headerName: 'ATTRIBUTE10', width: 120 },
  ];

  // 扩展默认列定义
  defaultColDef = {
    ...this.defaultColDef,
    // editable: true,
  };
  agFormGroup: FormGroup;

  // 扩展默认gridOptions
  gridOptions = {
    ...this.gridOptions,
    defaultColDef: this.defaultColDef,
    stopEditingWhenGridLosesFocus: false,
  };

  /** 检验规则 */
  validatedRule: { [key: string]: { rule: any, tips: any } } = {};

  constructor(
    public pro: BrandService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private formBuilder: FormBuilder,
    private modal: ModalHelper,
    private lookCodeDetailService: LookCodeDetailService,
    private fb: FormBuilder,
    public editService: BaseLookupCodeDetailEditService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.columnsDef[0].cellRendererParams.customTemplate = this.customTemplate;

    this.agFormGroup = this.fb.group({});
    (<any>window).fb = this.agFormGroup;

    // this.editService.code = this.code;
    // this.editService.lng = this.lng;
    // this.editService.lookupTypeId = this.lookupTypeId;
    // this.view2 = this.editService.pipe(
    //   map(data => process(data, this.gridState)),
    // );
    // this.editService.read();
    this.lookCodeDetailService.init({
      code: this.code,
      lng: this.lng,
      lookupTypeId: this.lookupTypeId,
      LngOptions: this.LngOptions,
    });
    this.queryCode();
  }


  /**
   * 查询快码
   */
  queryCode() {
    this.lookCodeDetailService.getCode(this.code, this.lng).subscribe(res => {
      this.gridData = res.data.slice();
      this.view = {
        data: [],
        total: res.data.length,
      };
    });
  }

  /** recode by jian.huang**/
  /**
   * 新增快码
   */
  addCode(item?: any) {
    this.modal.static(AddLookCodeComponent, { editType: !item ? 'add' : 'edit', item }, 'lg').subscribe(() => {
      this.queryCode();
    });
  }

  /**
   * 删除快码
   * @param item
   */
  deleteCode(item) {
    this.lookCodeDetailService.deleteCode(item.id).subscribe(res => {
      if (res.code === 200) { // if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.gridApi.updateRowData({ remove: [item] });
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }


  /**
   * 页码切换
   * @param {any} pageNo
   * @param {any} pageSize
   */
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  /**
   * grid准备事件
   */
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

}
