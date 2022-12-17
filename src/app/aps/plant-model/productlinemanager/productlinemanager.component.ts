/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:13
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 08:59:53
 * 生产线/资源
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './edit.service';
import { PlantModelProductlinemanagerEditComponent } from './edit/edit.component';
import { ProductLineManagerService } from '../../../modules/generated_module/services/production-line-manager';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-productlinemanager',
  templateUrl: './productlinemanager.component.html',
  providers: [QueryService],
})
export class PlantModelProductlinemanagerComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  selectKeys = 'id';
  applicationOptions: any[] = [];
  application: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];
  context = this;

  public resourceoptions: any[] = [];
  public plantcodeoptions: any[] = [];
  public schedulegroupoptions: any[] = [];
  public resourcetype: any[] = [];
  private YesOrNo: any[] = [];
  allColumnIds: any[] = [];
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;

  /**页面查询条件 */
  public queryParams = {
    defines: [
      { field: 'txtPlantCode', title: '工厂', ui: { type: UiType.select, options: this.plantcodeoptions, eventNo: 1 }, required: true },
      { field: 'txtScheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.schedulegroupoptions } },
      { field: 'txtResourceType', title: '资源类型', ui: { type: UiType.select, options: this.resourcetype } },
      { field: 'txtResourceCode', title: '资源编码', ui: { type: UiType.text } },
      { field: 'txtResourceDesc', title: '资源描述', ui: { type: UiType.text } },
      { field: 'lueEnableFlag', title: '是否有效', ui: { type: UiType.select, options: this.YesOrNo } },
    ],
    values: {
      txtPlantCode: this.appConfigService.getPlantCode(),
      txtScheduleGroupCode: '',
      lueEnableFlag: '',
      txtResourceCode: '',
      txtResourceDesc: '',
      txtResourceType: '',
      pageIndex: 1,
      pageSize: 20
    }
  };

  /**表格列 */
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 60, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'scheduleRegionCode', headerName: '事业部编码', width: 100, locked: false },
    { field: 'scheduleRegionDesc', headerName: '事业部描述', width: 100, locked: false },
    { field: 'plantCode', headerName: '工厂编码', width: 80, tooltipField: 'parameterName', menuTabs: ['filterMenuTab'] },
    { field: 'plantDesc', headerName: '工厂描述', width: 100, locked: false },
    { field: 'scheduleGroupCode', headerName: '计划组', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupDesc', headerName: '计划组描述', width: 120, locked: false },
    // { field: 'resourceGroupCode', headerName: '资源组', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源编码', width: 150, tooltipField: 'descriptions', menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '资源描述', width: 200, menuTabs: ['filterMenuTab'] },
    { field: 'resourceType', headerName: '资源类型', width: 100, menuTabs: ['filterMenuTab'] },
    // { field: 'qty', headerName: '资源数量', width: 100, menuTabs: ['filterMenuTab'] },
    // { field: 'orderByCode', headerName: '排序码', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'refuseLinkageFlag', headerName: '拒绝联动', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'followFlag', headerName: '跟随标志', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'enableMesFlag', headerName: '启用MES标识', width: 130, menuTabs: ['filterMenuTab'] },
    // { field: 'preprocessingLeadTime', headerName: '前处理提前期(小时)', width: 160, menuTabs: ['filterMenuTab'] },
    // { field: 'postprocessingLeadTime', headerName: '后处理提前期(小时)', width: 160, menuTabs: ['filterMenuTab'] },
    // { field: 'enableActualProdFlag', headerName: '启用实际排产' },
    // { field: 'vendorNumber', headerName: '供应商编码', menuTabs: ['filterMenuTab'] },
    // { field: 'vendorName', headerName: '供应商名称', menuTabs: ['filterMenuTab'] },
    // { field: 'vendorSiteCode', headerName: '供应商地点编码' },
    // { field: 'tonnage', headerName: '吨位(T)', width: 100, menuTabs: ['filterMenuTab'] },
    // { field: 'uph', headerName: '小时产出', width: 100, menuTabs: ['filterMenuTab'] },
    // { field: 'moType', headerName: '工单类型', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', width: 100, menuTabs: ['filterMenuTab'] }
  ];
  // // 隐藏列
  // hiddenColumns = [
  //   { field: 'ENABLE_ACTUAL_PROD_FLAG' },
  //   { field: 'VENDOR_NUMBER' },
  //   { field: 'VENDOR_SITE_CODE' }
  // ];
  /**导出列 */
  expColumns = [
    { field: 'resourceCode', title: '资源编码', width: 200, locked: true },
    { field: 'descriptions', title: '资源描述', width: 100, locked: false },
    { field: 'resourceType', title: '资源类型', width: 300, locked: false },
    { field: 'scheduleRegionCode', title: '事业部编码', width: 100, locked: false },
    { field: 'scheduleRegionDesc', title: '事业部描述', width: 100, locked: false },
    { field: 'plantCode', title: '工厂编码', width: 100, locked: false },
    { field: 'plantDesc', title: '工厂描述', width: 100, locked: false },
    { field: 'scheduleGroupCode', title: '计划组编码', width: 100, locked: false },
    { field: 'scheduleGroupDesc', title: '计划组描述', width: 100, locked: false },
    // { field: 'resourceGroupCode', title: '资源组', width: 100, locked: false },
    { field: 'qty', title: '资源数量', width: 100, locked: false },
    // { field: 'orderByCode', title: '排序码', width: 100, locked: false },
    { field: 'refuseLinkageFlag', title: '拒绝联动', width: 100, locked: false },
    { field: 'followFlag', title: '跟随标志', width: 100, locked: false },
    { field: 'enableMesFlag', title: '启用MES标识', width: 100, locked: false },
    { field: 'preprocessingLeadTime', title: '前处理提前期(小时)', width: 100, locked: false },
    // { field: 'postprocessingLeadTime', title: '后处理提前期(小时)', width: 100, locked: false },
    // { field: 'CHAIN_LINKAGE_FLAG', title: '启用链式联动', width: 100, locked: false },
    // { field: 'KEY_RESOURCE_FLAG', title: '关键资源标志', width: 100, locked: false },
    // { field: 'ENABLE_ACTUAL_PROD_FLAG', title: '启用实际排产标识', width: 100, locked: false },
    { field: 'vendorNumber', title: '供应商编码', width: 100, locked: false },
    { field: 'vendorName', title: '供应商名称', width: 100, locked: false },
    { field: 'vendorSiteCode', title: '供应商地点编码', width: 100, locked: false },
    // { field: 'MO_REFRESH_FLAG', title: '生产线刷新标识', width: 100, locked: false },
    // { field: 'IMPORT_PLAN_ORDER_FLAG', title: '计划单引入MO表示', width: 100, locked: false },
    { field: 'uph', title: '小时产出', width: 100, locked: false },
    // { field: 'tonnage', title: '吨位(T)', width: 100, locked: false },
    // { field: 'moType', title: '工单类型', width: 100, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 100, locked: false }
  ];

  expColumnsOptions: any[] = [{ field: 'applicationId', options: this.applicationOptions }];

  /**构造函数 */
  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    public editService: QueryService,
    private msgSrv: NzMessageService,
    private resourcemanager: ProductLineManagerService,
    private appConfigService: AppConfigService,
    private commonqueryservice: CommonQueryService,
    private apptranslate: AppTranslationService) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  /**页面加载 */
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadData();
  }

  /**页面加载方法 */
  loadData() {
    this.commonqueryservice.GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    // 用户组织
    this.commonqueryservice.GetUserPlant().subscribe(result => {
      result.Extra.forEach(element => {
        this.plantcodeoptions.push({
          label: element.descriptions,
          value: element.plantCode
        });
      });
    });

    // 当前组织
    this.plantChange(this.queryParams.values.txtPlantCode);

    /**资源类型绑定 */
    this.resourcemanager.GetResourceType().subscribe(result => {
      result.data.forEach(element => {
        this.resourcetype.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.query();
  }
  /**增加 */
  public add(item?: any) {
    this.modal.static(PlantModelProductlinemanagerEditComponent, { i: { id: (item !== undefined ? item.id : null) } }, 'lg')
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }
  /**导出 */
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    const httpExportAction = { url: this.resourcemanager.seachUrl2, method: 'GET' };

    this.editService.export(httpExportAction, this.GetQueryParams(), this.excelexport);
  }
  /**选择工厂 */
  plantChange(value: any) {
    this.queryParams.values.txtScheduleGroupCode = null;
    this.schedulegroupoptions.length = 0;
    this.resourcemanager.GetScheduleGroupCode(value).subscribe(result => {
      result.data.forEach(element => {
        this.schedulegroupoptions.push({
          label: element.descriptions,
          value: element.scheduleGroupCode
        });
      });
    });
  }
  /**查询 */
  public query() {
    const httpAction = { url: this.resourcemanager.seachUrl, method: 'GET' };

    super.query();
    this.editService.loadGridViewNew(httpAction, this.GetQueryParams(), this.context);
  }
  /**获取查询参数 */
  private GetQueryParams() {
    return {
      txtPlantCode: this.queryParams.values.txtPlantCode,
      txtScheduleGroupCode: this.queryParams.values.txtScheduleGroupCode,
      lueEnableFlag: this.queryParams.values.lueEnableFlag,
      txtResourceCode: this.queryParams.values.txtResourceCode,
      txtResourceDesc: this.queryParams.values.txtResourceDesc,
      txtResourceType: this.queryParams.values.txtResourceType,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }
  /**重置 */
  public clear() {
    this.queryParams.values = {
      txtPlantCode: this.appConfigService.getPlantCode(),
      txtScheduleGroupCode: '',
      lueEnableFlag: '',
      txtResourceCode: '',
      txtResourceDesc: '',
      txtResourceType: '',
      pageIndex: 1,
      pageSize: 20
    };
    this.plantChange(this.queryParams.values.txtPlantCode);
  }

  /**删除--未使用 */
  public remove(value: any) {
    this.resourcemanager.Remove(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  /**行选中改变 */
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  /**页码切换 */
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.query();
    } else {
      this.setLoading(false);
    }
  }
}
