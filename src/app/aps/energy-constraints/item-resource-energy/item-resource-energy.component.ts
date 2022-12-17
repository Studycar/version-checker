import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { EnergyConstraintsItemResourceEnergyEditComponent } from './edit/edit.component';
import { ItemResourceEnergyImportComponent } from './import/import.component';
import { ItemResourceEnergyService } from './query.service';

@Component({
  selector: 'item-resource-energy',
  templateUrl: './item-resource-energy.component.html',
  providers: [ItemResourceEnergyService]
})
export class EnergyConstraintsItemResourceEnergyComponent 
extends CustomBaseContext
implements OnInit {

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  plantCodeList: any[] = [];
  scheduleGroupCodeList: any[] = [];
  resourceCodeList: any[] = [];

  /**能源类型 */
  energyTypeOptions = [];

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

  /** 查询物料数据 */
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantCodeList, ngModelChange: this.loadScheduleGroup } },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.scheduleGroupCodeList, ngModelChange: this.loadResource } },
      { field: 'resourceCode', title: '资源编码', ui: { type: UiType.select, options: this.resourceCodeList } },
      {
        field: 'strItemCodeFrom',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemId',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
          },
        },
      },
      { field: 'descriptions', readonly: 'readonly', title: '物料描述', ui: { type: UiType.string },},
      { field: 'energyType', title: '能源类型', ui: { type: UiType.select, options: this.energyTypeOptions } },
    ],
    values: {
      plantCode: null,
      scheduleGroupCode: '',
      resourceCode: '',
      strItemCodeFrom: { value: '', text: '' },
      descriptions: '',
      energyType: '',
      unitSymbol: '',
    }
  };

  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
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
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    {
      field: 'plantCode',
      width: 80,
      headerName: '工厂'
    },
    {
      field: 'scheduleGroupCode',
      width: 80,
      headerName: '计划组'
    },
    {
      field: 'resourceCode',
      width: 80,
      headerName: '资源编码'
    },
    {
      field: 'itemCode',
      width: 80,
      headerName: '物料编码',
    },
    {
      field: 'descriptions',
      width: 120,
      headerName: '物料描述',
    },
    {
      field: 'unitOfMeasure',
      width: 50,
      headerName: '物料单位',
    },
    {
      field: 'energyType',
      width: 50,
      headerName: '能源类型',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'douValue',
      width: 80,
      headerName: '单位能耗值'
    },
    {
      field: 'unitSymbol',
      width: 80,
      headerName: '能源单位',
      valueGetter: params => this.optionsFind(params.data.energyType,1).attribute1
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.energyTypeOptions;
        break;
    }
    let option = options.find(x => x.value === value) || { label: value };
    return option;
  }

   constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private queryService: ItemResourceEnergyService,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadData();
  }

  loadData() {
    /**初始化 工厂信息 */
    this.queryService.GetUserPlantNew(this.appConfigService.getUserId()).subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
      if(result.data.length) { 
        this.queryParams.values.plantCode = result.data[0].plantCode; 
        this.loadScheduleGroup();
      }else {
        this.queryParams.values.plantCode = null;
      }
    });
    this.queryService.GetEnergyTypeByTypeRef('PS_ENERGY_TYPE', this.energyTypeOptions);
    this.query();
  }

  public loadScheduleGroup() {
    /** 根据工厂获取计划组编码  下拉框*/
    this.scheduleGroupCodeList.length = 0;
    this.queryService.GetScheduleGroupCode(this.queryParams.values.plantCode).subscribe(result => {
      result.data.forEach(d => {
        this.scheduleGroupCodeList.push({
          label: d.scheduleGroupCode,
          value: d.scheduleGroupCode,
        });
      });
      this.queryParams.values.scheduleGroupCode = null; 
    });
  }

  public loadResource() {
    /** 根据计划组获取资源  下拉框*/
    this.resourceCodeList.length = 0;
    this.queryService.GetResourceBySchedule(this.queryParams.values.plantCode, this.queryParams.values.scheduleGroupCode).subscribe(result => {
      result.data.content.forEach(d => {
        this.resourceCodeList.push({
          label: d.resourceCode,
          value: d.resourceCode,
        });
      });
      this.queryParams.values.resourceCode = null;
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  private httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    );
  }

  add(dataItem?: any) { 
    this.modal
      .static(EnergyConstraintsItemResourceEnergyEditComponent,{ i: (dataItem !== undefined ? dataItem : {id: null}) })
      .subscribe((value) => {
        if(value) {
          this.clear();
          this.queryCommon();
        }
      });
  }

  import() {
    this.modal
      .static(ItemResourceEnergyImportComponent, {}, 'md')
      .subscribe(() => {
        this.clear();
        this.queryCommon();
      });
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.clear();
    let exportParamsValues = {
      plantCode: this.queryParams.values.plantCode,
      energyType: this.queryParams.values.energyType,
      unitSymbol: this.queryParams.values.unitSymbol,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      resourceCode: this.queryParams.values.resourceCode,
      itemId: this.queryParams.values.strItemCodeFrom.value,
    };
    this.queryService.exportAction({ url: this.queryService.exportUrl, method: 'POST' }, exportParamsValues, 
      this.excelexport, this.context, this.exportDataPreFilter);
  }

  exportDataPreFilter = (res) => {
    let data = res.data.content.map((item) => {
      item.energyType = this.energyTypeOptions.find(type => type.value == item.energyType).label;
      return item;
    });
    return data;
  }

  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantCode || this.appConfigService.getActivePlantCode(),
      energyType: this.queryParams.values.energyType,
      unitSymbol: this.queryParams.values.unitSymbol,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      resourceCode: this.queryParams.values.resourceCode,
      itemId: this.queryParams.values.strItemCodeFrom.value,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  onSelectionChanged(e:any) {
    this.getGridSelectionKeys(this.selectBy);
  }

  delete() {
    let selectedRows = [...this.gridApi.getSelectedRows()];
    if(selectedRows.length === 0) {
      this.msgSrv.error(this.appTranslationService.translate("请先选择要删除的数据"));
    } else {
      let selectedIds = selectedRows.map(row => row.id);
      this.queryService.deleteItems(selectedIds).subscribe((res) => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('删除成功'));
          this.query();
        } else {
          this.msgSrv.error(this.appTranslationService.translate('删除失败'));
        }
      });
    }
  }

  public clear() {
    this.queryParams.values = {
      plantCode: null,
      scheduleGroupCode: null,
      resourceCode: null,
      strItemCodeFrom: { value: '', text: '' },
      descriptions: '',
      energyType: null,
      unitSymbol: '',
    };
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
    this.queryService
      .getUserPlantItemPageList(
        PLANT_CODE || '',
        ITEM_CODE || '',
        '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
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
    this.queryParams.values.descriptions = Row.descriptionsCn;
    this.queryParams.values.strItemCodeFrom.text = Row.itemCode;
    this.queryParams.values.strItemCodeFrom.value = Row.itemId;
  }

  onPopupSelectTextChanged(event: any) {
    const plantCode = this.queryParams.values.plantCode;
    const itemCode = event.Text;
    if(itemCode == '') { return; }
    // 加载物料
    this.queryService.getUserPlantItemPageList(plantCode, itemCode, '').subscribe(res => {
      if (res.data.content.length > 0) {
        this.queryParams.values.descriptions = res.data.content[0].descriptionsCn;
      }
    });
  }
}


