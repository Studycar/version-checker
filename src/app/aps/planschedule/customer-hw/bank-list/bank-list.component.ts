import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { IdeSubmitService } from 'app/modules/base_module/services/ide-submit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomerBankListEditComponent } from './edit/edit.component';
import { BankListQueryService } from './query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cutomer-bank-list',
  templateUrl: './bank-list.component.html',
  providers: [BankListQueryService]
})
export class CustomerBankListComponent extends CustomBaseContext implements OnInit {

  customer: any = {};
  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: BankListQueryService,
    private ideSubmitService: IdeSubmitService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }
  isChanging: boolean = false; // 是否操作变更
  isChanged: boolean = false; // 判断数据是否已修改
  gridDataClone: any[] = []; // 

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
      field: 'taxNum',
      width: 120,
      headerName: '统一社会信用代码（税号）',
    },
    {
      field: 'accountNum',
      width: 120,
      headerName: '银行账号',
    },
    {
      field: 'accountName',
      width: 120,
      headerName: '账号名称',
    },
    {
      field: 'branch',
      width: 120,
      headerName: '开户银行',
    },
    {
      field: 'bankArchives',
      width: 120,
      headerName: '银行档案',
    },
    {
      field: 'branchId',
      width: 130,
      headerName: '联行号',
    },
    {
      field: 'branchIdSec',
      width: 120,
      headerName: '联行号II（中银专用）',
    },
    {
      field: 'province',
      width: 120,
      headerName: '省/自治区',
    },
    {
      field: 'city',
      width: 120,
      headerName: '市/县',
    },
    {
      field: 'cbbDepId',
      width: 120,
      headerName: '机构号',
    },
    {
      field: 'defaultFlag',
      width: 120,
      headerName: '默认银行',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建日期',
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人',
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新日期',
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人',
    },
  ];

  yesOrNoOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNoOptions;
        break;
    }
    const option = options.find(x => x.value === value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'taxNum', title: '统一社会信用代码（税号）', ui: { type: UiType.text } },
    ],
    values: {
      taxNum: this.customer.taxNum
    }
  };

  clear() {
    this.queryParams.values = {
      taxNum: this.customer.taxNum
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
      'PS_YES_NOT': this.yesOrNoOptions,
    });
  }

  query() {
    super.query();
    this.isChanged = false;
    this.isChanging = false;
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  loadGridDataCallback = (res) => {
    this.gridDataClone = [...this.gridData];
  }

  getQueryParamsValue(isExport = false) {
    const params: any = { ...this.queryParams.values };
    params.taxNum = this.customer.taxNum;
    params.isExport = isExport;
    params.pageIndex = this._pageNo;
    params.pageSize = this._pageSize;
    return params;
  }

  change() {
    this.isChanging = true;
  }

  cancel() {
    // 取消操作，重新获取银行数据
    this.query();
    this.isChanging = false;
  }

  applyAudit() {
    this.ideSubmitService.navigate('ideCustomerBanksChange', {
      formData: {
        cusCode: this.customer.cusCode,
        cusName: this.customer.cusName,
        cusAbbreviation: this.customer.cusAbbreviation,
        taxNum: this.customer.taxNum,
        formCode: 'CUS_BANK_CHANGE',
        body: this.gridData
      },
    });
  }

  checkIsChanged() {
    // 删除时需要判断表格数据是否跟原表格数据一致
    if(JSON.stringify(this.gridData) !== JSON.stringify(this.gridDataClone)) {
      this.isChanged = true;
    } else {
      this.isChanged = false;
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      CustomerBankListEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem,
        isChanging: this.isChanging,
        customer: this.customer
      }
    ).subscribe((value) => {
      if (value) {
        if(!this.isChanging) {
          // 非变更修改数据，需要重新获取数据
          this.query();
        } else {
          // 变更时修改数据，需要修改表格数据
          if(value.id) {
            // 编辑数据，需要判断是否与原数据相同，不相同则更新数据
            if(JSON.stringify(value) !== JSON.stringify(dataItem)) {
              this.gridApi.forEachLeafNode(node => {
                if(node.data.id === value.id) {
                  node.setData(value);
                  this.isChanged = true;
                }
              });
            }
          } else {
            // 新增数据，直接修改表格数据
            this.gridData.push(value);
            this.isChanged = true;
            this.gridApi.setRowData(this.gridData);
          }
        }
      }
    })
  }

  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeysByFilter('id', (item) => item.defaultFlag === '0') : [dataItem.id];
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选非默认的银行数据'));
      return;
    } else {
      // 弹出确认框
      if (!this.isChanging) {
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
      } else {
        setTimeout(() => {
          this.gridData = this.gridData.filter(d => !ids.includes(d.id));
          this.gridApi.setRowData(this.gridData);
          this.checkIsChanged();
        }, 0);
      }
    }
  }

  delete(ids) {
    this.queryService.delete(ids).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  setDefault(dataItem) {
    if (!this.isChanging) {
      this.queryService.setAsDefault(dataItem.id).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.queryCommon();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    } else {
      this.gridApi.forEachLeafNode(node => {
        const data = node.data;
        if(node.data.id === dataItem.id) {
          data.defaultFlag = '1';
          this.isChanged = true;
        } else {
          data.defaultFlag = '0';
        }
        node.setData(data);
      })
    }
  }

  expColumnsOptions: any[] = [
    { field: 'defaultFlag', options: this.yesOrNoOptions },
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
