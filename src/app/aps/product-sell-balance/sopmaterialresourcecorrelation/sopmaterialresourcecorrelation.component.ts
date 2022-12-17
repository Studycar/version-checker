/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-01-08 08:55:30
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-10 17:14:52
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from './queryService';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { ProductSellBalanceSopmaterialresourcecorrelationEditComponent } from './edit/edit.component';
import { SopMaterialResourceCorrelationService } from 'app/modules/generated_module/services/sopmaterialresourcecorrelation-service';
import { MaterialResourceImportComponent } from './import/import.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopmaterialresourcecorrelation',
  templateUrl: './sopmaterialresourcecorrelation.component.html',
  providers: [QueryService]
})
export class ProductSellBalanceSopmaterialresourcecorrelationComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  plantOptions: any[] = [];
  typeOptions: any[] = [];
  groupOptions: any[] = []; // 计划组
  dimensionOptions: any[] = []; // 关键维度
  yesOrNo: any[] = [];

  public gridViewItems: GridDataResult = {
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

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 } },
      { field: 'dimensionType', title: '维度类型', ui: { type: UiType.select, options: this.typeOptions } },
      {
        field: 'itemCode', title: '物料', ui: {
          type: UiType.popupSelect, valueField: 'itemId', textField: 'itemCode',
          gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
        }
      },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.groupOptions } },
      { field: 'divisionName', title: '资源维度', ui: { type: UiType.select, options: this.dimensionOptions } },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.yesOrNo } }
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      dimensionType: '',
      itemCode: { text: '', value: '' },
      scheduleGroupCode: '',
      divisionName: '',
      enableFlag: '',
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: { template: this.headerTemplate },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: { template: this.headerTemplate }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'divisionName', headerName: '资源维度', menuTabs: ['filterMenuTab'] },
    { field: 'divisionDesc', headerName: '维度描述', tooltipField: 'divisionDesc', menuTabs: ['filterMenuTab'] },
    { field: 'divisionType', headerName: '维度类型', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] }
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'scheduleGroupCode', title: '计划组', width: 200, locked: false },
    { field: 'divisionName', title: '资源维度', width: 200, locked: false },
    { field: 'divisionDesc', title: '维度描述', width: 200, locked: false },
    { field: 'divisionType', title: '维度类型', width: 200, locked: false },
    { field: 'itemCode', title: '物料编码', width: 200, locked: false },
    { field: 'itemDesc', title: '物料描述', width: 200, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: false }
  ];
  expColumnsOptions: any[] = [
    { field: 'divisionType', options: this.typeOptions },
    { field: 'enableFlag', options: this.yesOrNo }];

  httpAction = { url: '/api/sop/sopresourcedivisionitem/getData', method: 'GET' };

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryservice: QueryService,
    private querydata: SopMaterialResourceCorrelationService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private nzModelService: NzModalService) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.LoadData();
    this.plantChange(this.queryParams.values.plantCode);

    this.query();
  }

  query() {
    super.query();

    this.queryCommon();
  }


  private getQueryParamsValue(isExport: any): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      dimensionType: this.queryParams.values.dimensionType,
      itemCode: this.queryParams.values.itemCode.text,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      divisionName: this.queryParams.values.divisionName,
      enableFlag: this.queryParams.values.enableFlag,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: isExport
    };
  }

  queryCommon() {
    this.queryservice.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      dimensionType: null,
      itemCode: { text: '', value: '' },
      scheduleGroupCode: null,
      divisionName: null,
      enableFlag: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    };
    this.gridViewItems.data = [];
    this.gridViewItems.total = 0;
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.yesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('SOP_RESOURCE_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.typeOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.querydata.GetDivision().subscribe(res => {
      res.data.forEach(element => {
        this.dimensionOptions.push({
          label: element.divisionName,
          value: element.divisionName
        });
      });
    });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryservice.export(this.httpAction, this.getQueryParamsValue(true), this.excelexport, this);
  }

  plantChange(value) {
    this.groupOptions.length = 0;
    this.commonquery.GetUserPlantGroup(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.groupOptions.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode
        });
      });
    });
  }

  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    // 加载物料
    this.commonquery.getUserPlantItemPageList(this.queryParams.values.plantCode || '', e.SearchValue || '', '', PageIndex, e.PageSize)
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
      });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.typeOptions;
        break;
      case 2:
        options = this.yesOrNo;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
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

  add(item?: any) {
    this.modal.static(ProductSellBalanceSopmaterialresourcecorrelationEditComponent,
      { i: item !== undefined ? item : null }, 'lg').subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.apptranslate.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.nzModelService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.RemoveBath(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.apptranslate.translate('删除成功'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.apptranslate.translate(res.msg));
          }
        });
      },
    });
  }

  remove(value: any) {
    this.querydata.RemoveBath([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.queryCommon();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  import() {
    this.modal.static(MaterialResourceImportComponent, {}, 'md').subscribe(() => this.queryCommon());
  }

}
