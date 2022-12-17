import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { QueryService } from './query.service';
import { ActivatedRoute } from '@angular/router';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-material-process-grid',
  templateUrl: './material-process-grid.component.html',
  providers: [QueryService],
})
export class MaterialmanagementMaterialProcessGridComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplate2', { static: true }) customTemplate2: TemplateRef<any>;

  public ITEM_CODE = null;
  public ITEM_ID = null;
  public PLANT_CODE = null;
  public selectBy = 'ID';
  public applicationOptions: any[] = [];
  public dtProcess: any[] = [];
  public dtReleationType: any[] = [];
  context = this;
  gridHeight = 320;

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      }
    },
    { field: 'PLANT_CODE', headerName: '工厂', width: 80 },
    {
      field: 'TECH_VERSION', headerName: '工艺版本', width: 200,
      editable: true, cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        if (params.colDef.field === 'TECH_VERSION') {
          const values = [];
          this.opVersion.forEach(pro => values.push(pro.value));
          return { values: values };
        }
      }
    },
    { field: 'ITEM_CODE', headerName: '物料号', width: 100 },
    { field: 'ITEM_DESC', headerName: '物料描述', tooltipField: 'ITEM_DESC', width: 120 },
    {
      field: 'PROCESS_CODE_DESC', headerName: '前工序', width: 200,
      editable: true, cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        if (params.colDef.field === 'PROCESS_CODE_DESC') {
          const values = [];
          this.opProcessList.forEach(pro => values.push(pro.PROCESS_CODE_DESC));
          return { values: values };
        }
      }
    },
    // { field: 'PROCESS_CODE_DESC', headerName: '前工序描述', tooltipField: 'PROCESS_CODE_DESC', width: 140 },
    {
      field: 'NEXT_PROCESS_CODE_DESC', headerName: '后工序', width: 200,
      editable: true, cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        if (params.colDef.field === 'NEXT_PROCESS_CODE_DESC') {
          const values = [];
          this.opProcessList.forEach(pro => values.push(pro.PROCESS_CODE_DESC));
          return { values: values };
        }
      }
    },
    // { field: 'NEXT_PROCESS_CODE_DESC', headerName: '后工序描述', tooltipField: 'NEXT_PROCESS_CODE_DESC', width: 240 },
    { field: 'PROCESS_SEQ', headerName: '顺序号', width: 100 },
    {
      field: 'RELATION_TYPE', headerName: '工序相关性', width: 120, valueFormatter: 'ctx.optionsFind(value).label',
      editable: true, cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        if (params.colDef.field === 'RELATION_TYPE') {
          const values = [];
          this.dtReleationType.forEach(pro => values.push(pro.value));
          return { values: values };
        }
      }
    },
    {
      field: 'LEAD_TIME', headerName: '提前小时', width: 100,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      }
    },
    {
      field: 'USAGE', headerName: '单位用量', width: 100,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      }
    },

    { field: 'CREATION_DATE', headerName: '创建时间', width: 150 },
    { field: 'CREATED_BY', headerName: '创建人', width: 120 },
    { field: 'LAST_UPDATE_DATE', headerName: '更新时间', width: 150 },
    { field: 'LAST_UPDATED_BY', headerName: '更新人', width: 120 }
  ];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  expColumns = [
    { field: 'PLANT_CODE', title: '工厂', width: 80 },
    { field: 'TECH_VERSION', title: '工艺版本', width: 80 },
    { field: 'ITEM_CODE', title: '物料号', width: 100 },
    { field: 'ITEM_DESC', title: '物料描述', width: 120 },
    { field: 'PROCESS_CODE', title: '前工序编码', width: 120 },
    { field: 'PROCESS_CODE_DESC', title: '前工序描述', width: 140 },
    { field: 'NEXT_PROCESS_CODE', title: '后工序编码', width: 120 },
    { field: 'NEXT_PROCESS_CODE_DESC', title: '后工序描述', width: 140 },
    { field: 'PROCESS_SEQ', title: '顺序号', width: 100 },
    { field: 'RELATION_TYPE', title: '工序相关性', width: 100 },
    { field: 'LEAD_TIME', title: '提前小时', width: 100 },
    { field: 'USAGE', title: '单位用量', width: 100 },
    { field: 'CREATION_DATE', title: '创建时间', width: 150 },
    { field: 'CREATED_BY', title: '创建人', width: 120 },
    { field: 'LAST_UPDATE_DATE', title: '更新时间', width: 150 },
    { field: 'LAST_UPDATED_BY', title: '更新人', width: 120 }
  ];

  httpAction = {
    url: this.queryService.seachUrl,
    method: 'GET'
  };

  iconStyle = {
    width: '25px',
    height: '25px',
  };

  // 新增数据的时候模板
  templateDataItem: any;
  // 工序
  opProcessList: any[] = [];

  // 工序版本
  opVersion: any[] = [];
  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    public queryService: QueryService,
    public msgSrv: NzMessageService,
    public translateservice: AppTranslationService,
    public modalService: NzModalService,
    public appService: AppConfigService,
    private commonquery: CommonQueryService,
    public route: ActivatedRoute
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.columns[9].cellRendererParams.customTemplate = this.customTemplate1;
    this.columns[10].cellRendererParams.customTemplate = this.customTemplate2;
    this.commonquery.GetLookupByType('PS_OP_RELATION_TYPE').subscribe(result => {
      this.dtReleationType.length = 0;
      result.Extra.forEach(d => {
        this.dtReleationType.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    this.queryService.GetLookupByType('TECH_VERSION').subscribe(result => {
      this.opVersion.push({
        label: '',
        value: '',
      });
      result.Extra.forEach(d => {
        this.opVersion.push({
          label: d.LOOKUP_CODE,
          value: d.LOOKUP_CODE,
        });
      });
    });

    this.queryService.getItemProcess(this.PLANT_CODE).subscribe(result => {
      this.opProcessList.length = 0;
      result.Extra.forEach(d => {
        this.opProcessList.push({
          PROCESS_CODE: d.PROCESS_CODE,
          PROCESS_CODE_DESC: d.PROCESS_CODE + '[' + d.DESCRIPTION + ']',
          DESCRIPTION: d.DESCRIPTION
        });
      });
      this.opProcessList.push({
        PROCESS_CODE: '-999',
        PROCESS_CODE_DESC: '-999',
        DESCRIPTION: '结束'
      });
    });

    // 工序版本


    this.query();
  }

  public optionsFind(value: string): any {
    return this.dtReleationType.find(x => x.value === value) || { label: value };
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  public queryCommon() {
    const queryValues = {
      plantCode: this.PLANT_CODE,
      itemCode: this.ITEM_CODE,
      pageIndex: 1,
      pageSize: 100
    };
    this.commonquery.loadGridView(this.httpAction, queryValues, this.context, null, () => {
      this.queryService.GetItemInfos(this.PLANT_CODE, this.ITEM_CODE).subscribe(res => {
        if (res.Success) {
          this.templateDataItem = res.Extra;
        }
      });
    });
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['工艺版本','前工序','后工序','工序相关性',];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#materialProcessGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  public onStateChange({ pageNo, pageSize }) {
    // this.gridState = state;
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 单元格内容改变
  onCellValueChanged(event) {
    console.log(event);
    if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString() &&
      (event.colDef.field === 'PROCESS_CODE_DESC' || event.colDef.field === 'NEXT_PROCESS_CODE_DESC')) {
      const opProcess = this.opProcessList.find(op => op.PROCESS_CODE_DESC === event.newValue);
      console.log(opProcess);
      if (event.colDef.field === 'PROCESS_CODE_DESC') {
        // event.data.PROCESS_CODE_DESC = opProcess.DESCRIPTION;
        event.data.PROCESS_CODE = opProcess.PROCESS_CODE;
      } else {
        // event.data.NEXT_PROCESS_CODE_DESC = opProcess.DESCRIPTION;
        event.data.NEXT_PROCESS_CODE = opProcess.PROCESS_CODE;
      }
      this.gridData = this.clone(this.gridData);
    }
  }

  export() {
    // super.export(); 原因不明，需要注释。不然导出列不是expColumns内容，或者修改expColumns变量名
    const params = {
      plantCode: this.PLANT_CODE,
      itemCodeFrom: this.ITEM_CODE,
      itemCodeTo: this.ITEM_CODE
    };
    this.commonquery.exportAction({ url: this.queryService.exportUrl, method: 'GET' }, params, this.excelexport, this.context);
  }

  add() {
    this.gridApi.setSortModel(null);
    const addDataItem = this.clone(this.templateDataItem);
    addDataItem.ID = new Date().getTime();
    console.log(addDataItem);
    this.gridData = [addDataItem, ...this.gridData];
  }

  remove(dataItem: any) {
    this.queryService.DeleteItemProcess(dataItem).subscribe(result => {
      if (result !== null && result.Success) {
        const deleteIndex = this.gridData.indexOf(dataItem);
        if (deleteIndex > -1) {
          this.gridData.splice(deleteIndex, 1);
        }
        this.gridData = this.clone(this.gridData);
      } else {
        this.msgSrv.error(this.translateservice.translate('删除失败：' + result.Message));
      }
    });
  }

  save() {
    if (this.gridData.length < 1) {
      this.msgSrv.error(this.translateservice.translate('没有可用的物料工序'));
      return;
    }

    this.gridData.forEach(op => {
      op.PROCESS_SEQ = 1;
    });
    this.queryService.SaveMengJie(this.gridData).subscribe(result => {
      if (result !== null && result.Success) {
        this.msgSrv.success(this.translateservice.translate('保存成功！'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.translateservice.translate('保存失败！' + result.Message));
      }
    });
  }

  copy() {
    if (this.gridData.length < 1) {
      this.msgSrv.error(this.translateservice.translate('没有可用的物料工序'));
      return;
    }

    if (this.targetCopyItemCode === '') {
      this.msgSrv.error(this.translateservice.translate('请先选择目标物料'));
      return;
    }

    if (this.targetCopyItemCode === this.templateDataItem.ITEM_CODE) {
      this.msgSrv.error(this.translateservice.translate('目标物料和源物料相同'));
      return;
    }

    const copyGridData = this.clone(this.gridData);
    copyGridData.forEach(op => {
      op.ITEM_CODE = this.targetCopyItemCode;
      op.PROCESS_SEQ = 1;
    });
    this.queryService.SaveMengJie(copyGridData).subscribe(result => {
      if (result !== null && result.Success) {
        this.msgSrv.success(this.translateservice.translate('复制成功！'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.translateservice.translate('复制失败！' + result.Message));
      }
    });
  }

  itemGridView: GridDataResult = {
    data: [],
    total: 0
  };

  itemColumns: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    }
  ];

  targetCopyItemCode = '';
  searchItem(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
  }

  // 加载物料或库存分类
  loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number, type: number = 1) {
    // 加载物料或库存分类
    this.queryService.GetUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE, '', PageIndex, PageSize).subscribe(res => {
      this.itemGridView.data = res.Result;
      this.itemGridView.total = res.TotalCount;
    });
  }
}
