import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
// import 'ag-grid-enterprise';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'item-use-area',
  templateUrl: './item-use-area.component.html',
})
export class ItemUseAreaComponent extends CustomBaseContext implements OnInit {
  UserPlantOptions: any[] = []; // 组织
  itemTypeOptions: any[] = []; // 物料类型
  itemStatusOptions: any[] = []; // 物料状态
  itemUnitOptions: any[] = []; // 物料单位

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

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.UserPlantOptions, eventNo: 1 }, required: true },
      {
        field: 'materialInfo', title: '物料编码', ui: {
          type: UiType.popupSelect,
          valueField: 'descriptionsCn',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
          extraEvent: { RowSelectEventNo: 3 }
        },
      },
      { field: 'itemDesc', readonly: 'readonly', title: '物料描述', ui: { type: UiType.string } },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      materialInfo: { value: '', text: '' },
      itemDesc: ''
    }
  };

  columns = [
    { field: 'plantCode', headerName: '工厂', tooltipField: 'plantCode', width: 80, menuTabs: ['filterMenuTab'] },
    { field: 'planLevel', headerName: '层次', tooltipField: 'planLevel', width: 80, menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', tooltipField: 'itemCode', width: 80, hidden: true, menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', tooltipField: 'itemDesc', width: 150, menuTabs: ['filterMenuTab'] },
    {
      field: 'itemType', headerName: '物料类型', tooltipField: 'itemType', width: 80, valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab']
    },
    { field: 'planCategoryName', headerName: '计划分类', tooltipField: 'planCategoryName', width: 100, menuTabs: ['filterMenuTab'] },
    {
      field: 'itemStatus', headerName: '物料状态', tooltipField: 'itemStatus', width: 100, valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab']
    },
    {
      field: 'itemMunit', headerName: '单位', tooltipField: 'itemMunit', width: 80, valueFormatter: 'ctx.optionsFind(value,3).label',
      menuTabs: ['filterMenuTab']
    },
    { field: 'componentQuantity', headerName: '组件数量', tooltipField: 'componentQuantity', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'effectivityDate', headerName: '生效日期', tooltipField: 'effectivityDate', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'expiryDate', headerName: '失效日期', tooltipField: 'expiryDate', width: 150, menuTabs: ['filterMenuTab'] }
  ];

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    this.setGridHeight({ topMargin: 120, bottomMargin: 65 });
    this.groupDefaultExpanded = -1;
  }

  ngOnInit() {
    this.gridData = [];

    this.getDataPath = function (data) {
      return data.itemCodePath.split('/');
    };

    this.autoGroupColumnDef = {
      headerName: '物料编号',
      width: 250,
      cellRendererParams: {
        checkbox: false,
        suppressCount: true,
      }
    };

    /** 初始化 用户权限下的组织  下拉框*/
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.UserPlantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });

    // 物料类型
    this.commonQueryService.GetLookupByType('PS_ITEM_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.itemTypeOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    // 物料状态
    this.commonQueryService.GetLookupByType('PP_MTL_ITEM_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.itemStatusOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    // 物料单位
    this.commonQueryService.GetLookupByType('PS_ITEM_UNIT').subscribe(result => {
      result.Extra.forEach(d => {
        this.itemUnitOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  public plantChange(value: any) {
    this.queryParams.values.materialInfo = { value: '', text: '' };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.commonQueryService.loadGridViewNew({
      url: '/api/ps/psMaterialManagement/queryList',
      method: 'POST'
    }, this.getQueryParamsValue(), this.context);
  }

  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.materialInfo.text
    };
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.itemTypeOptions;
        break;
      case 2:
        options = this.itemStatusOptions;
        break;
      case 3:
        options = this.itemUnitOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  selectKeys = 'itemCode';
  // 行选中改变
  onSelectionChanged() {
    this.getGridSelectionKeys(this.selectKeys);
  }

  // 物料弹出查询
  public searchItemsCode(e: any) {
    if (!this.queryParams.values.plantCode || this.queryParams.values.plantCode === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadItems(plantCode: string, itemCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  onPopupRowSelectChanged(event: any) {
    this.queryParams.values.itemDesc = event.Value;
  }

  onPopupSelectTextChanged(event: any) {
    const plantCode = this.queryParams.values.plantCode;
    const itemCode = event.Text;
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(plantCode, itemCode, '').subscribe(res => {
      if (res.data.content.length > 0) {
        this.queryParams.values.itemDesc = res.data.content[0].descriptionsCn;
      }
    });
  }

  // 导出列
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'itemType', options: this.itemTypeOptions },
    { field: 'itemStatus', options: this.itemStatusOptions },
    { field: 'itemUnit', options: this.itemUnitOptions }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
    /*this.commonQueryService.exportAction({
      url: '',
      method: 'POST'
    }, this.getQueryParamsValue(), this.excelexport, this);*/
  }
}
