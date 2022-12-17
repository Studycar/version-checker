import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { ModalHelper } from '@delon/theme';
import { DataRefreshComponent } from './data-refresh/data-refresh.component';
import { NumberInputEditorComponent } from './number-input.component';
import { ProdlineItemOptimizationService } from '../../../modules/generated_module/services/prodline-item-optimization-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'prodline-items-optimization',
  templateUrl: './prodline-items-optimization.component.html',
  providers: [ProdlineItemOptimizationService]
})

export class ProdlineItemsOptimizationComponent extends CustomBaseContext implements OnInit {

  constructor(

    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private modalService: NzModalService,
    private modal: ModalHelper,
    private queryService: ProdlineItemOptimizationService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];
  plantOptions: any[] = [];
  plantGroupOptions: any[] = [];
  productLineOptions: any[] = [];
  handleSuggestOptions: any[] = [];
  rateTypeOptions: any[] = [];
  queryParams = {
    defines: [
      {
        field: 'plant',
        title: '工厂',
        ui: {
          type: UiType.select,
          options: this.plantOptions,
          ngModelChange: this.onPlantChange,
        },
      },
      {
        field: 'plantGroup',
        title: '计划组',
        ui: {
          type: UiType.select,
          options: this.plantGroupOptions,
          ngModelChange: this.onGroupChange,
        },
      },
      {
        field: 'productLine',
        title: '资源',
        ui: { type: UiType.select, options: this.productLineOptions },
      },
      {
        field: 'materialCode',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
        },
      },
      {
        field: 'handleSuggest',
        title: '处理建议',
        ui: { type: UiType.select, options: this.handleSuggestOptions }
      },
      {
        field: 'scheduleQtyFlag',
        title: '排产数量 > 0',
        ui: { type: UiType.checkbox }
      }
    ],
    values: {
      plant: this.appConfigService.getPlantCode(),
      plantGroup: null,
      productLine: null,
      materialCode: { value: '', text: '' },
      handleSuggest: null,
      scheduleQtyFlag: true
    },
  };
  frameworkComponents = Object.assign({}, this.gridOptions.frameworkComponents, {
    numberInput: NumberInputEditorComponent
  });
  columns = [
    {
      colId: 1,
      field: '',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'plantCode',
      width: 80,
      headerName: '工厂',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'scheduleGroupCode',
      width: 100,
      headerName: '计划组',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'resourceCode',
      width: 100,
      headerName: '资源',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'processCode',
      width: 100,
      headerName: '工序号',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemCode',
      width: 120,
      headerName: '物料编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemDes',
      width: 150,
      headerName: '物料描述',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rateType',
      width: 100,
      headerName: '速率类型',
      valueFormatter: 'ctx.optionsFind(value, 1).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rate',
      width: 80,
      headerName: '速率',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'suggestRate',
      width: 100,
      headerName: '建议速率',
      menuTabs: ['filterMenuTab'],
      editable: true,
      cellEditor: 'numberInput',
    },
    {
      field: 'offsetRate',
      width: 80,
      headerName: '偏差率',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'priority',
      width: 80,
      headerName: '优先级',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'suggestPriority',
      width: 110,
      headerName: '建议优先级',
      menuTabs: ['filterMenuTab'],
      editable: true,
      cellEditor: 'numberInput',
    },
    {
      field: 'handleState',
      width: 100,
      headerName: '处理建议',
      valueFormatter: 'ctx.optionsFind(value, 2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'planQty',
      width: 100,
      headerName: '排产数量',
      menuTabs: ['filterMenuTab'],
    },
  ];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'scheduleGroupCode', title: '计划组', width: 150, locked: false },
    { field: 'resourceCode', title: '资源', width: 150, locked: false },
    { field: 'processCode', title: '工序号', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', width: 150, locked: false },
    { field: 'itemDes', title: '物料描述', width: 150, locked: false },
    { field: 'rateType', title: '速率类型', width: 150, locked: false },
    { field: 'rate', title: '速率', width: 150, locked: false },
    { field: 'suggestRate', title: '建议速率', width: 150, locked: false },
    { field: 'offsetRate', title: '偏差率', width: 150, locked: false },
    { field: 'priority', title: '优先级', width: 150, locked: false },
    { field: 'suggestPriority', title: '建议优先级', width: 150, locked: false },
    { field: 'handleState', title: '处理建议', width: 150, locked: false },
    { field: 'planQty', title: '排产数量', width: 150, locked: false },
  ];
  expColumnsOptions = [
    { field: 'rateType', options: this.rateTypeOptions },
    { field: 'handleState', options: this.handleSuggestOptions }
  ];
  @ViewChild('excelexport', { static: true }) excelExport: CustomExcelExportComponent;
  selectRows: any[] = [];

  ngOnInit() {
    this.loadRateTypeAndHandleSuggest();
    this.loadPlant();
    this.loadPlantGroup();
    this.query();
  }

  clear() {
    this.queryParams.values = {
      plant: this.appConfigService.getPlantCode(),
      plantGroup: null,
      productLine: null,
      materialCode: { value: '', text: '' },
      handleSuggest: null,
      scheduleQtyFlag: true
    };
    this.loadPlantGroup();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  getQueryParams(isExport: boolean = false) {
    return {
      plantCode: this.queryParams.values.plant,
      scheduleGroupCode: this.queryParams.values.plantGroup,
      resourceCode: this.queryParams.values.productLine,
      itemCode: this.queryParams.values.materialCode.text,
      handleState: this.queryParams.values.handleSuggest,
      planFlag: this.queryParams.values.scheduleQtyFlag ? 'Y' : 'N',
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
     // QueryParams: {
      
     // }
    };
  }

  queryCommon() {
    this.commonQueryService.loadGridViewNew(
      {url: this.queryService.queryUrl, method: 'GET'},
      this.getQueryParams(),
      this.context
    );
  }

  dataRefresh() {
    this.modal.static(DataRefreshComponent).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  exportFile() {
    this.commonQueryService.exportAction(
      { url: this.queryService.exportUrl, method: 'GET' },
      this.getQueryParams(true),
      this.excelExport,
      this.context
    );
  }

  processOptimization() {
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('是否确认更改该记录？'),
      nzOnOk: () => {
        this.selectRows = [...this.gridApi.getSelectedRows()];
        const queryDto = this.selectRows.length > 0 ? null : this.getQueryParams(true);
        this.queryService.processOptimization(this.selectRows, queryDto).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('优化请求提交成功！'));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      }
    });
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.rateTypeOptions;
        break;
      case 2:
        options = this.handleSuggestOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.plant,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  loadItems(
    plantCode: string,
    itemCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(
      plantCode || '',
      itemCode || '',
      '',
      pageIndex,
      pageSize,
      ).subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalPages;
      });
  }

  loadRateTypeAndHandleSuggest() {
    this.commonQueryService.GetLookupByType('PS_RATE_TYPE').subscribe(res => {
      res.Extra.forEach(item => {
        this.rateTypeOptions.push({
          label: item.meaning,
          value: item.meaning
        });
      });
    });
    this.commonQueryService.GetLookupByType('PS_RESOLUTION').subscribe(res => {
      res.Extra.forEach(item => {
        this.handleSuggestOptions.push({
          label: item.meaning,
          value: item.meaning
        });
      });
    });
  }

  loadPlant() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      this.plantOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  loadPlantGroup() {
    this.commonQueryService.GetUserPlantGroup(this.queryParams.values.plant).subscribe(res => {
      this.plantGroupOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantGroupOptions.push({
          label: item.scheduleGroupCode,
          value: item.scheduleGroupCode
        });
      });
    });
  }

  loadProductLine() {
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plant, this.queryParams.values.plantGroup).subscribe(res => {
      this.productLineOptions.length = 0;
      res.Extra.forEach(item => {
        this.productLineOptions.push({
          label: item.resourceCode,
          value: item.resourceCode
        });
      });
    });
  }

  onPlantChange(val: string) {
    this.queryParams.values.plantGroup = null;
    this.queryParams.values.productLine = null;
    this.queryParams.values.materialCode.text = '';
    this.queryParams.values.materialCode.value = '';
    this.loadPlantGroup();
  }

  onGroupChange(val: string) {
    this.queryParams.values.productLine = null;
    this.loadProductLine();
  }

  onCellValueChanged(params) {
    if (params.newValue !== params.oldValue) {
      this.queryService.cellValueSave(params.data).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('更改成功！'));
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    }
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
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
}
