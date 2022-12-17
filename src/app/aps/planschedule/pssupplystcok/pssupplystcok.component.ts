/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:14
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 10:06:12
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from './queryService';
import { PcBuyerService } from '../../../modules/generated_module/services/pc-buyer-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { PsSupplyStcokService } from 'app/modules/generated_module/services/PsSupplyStcokService';
import { PlanschedulePsSupplyStcokEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-pssupplystcok',
  templateUrl: './pssupplystcok.component.html',
  // providers: [QueryService]
})
export class PlanschedulePsSupplyStcokComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    // private queryservice: QueryService,
    private dataService: PsSupplyStcokService,
    private msgSrv: NzMessageService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  httpAction = {
    url: this.dataService.seachUrl,
    method: 'GET',
    data: false
  };

  plantOptions: any[] = [];
  // employeoptions: any[] = [];
  // kendoheight = document.body.clientHeight - 280;
  // mySelection: any[] = [];
  // context = this;
  // YesOrNo = [];

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public gridViewVendors: GridDataResult = {
    data: [],
    total: 0
  };

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
  public columnsVendors: any[] = [
    {
      field: 'vendorNumber',
      title: '供应商编码',
      width: '100'
    },
    {
      field: 'vendorName',
      title: '供应商名称',
      width: '100'
    }
  ];

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions } },
      {
        field: 'itemId', title: '物料', ui: {
          type: UiType.popupSelect, valueField: 'itemId', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
        }
      },
      {
        field: 'vendorNumber', title: '供应商', ui: {
          type: UiType.popupSelect, valueField: 'vendorNumber', textField: 'vendorNumber', gridView: this.gridViewVendors, columns: this.columnsVendors, eventNo: 3
        }
      }
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      itemId: { value: '', text: '' },
      vendorNumber: { value: '', text: '' }
    }
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
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'vendorNumber', headerName: '供应商编码', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'stockQty', headerName: '库存数量', menuTabs: ['filterMenuTab'] }
  ];

  expColumns = [
    { field: 'userName', title: '用户', width: 200, locked: true },
    { field: 'employeeNumber', title: '采购员编码', width: 200, locked: true },
    { field: 'fullName', title: '采购员姓名', width: 200, locked: true }
  ];

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('pssupplystcok');
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    // console.log(key);
    // this.allColumnIds.length = 0;
    // let i = 0;
    // this.gridColumnApi.getAllColumns().forEach(x => {
    //   if()
    //   this.allColumnIds.push(x.getColId());
    // });
    // this.gridColumnApi.autoSizeColumns(this.allColumnIds);
    // this.gridApi.sizeColumnsToFit();
    // return;
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {

    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  PlantChange(value: any) {
    this.queryParams.values.itemId.text = '';
    // this.loadItems(value, '', 1, 10);
  }

  LoadData() {
    // 加载工厂
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element1 => {
        this.plantOptions.push({
          label: element1.plantCode,
          value: element1.plantCode
        });
      });
    });
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  searchVendors(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(e.SearchValue, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadVendor(VENDOR_NUMBER: string, VENDOR_NAME: string, PageIndex: number, PageSize: number) {
    this.dataService.getVendorPageList(VENDOR_NUMBER || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewVendors.data = res.data.content;
      this.gridViewVendors.total = res.data.totalElements;
    });
  }

  GetQueryParams(isExport: boolean = false) {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemId: this.queryParams.values.itemId.text,
      vendorNumber: this.queryParams.values.vendorNumber.text,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  add(item?: any) {
    this.modal
      .static(
        PlanschedulePsSupplyStcokEditComponent,
        { i: { id: (item !== undefined ? item.id : null) } },
        'lg'
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonquery.loadGridViewNew(this.httpAction, this.GetQueryParams(), this);
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      vendorNumber: { value: '', text: '' },
      itemId: { value: '', text: '' },
    };
  }

  remove(value: any) {
    this.dataService.remove(value.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.apptranslate.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.apptranslate.translate(res.msg));
      }
    });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonquery.export(this.httpAction, this.GetQueryParams(), this.excelexport, this);
  }
  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
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
