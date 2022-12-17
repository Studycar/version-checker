import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { QueryService } from './queryService.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ProductSellBalanceSopSupplyCapCustomizedImportComponent } from './import/import.component';
import { ProductSellBalanceSopSupplyCapCustomizedEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sop-supply-cap-customized',
  templateUrl: './sop-supply-cap-customized.component.html',
  providers: [QueryService],
})
export class ProductSellBalanceSopSupplyCapCustomizedComponent extends CustomBaseContext implements OnInit {

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  plantList: any[] = [];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantList, ngModelChange: this.plantChange } },
      { field: 'currentMonth', title: '月份', ui: { type: UiType.monthPicker, format: 'yyyy-MM' } },
      { field: 'itemCode', title: '物料编码', ui: { type: UiType.text } },
      { field: 'itemDesc', title: '物料描述', ui: { type: UiType.text } },
      { field: 'vendorNumber', title: '供应商编码', ui: { type: UiType.text } },
      { field: 'vendorName', title: '供应商名称', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      currentMonth: null,
      itemCode: '',
      itemDesc: '',
      vendorNumber: '',
      vendorName: '',
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: { template: this.headerTemplate }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'currentMonth', headerName: '月份', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'vendorNumber', headerName: '供应商编码', menuTabs: ['filterMenuTab'] },
    { field: 'vendorName', headerName: '供应商名称', menuTabs: ['filterMenuTab'] },
    { field: 'percent', headerName: '供货比例(%)', menuTabs: ['filterMenuTab'] },
    { field: 'mouldNum', headerName: '模具数量', menuTabs: ['filterMenuTab'] },
    { field: 'capacity', headerName: '日产能(模具)', menuTabs: ['filterMenuTab'] },
    { field: 'workDay', headerName: '月开工天数', menuTabs: ['filterMenuTab'] },
  ];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private queryService: QueryService,
    private appconfig: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.clear();
    this.loadOptionData();
    this.query();
  }

  loadOptionData() {
    // 当前用户对应工厂
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantList.push({ value: d.plantCode, label: d.plantCode });
      });
      this.plantChange(this.queryParams.values.plantCode);
    });
  }

  plantChange(event) {
    //
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const dto = this.getQueryParams(false);
    this.queryService.loadGridViewNew({ url: this.queryService.queryUrl, method: 'GET' }, dto, this.context);
  }

  private getQueryParams(isExport: boolean) {
    let currentMonth = '';
    if (this.queryParams.values.currentMonth !== null && this.queryParams.values.currentMonth !== '') {
      currentMonth = this.queryService.getYearNum(this.queryParams.values.currentMonth) + '-' + this.queryService.getMonthNum(this.queryParams.values.currentMonth);
    }
    const dto = {
      plantCode: this.queryParams.values.plantCode,
      currentMonth: currentMonth,
      itemCode: this.queryParams.values.itemCode,
      itemDesc: this.queryParams.values.itemDesc,
      vendorNumber: this.queryParams.values.vendorNumber,
      vendorName: this.queryParams.values.vendorName,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
    return dto;
  }

  // 新增、编辑
  public add(item?: any) {
    this.modal.static(ProductSellBalanceSopSupplyCapCustomizedEditComponent, { originDto: item !== undefined ? item : null }, 'lg').subscribe((value) => {
      if (value) {
        this.queryCommon();
      }
    });
  }
  // 删除
  public remove(item: any) {
    this.queryService.deleteSopSupplyCapCustomized([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  // 批量删除
  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success(this.appTranslationService.translate('请选择要删除的数据。'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.queryService.deleteSopSupplyCapCustomized(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  // 导入
  public import() {
    this.modal.static(ProductSellBalanceSopSupplyCapCustomizedImportComponent, {}, 'md').subscribe(() => {
      this.queryCommon();
    });
  }
  // 重置
  public clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      currentMonth: null,
      itemCode: '',
      itemDesc: '',
      vendorNumber: '',
      vendorName: '',
    };
  }

  selectBy = 'id';
  // 行选中改变
  onSelectionChanged(event: any) {
    this.getGridSelectionKeys(this.selectBy);
  }

  expColumns: any[] = [];
  expColumnsOptions: any[] = [];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getQueryParams(true);
    this.queryService.export({ url: this.queryService.queryUrl, method: 'GET' }, dto, this.excelexport, this.context);
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
