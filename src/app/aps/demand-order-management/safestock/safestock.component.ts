import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DemandOrderManagementSafestockEditComponent } from 'app/aps/demand-order-management/safestock/edit/edit.component';
import { SafeStockEditService } from './edit.service';
import { DemandOrderManagementSafestockViewComponent } from 'app/aps/demand-order-management/safestock/view/view.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-safestock',
  templateUrl: './safestock.component.html',
  providers: [SafeStockEditService],
})
export class DemandOrderManagementSafestockComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public optionListPlant: any[] = [];
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
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
      { field: 'PLANT_CODE', title: '工厂', ui: { type: UiType.select, options: this.optionListPlant } },
      {
        field: 'ITEM_CODE',
        title: this.appTranslationService.translate('物料编码'),
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2
        }
      },

    ],
    values: {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      ITEM_CODE: { value: '', text: '' },
    }
  };

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      }
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
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', width: 70, tooltipField: 'plantCode', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 150, tooltipField: 'itemCode', menuTabs: ['filterMenuTab'] },
    { field: 'descriptionsCn', headerName: '物料描述', width: 210, tooltipField: 'descriptionsCn', menuTabs: ['filterMenuTab'] },
    { field: 'unitOfMeasure', headerName: '单位', width: 90, tooltipField: 'unitOfMeasure', menuTabs: ['filterMenuTab'] },
    { field: 'categoryCode', headerName: '物料类别', width: 150, tooltipField: 'categoryCode', menuTabs: ['filterMenuTab'] },
    { field: 'minQuantity', headerName: '最小数量', width: 100, tooltipField: 'minQuantity', menuTabs: ['filterMenuTab'] },
    { field: 'maxQuantity', headerName: '最大数量', width: 100, tooltipField: 'maxQuantity', menuTabs: ['filterMenuTab'] },
    { field: 'startTime', headerName: '生效日期', width: 150, tooltipField: 'startTime', menuTabs: ['filterMenuTab'] },
    { field: 'endTime', headerName: '失效日期', width: 150, tooltipField: 'endTime', menuTabs: ['filterMenuTab'] },
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: SafeStockEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    this.headerNameTranslate(this.columnsItems);
  }

  private getQueryParamsValue(isExport: boolean = false): any {
    return {
      plantCode: this.queryParams.values.PLANT_CODE ? this.queryParams.values.PLANT_CODE : this.appConfigService.getPlantCode(),
      itemCode: this.queryParams.values.ITEM_CODE.text,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }


  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadplant();
    this.query();
  }



  loadplant(): void {
    /** 初始化  工厂*/
    this.commonQueryService.GetUserPlantNew().subscribe(result => {
      result.data.forEach(d => {
        this.optionListPlant.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
  }

  httpAction = { url: this.editService.seachUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  public add(item?: any) {
    this.modal
      .static(
      DemandOrderManagementSafestockEditComponent,
      {
        i: item === undefined ? { id: null } : item
      },
      'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    this.editService.Remove([item.id]).subscribe(res => {
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
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.Remove(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success('删除成功');
            this.query();
          } else {
            this.msgSrv.warning(res.msg);
          }
        });
      },
    });
  }

  // 导入
  public import() {
    this.modal
      .static(DemandOrderManagementSafestockViewComponent, {}, 'md')
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  expColumns = this.columns;
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction({ url: this.editService.seachUrl, method: 'GET' }, this.getQueryParamsValue(true), this.excelexport, this.context);

  }

  public clear() {
    this.queryParams.values = {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      ITEM_CODE: { value: '', text: '' },
    };
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
