import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { PreparationPlatformPurchaseregionEditComponent } from 'app/aps/preparation-platform/purchaseregion/edit/edit.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { PurchaseRegionService } from '../../../modules/generated_module/services/purchase-region-service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { SopSupplyRestrainCapService } from 'app/modules/generated_module/services/SopSupplyRestrainCapService';
import { SopSupplyRestrainCapViewComponent } from './view/view.component';
import { SopSupplyRestrainCapEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-supply-restrain-cap',
  templateUrl: './sopsupplyrestraincap.component.html',
})
export class SopSupplyRestrainCapComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  HttpAction = {
    url: this.queryservice.url,
    method: 'GET',
    data: false,
  };
  selectKeys = 'id';
  public plantoptions: any[] = [];
  YesOrNo: any[] = [];
  regionoptions: any[] = [];
  deliveryRegionOption: any[] = [];

  dis = true;
  /**查询参数 */
  public queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 },
        required: true,
      },
      {
        field: 'currentMonth',
        title: '月份',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
      {
        field: 'vendorNumber',
        title: '供应商编码',
        ui: { type: UiType.select, options: this.regionoptions },
      }
    ],
    values: {
      plantCode: null,
      currentMonth: null,
      vendorNumber: null
    },
  };
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
      field: 'plantCode',
      headerName: '工厂',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'currentMonth',
      headerName: '月份',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'currentDate',
      headerName: '日期',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorNumber',
      headerName: '供应商编码',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorName',
      headerName: '供应商名称',
      width: 250,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'capacity',
      headerName: '月总产能',
      width: 120,
      menuTabs: ['filterMenuTab'],
    }
  ];
  /**导出列 */
  public expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: true },
    { field: 'currentMonth', title: '月份', width: 200, locked: true, },
    { field: 'currentDate', title: '日期', width: 200, locked: true },
    { field: 'vendorNumber', title: '供应商编码', width: 200, locked: true },
    { field: 'vendorName', title: '供应商名称', width: 200, locked: true, },
    { field: 'capacity', title: '月总产能', width: 200, locked: true },
  ];

  expColumnsOptions: any[] = [
    { field: 'deliveryRegionType', options: this.deliveryRegionOption },
    { field: 'enableFlag', options: this.YesOrNo },
  ];

  /**构造函数 */
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private queryservice: SopSupplyRestrainCapService,
    private msgSrv: NzMessageService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private appTranslationService: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.headerNameTranslate(this.columns);
  }
  /**页面初始化 */
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.dis = true;
    this.queryParams.values.plantCode = this.appconfig.getPlantCode();
    this.plantChange(this.queryParams.values.plantCode);
    this.LoadData();
    this.query();
  }
  /**加载方法 */
  LoadData() {
    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode,
        });
      });
    });
  }

  /**新增、编辑 */
  add(item?: any) {
    this.modal
      .static(
        SopSupplyRestrainCapEditComponent,
        { i: { id: item !== undefined ? item.id : null} },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }
  /**导出 */
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonquery.export(
      this.HttpAction,
      this.getQueryParams(true),
      this.excelexport,
      this,
    );
  }
  /**切换工厂 */
  plantChange(value: any) {
    while (this.regionoptions.length !== 0) {
      this.regionoptions.pop();
    }
    this.dis = false;
    // this.queryservice.GetRegion(value).subscribe(res => {
    //   res.data.content.forEach(element => {
    //     this.regionoptions.push({
    //       label: element.deliveryRegionCode,
    //       value: element.deliveryRegionCode,
    //     });
    //   });
    // });
  }

  /**查询 */
  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonquery.loadGridViewNew(
      this.HttpAction,
      this.getQueryParams(),
      this.context,
    );
  }

  getQueryParams(isExport: boolean = false): { [key: string]: any } {
    return {
      plantCode: this.queryParams.values.plantCode,
      currentMonth: this.queryParams.values.currentMonth,
      vendorNumber: this.queryParams.values.vendorNumber,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  /**重置 */
  clear() {
    this.queryParams.values = {
      plantCode: null,
      currentMonth: null,
      vendorNumber: null
    };
  }
  /**明细 */
  detail(item: any) {
    this.modal
      .static(SopSupplyRestrainCapViewComponent, {
        i: {
          plantCode: item.plantCode,
          id: item.id,
          vendorNumber: item.vendorNumber
        },
      })
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  remove(value: any) {
    this.queryservice.remove(value.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }

  // 页码切换
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}
