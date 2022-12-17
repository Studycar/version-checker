import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseLookupCodeEditService } from './edit.service';
import { LookupCode } from './model';
import { map } from 'rxjs/operators/map';
import { BaseLookupCodeDetailComponent } from './detail/lookup-code-detail.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BaseLookupCodeEditComponent } from './edit/edit.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { LookupCodeInputDto } from '../../../modules/generated_module/dtos/lookup-code-input-dto';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { AppGridStateService } from '../../../modules/base_module/services/app-gridstate-service';
import { QueryService } from './query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lookup-code',
  templateUrl: './lookup-code.component.html',
  providers: [QueryService, BaseLookupCodeEditService],
})

export class BaseLookupCodeComponent extends CustomBaseContext implements OnInit {

  expandForm = false;

  // public view: Observable<GridDataResult>;
  /*
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 30,
  };
  */
  applicationOptions: any[] = [];
  applications: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];
  public LngOptions: any[] = [];
  // public context = this;
  CurLng: any;
  kendoHeight = document.body.clientHeight - 302;
  public queryParams = {
    defines: [
      { field: 'TYPECODE', title: '类型', ui: { type: UiType.string } },
      { field: 'MEANING', title: '名称', ui: { type: UiType.string } },
      { field: 'DESCRIPTION', title: '描述', ui: { type: UiType.string } },    
      { field: 'LNG', title: '语言', ui: { type: UiType.select, options: this.LngOptions }  }
    ],
    values: {
      TYPECODE: '',
      MEANING: '',
      DESCRIPTION: '',
      LNG: ''
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    public editService: BaseLookupCodeEditService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private confirmationService: NzModalService,
    public appTranslationService: AppTranslationService,
    public appConfigService:  AppConfigService,
    public appGridStateService: AppGridStateService
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService }); }

  /*
  queryParams: any = {
    TYPECODE: '',
    MEANING: '',
    DESCRIPTION: '',
    LNG: '',
  };
  */


  httpAction = { url: this.editService.queryUrl, method: 'POST'};
  public query() {
    super.query();
    this.commonQueryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  public clear() {
    this.queryParams.values = {
      TYPECODE: '',
      MEANING: '',
      DESCRIPTION: '',
      LNG: ''
    };
  }

  private getQueryParamsValue(): any {
    return {
      TYPECODE: this.queryParams.values.TYPECODE,
      MEANING: this.queryParams.values.MEANING,
      DESCRIPTION: this.queryParams.values.DESCRIPTION,
      LNG: this.queryParams.values.LNG,
      PAGE_INDEX: this.gridState.skip / this.gridState.take + 1,
      PAGE_SIZE: this.gridState.take
    };
  }

  expColumns = [
    { field: 'lookupTypeCode', title: '编码类型', width: 200, locked: true },
    { field: 'meaning', title: '编码名称', width: 200, locked: false },
    { field: 'applicationCode', title: '应用模块', width: 100, locked: false },
    { field: 'description', title: '描述', width: 300, locked: false },
    { field: 'language', title: '语言', width: 100, locked: false }
  ];
  expColumnsOptions: any[] = [
    { field: 'applicationCode', options: this.applicationOptions },
    { field: 'language', options: this.LngOptions },
  ];


  /*
  @ViewChild('excelexport') excelexport: CustomExcelExportComponent;
  public export() {
    // this.gridData.length = 0;
    this.editService.export(
      this.queryParams,
      this.excelexport
    );
  }
  */

  public add(item?: any) {
    this.modal
      .static(
        BaseLookupCodeEditComponent,
        {
          i: {
            ID: (item !== undefined ? (item.ID ? item.ID : (item.Id ? item.Id : null)) : null),
            APPLICATIONCODE: (item !== undefined ? item.APPLICATION_CODE : null),
            DESCRIPTION: (item !== undefined ? item.DESCRIPTION : null),
            LNG: (item !== undefined ? item.LANGUAGE : null),
            TYPECODE: (item !== undefined ? item.LOOKUP_TYPE_CODE : null),
            MEANING: (item !== undefined ? item.MEANING : null),
          },
          applicationOptions: this.applicationOptions,
          languageOptions: this.LngOptions,
          CurLng: this.CurLng,
        },
        'lg',
      )
      .subscribe(res => {
        if (res) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    this.editService.Remove(item.Id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '删除成功'));
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.CurLng = this.appConfigService.getLanguage();
    this.queryParams.values.LNG = this.CurLng; // 设置当前查询默认语言
    // this.applicationOptions.unshift({ label: '　', value: '', });
    // this.LngOptions.unshift({ label: '　', value: '', });
    this.editService.GetApplications().subscribe(result => {
      this.applications = result.Extra;
      result.Extra.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationShortName + ' - ' + d.applicationName,
          value: d.applicationShortName,
          type:  d.applicationName,
        });
      });
    });

    /*
    this.editService.GetInitLunguage().subscribe(result => {
      result.Result.forEach(d => {
        this.LngOptions.push({
          label: d.MEANING,
          value: d.LANGUAGE,
        });
      });
    });
    */

    /** 初始化 系统支持的语言类型 */
    this.commonQueryService.GetLookupByType('FND_LANGUAGE').subscribe(result => {
      result.Extra.forEach(d => {
        this.LngOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    this.viewAsync = this.commonQueryService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.query();
  }

  public application(code: string): any {
    return this.applicationOptions.find(x => x.value === code);
  }

  public LANGUAGEOptions(lng: string): any {
    return this.LngOptions.find(x => x.value === lng);
  }


  // (pageChange)="pageChange($event)"
  public pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.gridState.take = event.take;
    this.commonQueryService.read(this.httpAction);
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.commonQueryService.read(this.httpAction);
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    this.commonQueryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  // 网格编辑
  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited) {
      sender.editCell(
        rowIndex,
        columnIndex,
        this.createEditFormGroup(dataItem),
      );
    }
  }

  // 关闭网格编辑
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }

  // 加行
  public addHandler({ sender }) {
    sender.addRow(this.createFormGroup(new LookupCode()));
  }
  // 取消编辑行
  public cancelHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex);
  }

  public saveHandler({ sender, formGroup, rowIndex }) {
    if (formGroup.valid) {
      this.editService.create(formGroup.value);
      sender.closeRow(rowIndex);
    }
  }

  public removeHandler({ sender, dataItem }) {
    this.editService.remove(dataItem);
    sender.cancelCell();
  }

  public saveChanges(grid: any): void {
    grid.closeCell();
    grid.cancelCell();
    this.editService.saveChanges();
  }

  public reload(grid: any): void {
    this.editService.reset();
    this.editService.read();
  }

  public cancelChanges(grid: any): void {
    grid.cancelCell();
    this.editService.cancelChanges();
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      LOOKUP_TYPE_ID: dataItem.LOOKUP_TYPE_ID,
      LOOKUP_TYPE_CODE: [dataItem.LOOKUP_TYPE_CODE, Validators.required],
      MEANING: [dataItem.MEANING, Validators.required],
      APPLICATION_ID: [dataItem.APPLICATION_ID, Validators.required],
      DESCRIPTION: [dataItem.DESCRIPTION],
      LANGUAGE: ['ZHS', Validators.required],
    });
  }

  public createEditFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      APPLICATION_ID: [dataItem.APPLICATION_ID, Validators.required],
      DESCRIPTION: [dataItem.DESCRIPTION],
    });
  }


  public removeBatch() {
    if (this.mySelection.length < 1) return;
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.editService
          .BatchRemove(this.mySelection)
          .subscribe(res => {
            this.msgSrv.success(this.appTranslationService.translate('删除成功'));
            // this.query();
          });
      },
    });
  }


  public detailHandler(item: any): void {
    const length = this.mySelection.length;
    if (length === 0) {
      return;
    }
    const code = this.mySelection[length - 1];
    const id = this.editService.GetIdByCode(code);
    this.modal
      .static(
        BaseLookupCodeDetailComponent,
        {
          code: item.LOOKUP_TYPE_CODE,
          lookupTypeId: (item.ID ? item.ID : (item.Id ? item.Id : null)),
          lng: item.LANGUAGE,
          LngOptions: this.LngOptions,
        },
        'xl',
      )
      .subscribe(() => {

      });
  }

  expData: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
    super.export();
    this.commonQueryService.exportAction({ url: this.commonQueryService.exportUrl, method: 'POST'}, this.getQueryParamsValue(), this.excelexport);
  }
}
