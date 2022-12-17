import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService, HttpAction } from 'app/modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { QueryService } from './query.service';

@Component({
  selector: 'app-inventory-demand',
  templateUrl: './inventory-demand.component.html',
  providers: [QueryService],
})
export class InventoryDemandComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    public queryService: QueryService,
    private commonQueryService: CommonQueryService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
    this.headerNameTranslate(this.expColumns);
    this.headerNameTranslate(this.columnsItems);
  }

  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];
  divisionOptions: Array<{ label: string, value: any }> = [];
  plantOptions: Array<{ label: string, value: any }> = [];
  queryParams = {
    defines: [
      {
        field: 'division',
        title: this.appTranslationService.translate('事业部'),
        required: true,
        ui: { type: UiType.select, options: this.divisionOptions, ngModelChange: this.onDivisionChange, }
      },
      {
        field: 'plantCode',
        title: this.appTranslationService.translate('工厂'),
        required: true,
        ui: { type: UiType.select, options: this.plantOptions, ngModelChange: this.onPlantCodeChange, }
      },
      {
        field: 'itemCode',
        title: this.appTranslationService.translate('物料编码'),
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
          },
        },
      },
      {
        field: 'demandStartDate',
        title: this.appTranslationService.translate('需求开始日期'),
        ui: { type: UiType.dateRange, }
      },

    ],
    values: {
      division: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { text: '', value: '' },
      demandStartDate: [],
    }
  };
  columns = [
    { field: 'scheduleRegionCode', headerName: '事业部', width: 90, menuTabs: ['filterMenuTab'], },
    { field: 'plantCode', headerName: '工厂', width: 90, menuTabs: ['filterMenuTab'], },
    { field: 'itemCode', headerName: '物料编码', width: 120, menuTabs: ['filterMenuTab'], },
    { field: 'itemDesc', headerName: '物料描述', width: 200, menuTabs: ['filterMenuTab'], },
    { field: 'demandQty', headerName: '需求数量', width: 100, menuTabs: ['filterMenuTab'], },
    {
      field: 'demandStartDate',
      headerName: '需求开始日期',
      width: 130,
      valueFormatter: function (params) {
        if (params.value) {
          return params.value.split(' ')[0];
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'demandEndDate',
      headerName: '需求结束日期',
      width: 130,
      valueFormatter: function (params) {
        if (params.value) {
          return params.value.split(' ')[0];
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab'],
    },
  ];
  expColumns = [
    { field: 'scheduleRegionCode', title: '事业部', width: 150, locked: false, },
    { field: 'plantCode', title: '工厂', width: 150, locked: false, },
    { field: 'itemCode', title: '物料编码', width: 150, locked: false, },
    { field: 'itemDesc', title: '物料描述', width: 150, locked: false, },
    { field: 'demandQty', title: '需求数量', width: 150, locked: false, },
    { field: 'demandStartDate', title: '需求开始日期', width: 150, locked: false },
    { field: 'demandEndDate', title: '需求结束日期', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelExport', { static: true }) excelExport: CustomExcelExportComponent;
  action: HttpAction = { url: this.queryService.seachUrl, method: 'GET' };


  ngOnInit() {
    this.getDivisionOptions();
    this.getPlantOptions(this.queryParams.values.division);
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      division: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { text: '', value: '' },
      demandStartDate: [],

    };
  }

  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      this.action,
      this.getQueryParams(),
      this.context,
    );
  }
  // this.queryService.loadGridViewNew(this.httpAction, this.GetQueryParams(false), this.context);

  getQueryParams(isExport: boolean = false) {
    return {
      division: this.queryParams.values.division,
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode.text,
      startDate: this.queryParams.values.demandStartDate.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.demandStartDate[0]) : '',
      endDate: this.queryParams.values.demandStartDate.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.demandStartDate[1]) : '',
      pageIndex: this.lastPageNo, // jianl新增，为了迎合后台定义的dto的属性名，所以增加了这个参数，和page是一样的（page不知道是哪个接口有用到，不敢删）
      pageSize: this.lastPageSize,
      isExport: isExport,
    };
  }

  exportFile() {
    this.commonQueryService.exportAction(
      this.action,
      this.getQueryParams(true),
      this.excelExport,
      this.context
    );
  }

  getDivisionOptions() {
    this.commonQueryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.divisionOptions.push({
          label: item.scheduleRegionCode,
          value: item.scheduleRegionCode
        });
      });
    });
  }

  getPlantOptions(division: string) {
    this.commonQueryService.GetUserPlant(division).subscribe(res => {
      this.plantOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  onDivisionChange(division: string) {
    this.queryParams.values.plantCode = null;
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
    this.getPlantOptions(division);
  }

  onPlantCodeChange(plant: string) {
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
  }

  searchItems(e: any) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选择工厂！'),
      );
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.plantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  loadItems(
    plantCode: string,
    itemCode: string,
    PageIndex: number,
    PageSize: number,
  ) {//getUserPlantItemPageList
    // this.commonQueryService.GetUserPlantItemPageList(
    //   plantCode || '',
    //   itemCode || '',
    //   '',
    //   PageIndex,
    //   PageSize,
    // ).subscribe(res => {
    //   this.gridViewItems.data = res.Result;
    //   this.gridViewItems.total = res.TotalCount;
    // });

    this.commonQueryService
      .getUserPlantItemPageList(
        plantCode || '',
        itemCode || '',
        '',
        PageIndex,
        PageSize,
        ''
      )
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
      });
  }

  rowSelect({ Row, Text, Value, sender }) {
    this.queryParams.values.itemCode.text = Text;
    this.queryParams.values.itemCode.value = Value;
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}
