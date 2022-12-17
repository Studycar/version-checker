import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { CustomerComplaintQueryService } from "../query.service";
import { CustomerComplaintDetailEditComponent } from "./edit/edit.component";
import { CustomerComplaintDetailRectifyComponent } from "./rectify/rectify.component";
import { CustomerComplaintDetailAnnexComponent } from "./fileList/fileList.component";
import { PlanscheduleHWChangeDetailComponent } from 'app/modules/base_module/components/change-detail/change-detail.component';

@Component({
  selector: 'customer-complaint-detail',
  templateUrl: './detail.component.html',
  providers: [CustomerComplaintQueryService]
})
export class CustomerComplaintDetailComponent extends CustomBaseContext implements OnInit {
  isResolve: boolean = false;
  complaintItem: any = {};
  cusCode: string = '';
  plantCode: string = '';

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerComplaintQueryService,
    public ideSubmitService: IdeSubmitService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 120,
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
      headerName: '客诉申请单号'
    },
    {
      field: 'pono',
      width: 120,
      headerName: '客诉申请单行号'
    },
    {
      field: 'state',
      width: 120,
      headerName: '客诉申请单行状态',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '选择处理公司',
    },
    {
      field: 'batchNum',
      width: 120,
      headerName: '钢卷号',
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
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'gjlx',
      width: 120,
      headerName: '钢卷状态',
    },
    {
      field: 'gjszd',
      width: 120,
      headerName: '钢卷所在地',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'weigthKg',
      width: 120,
      headerName: '净重',
    },
    {
      field: 'blp',
      width: 120,
      headerName: '不良量',
    },
    {
      field: 'qxms',
      width: 120,
      headerName: '缺陷描述',
    },
    {
      field: 'qhsq',
      width: 120,
      headerName: '客户诉求',
    },
    {
      field: 'cailiaoType',
      width: 120,
      headerName: '材料类型',
      valueFormatter: 'ctx.optionsFind(value,8).label'
    },
    {
      field: 'clxxfk',
      width: 120,
      headerName: '处理信息反馈',
    },
    {
      field: 'thType',
      width: 120,
      headerName: '退换货类型',
      valueFormatter: 'ctx.optionsFind(value,7).label'
    },
    {
      field: 'dgpf',
      width: 120,
      headerName: '吨钢赔付（元/吨）',
    },
    {
      field: 'azpf',
      width: 120,
      headerName: '按张赔付（元/张）',
    },
    {
      field: 'blpKg',
      width: 120,
      headerName: '不良重量/吨',
    },
    {
      field: 'pfje',
      width: 120,
      headerName: '赔偿金额',
    },
    {
      field: 'currency',
      width: 120,
      headerName: '币种',
      valueFormatter: 'ctx.optionsFind(value,9).label'
    },
    {
      field: 'payAccountNo',
      width: 120,
      headerName: '付款账号',
    },
    {
      field: 'payType',
      width: 120,
      headerName: '付款方式',
      valueFormatter: 'ctx.optionsFind(value,10).label'
    },
    {
      field: 'urgent',
      width: 120,
      headerName: '是否加急',
      valueFormatter: 'ctx.optionsFind(value,11).label'
    },
    {
      field: 'pfmssm',
      width: 120,
      headerName: '赔付描述说明',
    },
    {
      field: 'cwpf',
      width: 120,
      headerName: '财务赔付状态',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'jszg',
      width: 120,
      headerName: '技术整改状态',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'userResponsility',
      width: 120,
      headerName: '整改责任人'
    },
    {
      field: 'planDate',
      width: 120,
      headerName: '期望完成时间'
    },
    {
      field: 'correctiveType',
      width: 120,
      headerName: '投诉问题类型'
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
  plantOptions: any[] = [];
  gjszdOptions: any[] = [];
  cwpfOptions: any[] = [];
  thTypeOptions: any[] = [];
  stateOptions: any[] = [];
  cailiaoTypeOptions: any[] = [];
  currencyOptions = [];
  payTypeOptions = [];
  yesNoOptions = [];
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
        options = this.gjszdOptions;
        break;
      case 4:
        options = this.stateOptions;
        break;
      case 5:
        options = this.cwpfOptions;
        break;
      case 7:
        options = this.thTypeOptions;
        break;
      case 8:
        options = this.cailiaoTypeOptions;
        break;
      case 9:
        options = this.currencyOptions;
        break;
      case 10:
        options = this.payTypeOptions;
        break;
      case 11:
        options = this.yesNoOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  orno: string = '';

  queryParams = {
    defines: [
      { field: 'plantCode', title: '选择处理公司', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'orno', title: '客诉申请单号', ui: { type: UiType.text } },
      { field: 'cusCode', title: '客户名称', ui: { type: UiType.text } },
      { field: 'state', title: '客诉申请单行状态', ui: { type: UiType.select, options: this.stateOptions } },
      { field: 'batchNum', title: '钢卷号', ui: { type: UiType.text } },
      { field: 'dlslxr', title: '代理商联系人', ui: { type: UiType.text } },
      { field: 'ksdt', title: '客诉日期', ui: { type: UiType.date } },
    ],
    values: {
      orno: '',
      cusCode: '',
      plantCode: this.appconfig.getActivePlantCode(),
      state: null,
      batchNum: '',
      dlslxr: '',
      ksdt: '',
    }
  };

  clear() {
    this.queryParams.values = {
      orno: this.orno,
      cusCode: '',
      plantCode: this.appconfig.getActivePlantCode(),
      state: null,
      batchNum: '',
      dlslxr: '',
      ksdt: '',
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
      'PS_GJSZD': this.gjszdOptions,
      'PS_KSCLZT_DETAILED': this.stateOptions,
      'CWPF_STATE': this.cwpfOptions,
      'TH_TYPE': this.thTypeOptions,
      'CAILIAO_TYPE': this.cailiaoTypeOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_PAY_TYPE': this.payTypeOptions,
      'PS_YES_NOT': this.yesNoOptions,
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
    const fields = ['weigthKg', 'blp', 'pfje'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  getQueryParamsValue(isExport=false) {
    return {
      orno: this.queryParams.values.orno,
      ksdt: this.queryService.formatDate(this.queryParams.values.ksdt),
      plantCode: this.queryParams.values.plantCode,
      state: this.queryParams.values.state,
      batchNum: this.queryParams.values.batchNum,
      cusCode: this.queryParams.values.cusCode,
      dlslxr: this.queryParams.values.dlslxr,
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      CustomerComplaintDetailEditComponent,
      {
        i: dataItem === undefined ? { id: null, orno: this.orno } : dataItem,
        isResolve: this.isResolve,
        cusCode: this.complaintItem.cusCode,
        plantCode: this.complaintItem.plantCode,
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
   * 同意审批
   */
  agree(dataItem) {
    if(!dataItem.thType) {
      this.msgSrv.warning(this.appTranslationService.translate('请先填写退换货类型！'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要同意吗？'),
      nzOnOk: () => {
        this.queryService.agreeDetailedOne(dataItem.id).subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('提交成功'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

   /**
   * 驳回审批
   */
  reject(dataItem) {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要驳回吗？'),
      nzOnOk: () => {
        this.queryService.rejectDetailedOne(dataItem.id).subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('提交成功'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  showAnnex(dataItem) {
    this.modal.static(
      CustomerComplaintDetailAnnexComponent,
      { 
        id: dataItem.id,
        isResolve: this.isResolve, 
        state: dataItem.state,
      }
    ).subscribe((value) => {
      
    })
  }

  batchDownload(dataItem) {
    this.queryService.downloadBatch(dataItem.id).subscribe(res => {
      // this.queryService.downloadFile(res)
      console.log(res);
      const blob = new Blob([res.body]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // 再处理一下文件名乱码的问题即可
      const fileName = decodeURI(res.headers.get('content-disposition').split(';')[1].replace('filename=', ''));
      a.download = fileName;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url)
    })
  }

  submitApproval(dataItem) {
    if (!dataItem.id) {
      return this.msgSrv.error(this.appTranslationService.translate('明细 ID 为空'))
    }
    if (dataItem.pfje < 0) {
      return this.msgSrv.error(this.appTranslationService.translate('赔付金额不能为负数'))
    }
    // 默认退/换货
    let ideFlowPath = 'ideComplaintHandleReturnOrExchange'
    // 若是赔付类型
    if (dataItem.thType === '30') {
      if (!dataItem.pfje) {
        return this.msgSrv.error(this.appTranslationService.translate('赔付金额不能为 0 或空'))
      }
      ideFlowPath = dataItem.pfje > 5000 ?  'ideComplaintHandleLarge' : 'ideComplaintHandleSmall'
    }
    this.ideSubmitService.navigate(ideFlowPath, {
      getFormParams: {
        url: this.queryService.getDetailedOneUrl,
        method: 'POST',
        params: {
          id: dataItem.id,
        }
      },
      complaintItem: this.complaintItem
    })
  }

  /** 发起整改 */
  submitRectify(dataItem) {
    this.modal.static(
      CustomerComplaintDetailRectifyComponent,
      {
        i: dataItem,
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  showHistoryRecord(dataItem) {
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryDetailedHistoryUrl, method: 'POST' },
        myAgGrid: {
          myAgGridState: 'ps_complaint_detail_history',
          myAgGridRowKey: 'PS_COMPLAINT_DETAIL_HISTORY',
        },
        queryParamsValue: {
          orno: dataItem.orno,
          pono: dataItem.pono,
        },
        exportFileName: '客诉明细',
        tableColumns: [
          {
            field: 'zxdz',
            headerName: '执行动作',
            width: 100
          },
          ...this.columns.filter(col => col.colId === undefined),
        ],  
        tableExpColumnsOptions: this.expColumnsOptions,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }

  expColumnsOptions = [
    { field: 'state', options: this.stateOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'gjszd', options: this.gjszdOptions },
    { field: 'cwpf', options: this.cwpfOptions },
    { field: 'jszg', options: this.stateOptions },
    { field: 'thType', options: this.thTypeOptions },
    { field: 'cailiaoType', options: this.cailiaoTypeOptions },
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
