import { Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { SalesCurContractQueryService } from './query.service';
import { AddContractComponent } from '../sales-dist-detailed/add-contract/add-contract.component';
import { Router } from '@angular/router';
import { PlanscheduleHWContractService } from 'app/aps/planschedule/contract-hw/query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  selector: 'sales-cur-contract',
  templateUrl: './sales-cur-contract.component.html',
  providers: [SalesCurContractQueryService, PlanscheduleHWContractService],
})
export class SalesCurContractComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public appTranslationService: AppTranslationService,
    public appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public modal: ModalHelper,
    public queryService: SalesCurContractQueryService,
    public contractService: PlanscheduleHWContractService,
    public router: Router,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }
  contractStateOptions: any[] = [];
  contractTypeOptions: any[] = [];

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.queryUrl,
    method: 'GET',
  };

  // 表格列配置
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
      field: 'contractCode',
      width: 120,
      headerName: '合同编码'
    },
    {
      field: 'contractState',
      width: 120,
      headerName: '合同状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'contractType',
      width: 120,
      headerName: '合同类型',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'affiliatedContract',
      width: 120,
      headerName: '所属合同'
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '供方'
    },
    {
      field: 'signingDate',
      width: 120,
      headerName: '签订日期'
    },
    {
      field: 'affiliatedMonth',
      width: 120,
      headerName: '合同所属月份'
    },
    {
      field: 'deliveryPlace',
      width: 120,
      headerName: '交货地点'
    },
    {
      field: 'cusContractCode',
      width: 120,
      headerName: '客户合同号'
    },
    {
      field: 'signPlace',
      width: 120,
      headerName: '签订地点'
    },
    {
      field: 'amountWithoutTax',
      width: 120,
      headerName: '未税金额货款'
    },
    {
      field: 'taxAmount',
      width: 120,
      headerName: '税额'
    },
    {
      field: 'money',
      width: 120,
      headerName: '含税金额汇总'
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量汇总'
    },
    {
      field: 'weight',
      width: 120,
      headerName: '重量汇总'
    },
    {
      field: 'reason',
      width: 120,
      headerName: '驳回原因'
    },
    {
      field: 'deliveryDate',
      width: 120,
      headerName: '交货日期'
    },
    {
      field: 'priceTime',
      width: 120,
      headerName: '计价日期'
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
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.contractStateOptions;
        break;
      case 2:
        options = this.contractTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  plantOptions: any[] = [];
  // 查询条件配置
  queryParams = {
    defines: [
      { field: 'plantCode', title: '供方', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'contractCode', title: '合同编号', ui: { type: UiType.text } },
      { field: 'contractState', title: '合同状态', ui: { type: UiType.select, options: this.contractStateOptions } },
      { field: 'contractType', title: '合同类型', ui: { type: UiType.select, options: this.contractTypeOptions } }, 
      { field: 'affiliatedContract', title: '所属合同', ui: { type: UiType.text, } }, 
      { field: 'cusAbbreviation', title: '客户简称', ui: { type: UiType.text, } }, 
      { field: 'signingDate', title: '签订日期', ui: { type: UiType.date, } },
      { field: 'affiliatedMonth', title: '合同所属月份', ui: { type: UiType.monthPicker, } },
    ],
    values: {
      contractCode: '',
      affiliatedContract: '',
      contractState: null,
      contractType: null,
      cusAbbreviation: '',
      signingDate: '',
      affiliatedMonth: '',
      plantCode: this.appConfigService.getActivePlantCode(),
    }
  };

  // 获取查询条件
  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    params.signingDate = this.queryService.formatDate(params.signingDate);
    params.affiliatedMonth = this.queryService.formatDateTime2(params.affiliatedMonth, 'yyyy-MM');
    if (isExport) {
      params.isExport = true;
    } else {
      params.isExport = false;
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  // 初始化生命周期
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    this.query();
  }

  // 查询搜索条件
  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STATE': this.contractStateOptions,
      'PS_CONTRACT_TYPE': this.contractTypeOptions,
    });
    await this.plantOptions.push(...await this.queryService.getUserPlants());
  });

  query() {
    super.query();
    this.queryCommon();
  }

  // 查询方法
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParams(),
      this.context,
    );
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      contractCode: '',
      affiliatedContract: '',
      contractState: null,
      contractType: null,
      cusAbbreviation: '',
      signingDate: '',
      affiliatedMonth: '',
      plantCode: this.appConfigService.getActivePlantCode(),
    };
  }

  add(dataItem) {
    this.modal.static(
      AddContractComponent,
      {i: dataItem}
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  remove(dataItem) {
    const ids = dataItem === undefined ? this.getGridSelectionKeysByFilter('id', item => ['10','40'].includes(item.contractState)) : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选符合条件的数据'));
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
    })
  }

  cancel(dataItem) {
    this.queryService.goToIdeCurContractFlow(
      dataItem.id,
      {
        contractCode: dataItem.contractCode,
        businessType: 'cancel'
      }
    )
  }

  // 单元格双击
  onCellDoubleClicked(event) {
    if(event.colDef.field === 'contractCode') {
      // 跳转明细页
      localStorage.setItem('SALES_CUR_CONTRACT_CODE', event.data.contractCode);
      this.router.navigateByUrl(`/sale/salesCurContractDetail`);
    }
  }
  
  download(dataItem) {
    this.contractService.pageDownload('down', dataItem, this.queryService.downloadUrl);
  }

  preview(dataItem) {
    this.contractService.pageDownload('pre', dataItem, this.queryService.downloadUrl);
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

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'contractState', options: this.contractStateOptions },
    { field: 'contractType', options: this.contractTypeOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.exportAction(
      this.httpAction,
      params,
      this.excelexport,
      this.context
    );
  }
}