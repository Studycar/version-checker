/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @LastEditors: Zwh
 * @Note: ...
 * @Date: 2018-12-25 13:59:07
 * @LastEditTime: 2021-03-08 18:01:58
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BasePsBomEditService } from './editservice';
import { BasePsBomService } from '../../../modules/generated_module/services/base-psbom-service';
import { BasePsbomViewComponent } from './view/view.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { QueryService } from './query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { ModalPlusService } from '@shared/components/modal-plus/modal-plus.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-psbom',
  templateUrl: './psbom.component.html',
  providers: [BasePsBomEditService, QueryService],
})
export class BasePsbomComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  expandForm = false;
  scheduleoptions: any[] = [];
  plantoptions: any[] = [];
  public mySelection: any[] = [];
  public bz: any[] = [];
  public start: String = '请选择';
  public sch: any; // 默认计划组
  public pla: any; //  默认工厂
  context = this;
  rangeoptions: any[] = [];
  categoryOptions: any[] = []; // 采购分类集合
  yesOrNo: any[] = [];
  itemTypeOptions: any[] = [];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public modalService: NzModalService,
    private editService: BasePsBomEditService,
    private bomservice: BasePsBomService,
    private appConfigService: AppConfigService,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private commonquery: CommonQueryService,
    private exportImportService: ExportImportService,
    private modalPlusService: ModalPlusService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  /** 查询物料数据 */
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  /** 物料弹出框列显示字段*/
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

  public queryParams = {
    defines: [
      {
        field: 'scheduleRegionCode',
        title: '事业部',
        ui: { type: UiType.select, options: this.scheduleoptions, eventNo: 1 },
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantoptions, eventNo: 2 },
      },
      {
        field: 'buyCategory',
        title: '计划分类',
        ui: { type: UiType.select, options: this.categoryOptions },
      },
      {
        field: 'from',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 3,
          extraEvent: {
            RowSelectEventNo: 4,
          },
        },
      },
      // { field: 'to', title: '物料编码到', ui: { type: UiType.text } },
      { field: 'descriptions', title: '物料描述', ui: { type: UiType.text } },
    ],
    values: {
      scheduleRegionCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      buyCategory: '',
      from: { text: '', value: '' },
      descriptions: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
    },
  };

  GetQueryParams(isExport: boolean) {
    return {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      plantCode: this.queryParams.values.plantCode,
      buyCategory: this.queryParams.values.buyCategory,
      from: this.queryParams.values.from.text,
      // to: this.queryParams.values.to,
      descriptions: this.queryParams.values.descriptions,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: isExport
    };
  }

  clear() {
    this.queryParams.values = {
      scheduleRegionCode: this.sch,
      plantCode: this.pla,
      buyCategory: null,
      from: { text: '', value: '' },
      // to: '',
      descriptions: '',
      pageIndex: 1,
      pageSize: 20,
    };
  }

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '展开',
      width: 80,
      pinned: 'right',
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: this.customTemplate, // Complementing the Cell Renderer parameters
      },
    },
    // { field: 'ASSEMBLY_ITEM', headerName: 'BOM编码' },
    {
      field: 'scheduleRegionCode',
      headerName: '事业部',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'plantCode',
      headerName: '工厂',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'assemblyItemCode',
      headerName: '物料编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'descriptionsCn',
      headerName: '物料描述',
      tooltipField: 'descriptionsCn',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemType',
      headerName: '物料类型',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'planCategory',
      headerName: '计划分类',
      tooltipField: 'planCategory',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'shrinkageRate',
    //   headerName: '物料损耗率',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'alternateBomDesignator',
      headerName: '替代项版本',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'keyItemFlag',
      headerName: '关键资源标志',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'incompleteFlag',
    //   headerName: '残缺标志',
    //   valueFormatter: 'ctx.optionsFind(value,1).label',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'lastUpdateDate',
    //   headerName: '残缺更新时间',
    //   menuTabs: ['filterMenuTab'],
    // },
  ];

  expColumns = [
    // { field: 'SUB_LAYER', title: '子层标识', width: 200, locked: false },
    { field: 'assemblyItemCode', title: 'BOM编码', width: 200, locked: false },
    {
      field: 'scheduleRegionCode',
      title: '事业部',
      width: 200,
      locked: false,
    },
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'assemblyItem', title: '物料编码', width: 200, locked: false },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: 200,
      locked: false,
    },
    { field: 'itemType', title: '物料类型', width: 200, locked: false },
    { field: 'planCategory', title: '计划分类', width: 200, locked: false },
    // {
    //   field: 'shrinkageRate',
    //   title: '物料损耗率',
    //   width: 200,
    //   locked: false,
    // },
    {
      field: 'alternateBomDesignator',
      title: '替代项版本',
      width: 200,
      locked: false,
    },
    {
      field: 'keyResourceFlag',
      title: '关键资源标志',
      width: 200,
      locked: false,
    },
    // { field: 'incompleteFlag', title: '残缺标志', width: 200, locked: false },
    // {
    //   field: 'lastUpdateDate',
    //   title: '残缺更新时间',
    //   width: 200,
    //   locked: false,
    // },
  ];

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.LoadData();
    this.regionchange(this.appConfigService.getActiveScheduleRegionCode());
    this.queryParams.values.plantCode = this.appConfigService.getPlantCode();
    this.queryCommon();
  }

  LoadData() {
    // this.queryCommon();
    this.commonquery.GetScheduleRegions().subscribe(res => {
      res.data.forEach(element => {
        this.scheduleoptions.push({
          label: element.scheduleRegionCode,
          value: element.scheduleRegionCode,
        });
      });
    });

    this.bomservice
      .getCategory(this.queryParams.values.plantCode)
      .subscribe(res => {
        res.data.forEach(element => {
          this.categoryOptions.push({
            label: element,
            value: element,
          });
        });
      });

    this.commonquery
      .GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.yesOrNo.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });

      this.commonquery
      .GetLookupByTypeLang('PS_ITEM_TYPE', this.appConfigService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.itemTypeOptions.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });

  }

  query() {
    super.query();
    this.queryCommon();
  }


  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNo;
        break;
      case 2:
        options = this.itemTypeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.GetQueryParams(false),
      this.context,
    );
  }

  add(dataitem: any) {
    /*
    this.modal
      .static(
        BasePsbomViewComponent,
        {
          i: {
            alternateBomDesignator:
              dataitem !== undefined ? dataitem.alternateBomDesignator : null,
            plantCode: dataitem !== undefined ? dataitem.plantCode : null,
            assemblyItemId:
              dataitem !== undefined ? dataitem.assemblyItemId : null,
          },
        },
        'lg',
      )
      .subscribe(() => { });
    */
    // /*
    this.modalPlusService.create(BasePsbomViewComponent,
      {
        i: {
          alternateBomDesignator:
            dataitem !== undefined ? dataitem.alternateBomDesignator : null,
          plantCode: dataitem !== undefined ? dataitem.plantCode : null,
          assemblyItemId:
            dataitem !== undefined ? dataitem.assemblyItemId : null,
        },
      },
    ).subscribe(() => { });
    // */
  }

  regionchange(value: any) {
    this.queryParams.values.plantCode = null;
    this.commonquery.GetUserPlant(value).subscribe(res => {
      this.plantoptions.length = 0;
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode,
        });
      });
    });
  }

  plantChange(value: any) {
    this.queryParams.values.buyCategory = null;
    this.queryParams.values.from.text = '';
    this.queryParams.values.from.value = '';
    this.queryParams.values.descriptions = '';
    this.bomservice.getCategory(value).subscribe(res => {
      this.categoryOptions.length = 0;
      res.data.forEach(element => {
        this.categoryOptions.push({
          label: element,
          value: element
        });
      });
    });
  }

  public pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.queryCommon();
  }

  httpAction = { url: this.bomservice.searchurl, method: 'GET' };
  httpExportAction = { url: this.bomservice.exportUrl, method: 'GET' };
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.queryService.exportAction(
      this.httpExportAction,
      this.GetQueryParams(true),
      this.excelexport,
    );
  }

  selectKeys = 'id';

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

  /**
   * 物料弹出查询
   * @param {any} e
   */
  public searchItems(e: any) {
    if (
      !this.queryParams.values.plantCode ||
      this.queryParams.values.plantCode === undefined
    ) {
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

  /**
   * 加载物料
   * @param {string} PLANT_CODE 工厂代码
   * @param {string} ITEM_CODE  物料代码
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadItems(
    PLANT_CODE: string,
    ITEM_CODE: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.commonquery
      .getUserPlantItemPageList(
        PLANT_CODE || '',
        ITEM_CODE || '',
        '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.content.length;
      });
  }

  /**
   * 物料弹窗行选中事件
   * @param Row 选中行详细信息对象（DESCRIPTIONS_CN，ITEM_CODE，ITEM_ID，ROWINDEX，UNIT_OF_MEASURE，WIP_SUPPLY_TYPE）
   * @param Text this.queryParams.values.strItemCodeFrom.text值
   * @param Value this.queryParams.values.strItemCodeFrom.value值
   * @param sender 弹出组件实例
   */
  rowSelect({ Row, Text, Value, sender }) {
    this.queryParams.values.from.text = Text;
    this.queryParams.values.from.value = Value;
  }
}
