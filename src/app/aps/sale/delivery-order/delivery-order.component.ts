import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { ActivatedRoute, Router } from "@angular/router";
import { decimal } from "@shared";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { DeliveryOrderDetailComponent } from "./detail/detail.component";
import { DeliveryOrderEditComponent } from "./edit/edit.component";
import { DeliveryOrderQueryService } from "./query.service";
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DeliveryOrderImportComponent } from "./import/import.component";
import { concat } from "rxjs-compat/operator/concat";
import { SumItem } from "app/modules/base_module/components/custom-tb-select-sum.component";
@Component({
  selector: 'delivery-order',
  templateUrl: './delivery-order.component.html',
  providers: [DeliveryOrderQueryService]
})
export class DeliveryOrderComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: DeliveryOrderQueryService,
    public http: _HttpClient,
    private routerInfo: Router,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.sumHeight = 40;
    this.initGridHeight();
  }

  columns = [
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
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'docCode',
      width: 120,
      headerName: '来源单号'
    },
    {
      field: 'docDetailCode',
      width: 120,
      headerName: '来源单行号'
    },
    {
      field: 'deliveryOrderCode',
      width: 120,
      headerName: '配送单号'
    },
    {
      field: 'deliveryOrderState',
      width: 120,
      headerName: '配送单状态',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'deliveryDate',
      width: 120,
      headerName: '配送日期'
    },
    {
      field: 'carNumber',
      width: 120,
      headerName: '车号'
    },
    {
      field: 'logistics',
      width: 120,
      headerName: '物流公司'
    },
    {
      field: 'place',
      width: 120,
      headerName: '目的地'
    },
    {
      field: 'remarks',
      width: 120,
      headerName: 'APS备注',
      editable: true, 
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'specialRemarks',
      width: 120,
      headerName: '特殊备注',
    },
    {
      field: 'receiptTime',
      width: 120,
      headerName: '收货时间'
    },
    {
      field: 'detailAddress',
      width: 120,
      headerName: '详细地址'
    },
    {
      field: 'realDeliveryTime',
      width: 120,
      headerName: '实际发货时间'
    },
    {
      field: 'realCarNumber',
      width: 120,
      headerName: '实际送货车号'
    },
    {
      field: 'mesRemark',
      width: 120,
      headerName: 'MES备注'
    },

    {
      field: 'audit',
      width: 120,
      headerName: '审核人'
    },
    {
      field: 'auditTime',
      width: 120,
      headerName: '审核日期'
    },
    {
      field: 'deliveryOrderDetailCode',
      width: 120,
      headerName: '配送单行号'
    },
    {
      field: 'deliveryOrderDetailState',
      width: 120,
      headerName: '配送单行状态',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'stockCode',
      width: 120,
      headerName: '存货编码'
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '存货名称'
    },
    {
      field: 'warehouse',
      width: 120,
      headerName: '实体仓库编码'
    },
    {
      field: 'location',
      width: 120,
      headerName: '库位编码'
    },
    {
      field: 'whName',
      width: 120,
      headerName: '仓库'
    },
    {
      field: 'batchCode',
      width: 120,
      headerName: '批号'
    },
    {
      field: 'baleNo',
      width: 120,
      headerName: '捆包号'
    },
    {
      field: 'spec',
      width: 120,
      headerName: '规格尺寸'
    },
    {
      field: 'steelGrade',
      width: 120,
      headerName: '钢种'
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面'
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级'
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      headerName: '单位'
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量'
    },
    {
      field: 'weightKg',
      width: 120,
      headerName: '净重'
    },
    {
      field: 'grossWeight',
      width: 120,
      headerName: '毛重'
    },
    {
      field: 'theoreticalWeight',
      width: 120,
      headerName: '理重'
    },
    {
      field: 'coating',
      width: 120,
      headerName: '表面保护'
    },
    {
      field: 'sleeveType',
      width: 120,
      headerName: '套筒类型'
    },
    {
      field: 'sleeveWeight',
      width: 120,
      headerName: '套筒重量'
    },
    {
      field: 'boxType',
      width: 120,
      headerName: '箱体类型'
    },
    {
      field: 'packType',
      width: 120,
      headerName: '包装方式'
    },
    {
      field: 'saleRemark',
      width: 120,
      headerName: '供销备注'
    },
    // {
    //   field: 'deliveryOrderState',
    //   width: 120,
    //   headerName: '配送单状态'
    // },



    {
      field: 'area',
      width: 120,
      headerName: '送货区域'
    },
    {
      field: 'ranges',
      width: 120,
      headerName: '送货范围'
    },
    {
      field: 'withinProvince',
      width: 120,
      headerName: '是否省内'
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'cusName',
      width: 120,
      headerName: '客户名称'
    },

    {
      field: 'owner',
      width: 120,
      headerName: '货权'
    },
    {
      field: 'taxPrice',
      width: 120,
      headerName: '含税价'
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      headerName: '含税金额'
    },
    {
      field: 'deliveryMethod',
      width: 120,
      headerName: '提货方式'
    },

    {
      field: 'createdBy',
      width: 120,
      headerName: '制单人'
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '制单时间'
    },
    {
      field: 'driverName',
      width: 120,
      headerName: '司机姓名'
    },
    {
      field: 'driverTel',
      width: 120,
      headerName: '司机联系电话'
    },
  ];

  // 绑定仓库表
  public gridViewWares = {
    data: [],
    total: 0
  };

  public gridViewWaresHouse = {
    data: [],
    total: 0
  }
  public gridViewPlace = {
    data: [],
    total: 0
  }
  public columnsPlace: any[] = [
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
  ]
  public columnsWares: any[] = [
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

  deliveryStateOptions: any[] = []; //PS_DELIVERY_STATE
  deliveryDetailStateOptions: any[] = []; //PS_DELIVERY_DETAILED_TYPE
  deliveryTypeOptions: any[] = []; //PS_DELIVERY_TYPE
  plantOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.deliveryStateOptions;
        break;
      case 2:
        options = this.deliveryDetailStateOptions;
        break;
      case 3:
        options = this.deliveryTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  isVisible: boolean = false;
  isGenerate: boolean = false; // false 自动配车
  isChangeCar: boolean = false
  plantCode: string = '';
  carNumber: string = ''
  carPendingDeliveryIds: string[] = []
  sumItems: SumItem[] = [
    {
      field: 'theoreticalWeight',
      headerName: '理重',
      // unit: '吨',
    },
    {
      field: 'quantity',
      headerName: '数量',
      // unit: '张',
    },
  ]
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'dateRange', title: '配送日期', ui: { type: UiType.dateRange } },
      {
        field: 'warehouse', title: '实体仓库名称', ui: {
          type: UiType.popupSelect,
          valueField: 'subinventoryCode',
          textField: 'subinventoryDescription',
          gridView: this.gridViewWaresHouse,
          columns: this.columnsWares,
          eventNo: 3,
        }
      },
      {
        field: 'whCode', title: '仓库', ui: {
          type: UiType.popupSelect,
          valueField: 'subinventoryCode',
          textField: 'subinventoryDescription',
          gridView: this.gridViewWares,
          columns: this.columnsWares,
          eventNo: 4,
        }
      },
      { field: 'spec', title: '规格尺寸', ui: { type: UiType.text } },
      { field: 'batchCode', title: '批号', ui: { type: UiType.text } },
      { field: 'deliveryOrderCode', title: '配送单号', ui: { type: UiType.text } },
      { field: 'carNumber', title: '车号', ui: { type: UiType.text } },
      {
        field: 'place', title: '目的地', ui: {
          type: UiType.popupSelect,
          valueField: 'warehouse',
          textField: 'warehouse',
          gridView: this.gridViewPlace,
          columns: this.columnsPlace,
          eventNo: 5,
        }
      },
      { field: 'source', title: '来源', ui: { type: UiType.select, options: this.deliveryTypeOptions } },
      { field: 'cusName', title: '客户名称', ui: { type: UiType.text } },
      { field: 'stockName', title: '存货名称', ui: { type: UiType.text } },
      { field: 'baleNo', title: '捆包号', ui: { type: UiType.text } },
      { field: 'carMark', title: '配送标识', ui: { type: UiType.text } },
      { field: 'specialRemarks', title: '特殊备注', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      deliveryOrderCode: '',
      dateRange: [],
      carNumber: '',
      warehouse: { value: '', text: '' },
      whCode: { value: '', text: '' },
      spec: '',
      batchCode: '',
      place: { value: '', text: '' },
      source: '',
      cusName: '',
      stockName: '',
      baleNo: '',
      carMark: '',
      specialRemarks: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      deliveryOrderCode: '',
      dateRange: [],
      carNumber: '',
      warehouse: { value: '', text: '' },
      whCode: { value: '', text: '' },
      spec: '',
      batchCode: '',
      place: { value: '', text: '' },
      source: '',
      cusName: '',
      stockName: '',
      baleNo: '',
      carMark: '',
      specialRemarks: '',
    }
  }

  /**
     * 目的地弹出查询
     * @param {any} e
     */
  public searchPlace(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadPlace(
      e.SearchValue,
      PageIndex,
      e.PageSize
    );
  }

  public loadPlace(
    warehouse: string,
    pageIndex: number,
    pageSize: number
  ) {
    this.queryService
      .getDistributions({
        warehouse: warehouse,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewPlace.data = res.data.content;
        this.gridViewPlace.total = res.data.totalElements;
      });
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
      false
    );
  }

  public searchWaresHouse(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadWares(
      e.SearchValue,
      PageIndex,
      e.PageSize,
      true
    );
  }

  /**
   * 加载仓库
   * @param {string} subinventoryCode  仓库编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   * @param {boolean} isHouse   判断是否实体仓库
   */
  public loadWares(
    subinventoryCode: string,
    pageIndex: number,
    pageSize: number,
    isHouse: boolean
  ) {
    this.queryService
      .getWares({
        subinventoryCode: subinventoryCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        if (isHouse) {
          this.gridViewWaresHouse.data = res.data.content;
          this.gridViewWaresHouse.total = res.data.totalElements;
        } else {
          this.gridViewWares.data = res.data.content;
          this.gridViewWares.total = res.data.totalElements;
        }
      });
  }
  ngOnInit() {
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_DELIVERY_STATE': this.deliveryStateOptions,
      'PS_DELIVERY_DETAILED_TYPE': this.deliveryDetailStateOptions,
      'PS_DELIVERY_TYPE': this.deliveryTypeOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  query() {
    this.plantCode = this.appconfig.getActivePlantCode();
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
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
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
  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'deliveryOrderCode';
    // 需要统计的列数组
    const fields = ['quantity', 'weightKg', 'grossWeight', 'theoreticalWeight'];
    super.setTotalBottomRow(data, totalField, fields);
  }
  getQueryParamsValue(isExport = false) {
    const params: any = { ...this.queryParams.values };
    params.deliveryOrderDate = this.queryService.formatDate(params.dateRange[0]);
    params.endDeliveryOrderDate = this.queryService.formatDate(params.dateRange[1]);
    delete params.dateRange;
    params.warehouse = params.warehouse.text;
    params.whCode = params.whCode.value;
    params.place = params.place.value;
    let { deliveryOrderCode, dateRange, carNumber, warehouse, whCode, spec, batchCode, place, source, cusName, stockName, baleNo, carMark, plantCode } = this.queryParams.values
    return {
      ...params,
      export: isExport,
      pendingState: 10,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  onCellClicked(event) {
    if (event.colDef.field !== 'deliveryOrderCode') { return; }
    const data = event.data
    this.routerInfo.navigateByUrl(`/sale/deliveryOrderDetail?plantCode=${data.plantCode || ''}&deliveryOrderCode=${data.deliveryOrderCode || ''}`);
  }

  generate() {
    this.isGenerate = true;
    this.isVisible = true;
  }

  handleOk() {
    if (this.isGenerate) {
      const selectedRows = this.gridApi.getSelectedRows();
      let pendingDeliveryIds: string[] = selectedRows.map(item => item.pendingDeliveryId) || []
      this.queryService.compute({
        plantCode: this.plantCode,
        pendingDeliveryIds
      }).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.isVisible = false;
          this.plantCode = this.appconfig.getActivePlantCode();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    } else {
      this.queryService.match(this.plantCode).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.isVisible = false;
          this.plantCode = this.appconfig.getActivePlantCode();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    }
  }

  handleCancel() {
    this.isVisible = false;
    this.plantCode = this.appconfig.getActivePlantCode();
  }

  handleCarCancel() {
    this.isChangeCar = false
    this.carNumber = ''
  }

  handleCarNumberOk() {
    let list = this.carPendingDeliveryIds.map(item => {
      return {
        pendingDeliveryId: item,
        carNumber: this.carNumber
      }
    })
    this.queryService.editCarNumber(list).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('修改成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  remove() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选配送单'));
      return;
    }
    const ids = selectedRows.map(item => item.pendingDeliveryId)
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.delete(ids);
      },
    });
  }

  delete(ids) {
    this.queryService.delete(ids).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  refreshSubCode() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要刷新吗？'),
      nzOnOk: () => {
        this.queryService.refreshSubCode().subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  examineData() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选配送单'));
      return;
    }
    const pcNums = selectedRows.map(item => {
      let { carNumber, pendingDeliveryId } = item
      return {
        carNumber, pendingDeliveryId
      }
    })
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(`是否确认更新为已审核状态？`),
      nzOnOk: () => {
        this.queryService.examine(pcNums).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('审核成功!'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        })
      },
    });
  }
  editCarNumber() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选配送单'));
      return;
    }
    let noData = selectedRows.filter(item => !item.carNumber)
    if (noData.length !== 0) {
      this.msgSrv.info(this.appTranslationService.translate('车号未绑定'));
      return;
    }
    let list = selectedRows.map(item => {
      return {
        pendingDeliveryId: item.pendingDeliveryId || '',
        carNumber: item.carNumber
      }
    })
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(`是否确定修改车号？`),
      nzOnOk: () => {
        this.queryService.editCarNumber(list).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('修改成功'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        })
      },
    });

  }
  bind() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选配送单'));
      return;
    }
    const ids = [];
    let quantitySum = 0;
    for (let i = 0; i < selectedRows.length; i++) {
      if (!this.isNull(selectedRows[i].pcNum)) {
        this.msgSrv.info(this.appTranslationService.translate('已有捆绑订单，请先解除绑定'));
        return;
      }
      ids.push(selectedRows[i].id);
      quantitySum = decimal.add(quantitySum, selectedRows[i].quantitySum);
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(`本次配车的总重量总计 ${quantitySum} 吨，是否确认做绑定？`),
      nzOnOk: () => {
        this.queryService.car(ids).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('绑定成功'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        })
      },
    });
  }

  unbind() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选配送单'));
      return;
    }
    const pcNumsList = [...new Set(this.getGridSelectionKeysByFilter('carNumber', (item) => !this.isNull(item.carNumber)))];
    const pcNums = selectedRows.map(item => {
      let { carNumber, deliveryOrderDetailedId } = item
      return {
        carNumber, deliveryOrderDetailedId
      }
    })
    if (pcNumsList.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('没有车号'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(`是否确定解绑以下车号对应订单？${pcNumsList.join(', ')}`),
      nzOnOk: () => {
        this.queryService.relieveCar(pcNums).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('解绑成功'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        })
      },
    });
  }

  expColumnsOptions: any[] = [
    { field: 'deliveryOrderState', options: this.deliveryStateOptions },
    { field: 'deliveryOrderDetailState', options: this.deliveryDetailStateOptions },
    { field: 'source', options: this.deliveryTypeOptions }
  ];
  // 导出
  expColumns: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    let colums = this.columns.concat([])
    colums.shift()

    colums.splice(3, 0, {
      field: 'carMark',
      headerName: '配车标识',
      width: 200
    })
    this.expColumns = this.excelexport.setExportColumn(colums)
    // super.export();
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

  /**
   * 导入职责
   */
  public imports() {
    this.modal.static(DeliveryOrderImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }

  /**
   * 手动配车接口
  */
  bindCar() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选特殊备注一致的配送单'));
      return;
    }
    const list = [];
    for(let i = 0; i < selectedRows.length; i++) {
      if ((selectedRows[i].specialRemarks || '') !== (selectedRows[0].specialRemarks || '')) {
        this.msgSrv.warning(this.appTranslationService.translate('存在特殊备注不一致的数据，请检查'));
        return;
      }
      list.push({
        pendingDeliveryId: selectedRows[i].pendingDeliveryId || '',
        deliveryOrderDetailedId: selectedRows[i].deliveryOrderDetailedId || ''
      })
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(`是否确定手动开配送单？`),
      nzOnOk: () => {
        this.queryService.bindCar(list).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('手动开配送单成功'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        })
      },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onVirtualColumnsChanged(null);
    });
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['APS备注'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#digitalGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }

  onCellValueChanged (event) {  
    if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString() && this.editColumnHeaders.findIndex(x => x === event.colDef.headerName) > -1) {
      let { pendingDeliveryId } = event.data
      this.queryService.updataData({
        pendingDeliveryId,
        remarks: event.newValue
      }).subscribe(res => {
      })
    }
  }

}
