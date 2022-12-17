/*
 * @Author: 黄晓刚
 * @contact: ---
 * @LastEditors: Zwh
 * @Note: ...
 * @Date: 2018-08-01 17:49:16
 * @LastEditTime: 2019-04-30 17:03:00
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QueryService } from './edit.service';
import { BaseApplication } from './model';
import { BaseApplicationEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-application',
  templateUrl: './base-application.component.html',
  providers: [QueryService],
})
export class BaseApplicationComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  expandForm = false;
  context = this;

  constructor(
    public pro: BrandService,
    public appService: AppConfigService,
    public translateservice: AppTranslationService,
    private formBuilder: FormBuilder,
    public editService: QueryService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  public queryParams = {
    defines: [
      { field: 'applicationShortName', title: '应用简称', ui: { type: UiType.text } },
      { field: 'applicationName', title: '应用名称', ui: { type: UiType.text } },
      { field: 'basepath', title: '基本路径', ui: { type: UiType.text } },
      { field: 'description', title: '说明', ui: { type: UiType.text } },
    ],
    values: {
      applicationShortName: null,
      applicationName: null,
      basepath: null,
      description: null
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'applicationShortName', headerName: '应用简称', menuTabs: ['filterMenuTab'] },
    { field: 'applicationName', headerName: '应用名称', tooltipField: 'applicationName', menuTabs: ['filterMenuTab'] },
    {
      field: 'basepath', headerName: '基本路径', menuTabs: ['filterMenuTab']
    },
    { field: 'description', headerName: '说明', tooltipField: 'description', menuTabs: ['filterMenuTab'] }
  ];

  public clear() {
    this.queryParams.values = {
      applicationShortName: null,
      applicationName: null,
      basepath: null,
      description: null
    };
  }

  httpAction = {
    url: '/api/admin/application/list',
    method: 'GET'
  };

  public query() {
    this.editService.loadGridViewNew(this.httpAction, this.queryParams.values, this);
  }

  expColumns = [
    { field: 'applicationShortName', title: '应用简称', width: 200, locked: true },
    { field: 'applicationName', title: '应用名称', width: 200, locked: false },
    { field: 'basepath', title: '基本路径', width: 100, locked: false },
    { field: 'description', title: '说明', width: 300, locked: false }
  ];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    // this.gridData.length = 0;
    this.editService.export(
      this.httpAction,
      this.queryParams.values,
      this.excelexport
    );
  }

  public add(item?: any) {
    this.modal
      .static(
        BaseApplicationEditComponent,
        { i: { id: (item !== undefined ? item.id : null) } },
        'lg',
      )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.clear();
    this.query();
  }

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

  // public cellCloseHandler(args: any) {
  //   const { formGroup, dataItem } = args;

  //   if (!formGroup.valid) {
  //     // prevent closing the edited cell if there are invalid values.
  //     args.preventDefault();
  //   } else if (formGroup.dirty) {
  //     this.editService.assignValues(dataItem, formGroup.value);
  //     this.editService.update(dataItem);
  //   }
  // }

  public addHandler({ sender }) {
    sender.addRow(this.createFormGroup(new BaseApplication()));
  }

  public cancelHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex);
  }

  // public saveHandler({ sender, formGroup, rowIndex }) {
  //   if (formGroup.valid) {
  //     this.editService.create(formGroup.value);
  //     sender.closeRow(rowIndex);
  //   }
  // }

  // public removeHandler({ sender, dataItem }) {
  //   this.editService.remove(dataItem);

  //   sender.cancelCell();
  // }

  // public saveChanges(grid: any): void {
  //   grid.closeCell();
  //   grid.cancelCell();
  //   this.editService.saveChanges();
  // }

  // public reload(grid: any): void {
  //   this.editService.reset();
  //   this.editService.read();
  // }

  // public cancelChanges(grid: any): void {
  //   grid.cancelCell();
  //   this.editService.cancelChanges();
  // }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      id: dataItem.id,
      applicationShortName: [dataItem.applicationShortName, Validators.required],
      applicationName: [dataItem.applicationName, Validators.required],
      basepath: [dataItem.basepath],
      description: [dataItem.description],
    });
  }

  public createEditFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      id: [dataItem.id, Validators.required],
      applicationName: [dataItem.applicationName],
    });
  }

  selectKeys = 'id';

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

}

