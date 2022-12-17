import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { PsItemRoutingsService } from '../../../modules/generated_module/services/ps-item-routings-service';
import { MaterialmanagementProdlineItemsEditComponent } from './edit/edit.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { MaterialmanagementProdlineItemsImportComponent } from './import/import.component';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { ImportsModalComponent } from 'app/modules/base_module/components/imports-modal/imports-modal.component';
import { debug } from 'console';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-prodline-items-ag',
  templateUrl: './prodline-items-ag.component.html',
  providers: [PsItemRoutingsService],
})
export class MaterialmanagementProdlineItemsAgComponent
  extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public selectBy = 'id';

  isLoading = false;
  public optionListPlant: any[] = [];
  public optionListPlantGroup: Set<any> = new Set();
  public optionListProductLine: Set<any> = new Set();
  public applicationRateType: any[] = [];
  public applicationitemtypes: any[] = [];
  yesOrNo: any[] = [];
  applicationTechVerison: any[] = [];

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };

  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
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
        field: 'plantId',
        title: '工厂',
        ui: {
          type: UiType.select,
          options: this.optionListPlant,
          ngModelChange: this.onChangePlant,
        },
      },
      {
        field: 'plantGroupId',
        title: '计划组',
        ui: {
          type: UiType.select,
          options: this.optionListPlantGroup,
          ngModelChange: this.onChangeGroup,
        },
      },
      {
        field: 'productLineId',
        title: '资源',
        ui: { type: UiType.select, options: this.optionListProductLine },
      },
      {
        field: 'itemCodeS',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
        },
      },
    ],
    values: {
      plantId: this.appConfigService.getPlantCode(),
      plantGroupId: '',
      productLineId: '',
      itemCodeS: { value: '', text: '' },
    },
  };

  public columns = [
    // {
    //   colId: 0,
    //   field: '',
    //   headerName: '操作',
    //   width: 80,
    //   pinned: this.pinnedAlign,
    //   lockPinned: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate,
    //   },
    //   cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
    //   cellRendererParams: {
    //     customTemplate: null, // Complementing the Cell Renderer parameters
    //   },
    // },
    // {
    //   colId: 1,
    //   cellClass: '',
    //   field: '',
    //   headerName: '',
    //   width: 40,
    //   pinned: 'left',
    //   lockPinned: true,
    //   checkboxSelection: true,
    //   headerCheckboxSelection: true,
    //   headerCheckboxSelectionFilteredOnly: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate,
    //   },
    // },
    {
      field: 'plantCode',
      width: 80,
      headerName: '工厂',
      tooltipField: 'plantCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'scheduleGroupCode',
      width: 120,
      headerName: '计划组',
      tooltipField: 'scheduleGroupCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'resourceCode',
      width: 120,
      headerName: '资源',
      tooltipField: 'resourceCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'resourceType',
      width: 100,
      headerName: '资源类型',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemCode',
      width: 140,
      headerName: '物料编码',
      tooltipField: 'itemCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'descriptions',
      width: 150,
      headerName: '物料描述',
      tooltipField: 'descriptions',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'manufLineCode',
      width: 140,
      headerName: '产线编码',
      tooltipField: 'manufLineCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'manufLineName',
      width: 150,
      headerName: '产线名称',
      tooltipField: 'manufLineName',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'processCode',
    //   width: 100,
    //   headerName: '工序号',
    //   tooltipField: 'processCode',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'rateType',
      width: 140,
      headerName: '速率类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rate',
      width: 90,
      headerName: '速率',
      tooltipField: 'rate',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'batchQty',
    //   width: 100,
    //   headerName: '批次数量',
    //   tooltipField: 'batchQty',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'priority',
      width: 100,
      headerName: '优先级',
      tooltipField: 'priority',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'techVersion',
    //   width: 110,
    //   headerName: '工艺版本',
    //   valueFormatter: 'ctx.optionsFind(value,3).label',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'scheduleFlag',
      width: 120,
      headerName: '参与排产标识',
      tooltipField: 'scheduleFlag',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'selectResourceFlag',
      width: 120,
      headerName: '参与选线标识',
      tooltipField: 'selectResourceFlag',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'alternateBomDesignator',
      width: 120,
      headerName: 'BOM替代项',
      tooltipField: 'alternateBomDesignator',
      menuTabs: ['filterMenuTab'],
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationRateType;
        break;
      case 2:
        options = this.applicationitemtypes;
        break;
      case 3:
        options = this.applicationTechVerison;
        break;
      case 4:
        options = this.yesOrNo;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: PsItemRoutingsService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantId,
      itemCodeS: this.queryParams.values.itemCodeS.text,

      // ITEM_CODE_E: this.queryParams.values.ITEM_CODE_E.text,
      scheduleGroupCode: this.queryParams.values.plantGroupId,
      productLineCode: this.queryParams.values.productLineId,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  ngOnInit() {
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadplant();
    this.loadItemType();
    this.loadRateType();
    this.loadTechVersion();
    this.loadYesOrNo();
    this.query();
  }

  public loadYesOrNo(): void {
    this.commonQueryService
      .GetLookupByType('FND_YES_NO')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.yesOrNo.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  public loadRateType(): void {
    this.commonQueryService
      .GetLookupByType('PS_RATE_TYPE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.applicationRateType.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }
  public loadItemType(): void {
    this.commonQueryService
      .GetLookupByType('PS_RESOURCE_TYPE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.applicationitemtypes.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  public loadTechVersion(): void {
    this.commonQueryService
      .GetLookupByType('TECH_VERSION')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.applicationTechVerison.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.optionListPlant.length = 0;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
      this.queryParams.values.plantId = this.appConfigService.getPlantCode();

      // 根据工厂 加载组和产线
      this.loadplantGroup();
      this.loadproductLine();

      // 绑定物料
      // this.queryParams.values.ITEM_CODE_E.text = '';
      this.queryParams.values.itemCodeS.text = '';
      this.loadItems(this.queryParams.values.plantId, '', 1, 10);

      // this.query();
    });
  }

  loadplantGroup(): void {
    this.isLoading = true;
    this.commonQueryService
      .GetUserPlantGroup(this.queryParams.values.plantId)
      .subscribe(result => {
        this.isLoading = false;
        result.Extra.forEach(d => {
          this.optionListPlantGroup.add({
            label: d.scheduleGroupCode,
            value: d.scheduleGroupCode,
          });
        });
      });
  }

  loadproductLine(): void {
    this.isLoading = true;
    this.commonQueryService
      .GetUserPlantGroupLine(
        this.queryParams.values.plantId,
        this.queryParams.values.plantGroupId,
      )
      .subscribe(result => {
        this.isLoading = false;
        result.Extra.forEach(d => {
          this.optionListProductLine.add({
            label: d.resourceCode,
            value: d.resourceCode,
          });
        });
      });
  }

  // loadItem(): void {
  //   this.editService.SearchItemInfo(this.queryParams.values.plantID).subscribe(resultMes => {

  //     this.optionListItem1 = resultMes.Extra;
  //     this.optionListItem2 = resultMes.Extra;

  //   });
  // }

  public loadItems(
    plantCode: string,
    itemCode: string,
    PageIndex: number,
    PageSize: number,
  ) {
    // 加载物料
    this.editService
      .GetUserPlantItemPageList(
        plantCode || '',
        itemCode || '',
        '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
      });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.plantId,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    /** 重新绑定  组*/
    this.queryParams.values.plantGroupId = null;
    this.queryParams.values.productLineId = null;
    this.commonQueryService.GetUserPlantGroup(value).subscribe(result => {
      if (result.Extra == null) {
        this.optionListPlantGroup.clear();
        return;
      } else {
        // 先清除，在重新绑定
        this.optionListPlantGroup.clear();
        result.Extra.forEach(d => {
          this.optionListPlantGroup.add({
            label: d.scheduleGroupCode,
            value: d.scheduleGroupCode,
          });
        });
        return;
      }
    });

    // this.queryParams.values.ITEM_CODE_E.text = '';
    this.queryParams.values.itemCodeS.text = '';
    this.loadItems(this.queryParams.values.plantId, '', 1, 10);
  }

  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {
    console.log(value);
    this.queryParams.values.productLineId = null;
    /** 重新绑定  组*/
    this.commonQueryService
      .GetUserPlantGroupLine(this.queryParams.values.plantId, value)
      .subscribe(result => {
        if (result.Extra == null) {
          this.optionListProductLine.clear();
          return;
        } else {
          // 先清除，在重新绑定
          this.optionListProductLine.clear();
          result.Extra.forEach(d => {
            this.optionListProductLine.add({
              label: d.resourceCode,
              value: d.resourceCode,
            });
          });
          return;
        }
      });
  }

  httpAction = { url: this.editService.seachUrl1, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }

  public add(item: any) {
    this.modal
      .static(
        MaterialmanagementProdlineItemsEditComponent,
        {
          i: {
            id: item !== undefined ? item.id : null,
            plantCode: item !== undefined ? item.plantCode : null,
          },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    this.editService.Remove(item).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    console.log(this.selectionKeys);

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.RemoveBath(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(
              this.appTranslationService.translate('删除成功'),
            );
            this.query();
          } else {
            this.msgSrv.error(
              this.appTranslationService.translate(res.msg),
            );
          }
        });
      },
    });
  }

  // 导入
  public import() {
    // jianl注释，改用最新的导入模块
    this.modal
      .static(MaterialmanagementProdlineItemsImportComponent, {}, 'md')
      .subscribe(value => {
        // if (value) {
        this.query();
        // }
      });
    // this.exportImportService.import('ITEM_ROUTING_IMPORT', result => {
    //   // console.log("this.exportImportService.import('ITEM_ROUTING_IMPORT')");
    //   if (result) {
    //     this.query();
    //   }
    // });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [
    { field: 'resourceType', options: this.applicationitemtypes },
    { field: 'techVersion', options: this.applicationTechVerison },
    { field: 'rateType', options: this.applicationRateType },
  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.export({ url: this.editService.seachUrl1, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
    // jianl，改用新的导出方式
    // this.exportImportService.exportCompatibilityWithProgress(
    //   {
    //     url: this.editService.seachUrl,
    //     method: 'GET',
    //   },
    //   this.getQueryParamsValue(),
    //   this.expColumns,
    //   'ProdLineItemExport',
    //   this,
    //   '工艺路线数据导出.xlsx',
    // );
  }

  public clear() {
    this.queryParams.values = {
      plantId: null,
      plantGroupId: null,
      productLineId: null,
      itemCodeS: { value: '', text: '' },
      // ITEM_CODE_E: { value: '', text: '' }
    };

    this.loadplant();
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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
