/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:14
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 10:06:12
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { PreparationPlatformPcbuyerEditComponent } from './edit/edit.component';
import { QueryService } from './queryService';
import { PcBuyerService } from '../../../modules/generated_module/services/pc-buyer-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-pcbuyer',
  templateUrl: './pcbuyer.component.html',
  // providers: [QueryService]
})
export class PreparationPlatformPcbuyerComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    // private queryservice: QueryService,
    private pcbuyerservice: PcBuyerService,
    private msgSrv: NzMessageService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  httpAction = {
    url: this.pcbuyerservice.url,
    method: 'GET',
    data: false
  };

  selectKeys = 'id';

  useroptions: any[] = [];
  // employeoptions: any[] = [];
  // kendoheight = document.body.clientHeight - 280;
  // mySelection: any[] = [];
  // context = this;
  // YesOrNo = [];

  public gridViewBuyer: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsBuyer: any[] = [
    {
      field: 'employeeNumber',
      title: '采购员编码',
      width: '100'
    },
    {
      field: 'fullName',
      title: '采购员姓名',
      width: '100'
    }
  ];

  public queryParams = {
    defines: [
      { field: 'txtUser', title: '用户', ui: { type: UiType.select, options: this.useroptions } },
      {
        field: 'txtemployee', title: '采购员姓名', ui: {
          type: UiType.popupSelect, valueField: 'employeeNumber', textField: 'fullName', gridView: this.gridViewBuyer, columns: this.columnsBuyer, eventNo: 1
        }
      }
      // { field: 'txtemployee', title: '人员姓名', ui: { type: UiType.select, options: this.employeoptions } }
    ],
    values: {
      txtUser: '',
      txtemployee: { value: '', text: '' }
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true, suppressSizeToFit: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'userName', headerName: '用户', menuTabs: ['filterMenuTab'] },
    { field: 'employeeNumber', headerName: '采购员编码', menuTabs: ['filterMenuTab'] },
    { field: 'fullName', headerName: '采购员姓名', menuTabs: ['filterMenuTab'] }
  ];

  expColumns = [
    { field: 'userName', title: '用户', width: 200, locked: true },
    { field: 'employeeNumber', title: '采购员编码', width: 200, locked: true },
    { field: 'fullName', title: '采购员姓名', width: 200, locked: true }
  ];

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('pcbuyer');
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    // console.log(key);
    // this.allColumnIds.length = 0;
    // let i = 0;
    // this.gridColumnApi.getAllColumns().forEach(x => {
    //   if()
    //   this.allColumnIds.push(x.getColId());
    // });
    // this.gridColumnApi.autoSizeColumns(this.allColumnIds);
    // this.gridApi.sizeColumnsToFit();
    // return;
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {

    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  LoadData() {
    this.pcbuyerservice.GetUser().subscribe(res => {
      res.data.content.forEach(element => {
        this.useroptions.push({
          label: element.userName,
          value: element.userName
        });
      });
    });

    /*this.pcbuyerservice.GetEmploye().subscribe(res => {
      res.Extra.forEach(element => {
        this.employeoptions.push({
          label: element.FULL_NAME,
          value: element.EMPLOYEE_NUMBER
        });
      });
    });*/

    /*this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.YesOrNo.push({
          label: element.MEANING,
          value: element.LOOKUP_CODE
        });
      });
    });*/
  }

  GetQueryParams(isExport: boolean = false) {
    return {
      user: this.queryParams.values.txtUser,
      employee: this.queryParams.values.txtemployee.text,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  add(item?: any) {
    this.modal
      .static(
      PreparationPlatformPcbuyerEditComponent,
      { i: { id: (item !== undefined ? item.id : null) } },
      'lg'
      ).subscribe(
      (value) => {
        if (value) {
          this.query();
        }
      }
      );
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonquery.loadGridViewNew(this.httpAction, this.GetQueryParams(), this);
  }

  clear() {
    this.queryParams.values = {
      txtUser: null,
      txtemployee: { value: '', text: '' }
    };
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.pcbuyerservice.RemoveBath(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.apptranslate.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.apptranslate.translate(res.msg));
          }
        });
      },
    });
  }

  remove(value: any) {
    this.pcbuyerservice.RemoveBath([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.apptranslate.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.apptranslate.translate(res.msg));
      }
    });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonquery.export(this.httpAction, this.GetQueryParams(), this.excelexport, this);
  }
  // 行选中改变
  onSelectionChanged(event) {
    console.log('this.selectKeys--->',this.selectKeys);
    console.log(event)
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }

  searchBuyer(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadBuyer(e.SearchValue, PageIndex, e.PageSize);
  }

  public loadBuyer(employee: string, PageIndex: number, PageSize: number) {
    this.pcbuyerservice.GetBuyer(employee || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewBuyer.data = res.data.content;
      this.gridViewBuyer.total = res.data.totalElements;
    });
  }

}
