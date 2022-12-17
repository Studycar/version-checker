/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-09-20 10:04:21
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-20 17:51:41
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { QueryService } from './queryService';
import { SopPsMouldItemEditComponent } from './edit/edit.component';
import { SopPsMouldItemImportComponent } from './import/import.component';
import { PsMouldManageService } from 'app/modules/generated_module/services/psmould.service';
import { PsMouldItemManageService } from 'app/modules/generated_module/services/psmould-item.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
/**
 * 模具信息维护
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-psmould-manager',
  templateUrl: './psmould-item.component.html',
  providers: [QueryService],
})
export class SopPsMouldItemManagerComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  httpAction = {
    url: this.psMouldItemManageService.seachUrl,
    method: 'GET',
    data: false,
  };
  versionOptions: any[] = [];
  context = this;
  resourceOptions: any[] = [];
  sourceOptions: any[] = [];
  plantOptions: any[] = [];
  nameOptions: any[] = [];
  yesOrNo: any[] = [];

  // 物料的选择框
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

    // 模具的选择框
    gridViewMoulds: GridDataResult = {
      data: [],
      total: 0,
    };
    columnsMoulds: any[] = [
      {
        field: 'mouldCode',
        title: '模具',
        width: '100',
      },
      {
        field: 'descriptions',
        title: '描述',
        width: '100',
      },
    ];

  public queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 },
        required: true,
      },
      {
        field: 'itemCodeFrom', title: '物料编码', ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
        },
      },
      {
        field: 'resourceCodeFrom', title: '模具', ui: {
          type: UiType.popupSelect,
          valueField: 'mouldCode',
          textField: 'mouldCode',
          gridView: this.gridViewMoulds,
          columns: this.columnsMoulds,
          eventNo: 3,
        },
      },
      {
        field: 'enableFlag',
        title: '是否有效',
        ui: { type: UiType.select, options: this.yesOrNo },
      },
      { field: 'sopFlag', title: '参与S&OP', ui: { type: UiType.select, options: this.yesOrNo } },
      { field: 'scheduleFlag', title: '是否参与排产', ui: { type: UiType.select, options: this.yesOrNo } }
 
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      itemCodeFrom: { value: '', text: '' },
      resourceCodeFrom: { value: '', text: '' },
      enableFlag: '',
      scheduleFlag: '',
      sopFlag: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
    },
  };
  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 70,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1,
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
    },
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },

    {
      field: 'resourceCode',
      headerName: '模具编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemId',
      headerName: '物料',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemMouldPriority',
      headerName: '模具优先级',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'uph',
      headerName: '单位小时产出',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      headerName: '是否有效',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab']
    },
    {
      field: 'sopFlag',
      headerName: '参与S&OP',
      valueFormatter: function (params) {
        return params.value === 'Y' ? '是' : '否';
      },
      menuTabs: ['filterMenuTab']
    },
    {
      field: 'scheduleFlag',
      headerName: '是否参与排产',
      valueFormatter: function (params) {
        return params.value === 'Y' ? '是' : '否';
      },
    },
    {
      field: 'createdBy',
      headerName: '创建人',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'creationDate',
      headerName: '创建时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'lastUpdatedBy',
      headerName: '最近更新人',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'lastUpdateDate',
      headerName: '最近更新时间',
      menuTabs: ['filterMenuTab'],
    },
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'resouceCode', title: '模具编码', width: 200, locked: false },
    { field: 'itemId', title: '物料', width: 200, locked: false },
    { field: 'itemMouldPriority', title: '模具优先级', width: 200, locked: false },
    { field: 'uph', title: '单位小时产出', width: 200, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: false },
    { field: 'sopFlag', title: '参与S&OP', width: 200, locked: false },
    { field: 'scheduleFlag', title: '是否参与排产', width: 200, locked: false },
  ];
  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private psMouldItemManageService: PsMouldItemManageService,
    private psMouldManageService: PsMouldManageService,
    private translateservice: AppTranslationService,
    private modalService: NzModalService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: translateservice,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
  }

  LoadData() {

    this.commonquery.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });

      });
    });



    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.yesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });






  }

  query() {
    super.query();
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.GetQueryParams(),
      this.context,
    );
  }


  GetQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemId: this.queryParams.values.itemCodeFrom.value,
      resourceCode: this.queryParams.values.resourceCodeFrom.value,
      enableFlag: this.queryParams.values.enableFlag,
      sopFlag: this.queryParams.values.sopFlag,
      scheduleFlag: this.queryParams.values.scheduleFlag,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      itemCodeFrom: { value: '', text: '' },
      resourceCodeFrom: { value: '', text: '' },
      enableFlag: null,
      scheduleFlag:null,
      sopFlag:null,
      pageIndex: 1,
      pageSize: this.gridState.take,
    };
  }

  add(item?: any) {
    this.modal
      .static(
        SopPsMouldItemEditComponent,
        {
          i: { id: item !== undefined ? item.id : null },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }



  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }

    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.psMouldItemManageService.removeBatch(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.translateservice.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.translateservice.translate(res.msg));
          }
        });
      },
    });
  }

  remove(value: any) {
    this.psMouldItemManageService.removeBatch([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.translateservice.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg));
      }
    });
  }


  expData: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'enableFlag', options: this.yesOrNo },
    { field: 'sopFlag', options: this.yesOrNo },
    { field: 'scheduleFlag', options: this.yesOrNo },
  ];


  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }

  import() {
    this.modal
      .static(SopPsMouldItemImportComponent, {}, 'md')
      .subscribe(() => {
        this.query();
      });
  }

  selectKeys = 'Id';
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
      this.queryService.loadGridView(
        this.httpAction,
        this.GetQueryParams(),
        this.context,
      );
    } else {
      this.setLoading(false);
    }
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNo;
        break;

    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  // 物料弹出查询
  public searchItemsFrom(e: any) {
    debugger;
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.translateservice.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public searchMouldsFrom(e: any) {
    debugger;
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.translateservice.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadResources(this.queryParams.values.plantCode, PageIndex, e.PageSize);
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  
  public loadResources(plantCode: string, PageIndex: number, PageSize: number) {debugger;
    // 加载物料
    this.psMouldManageService.getPageList(plantCode || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewMoulds.data = res.data.content;
      this.gridViewMoulds.total = res.data.totalElements;
    });
  }

  // 工厂切换动态清除物料
  public clearItemCodes(event: string) {
    this.queryParams.values.itemCodeFrom.text = '';
    this.queryParams.values.itemCodeFrom.value = '';
    this.queryParams.values.resourceCodeFrom.text = '';
    this.queryParams.values.resourceCodeFrom.value = '';
  }
}
