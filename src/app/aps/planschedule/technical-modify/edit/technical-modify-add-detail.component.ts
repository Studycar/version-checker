import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from '../queryService';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { PlanschedulePsTechnicalModifyItemCategorySelectComponent } from './item-category-select.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-technical-modify-add-detail',
  templateUrl: './technical-modify-add-detail.component.html',
  providers: [QueryService]
})
export class PlanschedulePsTechnicalModifyAddDetailComponent extends CustomBaseContext implements OnInit {

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  // @ViewChild('customTemplateItem', { static: true }) customTemplateItem: TemplateRef<any>;
  // @ViewChild('customTemplateUsage', { static: true }) customTemplateUsage: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private queryService: QueryService,
    private msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  showExpand = false;
  inputParam: any;
  listYesNo: any[] = [];
  context = this;
  queryParams = {
    defines: [],
    values: {}
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true, suppressSizeToFit: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      checkboxSelection: function (params) { return params.context.dataRowEdit(params.data); },
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'models', headerName: '车型', menuTabs: ['filterMenuTab'] },
    { field: 'modelDesc', headerName: '车型描述', menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderNum', headerName: '生产订单号', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '生产订单物料', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '生产订单物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'beforeItemCode', headerName: '技改前物料', menuTabs: ['filterMenuTab'] },
    { field: 'beforeItemDesc', headerName: '技改前物料描述', menuTabs: ['filterMenuTab'] },
    {
      field: 'afterItemCode', headerName: '技改后物料', menuTabs: ['filterMenuTab'],
      // cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      // cellRendererParams: {
      //   customTemplate: null
      // }
      // 列编辑模式
      editable: (params) => {
        return this.dataRowEdit(params.data);
      },
    },
    { field: 'afterItemDesc', headerName: '技改后物料描述', menuTabs: ['filterMenuTab'] },
    {
      field: 'afterUsage', headerName: '技改后单位用量', menuTabs: ['filterMenuTab'],
      // cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      // cellRendererParams: {
      //   customTemplate: null
      // }
      // 列编辑模式
      editable: (params) => {
        return this.dataRowEdit(params.data);
      },
    },
    { field: 'unitOfMeasure', headerName: '技改后物料单位', menuTabs: ['filterMenuTab'] },
    { field: 'onhandQty', headerName: '场内库存', menuTabs: ['filterMenuTab'] },
    { field: 'supplyQty', headerName: '供应商库存', menuTabs: ['filterMenuTab'] },
    { field: 'totalDemandQty', headerName: '需求数量', menuTabs: ['filterMenuTab'] },
    { field: 'decudeStockAllocationQty', headerName: '推演库存分配', menuTabs: ['filterMenuTab'] },
    { field: 'decudeStockLeftQty', headerName: '推演剩余库存', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '生产线', menuTabs: ['filterMenuTab'] },
    { field: 'moQty', headerName: '生产订单数量', menuTabs: ['filterMenuTab'] },
    { field: 'issueFlag', headerName: '是否发料', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1)' },
  ];

  queryParamsValues: any;
  expColumns = [];
  expColumnsOptions = [
    { field: 'issueFlag', options: this.listYesNo },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    // this.columns.forEach(col => {
    //   if (col.field === 'afterItemCode') {
    //     col.cellRendererParams.customTemplate = this.customTemplateItem;
    //   }
    //   if (col.field === 'afterUsage') {
    //     col.cellRendererParams.customTemplate = this.customTemplateUsage;
    //   }
    // });

    this.gridData = [];
    this.loadData();
    this.query();
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1: // 是否
        options = this.listYesNo;
        break;
    }
    const obj = options.find(x => x.value === value) || { label: value };
    return obj ? obj.label : null;
  }

  loadData() {
    this.queryService.GetLookupByTypeNew('FND_YES_NO').subscribe(result => {
      result.data.forEach(d => {
        this.listYesNo.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  getQueryParams(isExport: boolean = false) {
    return {
      plantCode: this.inputParam.plantCode,
      models: this.inputParam.models,
      beforeItemCode: this.inputParam.beforeItemCode,
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryParamsValues = this.getQueryParams();
    this.queryService.loadGridViewNew(this.queryService.queryAddDetailHttpAction, this.queryParamsValues, this);
  }

  clear() {
  }

  save() {
    if (!this.gridData || this.gridData.length === 0) {
      this.msgSrv.success(this.apptranslate.translate('当前没有数据，请重新查询'));
      return;
    }

    const listSelect = this.getSelectedRows();
    if (listSelect.length === 0) {
      const msg = this.apptranslate.translate('请勾选数据！');
      this.msgSrv.info(msg);
      return;
    }

    let listError = listSelect.filter(p => p.afterItemId === null || p.afterItemId === '');
    if (listError.length > 0) {
      const msg = this.apptranslate.translate('存在技改后物料为空的数据，请检查！');
      this.msgSrv.info(msg);
      return;
    }
    listError = listSelect.filter(p => p.afterUsage === null || p.afterUsage === '');
    if (listError.length > 0) {
      const msg = this.apptranslate.translate('存在技改后单位用量为空的数据，请检查！');
      this.msgSrv.info(msg);
      return;
    }

    this.queryService.saveTechnicalModify(listSelect).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.apptranslate.translate('保存成功'));
        this.inputParam.refresh = true;
      } else {
        this.msgSrv.error(this.apptranslate.translate(res.msg));
      }
    });
  }

  getSelectedRows(): any {
    const listRet = [];
    const listSelect = this.gridApi.getSelectedRows();
    listSelect.forEach(data => {
      if (this.dataRowEdit(data)) {
        listRet.push(data);
      }
    });
    return listRet;
  }

  public export() {
    super.export();
    setTimeout(() => { this.excelexport.export(this.gridData); }, 300);
  }

  public dataRowEdit(dataItem: any) {
    return dataItem.issueFlag !== 'Y';
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['技改后物料', '技改后单位用量']; // , '备注', '送货地址'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged() {
    const gridDom = document.querySelectorAll('#dnGridTech');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }

  itemSelect(dataItem: any) {
    const inputParam = {
      selectType: 'item', // 选择物料
      plantCode: dataItem.plantCode,
      itemCode: dataItem.afterItemCode,
      showSelectText: false, // 不显示已选
      selectText: '',
      multiple: false, // 非多选
      selectRow: null, // 选择行
    };
    this.modal.static(PlanschedulePsTechnicalModifyItemCategorySelectComponent, { inputParam: inputParam }, 'lg').subscribe(value => {
      if (value && inputParam.selectRow) {
        dataItem.afterItemId = inputParam.selectRow.itemId;
        dataItem.afterItemCode = inputParam.selectRow.itemCode;
        dataItem.afterItemDesc = inputParam.selectRow.descriptionsCn;
        dataItem.unitOfMeasure = inputParam.selectRow.unitOfMeasure;
        this.gridApi.refreshCells();
      }
    });
  }

  // 单元格内容改变
  onCellValueChanged(event) {
    const oldValue = event.oldValue === undefined || event.oldValue === null || event.oldValue === '' ? '' : event.oldValue.toString();
    const newValue = event.newValue === undefined || event.newValue === null || event.newValue === '' ? '' : event.newValue.toString();
    if (oldValue !== newValue) {
      const field = event.colDef.field;
      const dataItem = event.data;
      if (field === 'afterItemCode') {
        // 修改技改后物料
        if (dataItem.beforeItemCode === newValue) {
          this.msgSrv.info(this.apptranslate.translate('技改后物料号不能和技改前物料号相同'));
          dataItem.afterItemCode = event.oldValue;
          this.gridApi.refreshCells();
        }
        if (newValue === '') {
          dataItem.afterItemId = '';
          dataItem.afterItemDesc = '';
          dataItem.unitOfMeasure = '';
          this.gridApi.refreshCells();
        } else {
          // 加载物料
          this.queryService.getUserPlantItemPageList(dataItem.plantCode, newValue, '', 1, 10).subscribe(res => {
            if (res.data.totalElements === 1) {
              const itemData = res.data.content.find(x => x.itemCode === newValue);
              dataItem.afterItemId = itemData.itemId;
              dataItem.afterItemDesc = itemData.descriptionsCn;
              dataItem.unitOfMeasure = itemData.unitOfMeasure;
              this.gridApi.refreshCells();

            } else {
              this.msgSrv.warning(this.apptranslate.translate('物料无效'));
              dataItem.afterItemId = '';
              dataItem.afterItemCode = event.oldValue;
              dataItem.afterItemDesc = '';
              dataItem.unitOfMeasure = '';
              this.gridApi.refreshCells();
            }
          });
        }
      }
      if (field === 'afterUsage') {
        // 修改技改后单位用量
        if (newValue.length > 0 && (this.strToNumber(newValue).toString() === 'NaN' || this.strToNumber(newValue) < 0)) {
          this.msgSrv.info(this.apptranslate.translate('请输入不小于0的数字'));
          dataItem.afterUsage = event.oldValue;
          this.gridApi.refreshCells();
        }
      }
    }
  }

  strToNumber(str: any) {
    if (str == null || str.length === 0) return 0;
    return Number(str);
  }

  // itemChange($event) {
  //   const value = this.inputParam.itemCode || '';
  //   if (value !== '') {
  //     // 加载物料
  //     this.queryService.getUserPlantItemPageList(this.inputParam.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
  //       this.gridView1.data = res.data.content;
  //       this.gridView1.total = res.data.totalElements;
  //       if (res.data.totalElements === 1) {
  //         this.i.itemId = res.data.content.find(x => x.itemCode === Text).itemId;
  //         this.i.itemCode = res.data.content.find(x => x.itemCode === Text).itemCode;
  //       } else {
  //         this.msgSrv.warning(this.apptranslate.translate('物料无效'));
  //       }
  //     });
  //   }
  // }

  // gridView1: GridDataResult = {
  //   data: [],
  //   total: 0
  // };
  // columns1: any[] = [
  //   {
  //     field: 'itemCode',
  //     title: '物料',
  //     width: '100'
  //   },
  //   {
  //     field: 'descriptionsCn',
  //     title: '物料描述',
  //     width: '100'
  //   },
  //   {
  //     field: 'unitOfMeasure',
  //     title: '物料单位',
  //     width: '100'
  //   }
  // ];
  // search1(e: any) {
  //   const PageIndex = e.Skip / e.PageSize + 1;
  //   this.loadItems(this.inputParam.plantCode, e.SearchValue, PageIndex, e.PageSize);
  // }

  // // 加载物料
  // public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
  //   // 加载物料
  //   this.queryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
  //     this.gridView1.data = res.data.content;
  //     this.gridView1.total = res.data.totalElements;
  //   });
  // }

  // //  行点击事件， 给参数赋值
  // onRowSelect(e: any) {
  //   // this.editDto.itemId = e.Row.itemId;
  //   // this.editDto.itemCode = e.Text;
  //   // this.editDto.itemDesc = e.Row.descriptionsCn;
  // }
}
