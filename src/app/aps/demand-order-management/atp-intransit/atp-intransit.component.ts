import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { ModalHelper } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from '../../../modules/base_module/components/custom-operatecell-render.component';
import { AtpIntransitDetailComponent } from './detail/detail.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';

@Component({
  selector: 'app-atp-intransit',
  templateUrl: './atp-intransit.component.html'
})
export class AtpIntransitComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modal: ModalHelper,
    private commonQueryService: CommonQueryService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  businessUnitOption: any[] = [];
  plantOption: any[] = [];
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
  queryParams = {
    defines: [
      {
        field: 'businessUnitCode',
        title: '事业部',
        ui: { type: UiType.select, options: this.businessUnitOption, ngModelChange: this.onBusinessUnitCodeChange }
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption, ngModelChange: this.onPlantCodeChange }
      },
      {
        field: 'itemCode',
        title: '物料编码',
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
      }
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getActivePlantCode(),
      itemCode: { text: '', value: '' }
    }
  };
  columns = [
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 70,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    { field: 'batchCode', headerName: '批次号', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'businessUnitCode', headerName: '事业部', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'plantCode', headerName: '工厂', width: 110, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 130, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'itemTypeDesc', headerName: '物料类型', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'intransitTypeDesc', headerName: '在途类型', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'availableDate', headerName: '能力日期', width: 170, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'originalWipQuantity', headerName: '原始数量', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'remainWipQuantity', headerName: '剩余数量', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  ];
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadBusinessUnitOption();
    this.loadPlantOption(this.queryParams.values.businessUnitCode);
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonQueryService.loadGridView(
      { url: '/api/ps/gopAtpIntransit/queryGopAtpIntransit', 
      method: 'GET' },
      this.getQueryParams(),
      this.context
    );
  }

  getQueryParams() {
    return {
      businessUnitCode: this.queryParams.values.businessUnitCode,
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode.text,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getQueryParams();
    this.commonQueryService.exportAction({ url: '/api/ps/gopAtpIntransit/queryGopAtpIntransit', method: 'GET' }, dto, this.excelexport, this.context);
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getActivePlantCode(),
      itemCode: { text: '', value: '' }
    };
  }

  detail(data: any) {
    this.modal.static(
      AtpIntransitDetailComponent,
      { data: data },
      'lg'
    ).subscribe(res => { });
  }

  onBusinessUnitCodeChange(val: string) {
    this.queryParams.values.plantCode = null;
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
    this.loadPlantOption(val);
  }

  onPlantCodeChange(val: string) {
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
  }

  loadBusinessUnitOption() {
    this.commonQueryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.businessUnitOption.push({
          label: item.scheduleRegionCode,
          value: item.scheduleRegionCode
        });
      });
    });
  }

  loadPlantOption(businessUnitCode: string) {
    this.commonQueryService.GetUserPlant(businessUnitCode, '').subscribe(res => {
      this.plantOption.length = 0;
      res.Extra.forEach(item => {
        this.plantOption.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  rowSelect({ Row, Text, Value, sender }) {
    this.queryParams.values.itemCode.text = Text;
    this.queryParams.values.itemCode.value = Value;
  }

  searchItems(e: any) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate(this.appTranslationService.translate('请先选择工厂！')));
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

  public loadItems(plantCode: string, itemCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data =  res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
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
