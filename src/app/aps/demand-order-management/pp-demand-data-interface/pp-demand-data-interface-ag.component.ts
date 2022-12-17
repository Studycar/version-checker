import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { PpDemandDataInterfaceEditService } from './edit.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { DemandOrderManagementPpDemandDataInterfaceImportComponent } from './import/import.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DemandOrderManagementPpDemandDataInterfaceChildAgComponent } from '../pp-demand-data-interface-child/pp-demand-data-interface-child-ag.component';
import { DemandOrderManagementPpDemandDataInterfaceEditComponent } from './edit/edit.component';
import { formatDate } from '@angular/common';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-pp-demand-data-interface-ag',
  templateUrl: './pp-demand-data-interface-ag.component.html',
  providers: [PpDemandDataInterfaceEditService],
})
export class DemandOrderManagementPpDemandDataInterfaceAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  // 绑定页面的数据来源
  public optionListloadSourceType = [];
  // 绑定页面的需求类型
  public optionListReqType = [];
  // 绑定页面的下拉框Plant
  public optionListPlant: any[] = [];
  // 绑定页面的订单状态
  public optionListStatus = [];
  // 绑定物料
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
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.optionListPlant, ngModelChange: this.onChangePlant } },
      { field: 'sourceType', title: '数据来源系统', ui: { type: UiType.select, options: this.optionListloadSourceType } },
      {
        field: 'itemCode', title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2
          }
        }
      },
      { field: 'dataPushDateRange', title: '数据推送日期范围', ui: { type: UiType.dateRange } },
      { field: 'demandDateRange', title: '需求日期范围', ui: { type: UiType.dateRange } },
      { field: 'reqNumber', title: '订单编号', ui: { type: UiType.textarea } },
      // { field: 'isSplit', title: '已拆分', ui: { type: UiType.checkbox } },
      // { field: 'isCombine', title: '已合并', ui: { type: UiType.checkbox } },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      sourceType: null,
      itemCode: { text: '', value: '' },
      dataPushDateRange: [],
      demandDateRange: [],
      isSplit: false,
      isCombine: false,
      reqNumber: null
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null    // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'creationDate', headerName: '数据推送日期', tooltipField: 'creationDate', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂', tooltipField: 'plantCode', menuTabs: ['filterMenuTab'] },
    { field: 'source', headerName: '来源系统', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'reqNumber', headerName: '订单编号', tooltipField: 'reqNumber', menuTabs: ['filterMenuTab'] },
    { field: 'reqLineNum', headerName: '需求订单行号', tooltipField: 'reqLineNum', menuTabs: ['filterMenuTab'] },
    { field: 'reqType', headerName: '需求类型', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    {
      field: 'standardFlag', headerName: '标准类型', tooltipField: 'standardFlag', valueFormatter: 'ctx.standard(value)',
      menuTabs: ['filterMenuTab']
    },
    { field: 'itemCode', headerName: '物料编码', tooltipField: 'itemCode', menuTabs: ['filterMenuTab'] },
    { field: 'itemDescription', headerName: '物料描述', tooltipField: 'itemDescription', menuTabs: ['filterMenuTab'] },
    { field: 'reqQty', headerName: '需求数量', tooltipField: 'reqQty', menuTabs: ['filterMenuTab'] },
    { field: 'promiseDate', headerName: '承诺日期', tooltipField: 'promiseDate', menuTabs: ['filterMenuTab'] },
    // { field: 'lastDeliveryTime', headerName: '交期运算时间', tooltipField: 'lastDeliveryTime', menuTabs: ['filterMenuTab'] },
    { field: 'reqDate', headerName: '需求日期', tooltipField: 'reqDate', menuTabs: ['filterMenuTab'] },
    { field: 'customerNumber', headerName: '客户代码', tooltipField: 'customerNumber', menuTabs: ['filterMenuTab'] },
    { field: 'customerName', headerName: '客户名称', tooltipField: 'customerName', menuTabs: ['filterMenuTab'] },
    { field: 'salesRegion', headerName: '销售大区', tooltipField: 'salesRegion', menuTabs: ['filterMenuTab'] },
    { field: 'salesArea', headerName: '销售区域', tooltipField: 'salesArea', menuTabs: ['filterMenuTab'] },
    { field: 'businessUnit', headerName: '事业部', tooltipField: 'businessUnit', menuTabs: ['filterMenuTab'] },
    { field: 'shipMentSetName', headerName: '发运集', tooltipField: 'shipMentSetName', menuTabs: ['filterMenuTab'] },
    { field: 'reqComment', headerName: '需求说明', tooltipField: 'reqComment', menuTabs: ['filterMenuTab'] },
    { field: 'status', headerName: '订单状态', valueFormatter: 'ctx.optionsFind(value,3).label', menuTabs: ['filterMenuTab'] },
    { field: 'salesRepContact', headerName: '销售业务员', tooltipField: 'salesRepContact', menuTabs: ['filterMenuTab'] },

    { field: 'attribute8', headerName: '客户等级', tooltipField: 'attribute8', menuTabs: ['filterMenuTab'] },
    { field: 'attribute9', headerName: '收货人电话', tooltipField: 'attribute9', menuTabs: ['filterMenuTab'] },
    { field: 'attribute10', headerName: '送货地址', tooltipField: 'attribute10', menuTabs: ['filterMenuTab'] },
    { field: 'attribute11', headerName: '运费承担', tooltipField: 'attribute11', menuTabs: ['filterMenuTab'] },
    { field: 'attribute12', headerName: '币种', tooltipField: 'attribute12', menuTabs: ['filterMenuTab'] },
    { field: 'attribute13', headerName: '收款状态', tooltipField: 'attribute13', menuTabs: ['filterMenuTab'] },
    { field: 'attribute14', headerName: '提货方式', tooltipField: 'attribute14', menuTabs: ['filterMenuTab'] },
    { field: 'attribute15', headerName: '装载车型', tooltipField: 'attribute15', menuTabs: ['filterMenuTab'] },

    { field: 'attribute1', headerName: '合并标识', tooltipField: 'attribute1', valueFormatter: 'ctx.attribute(value,1)', menuTabs: ['filterMenuTab'] },
    { field: 'attribute1', headerName: '拆分标识', tooltipField: 'attribute1', valueFormatter: 'ctx.attribute(value,2)', menuTabs: ['filterMenuTab'] }
  ];

  httpAction = { url: this.editService.url, method: 'GET' };

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: PpDemandDataInterfaceEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadplant();
    this.loadSourceType();
    this.loadReqType();
    this.loadOrderStatus();

    this.query();
  }

  loadplant(): void {
    /** 初始化  工厂*/
    this.commonQueryService.GetUserPlantNew().subscribe(result => {
      result.data.forEach(item => {
        this.optionListPlant.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  loadSourceType(): void {
    this.commonQueryService.GetLookupByTypeNew('PP_DM_SOURCE_SYSTEM').subscribe(result => {
      result.data.forEach(d => {
        this.optionListloadSourceType.push({
          label: d.meaning,
          value: d.lookupCode
        });
      });
    });
  }

  loadReqType(): void {
    this.commonQueryService.GetLookupByTypeNew('PP_PLN_ORDER_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.optionListReqType.push({
          label: d.meaning,
          value: d.lookupCode
        });
      });
    });
  }

  loadOrderStatus(): void {
    this.commonQueryService.GetLookupByTypeNew('PP_PLN_ORDER_STATUS').subscribe(result => {
      result.data.forEach(d => {
        this.optionListStatus.push({
          label: d.meaning,
          value: d.lookupCode
        });
      });
    });
  }

  // 工厂 值更新事件 重新绑计划员
  onChangePlant(value: string): void {
    /** 重新绑定  物料*/
    this.queryParams.values.itemCode.text = '';
    this.queryParams.values.itemCode.value = '';
  }

  onRowSelect(e: any) {
    this.queryParams.values.itemCode.text = e.Text;
    this.queryParams.values.itemCode.value = e.Value;
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
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public standard(value: string): any {
    if (value === 'Y') {
      return '标准';
    } else {
      return '非标';
    }
  }

  public attribute(value: string, optionsIndex: number): any {
    let att = '';
    switch (optionsIndex) {
      case 1:
        if (value === 'M') {
          att = '是';
        }
        break;
      case 2:
        if (value === 'Y') {
          att = '是';
        }
        break;
    }
    return att;
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.optionListloadSourceType;
        break;
      case 2:
        options = this.optionListReqType;
        break;
      case 3:
        options = this.optionListStatus;
        break;

    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  private getQueryParamsValue(isExport: any): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      sourceType: this.queryParams.values.sourceType,
      itemCode: this.queryParams.values.itemCode.text,
      startBegin: this.queryParams.values.dataPushDateRange.length > 0 ?
        formatDate(this.queryParams.values.dataPushDateRange[0], 'yyyy-MM-dd', 'zh-Hans') : null,
      startEnd: this.queryParams.values.dataPushDateRange.length > 0 ?
        formatDate(this.queryParams.values.dataPushDateRange[1], 'yyyy-MM-dd', 'zh-Hans') : null,
      endBegin: this.queryParams.values.demandDateRange.length > 0 ?
        formatDate(this.queryParams.values.demandDateRange[0], 'yyyy-MM-dd', 'zh-Hans') : null,
      endEnd: this.queryParams.values.demandDateRange.length > 0 ?
        formatDate(this.queryParams.values.demandDateRange[1], 'yyyy-MM-dd', 'zh-Hans') : null,
      isCombine: this.queryParams.values.isCombine,
      isSplit: this.queryParams.values.isSplit,
      reqNumber: this.queryParams.values.reqNumber,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: isExport
    };
  }

  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      sourceType: null,
      dataPushDateRange: [],
      demandDateRange: [],
      itemCode: { text: '', value: '' },
      isCombine: false,
      isSplit: false,
      reqNumber: ''
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

  // 导入
  public import() {
    this.modal.static(DemandOrderManagementPpDemandDataInterfaceImportComponent, {}, 'md')
      .subscribe(() => this.queryCommon());
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'source', options: this.optionListloadSourceType },
    { field: 'status', options: this.optionListStatus },
    { field: 'reqType', options: this.optionListReqType }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction(this.httpAction, this.getQueryParamsValue(true), this.excelexport, this.context);
  }

  public QueryChild(item: any) {
    this.modal.static(DemandOrderManagementPpDemandDataInterfaceChildAgComponent,
      {
        i: {
          plantCode: (item !== undefined ? item.plantCode : null),
          reqNumber: (item !== undefined ? item.reqNumber : null),
          reqLineNum: (item !== undefined ? item.reqLineNum : null),
          reqQty: (item !== undefined ? item.reqQty : null),
          reqDate: (item !== undefined ? item.reqDate : null)
        }
      }, 1300).subscribe(() => {
        this.queryCommon();
      });
  }

  // 编辑
  public modifyData(item: any) {
    this.modal.static(DemandOrderManagementPpDemandDataInterfaceEditComponent, {
      i: item
    }, 980, 500).subscribe((value) => {
      if (value) {
        this.queryCommon();
      }
    });
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择要删除的数据。'));
      return;
    }

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.RemoveBath(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('删除成功'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  // 拆分合并
  split() {

    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择工厂'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认自动拆分合并需求订单?'),
      nzOnOk: () => {

        this.editService.split(this.queryParams.values.sourceType, this.queryParams.values.plantCode, this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('自动拆分合并请求已提交，请等候处理'));
            this.query();

          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  // 下发
  send() {

    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择工厂'));
      return;
    }
    // const that = this;
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认导入需求工作台?'),
      nzOnOk: () => {

        let MY_SELECTION = '';
        if (this.selectionKeys.length > 0) {
          this.selectionKeys.forEach(element => {
            MY_SELECTION += element + ',';
          });
        }

        this.editService.SendReq(this.queryParams.values.sourceType, this.queryParams.values.plantCode, this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('导入需求工作台请求已提交，请等候处理'));
            this.query();

          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  // 交期运算
  calculateDelivery() {
    if (this.queryParams.values.plantCode === 'underfind' || this.queryParams.values.plantCode === '') {
      this.msgSrv.error(this.appTranslationService.translate('请先查询需求订单'));
      return;
    }

    const projectNumList = [];
    const gridSelectRows = this.gridApi.getSelectedRows();
    if (!this.isNull(gridSelectRows) && gridSelectRows.length > 0) {
      gridSelectRows.forEach(d => {
        projectNumList.push(d['projectNumber']);
      });
    }

    if (projectNumList.length === 0) {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('没有选择需求订单，继续提交将所有订单将参与运算，耗时较长，是否继续?'),
        nzOnOk: () => {
          this.editService.calculateDeliveryTime(this.queryParams.values.plantCode, projectNumList).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('交期运算请求已提交，请等候处理'));
              this.query();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
        },
      });
    } else {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('系统将运算已选择的需求订单的交期，是否继续?'),
        nzOnOk: () => {
          this.editService.calculateDeliveryTime(this.queryParams.values.plantCode, projectNumList).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('交期运算请求已提交，请等候处理'));
              this.query();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
        },
      });
    }
  }
}
