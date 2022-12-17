import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { TransferOrderEditComponent } from "../edit/edit.component";
import { TransferOrderQueryService } from "../query.service";
import { TransferOrderDetailEditComponent } from "./edit/edit.component";


@Component({
  selector: 'transfer-order-detail',
  templateUrl: './detail.component.html',
  providers: [TransferOrderQueryService]
})
export class TransferOrderDetailComponent extends CustomBaseContext implements OnInit {

  transferOrderCode: string = '';
  allocationDate: string = '';
  outCode: string = '';
  plantCode: string = '';
  isMenu: Boolean = true;

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: TransferOrderQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
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
      field: 'code',
      width: 120,
      headerName: '调拨单号'
    },
    {
      field: 'pono',
      width: 120,
      headerName: '调拨单行号'
    },
    {
      field: 'state',
      width: 120,
      headerName: '调拨单行状态',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'batchNum',
      width: 120,
      headerName: '批号',
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量',
    },
    {
      field: 'taxPrice',
      width: 120,
      headerName: '单价',
    },
    {
      field: 'money',
      width: 120,
      headerName: '金额',
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
      field: 'unit',
      width: 120,
      headerName: '数量单位',
    },
    {
      field: 'steelStandart',
      width: 120,
      headerName: '规格尺寸'
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'thickness',
      width: 120,
      headerName: '实厚'
    },
    {
      field: 'cwar',
      width: 120,
      headerName: '库位编码'
    },
    {
      field: 'weigth',
      width: 120,
      headerName: '实宽'
    },
    {
      field: 'grossWeight',
      width: 120,
      headerName: '毛重'
    },
    // {
    //   field: 'length',
    //   width: 120,
    //   headerName: '长度'
    // },
    {
      field: 'qualityInformation',
      width: 120,
      headerName: '品质信息'
    },
    {
      field: 'coating',
      width: 120,
      headerName: '表面保护',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'batchNumRemarks',
      width: 120,
      headerName: '批号备注'
    },
    {
      field: 'haulWay',
      width: 120,
      headerName: '运输路线'
    },
    {
      field: 'contractCode',
      width: 120,
      headerName: '合同号'
    },
    {
      field: 'transportationEnterpriseCode',
      width: 120,
      headerName: '仓库编码'
    },
    {
      field: 'transportationEnterprise',
      width: 120,
      headerName: '目的地'
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
    {
      field: 'theoreticalWeight',
      width: 120,
      headerName: '理重'
    },
    {
      field: 'weight',
      width: 120,
      headerName: '净重'
    },
    {
      field: 'unitOfWeight',
      width: 120,
      headerName: '重量单位'
    },
    {
      field: 'unitCodeWeight',
      width: 120,
      headerName: '重量单位编码'
    },
  ];
  steelTypeOptions: any[] = [];
  surfaceOptions: any[] = [];
  gradeOptions: any[] = [];
  detailedStateOptions: any[] = [];
  coatingOptions: any[] = [];
  plantOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.steelTypeOptions;
        break;
      case 2:
        options = this.surfaceOptions;
        break;
      case 3:
        options = this.gradeOptions;
        break;
      case 4:
        options = this.detailedStateOptions;
        break;
      case 5:
        options = this.coatingOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'code', title: '调拨单号', ui: { type: UiType.text } },
      { field: 'pono', title: '调拨单行号', ui: { type: UiType.text } },
      { field: 'batchNum', title: '批号', ui: { type: UiType.text } },
      { field: 'stockCode', title: '存货编码', ui: { type: UiType.text } },
      { field: 'state', title: '调拨单行状态', ui: { type: UiType.select, options: this.detailedStateOptions } },
      { field: 'steelGrade', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'transportationEnterprise', title: '目的地', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      code: '',
      pono: '',
      batchNum: '',
      stockCode: '',
      state: null,
      steelGrade: null,
      transportationEnterprise: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      code: this.transferOrderCode,
      pono: '',
      batchNum: '',
      stockCode: '',
      state: null,
      steelGrade: null,
      transportationEnterprise: '',
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
    const totalField = 'code';
    // 需要统计的列数组
    const fields = ['theoreticalWeight', 'weight', 'quantity'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    if(this.transferOrderCode) {
      this.isMenu = false;
      this.queryParams.values.code = this.transferOrderCode;
    } 
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_GRADE': this.gradeOptions,
      'PS_ALLOT_DETAILED_STATE': this.detailedStateOptions,
      'PS_COATING': this.coatingOptions,
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
      pageSize: this._pageSize
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      TransferOrderDetailEditComponent,
      {
        i: dataItem === undefined ? { 
          id: null, 
          code: this.transferOrderCode,
        } : dataItem,
        transferOrderCode: this.transferOrderCode,
        allocationDate: this.allocationDate,
        outCode: this.outCode,
        plantCode: this.plantCode,
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
          myAgGridState: 'ps_transfer_order_detailed_history',
          myAgGridRowKey: 'PS_TRANSFER_ORDER_DETAILED_HISTORY',
        },
        queryParamsValue: {
          pono: dataItem.pono,
        },
        exportFileName: '调拨单明细',
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
  
  expColumnsOptions: any[] = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'grade', options: this.gradeOptions },
    { field: 'coating', options: this.coatingOptions },
    { field: 'state', options: this.detailedStateOptions },
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
