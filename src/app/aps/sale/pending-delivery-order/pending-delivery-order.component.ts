import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { PendingDeliveryOrderQueryService } from "./query.service";
import { PendingDeliveryOrderEditComponent } from "./edit/edit.component";
import { PendingDeliveryOrderImportComponent } from "./import/import.component";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SumItem } from "app/modules/base_module/components/custom-tb-select-sum.component";

@Component({
  selector: 'pending-delivery-order',
  templateUrl: './pending-delivery-order.component.html',
  providers: [PendingDeliveryOrderQueryService]
})
export class PendingDeliveryOrderComponent extends CustomBaseContext implements OnInit {

  isVisible: boolean = false;

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: PendingDeliveryOrderQueryService,
    public http: _HttpClient,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.sumHeight = 40;
    this.initGridHeight();
  }

  columns = [
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
      field: 'source',
      width: 120,
      headerName: '来源',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'docCode',
      width: 120,
      headerName: '来源单号',
    },
    {
      field: 'docDetailCode',
      width: 120,
      headerName: '来源单明细行号',
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'batchCode',
      width: 120,
      headerName: '批号',
    },
    {
      field: 'pendingState',
      width: 120,
      headerName: '状态',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码',
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称',
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '存货名称',
    },
    {
      field: 'stockCode',
      width: 120,
      headerName: '存货编码',
    },
    {
      field: 'standardsType',
      width: 120,
      headerName: '规格尺寸',
    },
    {
      field: 'steelGrade',
      width: 120,
      headerName: '钢种',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'onhandQuantity',
      width: 120,
      headerName: '数量',
    },
    {
      field: 'weightKg',
      width: 120,
      headerName: '重量',
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      headerName: '单位',
      valueFormatter: 'ctx.optionsFind(value,6).label'
    },
    {
      field: 'whCode',
      width: 120,
      headerName: '仓库编码',
    },
    {
      field: 'whName',
      width: 120,
      headerName: '仓库',
    },
    {
      field: 'location',
      width: 120,
      headerName: '库位',
    },
    {
      field: 'urgent',
      width: 120,
      headerName: '是否加急',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'carNumber',
      width: 120,
      headerName: '车牌号',
    },
    {
      field: 'realCarNumber',
      width: 120,
      headerName: '实际送货车号',
    },
    {
      field: 'deliveryMethod',
      width: 120,
      headerName: '提货方式',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'shippingAddress',
      width: 120,
      headerName: '送货地点',
    },
    // {
    //   field: 'distributionWarehouse',
    //   width: 120,
    //   headerName: '配送公仓',
    // },
    {
      field: 'place',
      width: 120,
      headerName: '目的地',
    },
    {
      field: 'area',
      width: 120,
      headerName: '送货区域',
    },
    {
      field: 'ranges',
      width: 120,
      headerName: '送货范围',
    },
    {
      field: 'logistics',
      width: 120,
      headerName: '物流公司',
    },
    {
      field: 'remarks',
      width: 120,
      headerName: '备注',
    },
    {
      field: 'specialRemarks',
      width: 120,
      headerName: '特殊备注',
    },
    {
      field: 'deliveryDate',
      width: 120,
      headerName: '配送日期',
    },
    {
      field: 'deliveryOrderDetailState',
      width: 120,
      headerName: '配送单行状态',
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      headerName: '含税金额',
    },
    {
      field: 'price',
      width: 120,
      headerName: '价格',
    },
    {
      field: 'taxPrice',
      width: 120,
      headerName: '含税价',
    },
    {
      field: 'theoreticalWeight',
      width: 120,
      headerName: '理重',
    },
    {
      field: 'unitCode',
      width: 120,
      headerName: '数量单位',
      valueFormatter: 'ctx.optionsFind(value,6).label'
    },
    {
      field: 'haveContract',
      width: 120,
      headerName: '是否有合同',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
  ];
  steelTypeOptions: any[] = [];
  YesNoOptions: any[] = [];
  detailedStateOptions: any[] = [];
  deliveryTypeOptions: any[] = [];
  transportTypeOptions: any[] = [];
  gradeOptions: any[] = [];
  unitOptions: any[] = [];
  plantOptions: any[] = [];
  deliveryOrderDetailStateOptions: any[] = [];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.deliveryTypeOptions;
        break;
      case 2:
        options = this.detailedStateOptions;
        break;
      case 3:
        options = this.YesNoOptions;
        break;
      case 4:
        options = this.transportTypeOptions;
        break;
      case 5:
        options = this.gradeOptions;
        break;
      case 6:
        options = this.unitOptions;
        break;
      case 7:
        options = this.deliveryOrderDetailStateOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  // @ApiModelProperty(value = "数据来源标识")
  // private String source;

  // @ApiModelProperty(value = "单号（调拨单、发货单）")
  // private String docCode;

  // @ApiModelProperty(value = "单明细号（调拨单、发货单）")
  // private String docDetailCode;

  // @ApiModelProperty(value = "批号")
  // private String batchCode;

  // @ApiModelProperty(value = "状态")
  // private String pendingState;

  // @ApiModelProperty(value = "客户编码")
  // private String cusCode;

  // @ApiModelProperty(value = "客户简称")
  // private String cusAbbreviation;

  // @ApiModelProperty(value = "是否加急")
  // private String urgent;

  // @ApiModelProperty(value = "实际送货车号")
  // private String realCarNumber;

  // @ApiModelProperty(value = "提货方式")
  // private String deliveryMethod;

  // @ApiModelProperty(value = "配送公仓")
  // private String distributionWarehouse;
  
  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
    {
      field: 'plantCode',
      title: '工厂',
      width: '100'
    },
    {
      field: 'subinventoryCode',
      title: '仓库编码',
      width: '100'
    },
    {
      field: 'subinventoryDescription',
      title: '仓库名称',
      width: '100'
    }
  ];
    
  // 绑定仓库表
  public gridViewPlaces: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsPlaces: any[] = [
    {
      field: 'warehouse',
      width: 120,
      title: '配送仓库',
    },
    {
      field: 'place',
      width: 120,
      title: '配送地点',
    },
    {
      field: 'area',
      width: 120,
      title: '送货区域',
    },
    {
      field: 'ranges',
      width: 120,
      title: '送货范围',
    },
  ];
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      {
        field: 'whCode', title: '仓库', ui: {
          type: UiType.popupSelect, valueField: 'subinventoryCode', textField: 'subinventoryDescription', gridView: this.gridViewWares, columns: this.columnsWares, eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
            TextChangedEventNo: 3,
          }
        }
      },
      { field: 'deliveryDate', title: '配送日期', ui: { type: UiType.dateRange, } },
      { field: 'batchCode', title: '批号', ui: { type: UiType.text, } },
      { field: 'cusAbbreviation', title: '客户简称', ui: { type: UiType.text, } },
      { field: 'urgent', title: '是否加急', ui: { type: UiType.select, options: this.YesNoOptions } },
      { field: 'source', title: '来源', ui: { type: UiType.select, options: this.deliveryTypeOptions } },
      { field: 'docCode', title: '来源单号', ui: { type: UiType.text, } },
      { field: 'pendingState', title: '状态', ui: { type: UiType.select, options: this.detailedStateOptions } },
      {
        field: 'place', title: '目的地', ui: {
          type: UiType.popupSelect, valueField: 'warehouse', textField: 'warehouse', gridView: this.gridViewPlaces, columns: this.columnsPlaces, eventNo: 4,
          extraEvent: {
            RowSelectEventNo: 5,
            TextChangedEventNo: 6,
          }
        }
      },
      { field: 'steelGrade', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'realCarNumber', title: '实际送货车号', ui: { type: UiType.text, } },
      { field: 'specialRemarks', title: '特殊备注', ui: { type: UiType.text, } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      whCode: { value: '', text: '' },
      deliveryDate: [],
      batchCode: '',
      cusAbbreviation: '',
      urgent: null,
      source: null,
      docCode: '',
      pendingState: null,
      place: { value: '', text: '' },
      steelGrade: null,
      realCarNumber: '',
      specialRemarks: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      whCode: { value: '', text: '' },
      deliveryDate: [],
      batchCode: '',
      cusAbbreviation: '',
      urgent: null,
      source: null,
      docCode: '',
      pendingState: null,
      place: { value: '', text: '' },
      steelGrade: null,
      realCarNumber: '',
      specialRemarks: '',
    }
  }

  sumItems: SumItem[] = [
    {
      field: 'theoreticalWeight',
      headerName: '理重',
      // unit: '吨',
    },
    {
      field: 'onhandQuantity',
      headerName: '数量',
      // unit: '张',
    },
  ]
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions();
  }

  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_YES_NOT': this.YesNoOptions,
      'PS_PENDING_STATE': this.detailedStateOptions,
      'PS_DELIVERY_TYPE': this.deliveryTypeOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_GRADE': this.gradeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_DELIVERY_DETAILED_TYPE': this.deliveryOrderDetailStateOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  });

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport = false) {
    const params: any = { ...this.queryParams.values, export: isExport };
    params.whCode = params.whCode.value;
    params.place = params.place.value;
    params.deliveryDate1 = this.queryService.formatDate(params.deliveryDate[0]);
    params.deliveryDate2 = this.queryService.formatDate(params.deliveryDate[1]);
    delete params.deliveryDate;
    if (!isExport) {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  /**
   * 仓库弹出查询
   * @param {any} e
   */
  public searchWares(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadWares(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载仓库
   * @param {string} subinventoryCode  仓库编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadWares(
    subinventoryCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService
      .getWares({
        plantCode: this.queryParams.values.plantCode,
        subinventoryCode: subinventoryCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewWares.data = res.data.content;
        this.gridViewWares.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onWaresSelect(e: any) {
    this.queryParams.values.whCode = {
      value: e.Row.subinventoryCode,
      text: e.Row.subinventoryDescription,
    };
  }

  onWaresTextChanged(event: any) {
    const subinventoryCode = event.Text.trim();
    if(subinventoryCode !== '') {
      if (!this.queryParams.values.plantCode) {
        this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
        return;
      }
      this.queryService
      .getWares({
        plantCode: this.queryParams.values.plantCode,
        subinventoryCode: subinventoryCode,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          // 判断转入转出仓库是否相同
          this.queryParams.values.whCode = {
            value: res.data.content[0].subinventoryCode,
            text: res.data.content[0].subinventoryDescription,
          };
        } else {
          this.queryParams.values.whCode = {
            value: '',
            text: ''
          };
          this.msgSrv.info(this.appTranslationService.translate('仓库编码无效'))
        }
      });
    } else {
      this.queryParams.values.whCode = {
        value: '',
        text: ''
      };
    }
  }

  /**
   * 目的地弹出查询
   * @param {any} e
   */
  public searchPlaces(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadPlaces(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载仓库
   * @param {string} warehouse  仓库
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadPlaces(
    warehouse: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getDistributions({
        warehouse: warehouse,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewPlaces.data = res.data.content;
        this.gridViewPlaces.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onPlacesSelect(e: any) {
    this.queryParams.values.place = {
      value: e.Row.warehouse,
      text: e.Row.warehouse
    };
  }

  onPlacesTextChanged(event: any) {
    const warehouse = event.Text.trim();
    if(warehouse !== '') {
      this.queryService
      .getDistributions({
        warehouse: warehouse,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.queryParams.values.place = {
            value: res.data.content[0].warehouse,
            text: res.data.content[0].warehouse
          };
        } else {
          this.queryParams.values.place = {
            value: '',
            text: ''
          };
          this.msgSrv.warning(this.appTranslationService.translate('配送仓库无效'))
        }
      });
    } else {
      this.queryParams.values.place = {
        value: '',
        text: ''
      };
    }
  }
  
  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
        } 
      }
      this.setTotalBottomRow(data);
    });
  }

  // 过滤后重新统计
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }

  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'source';
    // 需要统计的列数组
    const fields = ['amountIncludingTax', 'theoreticalWeight', 'onhandQuantity', 'weightKg'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  add(dataItem?: any) {
    this.modal.static(
      PendingDeliveryOrderEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem,
      }
    ).subscribe((value) => {
      if (value) {
        this.query();
      }
    })
  }

  import() {
    this.modal.static(
      PendingDeliveryOrderImportComponent,
      {
      },
      'md'
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if (dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要删除吗？'),
          nzOnOk: () => {
            this.delete(ids);
          },
        });
      } else {
        this.delete(ids);
      }
    }
  }

  delete(ids) {
    this.queryService.delete(ids).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  confirm(dataItem) {
    const ids = [dataItem.id];
    this.queryService.confirm(ids).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('确认成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  /**
   * 批量确认
   * @returns 
   */
  batchConfirm() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选待配送列表'));
      return;
    }
    const idList = this.getGridSelectionKeysByFilter('id', (item) => (item.pendingState === '10')
      && ((item.place || '') !== '') && (item.deliveryDate != null));
    if (idList.length !== selectedRows.length) {
      this.msgSrv.info(this.appTranslationService.translate('待确认的配送单中目的地、配送日期不能为空！'));
      return;
    }

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(`是否确认？`),
      nzOnOk: () => {
        this.queryService.confirm(idList).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('确认成功'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }


  type: 'generate' | 'refresh' = 'generate';
  typeMsg = {
    'generate': '开配送单',
    'refresh': '更新待配送列表',
  }
  plantCode = this.appconfig.getActivePlantCode();
  deliveryOrderDate = new Date();
  openModal(type: 'generate' | 'refresh') {
    this.type = type;
    this.isVisible = true;
  }

  handleOk() {
    switch (this.type) {
      case 'generate':
        this.generate();
        break;
      case 'refresh':
        this.refreshList();
        break;

      default:
        break;
    }
    this.handleCancel();
  }

  handleCancel() {
    this.isVisible = false;
    this.plantCode = this.appconfig.getActivePlantCode();
    this.deliveryOrderDate = new Date();
  }

  refreshList() {
    this.queryService.refreshList(this.plantCode).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  generate() {
    const ids = [];
    const selectedRows = this.gridApi.getSelectedRows().filter(item => {
      if (item.pendingState === '20') {
        ids.push(item.id);
        return true;
      }
      return false;
    });
    // if(selectedRows.length === 0) {
    //   this.msgSrv.warning(this.appTranslationService.translate('请先勾选已确认的数据'));
    //   return;
    // }
    const cusCode = selectedRows[0].cusCode;
    const plantCode = selectedRows[0].plantCode;
    const place = selectedRows[0].place;
    for (let i = 1; i < selectedRows.length; i++) {
      if (selectedRows[i].cusCode !== cusCode || selectedRows[i].plantCode !== plantCode || selectedRows[i].place !== place) {
        this.msgSrv.error(this.appTranslationService.translate('必须为相同工厂/客户/目的地！'));
        return;
      }
    }
    this.queryService.generate(ids, this.queryService.formatDate(this.deliveryOrderDate)).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('开配送单成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  expColumnsOptions: any[] = [
    { field: 'source', options: this.deliveryTypeOptions },
    { field: 'pendingState', options: this.detailedStateOptions },
    { field: 'deliveryOrderDetailState', options: this.deliveryOrderDetailStateOptions },
    { field: 'grade', options: this.gradeOptions },
    { field: 'unitOfMeasure', options: this.unitOptions },
    { field: 'unitCode', options: this.unitOptions },
    { field: 'urgent', options: this.YesNoOptions },
    { field: 'deliveryMethod', options: this.transportTypeOptions },
    { field: 'haveContract', options: this.YesNoOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.exportFile();
  }

  exportFile() {
    this.queryService.exportAction(
      this.httpAction,
      this.getQueryParamsValue(true),
      this.excelexport,
      this.context
    );
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
