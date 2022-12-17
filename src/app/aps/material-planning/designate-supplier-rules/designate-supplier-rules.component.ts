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
import { DesignateSupplierRulesService } from './designate-supplier-rules.service';
import { DesignateSupplierRulesEditComponent } from './edit/edit.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'designate-supplier-rules',
  templateUrl: './designate-supplier-rules.component.html',
  providers: [DesignateSupplierRulesService]
})
export class DesignateSupplierRulesComponent extends CustomBaseContext implements OnInit {

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private modal: ModalHelper,
    private queryService: DesignateSupplierRulesService
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
  materialRangeOptions: any = [];
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
        field: 'itemId',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemId',
          textField: 'itemCode' /*valueField和textField与gridView的列对应  */,
          gridView: this.gridViewItem,
          columns: this.columnsItem,
          eventNo: 2,
        },       
      },
      {
        field: 'itemDes',
        title: '物料描述',
        ui: { type: UiType.text }
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      itemId: { value: '', text: '' },
      itemDes: '',
    }
  };
  columns = [
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
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'projectNumber',
      headerName: '项目号',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'assemblyItemId',
      headerName: '上阶物料编码',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'assemblyItemDes',
      headerName: '上阶物料描述',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'alternateBomDesignator',
      headerName: '替代项',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemId',
      headerName: '物料编码',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemDes',
      headerName: '物料描述',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'bomVersion',
      headerName: 'bom版本',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorNumber',
      headerName: '供应商编码',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorDes',
      headerName: '供应商描述',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'brandNumber',
      headerName: '品牌编码',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'brandDes',
      headerName: '品牌描述',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
  ];

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.LoadData();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
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

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      itemId: { value: '', text: '' },
      itemDes: '',
    };
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.setLoading(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.records && Array.isArray(res.data.records) ? res.data.records : [];
      const total = res.data && res.data.total ? res.data.total : 0;
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
      itemId: this.queryParams.values.itemId.value,
      itemCode: this.queryParams.values.itemId.text,
      itemDes: this.queryParams.values.itemDes,
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
      const data = res.data && res.data.records && Array.isArray(res.data.records) ? res.data.records : [];
      const exportData = data;
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }

  add(data?: any) {
    this.modal.static(
      DesignateSupplierRulesEditComponent,
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
        options = this.materialRangeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
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

  loadMaterialRangeOptions() {
    this.commonQueryService.GetLookupByTypeRef('MRP_PLAN_INCLUDE_ITEMS', this.materialRangeOptions)
    /*.subscribe(res => {
      this.materialRangeOptions.length = 0;
      res.Extra.forEach(item => {
        this.materialRangeOptions.push({
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
      if (res.code === 200) {
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
