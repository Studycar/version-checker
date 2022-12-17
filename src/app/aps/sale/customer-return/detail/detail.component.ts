import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { PlanscheduleHWChangeDetailComponent } from 'app/modules/base_module/components/change-detail/change-detail.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomerReturnQueryService } from '../query.service';
import { CustomerReturnDetailEditComponent } from './edit/edit.component';

@Component({
  selector: 'customer-return-detail',
  templateUrl: './detail.component.html',
  providers: [CustomerReturnQueryService]
})
export class CustomerReturnDetailComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerReturnQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  plantCode: string = '';

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
      field: 'orno',
      width: 120,
      headerName: '退货单号'
    },
    {
      field: 'pono',
      width: 120,
      headerName: '退货单行号'
    },
    {
      field: 'state',
      width: 120,
      headerName: '退货单行状态',
      valueFormatter: 'ctx.optionsFind(value,6).label'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'batchNum',
      width: 120,
      headerName: '钢卷号/批号',
    },
    {
      field: 'ksorno',
      width: 120,
      headerName: '客诉单号'
    },
    {
      field: 'kspono',
      width: 120,
      headerName: '客诉单明细行号'
    },
    {
      field: 'thType',
      width: 120,
      headerName: '退换货类型',
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
    {
      field: 'salesOrderType',
      width: 120,
      headerName: '销售类型',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'salesOrderCode',
      width: 120,
      headerName: '销售订单号',
    },
    {
      field: 'salesOrderNum',
      width: 120,
      headerName: '销售订单行',
    },
    {
      field: 'businessType',
      width: 120,
      headerName: '业务类型',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'department',
      width: 120,
      headerName: '销售部门',
    },
    {
      field: 'contractCode',
      width: 120,
      headerName: '合同号',
    },
    {
      field: 'salesman',
      width: 120,
      headerName: '业务员',
    },
    {
      field: 'stockCode',
      width: 120,
      headerName: '存货编码',
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '存货名称',
    },
    {
      field: 'steelStandart',
      width: 120,
      headerName: '规格尺寸',
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'unit',
      width: 120,
      headerName: '单位',
      valueFormatter: 'ctx.optionsFind(value,8).label'
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量',
    },
    {
      field: 'weight',
      width: 120,
      headerName: '重量',
    },
    {
      field: 'taxPrice',
      width: 120,
      headerName: '单价',
    },
    {
      field: 'money',
      width: 120,
      headerName: '无税金额',
    },
    {
      field: 'taxAmount',
      width: 120,
      headerName: '税额',
    },
    {
      field: 'taxPrice',
      width: 120,
      headerName: '价税合计',
    },
    {
      field: 'remarks',
      width: 120,
      headerName: '备注',
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
  surfaceOptions: any[] = [];
  salesOrderTypeOptions: any[] = [];
  detailedStateOptions: any[] = [];
  businessTypesOptions: any[] = [];
  thTypeOptions: any[] = [];
  unitOptions: any[] = [];
  gradeOptions: any[] = [];
  plantOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesOrderTypeOptions;
        break;
      case 2:
        options = this.businessTypesOptions;
        break;
      case 3:
        options = this.gradeOptions;
        break;
      case 4:
        options = this.surfaceOptions;
        break;
      case 5:
        options = this.steelTypeOptions;
        break;
      case 6:
        options = this.detailedStateOptions;
        break;
      case 7:
        options = this.thTypeOptions;
        break;
      case 8:
        options = this.unitOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  orno: string = '';

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'orno', title: '退货单号', ui: { type: UiType.text } },
      { field: 'pono', title: '退货单行号', ui: { type: UiType.text } },
      { field: 'batchNum', title: '钢卷号', ui: { type: UiType.text } },
      { field: 'salesOrderType', title: '销售类型', ui: { type: UiType.select, options: this.salesOrderTypeOptions } },
      { field: 'salesOrderCode', title: '销售订单号', ui: { type: UiType.text } },
      { field: 'salesOrderNum', title: '销售订单行号', ui: { type: UiType.text } },
      { field: 'businessTypes', title: '业务类型', ui: { type: UiType.select, options: this.businessTypesOptions } },
      { field: 'department', title: '销售部门', ui: { type: UiType.text } },
      { field: 'contractCode', title: '合同号', ui: { type: UiType.text } },
      { field: 'salesman', title: '业务员', ui: { type: UiType.text } },
      { field: 'stockCode', title: '存货编码', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      orno: '',
      pono: '',
      batchNum: '',
      salesOrderType: null,
      salesOrderCode: '',
      salesOrderNum: '',
      businessTypes: null,
      department: '',
      contractCode: '',
      salesman: '',
      stockCode: '',
    }
  };

  
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
    const totalField = 'orno';
    // 需要统计的列数组
    const fields = ['quantity', 'money', 'taxAmount', 'taxPrice', 'weight'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      orno: this.orno,
      pono: '',
      batchNum: '',
      salesOrderType: null,
      salesOrderCode: '',
      salesOrderNum: '',
      businessTypes: null,
      department: '',
      contractCode: '',
      salesman: '',
      stockCode: '',
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.queryParams.values.orno = this.orno;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_SALES_ORDER_TYPE': this.salesOrderTypeOptions,
      'PS_RETURN_DETAILED_STATE': this.detailedStateOptions,
      'PS_BUSINESS_TYPES': this.businessTypesOptions,
      'PS_GRADE': this.gradeOptions,
      'TH_TYPE': this.thTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryDetailedUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values };
    return {
      ...params,
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      CustomerReturnDetailEditComponent,
      {
        i: dataItem === undefined ? { id: null, orno: this.orno } : dataItem
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
        httpAction: { url: this.queryService.queryDetailChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: 'ps_return_detailed_history',
          myAgGridRowKey: 'PS_RETURN_DETAILED_HISTORY',
        },
        queryParamsValue: {
          pono: dataItem.pono,
        },
        exportFileName: '退货单明细',
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
   * 将明细行状态修改为已审核（MES审核通过改为30已退货）
   * @param dataItem 
   */
  confirm(dataItem) {
    this.queryService.confirmDetailed(dataItem.id, '20').subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('状态更新成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  expColumnsOptions = [
    { field: 'state', options: this.detailedStateOptions },
    { field: 'thType', options: this.thTypeOptions },
    { field: 'salesOrderType', options: this.salesOrderTypeOptions },
    { field: 'businessType', options: this.businessTypesOptions },
    { field: 'grade', options: this.gradeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'unit', options: this.unitOptions },
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
