import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { PlantCalendarService } from './plant-calendar.service';
import { PlantCalendarEditComponent } from './edit/edit.component';
import { PlantCalendarDetailComponent } from './detail/detail.component';
import { PlantCalendarCopyComponent } from './copy/copy.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-calendar',
  templateUrl: './plant-calendar.component.html',
  providers: [PlantCalendarService]
})
export class PlantCalendarComponent extends CustomBaseContext implements OnInit {

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private modal: ModalHelper,
    private queryService: PlantCalendarService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  plantOptions: any[] = [];
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions },
      },
    ],
    values: {
      plantCode: null
    }
  };
  columns = [
    {
      colId: 'select',
      cellClass: '',
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
      suppressSizeToFit: true,
    },
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 100,
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
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'plantDesc',
      headerName: '工厂描述',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'startDate',
      headerName: '开始日期',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'endDate',
      headerName: '结束日期',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'weekWorkDays',
      headerName: '周工作天数',
      width: 110,
      menuTabs: ['filterMenuTab'],
    }
  ];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'plantDesc', title: '工厂描述', width: 150, locked: false },
    { field: 'startDate', title: '开始日期', width: 150, locked: false },
    { field: 'endDate', title: '结束日期', width: 150, locked: false },
    { field: 'weekWorkDays', title: '周工作天数', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelExport', { static: true }) excelExport: CustomExcelExportComponent;
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  ngOnInit() {
    this.columns[1].cellRendererParams.customTemplate = this.customTemplate;
    this.loadPlantOptions();
    this.query();
  }

  clear() {
    this.queryParams.values = {
      plantCode: null,
    };
  }

  query() {
    super.query();
    this.commonQuery();
  }

  getQueryParams(isExport: boolean = false) {
    return {
      plantCode: this.queryParams.values.plantCode,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      { url: this.queryService.queryUrl, method: 'GET' },
      this.getQueryParams(),
      this.context
    );
  }

  loadPlantOptions() {
    this.commonQueryService.GetUserPlantNew(this.appConfigService.getUserId()).subscribe(res => {
      this.plantOptions.length = 0;
      res.data.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  add(data?: any) {
    this.modal.static(
      PlantCalendarEditComponent,
      { params: data ? data : {} },
      'lg'
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  exportFile() {
    this.commonQueryService.export(
      { url: this.queryService.queryUrl, method: 'GET' },
      this.getQueryParams(true),
      this.excelExport,
      this.context
    );
  }

  plantCalendarInit() {
    if (this.selectionKeys.length === 0) {
      this.msgSrv.error(this.appTranslationService.translate('请先选择需要初始化的项！'));
      return;
    }
    this.queryService.initPlantCalendar(this.selectionKeys).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('初始化成功！'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  plantCalendarCopy() {
    this.modal.static(
      PlantCalendarCopyComponent,
      { queryParams: this.getQueryParams(true) },
      'lg'
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  plantCalendarDetail(data: any) {
    this.modal.static(
      PlantCalendarDetailComponent,
      {
        plantCode: data.plantCode,
        plantDesc: data.plantDesc,
        startDate: data.startDate,
        endDate: data.endDate

      },
      'xl'
    ).subscribe(res => {});
  }

  remove(data: any) {
    const plantCodes = [data.plantCode];
    this.queryService.removePlantCalendar(plantCodes).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功！'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  onSelectionChanged() {
    this.getGridSelectionKeys('plantCode');
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
