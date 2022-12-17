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
import { BomChangeRequestService } from './bom-change-request.service';
import { BomChangeRequestEditComponent } from './edit/edit.component';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planning-parameters',
  templateUrl: './bom-change-request.component.html',
  providers: [BomChangeRequestService]
})
export class BomChangeRequestComponent extends CustomBaseContext implements OnInit {

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private modal: ModalHelper,
    private queryService: BomChangeRequestService
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  whetherOptions: any[] = [];
  ecrTypeOptions: any = [];
  planTypeOptions: any = [];
  planApplicationOptions: any = [];
  plantOptions: any[] = [];
  public gridViewItem: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItem: any[] = [
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

  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 },
      },
      {
        field: 'assemblyItemCode',
        title: '上阶物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode' /*valueField和textField与gridView的列对应  */,
          gridView: this.gridViewItem,
          columns: this.columnsItem,
          eventNo: 2,
        },        
      },
      {
        field: 'componentItemCode',
        title: '物料编码',   
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode' /*valueField和textField与gridView的列对应  */,
          gridView: this.gridViewItem,
          columns: this.columnsItem,
          eventNo: 2,
        },   
      },
      {
        field: 'ecrType',
        title: '变更类型',
        ui: { type: UiType.select, options: this.ecrTypeOptions, eventNo: 1 },
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      assemblyItemCode: { value: '', text: '' },
      componentItemCode: { value: '', text: '' },
      ecrType: '',
    }
  };
  columns = [
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 130,
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
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'assemblyItemCode',
      headerName: '上阶物料编码',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'componentItemCode',
      headerName: '物料编码',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'ecrType',
      headerName: '变更类型',
      width: 150,
      valueFormatter: 'ctx.optionsFind(value, 2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'beforeQty',
      headerName: '变更前用量',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'afterQty',
      headerName: '变更后用量',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'effectivityDate',
      headerName: '生效期',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'disableDate',
      headerName: '失效期',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'alternateBomDesignator',
      headerName: 'BOM替代项',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'replacementGroup',
      headerName: '替代组',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      headerName: '是否启用',
      width: 100,
      valueFormatter: 'ctx.optionsFind(value, 1).label',
      menuTabs: ['filterMenuTab'],
    },
  ];
  // expColumns = [
  //   { field: 'planName', title: '计划名称', width: 150, locked: false },
  //   { field: 'description', title: '计划描述', width: 150, locked: false },
  //   { field: 'purchasingExecutive', title: '采购执行计划', width: 150, locked: false },
  //   { field: 'productionExecutive', title: '生产执行计划', width: 150, locked: false },
  //   { field: 'planHorizonDays', title: '展望期天数', width: 150, locked: false },
  //   { field: 'planIncludedItems', title: '物料范围', width: 150, locked: false },
  // ];
  // expColumnsOptions = [
  //   { field: 'purchasingExecutive', options: this.whetherOptions },
  //   { field: 'productionExecutive', options: this.whetherOptions },
  //   { field: 'planIncludedItems', options: this.ecrTypeOptions },
  // ];
  // @ViewChild('excelexport', { static: true }) excelExport: CustomExcelExportComponent;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.LoadData();
    this.loadWhetherOptions();
    this.loadEcrTypeOptions();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      assemblyItemCode: { value: '', text: '' },
      componentItemCode: { value: '', text: '' },
      ecrType: '',
    };
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.setLoading(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const total = res.data && res.data.totalElements ? res.data.totalElements : 0;
      this.gridData = data;
      this.view = {
        data: this.gridData,
        total: total,
      };
      this.initGridWidth();
      setTimeout(() => {
        this.setLoading(false);
      });
    });
  }

  getQueryParams(isExport: boolean = false) {
    return {
      plantCode: this.queryParams.values.plantCode,
      assemblyItemCode: this.queryParams.values.assemblyItemCode.text,
      componentItemCode: this.queryParams.values.componentItemCode.text,
      ecrType: this.queryParams.values.ecrType,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const exportData = data;
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }

  add(data?: any) {
    this.modal.static(
      BomChangeRequestEditComponent,
      { params: data ? data : {plantCode: this.appConfigService.getPlantCode()} },
      'lg'
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.whetherOptions;
        break;
      case 2:
        options = this.ecrTypeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  LoadData() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  loadWhetherOptions() {
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.whetherOptions)
    /*.subscribe(result => {
      this.whetherOptions.length = 0;
      result.Extra.forEach(d => {
        this.whetherOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    })*/;
  }

  loadEcrTypeOptions() {
    this.commonQueryService.GetLookupByTypeRef('MRP_ECR_TYPE', this.ecrTypeOptions)
    /*.subscribe(res => {
      this.ecrTypeOptions.length = 0;
      res.Extra.forEach(item => {
        this.ecrTypeOptions.push({
          label: item.MEANING,
          value: item.LOOKUP_CODE,
        });
      });
    })*/;
  }

  searchItems(e: any) {
    const pageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, pageIndex, e.PageSize);
  }

  public loadItems(plantCode: string, itemCode: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', pageIndex, pageSize).subscribe(res => {
      this.gridViewItem.data = res.data.content;
      this.gridViewItem.total = res.data.totalElements;
    });
  }

  // exportFile() {
  //   this.commonQueryService.exportAction(
  //     { url: this.queryService.queryUrl, method: 'POST' },
  //     this.getQueryParams(true),
  //     this.excelExport,
  //     this.context
  //   );
  // }

  remove(data: any) {
    //const listIds = [data.Id];
    this.queryService.remove(data).subscribe(res => {
      if (res.code = 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功！'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
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
