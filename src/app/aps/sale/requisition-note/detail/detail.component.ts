import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { RequisitionNoteQueryService } from "../query.service";
import { RequisitionNoteDetailedEditComponent } from "./edit/edit.component";

@Component({
  selector: 'requisition-note-detail',
  templateUrl: './detail.component.html',
  providers: [RequisitionNoteQueryService]
})
export class RequisitionNoteDetailComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: RequisitionNoteQueryService,
    public http: _HttpClient,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  requisitionNoteCode: string = '';
  invoiceBillCode: string = '';
  distributionWarehouseCode: string = ''; // 配送公仓编码
  
  isVisible: boolean = false;
  changeDistributionWarehouse: string = ''; // 用于变更目的地

  // 绑定客户
  public gridViewCustoms: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsCustoms: any[] = [
    {
      field: 'cusCode',
      width: 120,
      title: '客户编码'
    },
    {
      field: 'plantCode',
      width: 120,
      title: '所属公司'
    },
    {
      field: 'creditCus',
      width: 120,
      title: '信用单位'
    },
    {
      field: 'affiliatedCus',
      width: 120,
      title: '所属客户'
    },
    {
      field: 'cusState',
      width: 120,
      title: '客户状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cusGrade',
      width: 120,
      title: '客户等级',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'cusType',
      width: 120,
      title: '客户类型',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'cusName',
      width: 120,
      title: '客户名称'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      title: '客户简称'
    },
    {
      field: 'taxNum',
      width: 120,
      title: '税号'
    },
    {
      field: 'contact',
      width: 120,
      title: '联系人'
    },
    {
      field: 'region',
      width: 120,
      title: '地区分类',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'address',
      width: 120,
      title: '地址'
    },
    {
      field: 'telNum',
      width: 120,
      title: '联系电话'
    },
    {
      field: 'bank',
      width: 120,
      title: '开户银行'
    },
    {
      field: 'bankNum',
      width: 120,
      title: '银行账号'
    },
    {
      field: 'bankArchives',
      width: 120,
      title: '银行档案'
    },
    {
      field: 'initialCredit',
      width: 120,
      title: '客户初始额度'
    },
    {
      field: 'domestic',
      width: 120,
      title: '是否国内',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'currency',
      width: 120,
      title: '币种',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'credit',
      width: 120,
      title: '信用额度'
    },
    {
      field: 'zyQuota',
      width: 120,
      title: '占用额度'
    },
    {
      field: 'temCredit',
      width: 120,
      title: '临时信用额度'
    },
    {
      field: 'balance',
      width: 120,
      title: '账户余额'
    },
    {
      field: 'salesmanCode',
      width: 120,
      title: '业务员编码',
    },
    {
      field: 'salesman',
      width: 120,
      title: '业务员',
    },
    {
      field: 'departmentCode',
      width: 120,
      title: '部门编码',
    },
    {
      field: 'department',
      width: 120,
      title: '分管部门',
    },
    {
      field: 'creditControl',
      width: 120,
      title: '是否控制信用额度',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'tax',
      width: 120,
      title: '税率'
    },
    {
      field: 'disableTime',
      width: 120,
      title: '停用时间'
    },
    {
      field: 'reason',
      width: 120,
      title: '驳回原因'
    },
  ];
  customersOptions = {
    1: { 'PS_CUSTOMER_STATUS': [] },
    2: { 'PS_CUS_GRADE': [] },
    3: { 'CUS_TYPE': [] },
    4: { 'PS_CUS_REGION': [] },
    5: { 'PS_CUS_DOMESTIC': [] },
    6: { 'PS_CURRENCY': [] },
    7: { 'PS_YES_NOT': [] },
  };

  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
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
      field: 'requisitionNoteCode',
      width: 120,
      headerName: '转货单编号'
    },
    {
      field: 'detailedNum',
      width: 120,
      headerName: '明细行号'
    },
    {
      field: 'state',
      width: 120,
      headerName: '转货单行状态',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'invoiceBillCode',
      width: 120,
      headerName: '发货单号'
    },
    {
      field: 'invoiceBillDetailedNum',
      width: 120,
      headerName: '发货单明细行号'
    },
    {
      field: 'batchNum',
      width: 120,
      headerName: '批号'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'printed',
      width: 120,
      headerName: '已打印',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'printTimes',
      width: 120,
      headerName: '打印次数',
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'standardsType',
      width: 120,
      headerName: '规格尺寸',
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量',
    },
    {
      field: 'entrusted',
      width: 120,
      headerName: '受托单位',
    },
    {
      field: 'distributionWarehouse',
      width: 120,
      headerName: '目的地',
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码',
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
    },
    {
      field: 'shipper',
      width: 120,
      headerName: '货主',
    },
    {
      field: 'shippingAddress',
      width: 120,
      headerName: '送货地址',
    },
    {
      field: 'contact',
      width: 120,
      headerName: '联系人',
    },
    {
      field: 'phone',
      width: 120,
      headerName: '联系电话',
    },
    {
      field: 'haveContract',
      width: 120,
      headerName: '是否有合同',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建日期'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新日期'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ];
  steelTypeOptions: any[] = [];
  detailedStateOptions: any[] = [];
  YesNoOptions: any[] = [];
  plantOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.steelTypeOptions;
        break;
      case 2:
        options = this.detailedStateOptions;
        break;
      case 3:
        options = this.YesNoOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'requisitionNoteCode', title: '转货单号', ui: { type: UiType.text } },
      { field: 'batchNum', title: '批号', ui: { type: UiType.text } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'printed', title: '已打印', ui: { type: UiType.select, options: this.YesNoOptions } },
      // 通过客户简称转化客户编码
      { field: 'cusCode', title: '客户简称', ui: 
        { 
          type: UiType.popupSelect,
          valueField: 'cusCode', 
          textField: 'cusAbbreviation', 
          name: 'cusCode',
          gridView: this.gridViewCustoms, 
          columns: this.columnsCustoms, 
          options: this.customersOptions,
          eventNo: 4,
          extraEvent: {
            RowSelectEventNo: 5,
            TextChangedEventNo: 6,
          }
        }  
      },
      { field: 'distributionWarehouse', title: '目的地', ui: 
        { 
          type: UiType.popupSelect,
          valueField: 'warehouse', 
          textField: 'warehouse', 
          name: 'distributionWarehouse',
          gridView: this.gridViewWares, 
          columns: this.columnsWares, 
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
            TextChangedEventNo: 3,
          }
        }  
      },
    ],
    values: {
      requisitionNoteCode: '',
      batchNum: '',
      steelType: null,
      plantCode: this.appconfig.getActivePlantCode(),
      printed: null,
      cusCode: {value:'',text:''},
      distributionWarehouse: { value:'', text:''},
    }
  };

  clear() {
    this.queryParams.values = {
      requisitionNoteCode: this.requisitionNoteCode,
      batchNum: '',
      steelType: null,
      plantCode: this.appconfig.getActivePlantCode(),
      printed: null,
      cusCode: {value:'',text:''},
      distributionWarehouse: { value:'', text:''},
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.queryParams.values.requisitionNoteCode = this.requisitionNoteCode;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    })
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_TRANSFER_DETAILED_STATE': this.detailedStateOptions,
      'PS_YES_NOT': this.YesNoOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryDetailUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values };
    params.cusCode = this.queryParams.values.cusCode.value;
    params.distributionWarehouse = this.queryParams.values.distributionWarehouse.value;
    return {
      ...params,
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      RequisitionNoteDetailedEditComponent,
      {
        i: dataItem === undefined ? { id: null, requisitionNoteCode: this.requisitionNoteCode, invoiceBillCode: this.invoiceBillCode } : dataItem,
        distributionWarehouseCode: this.distributionWarehouseCode,
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
    this.queryService.deleteDetailed(ids).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

    
  /**
   * 打开修改记录
   * @param dataItem 
   */
   showChangeDetail(dataItem) {
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryDetailChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: 'ps_requisition_note_detailed_history',
          myAgGridRowKey: 'PS_REQUISITION_NOTE_DETAILED_HISTORY',
        },
        queryParamsValue: {
          detailedNum: dataItem.detailedNum,
        },
        exportFileName: '转货单明细',
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
  /**
   * 客户弹出查询
   * @param {any} e
   */
   public searchCustoms(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCustoms(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

 /**
   * 加载客户
   * @param {string} cusAbbreviation  客户简称
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadCustoms(
    cusAbbreviation: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.queryService
      .getCustoms({
        plantCode: this.queryParams.values.plantCode,
        cusAbbreviation: cusAbbreviation,
        isCusCodeNotNull: true,
        pageIndex: PageIndex,
        pageSize: PageSize,
      })
      .subscribe(res => {
        this.gridViewCustoms.data = res.data.content;
        this.gridViewCustoms.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.queryParams.values.cusCode.value = e.Row.cusCode;
    this.queryParams.values.cusCode.text = e.Row.cusAbbreviation;
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
    const totalField = 'requisitionNoteCode';
    // 需要统计的列数组
    const fields = ['theoreticalWeight', 'weight', 'quantity'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  onCustomsTextChanged(event: any) {
    const cusAbbreviation = event.Text.trim();
    if(cusAbbreviation == '') { 
      this.queryParams.values.cusCode = { value:'', text:'' };
      return; 
    } else {
      this.queryService
      .getCustoms({
        plantCode: this.queryParams.values.plantCode,
        cusAbbreviation: cusAbbreviation,
        isCusCodeNotNull: true,
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.queryParams.values.cusCode.value = res.data.content[0].cusCode;
          this.queryParams.values.cusCode.text = res.data.content[0].cusAbbreviation;
        } else {
          this.msgSrv.error(this.appTranslationService.translate('客户简称无效'))
          this.queryParams.values.cusCode = { value:'', text:'' };
        }
      });
    }
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
   * @param {string} warehouse  仓库
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadWares(
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
        this.gridViewWares.data = res.data.content;
        this.gridViewWares.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onWaresSelect(e: any, type: 'search' | 'change') {
    this.saveWares(e.Row, type);
  }

  onWaresTextChanged(event: any, type: 'search' | 'change') {
    const warehouse = event.Text.trim();
    if(warehouse !== '') {
      this.queryService
      .getDistributions({
        warehouse: warehouse,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveWares(res.data.content[0], type);
        } else {
          this.clearWares(type);
          this.msgSrv.warning(this.appTranslationService.translate('没有此仓库信息'));
        }
      });
    } else {
      this.clearWares(type);
    }
  }

  saveWares(data, type: 'search' | 'change') {
    if(type === 'search') {
      this.queryParams.values.distributionWarehouse = {
        value: data.warehouse,
        text: data.warehouse,
      };
    } else {
      this.changeDistributionWarehouse = data.warehouse;
    }
  }

  clearWares(type: 'search' | 'change') {
    if(type === 'search') {
      this.queryParams.values.distributionWarehouse = {
        value: '',
        text: '',
      };
    } else {
      this.changeDistributionWarehouse = '';
    }
  }
  selectedIds = [];
  changeDists() {
    const ids = this.getGridSelectionKeysByFilter('id', item => item.printed != '1');
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选未打印的数据'));
      return;
    }
    this.isVisible = true;
    this.selectedIds = [...ids];
  }

  handleOk() {
    this.queryService.batchUpdateDist(this.changeDistributionWarehouse, this.selectedIds).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.isVisible = false;
        this.selectedIds = [];
        this.changeDistributionWarehouse = '';
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  handleCancel() {
    this.isVisible = false;
    this.selectedIds = [];
    this.changeDistributionWarehouse = '';
  }

  printItem = {
    ids: [],
    isDownloading: false,
  }
  print() {
    const ids = this.getGridSelectionKeysByFilter('id', (item)=>item.printed !== 1);
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } 
    this.printItem.ids = ids;
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要打印吗？'),
      nzOnOk: () => {
        this.queryService.pageDownload(this.printItem);
      },
    });
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

  expColumnsOptions: any[] = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'state', options: this.detailedStateOptions },
    { field: 'printed', options: this.YesNoOptions },
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
}
