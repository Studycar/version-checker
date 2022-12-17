/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:14
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 10:14:36
 * @Note: ...
 * 送货区域
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { PreparationPlatformPurchaseregionEditComponent } from 'app/aps/preparation-platform/purchaseregion/edit/edit.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { PurchaseRegionService } from '../../../modules/generated_module/services/purchase-region-service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { PreparationPlatformPurchaseregionViewComponent } from './view/view.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-purchaseregion',
  templateUrl: './purchaseregion.component.html',
})
export class PreparationPlatformPurchaseregionComponent extends CustomBaseContext implements OnInit {
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
        field: 'txtPlantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 },
        required: true,
      },
      {
        field: 'txtPurchaseRegion',
        title: '送货区域',
        ui: { type: UiType.select, options: this.regionoptions },
      },
      {
        field: 'txtEnableFlag',
        title: '是否有效',
        ui: { type: UiType.select, options: this.YesOrNo },
      },
    ],
    values: {
      txtPlantCode: null,
      txtPurchaseRegion: null,
      txtEnableFlag: null,
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
      field: 'deliveryRegionCode',
      headerName: '送货区域',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'description',
      headerName: '送货区域说明',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'address',
      headerName: '送货区域地址',
      width: 250,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'deliveryRegionType',
      headerName: '送货区域类型',
      width: 120,
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      headerName: '是否有效',
      width: 100,
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
  ];
  /**导出列 */
  public expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: true },
    { field: 'deliveryRegionCode', title: '送货区域', width: 200, locked: true, },
    { field: 'description', title: '送货区域说明', width: 200, locked: true },
    { field: 'address', title: '送货区域地址', width: 200, locked: true },
    { field: 'deliveryRegionType', title: '送货区域类型', width: 200, locked: true, },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: true },
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
    private queryservice: PurchaseRegionService,
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
    this.queryParams.values.txtPlantCode = this.appconfig.getPlantCode();
    this.plantChange(this.queryParams.values.txtPlantCode);
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

    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('FND_DEL_REGION_TYPE').subscribe(res => {
      res.data.forEach(item => {
        this.deliveryRegionOption.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.deliveryRegionOption;
        break;
      case 2:
        options = this.YesOrNo;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  /**新增、编辑 */
  add(item?: any) {
    this.modal
      .static(
        PreparationPlatformPurchaseregionEditComponent,
        { i: { id: item !== undefined ? item.id : null } },
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
    this.queryservice.GetRegion(value).subscribe(res => {
      res.data.content.forEach(element => {
        this.regionoptions.push({
          label: element.deliveryRegionCode,
          value: element.deliveryRegionCode,
        });
      });
    });
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

  getQueryParams(isExport: boolean = false): {[key: string]: any} {
    return {
      plantCode: this.queryParams.values.txtPlantCode,
      deliveryRegionCode: this.queryParams.values.txtPurchaseRegion,
      enableFlag: this.queryParams.values.txtEnableFlag,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  /**重置 */
  clear() {
    this.queryParams.values = {
      txtPlantCode: null,
      txtPurchaseRegion: null,
      txtEnableFlag: null,
    };
  }
  /**明细 */
  detail(item: any) {
    this.modal
      .static(PreparationPlatformPurchaseregionViewComponent, {
        i: {
          plantCode: item.plantCode,
          deliveryRegionCode: item.deliveryRegionCode,
        },
      })
      .subscribe(value => {
        if (value) {
          this.query();
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
