/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:14
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 09:01:39
 * 物料合格供应商
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { PreparationPlatformSupplierEditComponent } from './edit/edit.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { SupplierService } from '../../../modules/generated_module/services/supplier-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-supplier',
  templateUrl: './supplier.component.html',
})
export class PreparationPlatformSupplierComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  selectKeys = 'id';
  plantoptions: any[] = [];
  StatusOptions: any[] = [];
  whetherOptions: any[] = [];
  mySelection: any[] = [];
  context = this;
  httpAction = {
    url: this.querydata.url,
    method: 'GET',
    data: null
  };

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public gridViewVendors: GridDataResult = {
    data: [],
    total: 0
  };
  public gridViewBuyer: GridDataResult = {
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
  public columnsBuyer: any[] = [
    {
      field: 'employeeNumber',
      title: '采购员编码',
      width: '100'
    },
    {
      field: 'fullName',
      title: '采购员名称',
      width: '100'
    }
  ];
  public queryParams = {
    defines: [
      { field: 'txtPlantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 }, required: true },
      {
        field: 'txtBuyer', title: '采购员', ui: {
          type: UiType.popupSelect, valueField: 'employeeNumber', textField: 'fullName', gridView: this.gridViewBuyer, columns: this.columnsBuyer, eventNo: 4
        }
      },
      {
        field: 'txtItemCode', title: '物料', ui: {
          type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
        }
      },
      {
        field: 'txtVendorNumber', title: '供应商', ui: {
          type: UiType.popupSelect, valueField: 'vendorNumber', textField: 'vendorNumber', gridView: this.gridViewVendors, columns: this.columnsVendors, eventNo: 3
        }
      },
      { field: 'txtStatus', title: '状态', ui: { type: UiType.select, options: this.StatusOptions } },
    ],
    values: {
      txtPlantCode: this.appconfig.getPlantCode(),
      txtBuyer: { value: '', text: '' },
      txtItemCode: { value: '', text: '' },
      txtVendorNumber: { value: '', text: '' },
      txtStatus: ''
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 70, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料说明', width: 250, tooltipField: 'ITEM_DESC', menuTabs: ['filterMenuTab'] },
    { field: 'buyer', headerName: '采购员', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'vendorNumber', headerName: '供应商编码', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'vendorName', headerName: '供应商名称', width: 200, tooltipField: 'VENDOR_NAME', menuTabs: ['filterMenuTab'] },
    // { field: 'vendorSiteCode', headerName: '供应商地点', width: 200, menuTabs: ['filterMenuTab'] },
    { field: 'priority', headerName: '优先级', width: 80, menuTabs: ['filterMenuTab'] },
    { field: 'economicalLot', headerName: '经济批量', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'minimunPackage', headerName: '最小包装', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'leadTime', headerName: '提前期', width: 80, menuTabs: ['filterMenuTab'] },
    { field: 'status', headerName: '状态', width: 100, valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'allocationPercent', headerName: '送货比例', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', width: 100, valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    // { field: 'customerNumber', headerName: '客户编码', width: 120, menuTabs: ['filterMenuTab'] },
    // { field: 'productItemCode', headerName: '成品编码', width: 120, menuTabs: ['filterMenuTab'] },
   ];

  expColumns = [
      { field: 'plantCode', title: '工厂', width: 100 },
      { field: 'itemCode', title: '物料编码', width: 150 },
      { field: 'itemDesc', title: '物料说明', width: 250 },
      { field: 'fullName', title: '采购商', width: 200 },
      { field: 'vendorNumber', title: '供应商编码', width: 150 },
      { field: 'vendorName', title: '供应商名称', width: 150 },
      // { field: 'vendorSiteCode', title: '供应商地点', width: 200 },
      { field: 'priority', title: '优先级', width: 80 },
      { field: 'economicalLot', title: '经济批量', width: 100 },
      { field: 'minimunPackage', title: '最小包装', width: 100 },
      { field: 'leadTime', title: '提前期', width: 80 },
      { field: 'enableFlag', title: '是否有效', width: 100 },
      { field: 'status', title: '状态', width: 80 },
      // { field: 'customerNumber', title: '客户编码', width: 150 },
      // { field: 'productItemCode', title: '成品编码', width: 150 },
    ];
  expColumnsOptions = [
    { field: 'status', options: this.StatusOptions },
    { field: 'enableFlag', options: this.whetherOptions },
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    public commonquery: CommonQueryService,
    public querydata: SupplierService,
    public msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.queryCommon();
    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
    this.commonquery.GetLookupByTypeNew('PC_PO_ASL_STATUS').subscribe(res => {
      res.data.forEach(element => {
        this.StatusOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.whetherOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.StatusOptions;
        break;
      case 2:
        options = this.whetherOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  PlantChange(value: any) {
    this.queryParams.values.txtItemCode.text = '';
    // this.loadItems(value, '', 1, 10);
  }

  private getQueryParamsValue(isExport: boolean = false): any {
    return {
      plantCode: this.queryParams.values.txtPlantCode,
      buyer: this.queryParams.values.txtBuyer.value,
      itemCode: this.queryParams.values.txtItemCode.text,
      vendorNumber: this.queryParams.values.txtVendorNumber.text,
      status: this.queryParams.values.txtStatus,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.commonquery.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this);
  }

  add(item?: any) {
    this.modal
      .static(
        PreparationPlatformSupplierEditComponent,
        { i: { id: item !== undefined ? item.id : null } },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  clear() {
    this.queryParams.values = {
      txtPlantCode: this.appconfig.getPlantCode(),
      txtBuyer: { value: '', text: '' },
      txtItemCode: { value: '', text: '' },
      txtVendorNumber: { value: '', text: '' },
      txtStatus: null
    };
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.info(this.apptranslate.translate('请选择要删除的数据。'));
      return;
    }
    // 弹出确认框
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.remove(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.apptranslate.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.apptranslate.translate(res.msg));
          }
        });
      },
    });
  }

  remove(value: any) {
    this.querydata.remove([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.apptranslate.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.apptranslate.translate(res.msg));
      }
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
    this.loadItems(this.queryParams.values.txtPlantCode, e.SearchValue, PageIndex, e.PageSize);
  }


  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonquery.export(this.httpAction, this.getQueryParamsValue(true), this.excelexport);
  }

  searchVendors(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(e.SearchValue, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadVendor(VENDOR_NUMBER: string, VENDOR_NAME: string, PageIndex: number, PageSize: number) {
    this.querydata.getVendorPageList( '', VENDOR_NUMBER || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewVendors.data = res.data.content;
      this.gridViewVendors.total = res.data.totalElements;
    });
  }

  searchBuyer(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadBuyer(e.SearchValue, PageIndex, e.PageSize);
  }

  public loadBuyer(employee: string, PageIndex: number, PageSize: number) {
    this.querydata.getBuyerPageList(employee || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewBuyer.data = res.data.content;
      this.gridViewBuyer.total = res.data.totalElements;
    });
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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
