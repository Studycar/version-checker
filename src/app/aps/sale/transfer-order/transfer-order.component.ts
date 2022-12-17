import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TransferOrderDetailComponent } from './detail/detail.component';
import { TransferOrderEditComponent } from './edit/edit.component';
import { PlanscheduleHWChangeDetailComponent } from 'app/modules/base_module/components/change-detail/change-detail.component';
import { TransferOrderQueryService } from './query.service';

@Component({
  selector: 'transfer-order',
  templateUrl: './transfer-order.component.html',
  providers: [TransferOrderQueryService]
})
export class TransferOrderComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: TransferOrderQueryService,
    public http: _HttpClient,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  // 绑定业务员
  public gridViewUsers: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsUsers: any[] = [
    {
      field: 'userName',
      title: '用户名',
      width: '100'
    },
    {
      field: 'description',
      title: '真实用户名',
      width: '120'
    },
  ];
  
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
      field: 'code',
      width: 120,
      headerName: '调拨单号'
    },
    {
      field: 'allocationDate',
      width: 120,
      headerName: '调拨单日期'
    },
    {
      field: 'state',
      width: 120,
      headerName: '调拨单状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'outCode',
      width: 120,
      headerName: '转出部门编码',
    },
    {
      field: 'outDepartment',
      width: 120,
      headerName: '转出部门'
    },
    {
      field: 'summaryQuantity',
      width: 120,
      headerName: '汇总数量',
    },
    {
      field: 'inCode',
      width: 120,
      headerName: '转入部门编码',
    },
    {
      field: 'inDepartment',
      width: 120,
      headerName: '转入部门'
    },
    {
      field: 'cklbCode',
      width: 120,
      headerName: '出库类别编码',
    },
    {
      field: 'cklb',
      width: 120,
      headerName: '出库类别'
    },
    {
      field: 'rklbCode',
      width: 120,
      headerName: '入库类别编码',
    },
    {
      field: 'rklb',
      width: 120,
      headerName: '入库类别'
    },
    // {
    //   field: 'approveDate',
    //   width: 120,
    //   headerName: '审核日期'
    // },
    {
      field: 'inWarehouseCode',
      width: 120,
      headerName: '转入仓库编码',
    },
    {
      field: 'inWarehouse',
      width: 120,
      headerName: '转入仓库'
    },
    {
      field: 'outWarehouseCode',
      width: 120,
      headerName: '转出仓库编码'
    },
    {
      field: 'outWarehouse',
      width: 120,
      headerName: '转出仓库'
    },
    {
      field: 'remarks',
      width: 120,
      headerName: '备注'
    },
    {
      field: 'approveTime',
      width: 120,
      headerName: '审核时间',
    },
    // {
    //   field: 'userId',
    //   width: 120,
    //   headerName: '经手人编码',
    // },
    {
      field: 'userName',
      width: 120,
      headerName: '用户名'
    },
    {
      field: 'description',
      width: 120,
      headerName: '真实用户名'
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建时间'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ];
  allotStateOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.allotStateOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  plantOptions: any[] = [];
  productCategoryOptions: any[] = [];
  
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'code', title: '调拨单号', ui: { type: UiType.text } },
      { field: 'state', title: '调拨单状态', ui: { type: UiType.select, options: this.allotStateOptions } },
      { field: 'allocationDateRange', title: '调拨单日期', ui: { type: UiType.dateRange } },
      { field: 'approveDateRange', title: '审核日期', ui: { type: UiType.dateRange } },
      { field: 'createdBy', title: '创建人', ui: 
        { 
          type: UiType.popupSelect,
          valueField: 'userName', 
          textField: 'description', 
          name: 'createdBy',
          gridView: this.gridViewUsers, 
          columns: this.columnsUsers, 
          eventNo: 1,
          extraEvent: {
            TextChangedEventNo: 7,
          }
        } 
      },
      { field: 'inWarehouseStr', title: '转入仓库', ui: 
        { 
          type: UiType.popupSelect,
          valueField: 'subinventoryCode', 
          textField: 'subinventoryCode', 
          name: 'inWarehouse',
          gridView: this.gridViewWares, 
          columns: this.columnsWares, 
          eventNo: 2,
          extraEvent: {
            RowSelectEventNo: 3,
            TextChangedEventNo: 4,
          }
        } 
      },
      { field: 'outWarehouseStr', title: '转出仓库', ui: 
        { 
          type: UiType.popupSelect,
          valueField: 'subinventoryCode', 
          textField: 'subinventoryCode', 
          name: 'outWarehouse',
          gridView: this.gridViewWares, 
          columns: this.columnsWares, 
          eventNo: 2,
          extraEvent: {
            RowSelectEventNo: 5,
            TextChangedEventNo: 6,
          }
        } 
      },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      code: '',
      state: null,
      allocationDateRange: [],
      approveDateRange: [],
      createdBy: { value: '', text: '' },
      inWarehouseStr: { value: '', text: '' },
      outWarehouseStr: { value: '', text: '' },
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      code: '',
      state: null,
      allocationDateRange: [],
      approveDateRange: [],
      createdBy: { value: '', text: '' },
      inWarehouseStr: { value: '', text: '' },
      outWarehouseStr: { value: '', text: '' },
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_ALLOT_STATE': this.allotStateOptions,
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

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

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values };
    params.allocationDate = this.queryService.formatDate(this.queryParams.values.allocationDateRange[0]);
    params.endAllocationDate = this.queryService.formatDate(this.queryParams.values.allocationDateRange[1]);
    params.approveDate = this.queryService.formatDate(this.queryParams.values.approveDateRange[0]);
    params.endApproveDate = this.queryService.formatDate(this.queryParams.values.approveDateRange[1]);
    params.inWarehouse = this.queryParams.values.inWarehouseStr.text;
    params.outWarehouse = this.queryParams.values.outWarehouseStr.text;
    params.createdBy = this.queryParams.values.createdBy.value;
    delete params.allocationDateRange;
    delete params.approveDateRange;
    delete params.inWarehouseStr;
    delete params.outWarehouseStr;
    return {
      ...params,
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      TransferOrderEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if(dataItem === undefined) {
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
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  examine(dataItem) {
    this.queryService.examine(dataItem.id, dataItem.inWarehouseCode, dataItem.inWarehouse).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('更新成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  /**
   * 打开修改记录
   * @param dataItem 
   */
   showChangeDetail(dataItem) {
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: 'ps_transfer_order_history',
          myAgGridRowKey: 'PS_TRANSFER_ORDER_HISTORY',
        },
        queryParamsValue: {
          code: dataItem.code,
        },
        exportFileName: '调拨单',
        tableColumns: [{
          field: 'zxdz',
          headerName: '执行动作',
          width: 100
        }, ...this.columns.filter(col => col.colId === undefined)],
        tableExpColumnsOptions: this.expColumnsOptions,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }
  
  showDetail(dataItem) {
    this.modal.static(
      TransferOrderDetailComponent,
      {
        transferOrderCode: dataItem.code,
        allocationDate: dataItem.allocationDate,
        outCode: dataItem.outCode,
        plantCode: dataItem.plantCode
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  /**
   * 用户弹出查询
   * @param {any} e
   */
   public searchUsers(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadUsers(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载用户
   * @param {string} userName  用户名或真实用户名
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadUsers(
    userName: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService.getUsers({
      userName: userName,
      page: pageIndex,
      pageSize: pageSize
    }).subscribe(res => {
      this.gridViewUsers.data = res.data.content;
      this.gridViewUsers.total = res.data.totalElements;
    })
  }

  onUsersTextChanged(event: any) {
    const userName = event.Text.trim();
    if(userName !== '') {
      this.queryService
      .getUsers({
        userName: userName,
        page: 1,
        pageSize: 1 
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('创建人真实用户名无效'));
          this.queryParams.values.createdBy = { value: '', text: '' };
        } else {
          this.queryParams.values.createdBy = { value: res.data.content[0].userName, text: res.data.content[0].description };
        }
      });
    } 
  }

  isVisible: boolean = false;
  plantCode = this.appconfig.getActivePlantCode();
  productCategory = this.appconfig.getActiveProductCategory();

  handleOk() {
    this.queryService.task(this.productCategory, this.plantCode).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.isVisible = false;
        this.plantCode = this.appconfig.getActivePlantCode();
        this.productCategory = this.appconfig.getActiveProductCategory();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  handleCancel() {
    this.isVisible = false;
    this.plantCode = this.appconfig.getActivePlantCode();
    this.productCategory = this.appconfig.getActiveProductCategory();
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
  onWaresSelect(e: any, type: 'out' | 'in') {
    this.queryParams.values[type + 'WarehouseStr'] = {
      value: e.Row.subinventoryCode,
      text: e.Row.subinventoryDescription,
    };
  }

  onWaresTextChanged(event: any, type: 'out' | 'in') {
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
          this.queryParams.values[type + 'WarehouseStr'] = {
            value: res.data.content[0].subinventoryCode,
            text: res.data.content[0].subinventoryDescription,
          };
        } else {
          this.queryParams.values[type + 'WarehouseStr'] = {
            value: '',
            text: '',
          };
          this.msgSrv.warning(this.appTranslationService.translate('没有此仓库信息'));
        }
      });
    } else {
      this.queryParams.values[type + 'WarehouseStr'] = {
        value: '',
        text: '',
      };
    }
  }


  expColumnsOptions = [
    { field: 'state', options: this.allotStateOptions },
  ]
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
