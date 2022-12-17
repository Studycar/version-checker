import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { process } from '@progress/kendo-data-query';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DemandViewDetailComponent } from './view/demand-view-detail.component';
import { SupplyViewDetailComponent } from './view/supply-view-detail.component';
import { InventoryDetailComponent } from '../inventory-calculation/detail/detail.component';
import { formatDate } from '@angular/common';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'supply-demand-check',
  templateUrl: './supply-demand-check.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [QueryService],
  styles: [`.k-grid .no-padding{padding:0}
          .whole-cell{display:block;padding:0;margin:0;}
          .redCellStyle {color:red;}
          .blueCellStyle {color:blue;}
          .yellowCellStyle {color:#EAC100}
          .backColor0 {background-color:#ffffff !important}
          .backColor1 {background-color:#f5f7fa !important}
          .show-cell {
                background: white;
                border-left: 0.5px lightgrey solid !important;
                border-right: 0.5px lightgrey solid !important;
                border-bottom: 0.5px lightgrey solid !important;
            }`]
})
export class SupplyDemandCheckComponent extends CustomBaseContext implements OnInit {

  // 工厂
  public plantCodes: any[] = [];
  // 物料
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  // 物料
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];
  // 查询参数
  queryParams = {
    defines: [
      { field: 'strPlantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantCodes } },
      {
        field: 'strItemForm', title: '物料编码从', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems,
          eventNo: 1
        }
      },
      {
        field: 'strItemTo', title: '物料编码至', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems,
          eventNo: 1
        }
      },
      { field: 'strTimeRange', title: '日期范围', required: true, ui: { type: UiType.dateRange } }
    ],
    values: {
      strPlantCode: this.appConfig.getPlantCode(),
      strTimeRange: [],
      strItemForm: { value: '', text: '' },
      strItemTo: { value: '', text: '' }
    }
  };
  //
  public rowComponents;
  // 静态列
  public staticColumns: any[] = [
    {
      field: 'plantCode', headerName: '工厂', title: '工厂', width: 120, locked: true,
      cellRenderer: 'showCellRenderer',
      rowSpan: function (params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell': function (params) { return true; },
        'backColor0': function (params) { return params.data.showCell && params.data.groupIndex % 2 === 0; },
        'backColor1': function (params) { return params.data.showCell && params.data.groupIndex % 2 !== 0; }
      },
    },
    {
      field: 'itemCode', headerName: '物料', title: '物料', width: 120, locked: true,
      cellRenderer: 'showCellRenderer',
      rowSpan: function (params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell': function (params) { return true; },
        'backColor0': function (params) { return params.data.showCell && params.data.groupIndex % 2 === 0; },
        'backColor1': function (params) { return params.data.showCell && params.data.groupIndex % 2 !== 0; }
      },
    },
    {
      field: 'itemType', headerName: '物料类型', title: '物料类型', width: 120, locked: true,
      cellRenderer: 'showCellRenderer',
      rowSpan: function (params) {
        return params.data.rowSpan;
      },
      cellClassRules: {
        'show-cell': function (params) { return true; },
        'backColor0': function (params) { return params.data.showCell && params.data.groupIndex % 2 === 0; },
        'backColor1': function (params) { return params.data.showCell && params.data.groupIndex % 2 !== 0; }
      },
    },
    { field: 'rowType', headerName: '行类型', title: '行类型', width: 120, locked: true },
    {
      field: 'beginning', headerName: '期初', title: '期初', width: 120, locked: true,
      cellClass: function (params) { return params.context.getCellClass(params.data, 'beginning'); }
    }];
  // 日期扩展列
  public extendColumns: any[] = [];
  // 所有列
  public totalColumns: any[] = [];
  // 需要显示红色的列头
  public redColumnHeaders: any[] = [];

  showChart = false;
  options = {
    title: {
      text: '物料消耗曲线'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['产出', '消耗', '结余']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '产出',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '消耗',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '结余',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
    ]
  };

  onCellClicked(params) {
    const dto = {
      plantCode: this.queryParams.values.strPlantCode,
      itemCodeFrom: params.data.ItemCode,
      itemCodeTo: params.data.ItemCode,
      dateFrom: this.queryService.formatDate(this.queryParams.values.strTimeRange[0]),
      dateTo: this.queryService.formatDate(this.queryParams.values.strTimeRange[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: false
    };
    this.queryService.QueryMainData(dto).subscribe(res => {
      this.showChart = true;
      const xAxisData: string[] = [];
      let startDate = this.queryParams.values.strTimeRange[0];
      const endDate = this.queryParams.values.strTimeRange[1];
      const output = res.data[1];
      const consume = res.data[0];
      const remain = res.data[2];
      const outputData: any[] = [];
      const consumeData: any[] = [];
      const remainData: any[] = [];
      while (startDate < endDate) {
        const timeString = 'COL' + formatDate(startDate, 'yyyyMMdd', 'zh-Hans');
        outputData.push(output[timeString] === '' ? 0 : Number(output[timeString]));
        consumeData.push(consume[timeString] === '' ? 0 : Number(consume[timeString]));
        remainData.push(remain[timeString] === '' ? 0 : Number(remain[timeString]));

        xAxisData.push(formatDate(startDate, 'yyyy-MM-dd', 'zh-Hans'));
        startDate = this.queryService.addDays(startDate, 1);
      }

      const endStr = 'COL' + formatDate(endDate, 'yyyyMMdd', 'zh-Hans');
      outputData.push(output[endStr] === '' ? 0 : Number(output[endStr]));
      consumeData.push(consume[endStr] === '' ? 0 : Number(consume[endStr]));
      remainData.push(remain[endStr] === '' ? 0 : Number(remain[endStr]));
      xAxisData.push(formatDate(endDate, 'yyyy-MM-dd', 'zh-Hans'));

      this.options.title.text = consume.ItemCode + '-物料消耗曲线';
      this.options.xAxis.data = xAxisData;
      this.options.series[0].data = outputData;
      this.options.series[1].data = consumeData;
      this.options.series[2].data = remainData;
      this.options = Object.assign({}, this.options);
    });
  }

  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    public pro: BrandService,
    public appConfig: AppConfigService,
    private confirmationService: NzModalService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfig });
    this.headerNameTranslate(this.staticColumns);

    this.rowComponents = { showCellRenderer: this.mergeCellRenderer() };
  }

  mergeCellRenderer() {
    function ShowCellRenderer() { }
    ShowCellRenderer.prototype.init = function (params) {
      this.ui = document.createElement('div');
      if (params.colDef.field === 'itemCode') {
        this.ui.innerHTML = '<div>' + params.data.itemCode + '</div>' +
          '<div style="white-space: normal;"><span>' + params.data.itemDesc + '</span></div>';
      } else {
        this.ui.innerHTML = '<div>' + params.value + '</div>';
      }
    };
    ShowCellRenderer.prototype.getGui = function () {
      return this.ui;
    };
    return ShowCellRenderer;
  }

  ngOnInit() {
    this.gridData = [];
    this.defaultColDef.sortable = false;
    this._pageSize = this.pageSizes[0];
    this.clear();
    this.initPlantCodes();
    this.setGridColumn();
  }

  public loadItems(plantCode: string, itemCode: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.queryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', pageIndex, pageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.strPlantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  setGridColumn() {
    this.totalColumns = [];
    this.staticColumns.forEach(col => {
      this.totalColumns.push(col);
    });
    this.extendColumns.forEach(col => {
      this.totalColumns.push(col);
    });
  }

  initPlantCodes() {
    // 当前用户对应工厂
    this.queryParams.values.strPlantCode = this.appConfig.getPlantCode();
    /** 初始化 组织  下拉框*/
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodes.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  clear() {
    // 默认开始时间为当前时间，结束时间为当前时间+15天
    const dateFrom = new Date();
    const dateTo = this.queryService.addDays(dateFrom, 15);
    this.queryParams.values = {
      strPlantCode: this.appConfig.getPlantCode(),
      strTimeRange: [dateFrom, dateTo],
      strItemForm: { value: '', text: '' },
      strItemTo: { value: '', text: '' }
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // 查询
  queryCommon() {
    this.gridApi.paginationSetPageSize(this._pageSize);
    this.setLoading(true);
    const dto = {
      plantCode: this.queryParams.values.strPlantCode,
      itemCodeFrom: this.queryParams.values.strItemForm.text,
      itemCodeTo: this.queryParams.values.strItemTo.text,
      dateFrom: this.queryService.formatDate(this.queryParams.values.strTimeRange[0]),
      dateTo: this.queryService.formatDate(this.queryParams.values.strTimeRange[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize / 3,
      isExport: false
    };
    this.queryService.QueryMainData(dto).subscribe(result => {
      this.createExtendColumns();
      this.gridData = result.data.content;
      this.view = {
        data: process(result.data.content, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length,
          filter: this.gridState.filter
        }).data,
        total: result.data.totalElements * 3
      };
      this.setLoading(true);
    });
  }

  displayCols: any;
  // 创建扩展列
  createExtendColumns() {
    let dateFrom = this.queryService.formatDate(this.queryParams.values.strTimeRange[0]);
    let dateTo = this.queryService.formatDate(this.queryParams.values.strTimeRange[1]);
    const display = dateFrom + '-' + dateTo;
    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);
    // 如果扩展天数有变更，则重新创建扩展列
    if (this.displayCols !== display) {
      this.displayCols = display;

      this.extendColumns = [];
      this.redColumnHeaders = [];
      // 列头样式：MM-DD班次号(星期)，如：04-10天(一)
      const weekDays = this.appTranslationService.translate('日一二三四五六');
      for (const curDate = dateFrom; dateFrom <= dateTo; curDate.setDate(curDate.getDate() + 1)) {
        const days = curDate.getDay();
        const str = this.getDateFormat(curDate);
        const reg = new RegExp('-', 'g'); // 创建正则RegExp对象

        const field = 'COL' + str.replace(reg, '');
        const title = str.substring(5) + '(' + weekDays.charAt(days) + ')';

        // 构造列
        const col = {
          field: field,
          title: title,
          headerName: title,
          colDate: str,
          width: 120,
          locked: true,
          cellClass: function (params) { return params.context.getCellClass(params.data, field); }
        };
        this.extendColumns.push(col);
        // 列头星期六星期天显示红色
        if (days === 0 || days === 6) {
          this.redColumnHeaders.push(title);
        }
      }

      this.setGridColumn();
    }
  }

  getDateFormat(dt: Date) {
    return this.queryService.formatDate(dt);
  }

  // 单元格双击
  onCellDoubleClicked(event) {
    const rowType = event.data.rowType;
    if ((rowType === '需求量' || rowType === '供应量') && this.strToNumber(event.value) > 0) {
      const itemCode = event.data.itemCode;
      const colDate = event.colDef.colDate;
      const dto = {
        plantCode: this.queryParams.values.strPlantCode,
        itemCodeFrom: itemCode,
        itemCodeTo: itemCode,
        dateFrom: colDate,
        dateTo: colDate,
        isExport: true
      };

      if (event.colDef.headerName === '期初') {
        dto.dateFrom = null;
        dto.dateTo = this.queryService.formatDate(this.queryParams.values.strTimeRange[0]);
      }

      if (rowType === '需求量') {
        if (this.checkEventTriggered()) return;
        this.modal.static(DemandViewDetailComponent, { iParam: dto }, 850).subscribe(() => { this.hasEventTriggered = false; });
      } else if (rowType === '供应量') {
        if (this.checkEventTriggered()) return;
        this.modal.static(SupplyViewDetailComponent, { iParam: dto }, 850).subscribe(() => { this.hasEventTriggered = false; });
      }
    }
  }

  public getCellClass(dataItem: any, field: string) {
    // 负数显示红色
    if (this.strToNumber(dataItem[field]) < 0) {
      return 'redCellStyle';
    }

    return '';
  }

  strToNumber(str: any) {
    if (str == null || str.length === 0) return 0;
    return Number(str);
  }

  // 显示列变更（列头样式）
  onVirtualColumnsChanged() {
    const gridDom = document.querySelectorAll('#dnGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.redColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: red');
        }
      });
    }
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  // 导出
  export() {
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    const dto = {
      plantCode: this.queryParams.values.strPlantCode,
      itemCodeFrom: this.queryParams.values.strItemForm.text,
      itemCodeTo: this.queryParams.values.strItemTo.text,
      dateFrom: this.queryService.formatDate(this.queryParams.values.strTimeRange[0]),
      dateTo: this.queryService.formatDate(this.queryParams.values.strTimeRange[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: true
    };

    this.queryService.QueryMainData(dto).subscribe(result => {
      this.excelexport.export(result.data.content);
    });
  }

  inventoryCheck() {
    this.modal.static(
      InventoryDetailComponent,
      {
        params: {
          PlantCode: this.queryParams.values.strPlantCode,
          StartDatetime: this.queryParams.values.strTimeRange[0],
          EndDatetime: this.queryParams.values.strTimeRange[1],
        }
      },
      'lg'
    ).subscribe(res => {});
  }

  // 页面大小选项
  pageSizes = [30, 60, 90, 120, 150];
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  public onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      if (this.queryParams !== undefined) {
        this.queryCommon();
      }
    } else {
      this.setLoading(false);
    }
  }

  // 提交供需平衡检查请求
  submitReq() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('系统将提交请求供需平衡检查数据，是否继续生成?'),
      nzOnOk: () => {
        this.queryService.SubmitReq(this.queryParams.values.strPlantCode).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('供需平衡检查请求已提交，请等候处理'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }
}
