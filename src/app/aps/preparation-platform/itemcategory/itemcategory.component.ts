/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:13
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-24 10:44:47
 * @Note: 采购品类
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { QueryService } from './queryService';
import { ItemCategoryService } from '../../../modules/generated_module/services/item-category-service';
import { PreparationPlatformItemcategoryEditComponent } from '../itemcategory/edit/edit.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { PreparationPlatformItemcategoryViewComponent } from './view/view.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-itemcategory',
  templateUrl: './itemcategory.component.html',
  providers: [QueryService],
})
export class PreparationPlatformItemcategoryComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  selectKeys = 'id';
  httpAction = {
    url: this.querydata.url,
    method: 'GET',
  };
  plantoptions: any[] = [];
  plantTransOptions: any[] = [];
  fdsourceoptions: any[] = [];
  calendaroptions: any[] = [];
  regionoptions: any[] = [];
  enableOptions: any[] = [];
  collectOptions: any[] = [];
  mySelection: any[] = [];
  context = this;
  detailFlag: string;
  selectCategorySetCode: string;
  selectPlantId: string;
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.regionoptions;
        break;
      case 2:
        options = this.fdsourceoptions;
        break;
      case 3:
        options = this.calendaroptions;
        break;
      case 4:
        options = this.collectOptions;
        break;
      case 5:
        options = this.enableOptions;
        break;

    }
    return options.find(x => x.value === value) || { label: value };
  }

  /**表格列 */
  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 100,
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
      field: 'categoryCode',
      headerName: '物料类别',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'categoryDesc',
      headerName: '类别描述',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'deliveryRegionCode',
      headerName: '送货区域',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fdSourceType',
      headerName: '备料方式',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'deliveryCalendarCode',
      headerName: '监控方式',
      valueFormatter: 'ctx.optionsFind(value,3).label',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'demandCollectType',
      headerName: '需求汇总方式',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      width: 130,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'reqLeadTime',
      headerName: '需求提前期(小时)',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'overdueReqTime',
      headerName: '获取过期需求时间(小时)',
      width: 180,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'overdueDelNotifyTime',
      headerName: '过期送货通知时间(小时)',
      width: 180,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'issueTimeFence',
      headerName: '下达时间栏(小时)',
      width: 140,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'fixTimeFence',
      headerName: '送货通知锁定期(小时)',
      width: 170,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      headerName: '是否有效',
      valueFormatter: 'ctx.optionsFind(value,5).label',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
  ];

  /**导出列 */
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: true },
    { field: 'categoryCode', title: '类别编码', width: 200, locked: true },
    { field: 'categoryName', title: '类别名称', width: 200, locked: true },
    {
      field: 'deliveryRegionCode',
      title: '送货区域',
      width: 200,
      locked: true,
    },
    { field: 'fdSourceType', title: '备料方式', width: 200, locked: true },
    {
      field: 'deliveryCalendarCode',
      title: '监控方式',
      width: 200,
      locked: true,
    },
    { field: 'reqLeadTime', title: '需求提前期', width: 200, locked: true },
    {
      field: 'overdueReqTime',
      title: '获取过期需求时间(小时)',
      width: 200,
      locked: true,
    },
    {
      field: 'overdueDelNotifyTime',
      title: '过期送货通知时间(小时)',
      width: 200,
      locked: true,
    },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: true },
  ];
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  /** */
  public columnsItems: any[] = [
    {
      field: 'categoryCode',
      title: '类别编码',
      width: '100',
    },
    {
      field: 'categoryDesc',
      title: '类别名称',
      width: '100',
    },
  ];
  /**查询参数 */
  public queryParams = {
    defines: [
      {
        field: 'txtPlantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantoptions ,eventNo: 2 }, required: true
      },
      {
        field: 'txtCategory',
        title: '类别',
        ui: {
          type: UiType.popupSelect,
          valueField: 'categoryCode',
          textField: 'categoryCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
        },
      },
    ],
    values: {
      txtPlantCode: this.appconfig.getPlantCode(),
      txtCategory: { value: '', text: '' },
    },
  };

  plantchange(value) {

  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private querydata: ItemCategoryService,
    private appconfig: AppConfigService,
    private commonQuery: CommonQueryService,
    private modalService: NzModalService,
    private translateservice: AppTranslationService,
    private appGridStateService: AppGridStateService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: translateservice,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.headerNameTranslate(this.columns);
  }
  /**页面初始化 */
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.LoadData();

    this.query();
  }
  /**页面加载方法 */
  LoadData() {
    this.commonQuery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode,
        });
      });
    });

    this.commonQuery.GetLookupByType('FND_CATEGORY_SET').subscribe(res => {
      res.Extra.forEach(item => {
        if (item.lookupCode === 'PURCHASE_CATEGORY') {
          this.selectCategorySetCode = item.additionCode;
        }
      });
    });

    this.commonQuery.GetLookupByTypeLang('PC_DEMAND_COLLECT', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.collectOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonQuery.GetLookupByType('FND_YES_NO').subscribe(result => {
      result.Extra.forEach(element => {
        this.enableOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });


    this.commonQuery.GetLookupByTypeLang('PC_DLY_CALENDAR_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.calendaroptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonQuery.GetLookupByType('PC_SOURCE_TYPE').subscribe(result => {
      result.Extra.forEach(element => {
        this.fdsourceoptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

  }

  queryMulRegion() {
    let plantId = this.queryParams.values.txtPlantCode;
    this.plantTransOptions.length = 0;
    // 加载工厂用于根据plantCode得到plantId
    this.querydata.GetMasterOrganizationids(this.queryParams.values.txtPlantCode).subscribe(result => {
      plantId = result.data[0].id;
      this.commonQuery
        .GetParameter('PC_MUL_REGION_FLAG', '3', plantId)
        .subscribe(res => {
          this.detailFlag = res.data;
        });
    })

  }
  //
  /**查询 */
  query() {
    this.queryMulRegion();
    super.query();
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }
  /**得到查询参数 */
  getQueryParamsValue() {
    return {
      plantCode: this.queryParams.values.txtPlantCode,
      CategoryCode: this.queryParams.values.txtCategory.text,
    };
  }
  /**新增、编辑 */
  add(item?: any) {
    this.modal
      .static(
        PreparationPlatformItemcategoryEditComponent,
        { i: { id: item !== undefined ? item.id : null, plantCode: item !== undefined ? item.plantCode : null, selectCategorySetCode: this.selectCategorySetCode } },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }
  /**明细 */
  detail(item: any) {
    this.modal
      .static(
        PreparationPlatformItemcategoryViewComponent,
        {
          j: {
            plantCode: item !== undefined ? item.plantCode : null,
            categoryCode: item.categoryCode,
            enableOptions: this.enableOptions
          },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
    /* } else {
       alert('不存在明细行');
     }
   });*/
  }
  /**重置 */
  clear() {
    this.queryParams.values = {
      txtPlantCode: this.appconfig.getPlantCode(),
      txtCategory: { value: '', text: '' },
    };
  }
  /**删除 */
  public remove(item: any) {
    this.querydata.remove([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        // this.msgSrv.error(res.Message);
        this.msgSrv.error(this.translateservice.translate(res.msg));
      }
    });
  }

  /**批量删除 */
  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    console.log(this.selectionKeys);

    this.modalService.confirm({
      nzContent: this.translateservice.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.querydata.remove(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success('删除成功');
            this.query();
          } else {
            // this.msgSrv.error(res.Message);
            this.msgSrv.error(this.translateservice.translate(res.msg));
          }
        });
      },
    });
  }

  // /**导出 */
  expData: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'deliveryRegionCode', options: this.regionoptions },
    { field: 'fdSourceType', options: this.fdsourceoptions },
    { field: 'deliveryCalendarCode', options: this.calendaroptions },
    { field: 'demandCollectType', options: this.collectOptions },
    { field: 'enableFlag', options: this.enableOptions },
  ];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }

  public loadItems(PLANT_CODE: string, CATEGORY_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.querydata.GetUserPlantCategoryPageList(PLANT_CODE || '', CATEGORY_CODE || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.txtPlantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
