import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../../modules/base_module/services/app-config-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from '../../query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { GridApi, ColumnApi } from 'ag-grid-community';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-functionmanager-detail-config',
  templateUrl: './config.component.html',
  providers: [QueryService],
  styles: [`
  .inline {
    display: inline-block;
  }

  .left {
    width:35%;
    left: 0px;
  }

  .right {
    width:60%;
    float:right;
    right: 0px;
  }
`],
})
export class BaseFunctionmanagerDetailConfigComponent extends CustomBaseContext implements OnInit {
  @Input()
  FUNCTION_ID = '';
  public gridHeight = 400;
  public gridData1 = [];
  public gridApi1: GridApi;
  public gridColumnApi1: ColumnApi;
  headerTemplate =
    `<div class="ag-cell-label-container" role="presentation">
      <div ref="eLabel" class="ag-header-cell-label" role="presentation">
        <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
      </div>
    </div>`;
  columns1 = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'OPERATION_CODE', headerName: '操作编码', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'DESCRIPTION', headerName: '操作描述', menuTabs: ['filterMenuTab'] },
  ];
  columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'OPERATION_CODE', headerName: '操作编码', width: 120, editable: true, menuTabs: ['filterMenuTab'] },
    {
      field: 'OPERATION_DESC', headerName: '操作描述', editable: true, menuTabs: ['filterMenuTab']
    },
    {
      field: 'METHOD_NAME', headerName: '操作方法', editable: true, menuTabs: ['filterMenuTab']
    }
  ];
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private queryService: QueryService
  ) {
    super({ pro: null, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.loadData();
  }

  // 加载数据
  loadData() {
    this.queryService.GetFunctionOperations(this.FUNCTION_ID).subscribe(res => {
      if (res.Success) {
        this.gridData = res.Extra;
      }
      this.refreshLeft();
    });
  }
  // 新增操作
  add() {
    this.gridData = [{ OPERATION_CODE: '', OPERATION_DESC: '', METHOD_NAME: '', FUNCTION_ID: this.FUNCTION_ID }, ...this.gridData];
  }
  // 保存
  save() {
    if (this.gridData.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('无数据,请先选择/录入操作信息！'));
      return;
    }
    this.queryService.SaveFunctionOperations(this.gridData).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }
  // 清空
  clearAll() {
    this.gridData = [];
    this.refreshLeft();
  }
  // 移除
  toLeft() {
    this.selectionKeys.forEach(key => {
      const index = this.gridData.findIndex(d => d[this.selectBy] === key);
      this.gridData.splice(index, 1);
    });
    this.gridData = [...this.gridData];
    this.refreshLeft();
  }
  // 选择
  toRight() {
    const data = [];
    this.selectionKeys1.forEach(key => {
      const index = this.gridData1.findIndex(d => d[this.selectBy] === key);
      data.push({ ...this.gridData1[index], OPERATION_DESC: this.gridData1[index].DESCRIPTION, FUNCTION_ID: this.FUNCTION_ID });
      this.gridData1.splice(index, 1);
    });
    this.gridData = [...data, ...this.gridData];
    this.gridData1 = [...this.gridData1];
  }
  selectBy = 'OPERATION_CODE';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  selectionKeys1 = [];
  // 行选中改变
  onSelectionChanged1(event) {
    const gridSelectRows = this.gridApi1.getSelectedRows();
    this.selectionKeys1 = [];
    if (!this.isNull(gridSelectRows) && gridSelectRows.length > 0) {
      gridSelectRows.forEach(d => {
        this.selectionKeys1.push(d[this.selectBy]);
      });
    }
  }
  // 刷新左侧待选区
  refreshLeft() {
    const gridData1 = [];
    this.queryService.GetOperations().subscribe(result => {
      if (this.gridData.length === 0) {
        this.gridData1 = result.Extra;
      } else {
        result.Extra.forEach(d => {
          if (this.gridData.findIndex(t => t[this.selectBy] === d[this.selectBy]) === -1) {
            gridData1.push(d);
          }
        });
        this.gridData1 = gridData1;
      }
    });
  }
  // grid初始化加载
  public onGridReady1(params) {
    this.gridApi1 = params.api;
    this.gridColumnApi1 = params.columnApi;
  }
}
