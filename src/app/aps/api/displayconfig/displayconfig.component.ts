import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-displayconfig',
  templateUrl: './displayconfig.component.html',
  styles: [`
  .inline {
    display: inline-block;
  }

  .left {
    width:25%;
    left: 0px;
  }

  .right {
    width:70%;
    float:right;
    right: 0px;
  }
`],
  providers: [QueryService],
})
export class ApiDisplayConfigComponent extends CustomBaseContext implements OnInit {
  i: any = {};
  apiOptions: any[] = [];
  public gridData1 = [];
  public gridApi1: GridApi;
  public gridColumnApi1: ColumnApi;
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
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
    { field: 'fieldName', headerName: '字段名称', menuTabs: ['filterMenuTab'] },
  ];
  columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 80, pinned: 'left', lockPinned: true, rowDrag: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'fieldName', headerName: '字段名称', menuTabs: ['filterMenuTab'] },
    {
      field: 'displayName', headerName: '显示名称', editable: true, menuTabs: ['filterMenuTab']
    },
    {
      field: 'width', headerName: '宽度', editable: true, width: 100, menuTabs: ['filterMenuTab']
    },
    {
      field: 'enableFlag', headerName: '是否显示', width: 100, headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }, menuTabs: ['filterMenuTab']
    },
  ];
  /**构造函数 */
  constructor(
    public pro: BrandService,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private modal: ModalHelper,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // this.headerNameTranslate(this.columns);
  }

  /**页面初始化 */
  ngOnInit() {
    this.defaultColDef.sortable = false;
    this.columns[4].cellRendererParams.customTemplate = this.customTemplate;
    this.loadInitData();
  }
  // 加载初始化数据
  private loadInitData() {
    // 接口列表
    this.queryService.GetApiAllList().subscribe(result => {
      result.data.forEach(d => {
        this.apiOptions.push({ value: d.apiCode, label: d.apiCode + ' ' + d.apiName, API_TABLE: d.tableName });
      });
    });
  }
  // 保存
  save() {
    if (this.gridData.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('无数据,请先选择字段！'));
      return;
    }
    const dtos = [];
    let index = 1;
    this.gridData.forEach(d => {
      dtos.push({ configId: d.id, apiCode: this.i.API_CODE, tableName: this.i.TABLE_NAME, fieldName: d.fieldName, enableFlag: d.enableFlag, displayName: d.dispatchName, width: d.width, boolEnableFlag: d.boolEnableFlag, orderNo: index++ });
    });
    this.queryService.Save(dtos).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }
  // 接口编码切换
  onApiChange(event) {
    this.gridData = [];
    this.i.TABLE_NAME = '';
    // 根据接口编码加载已选展示列
    this.queryService.GetDisplayColumns(this.i.API_CODE).subscribe(result => {
      if (result.data !== null && result.data.length > 0) {
        this.gridData = result.data;
        this.i.TABLE_NAME = this.gridData[0].tableName;
      }
      if (this.isNull(this.i.TABLE_NAME) && this.apiOptions.findIndex(t => t.value === this.i.API_CODE) > -1) {
        this.i.TABLE_NAME = this.apiOptions.find(t => t.value === this.i.API_CODE).API_TABLE;
      }
      this.refreshFields();
    });
  }
  // 刷新待选字段列表
  refreshFields() {
    const gridData1 = [];
    // 根据接口编码加载待选字段
    this.queryService.GetDisplayFields(this.i.TABLE_NAME).subscribe(result => {
      if (this.gridData.length === 0) {
        this.gridData1 = result.data;
      } else {
        result.data.forEach(d => {
          if (this.gridData.findIndex(t => t.fieldName === d.fieldName) === -1) {
            gridData1.push(d);
          }
        });
        this.gridData1 = gridData1;
      }
    });
  }
  // 清空
  clearAll() {
    this.gridData = [];
    this.refreshFields();
  }
  // 移除
  toLeft() {
    this.selectionKeys.forEach(key => {
      const index = this.gridData.findIndex(d => d[this.selectBy] === key);
      this.gridData.splice(index, 1);
    });
    this.gridData = [...this.gridData];
    this.refreshFields();
  }
  // 选择
  toRight() {
    const data = [];
    this.selectionKeys1.forEach(key => {
      const index = this.gridData1.findIndex(d => d[this.selectBy] === key);
      data.push({ ...this.gridData1[index] });
      this.gridData1.splice(index, 1);
    });
    this.gridData = [...this.gridData, ...data];
    this.gridData1 = [...this.gridData1];
  }
  selectBy = 'fileldName';
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
  // grid初始化加载
  public onGridReady1(params) {
    this.gridApi1 = params.api;
    this.gridColumnApi1 = params.columnApi;
  }

  public getRowNodeId = function getRowNodeId(data) {
    return data.FIELD_NAME;
  };
  onRowDragEnter(e) {
    // console.log('onRowDragEnter', e);
  }

  onRowDragMove(event) {
    const movingNode = event.node;
    const overNode = event.overNode;
    const rowNeedsToMove = movingNode !== overNode;
    if (rowNeedsToMove) {
      const movingData = movingNode.data;
      const overData = overNode.data;
      const newStore = this.gridData.slice(); // []浅拷贝
      /* --------批量拖动start------ */
      const selectedRows = [movingData]; // 防止拖动行未选中
      // 1.获取需移动的行数据（选中行）
      this.gridApi.getSelectedRows().forEach(row => { if (selectedRows.indexOf(row) === -1) selectedRows.push(row); });
      // 2.调整gridData浅拷贝数据行的顺序
      // 当目标行是选中行时不调整数据行顺序
      if (selectedRows.indexOf(overData) === -1) {
        let movingDatas = [];
        if (selectedRows.length === 1) {
          movingDatas = selectedRows;
        } else {
          const movingIndex = this.gridData.indexOf(movingData);
          const overIndex = this.gridData.indexOf(overData);
          const dragDown = movingIndex < overIndex; // 向下拖动，确定鼠标拖动方向
          let index = 0;
          this.gridData.forEach(data => {
            const moveDown = index < overIndex; // 确定当前行在目标行的上下方向
            // 选中项与拖动方向一致才移动行
            if (selectedRows.indexOf(data) > -1) {
              if (dragDown === moveDown) {
                if (dragDown) {
                  movingDatas.unshift(data); // 向下移动，待移动行逆序排序
                } else {
                  movingDatas.push(data); // 向上移动，待移动行顺序排序
                }
              }
            }
            index++;
          });
        }
        movingDatas.forEach(data => {
          const fromIndex = newStore.indexOf(data);
          const toIndex = newStore.indexOf(overData);
          moveInArray(newStore, fromIndex, toIndex);
        });
      }
      /* --------批量拖动end----- */
      this.gridData = this.clone(newStore);
      this.gridApi.setRowData(this.gridData);
    }
    function moveInArray(arr: any[], fromIndex: number, toIndex: number) {
      const element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element); // 在目标后插入
    }
  }

  onRowDragEnd(e) {
    // this.gridData = this.clone(this.gridData);
  }

  onRowDragLeave(e) {
    // console.log('onRowDragLeave', e);
  }
}
