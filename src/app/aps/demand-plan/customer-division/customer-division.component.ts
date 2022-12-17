/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-08-31 15:43:39
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-05 15:28:20
 * @Note: ...
 */
import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { QueryService } from './queryService';
import { CustomerDivisionService } from 'app/modules/generated_module/services/customer-division-service';
import { DemandPlanCustomerDivisionEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-plan-customer-division',
  templateUrl: './customer-division.component.html',
  providers: [QueryService]
})
export class DemandPlanCustomerDivisionComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: CustomerDivisionService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
    private injector: Injector) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig});
    this.headerNameTranslate(this.columns);
  }

  versionOptions: any[] = [];
  context = this;
  nameOptions: any[] = [];
  pNameOptions: any[] = [];
  yesOrNo: any[] = [];
  /**事业部集合 */
  scheduleregions: any[] = [];
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
  }

  LoadData() {

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.yesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('DP_CUSTOMER_DIVISION', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.nameOptions.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
        this.pNameOptions.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });

    // this.querydata.getUserGroup().subscribe(res => {
    //   res.Extra.forEach(element => {
    //     this.groupOptions.push({
    //       label: element.USER_GROUP,
    //       value: element.USER_GROUP
    //     });
    //   });
    // });

    this.scheduleregions.length = 0;
    /**加载所有事业部 */
    this.commonquery.GetAllScheduleRegion().subscribe(result => {
      result.data.forEach(d => {
        this.scheduleregions.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });

  }

  httpAction = {
    url: this.querydata.seachUrl,
    method: 'POST',
    data: false
  };


  public queryParams = {
    defines: [
      {
        field: 'scheduleRegionCode',
        title: '事业部',
        ui: {
          type: UiType.select,
          options: this.scheduleregions,
        },
        required: true,
      },
      { field: 'custDivisionName', title: '维度名称', ui: { type: UiType.text } },
      { field: 'custDivisionValue', title: '维度值', ui: { type: UiType.text } },
      { field: 'custDivisionType', title: '维度类型', ui: { type: UiType.select, options: this.nameOptions } },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.yesOrNo } },
    ],
    values: {
      scheduleRegionCode: this.appconfig.getActiveScheduleRegionCode(),
      custDivisionName: '',
      custDivisionValue: '',
      custDivisionType: null,
      enableFlag: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.GetQueryParams(false), this.context);
  }

  GetQueryParams(exp:boolean) {
    return {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      custDivisionName: this.queryParams.values.custDivisionName,
      custDivisionValue: this.queryParams.values.custDivisionValue,
      custDivisionType: this.queryParams.values.custDivisionType,
      enableFlag: this.queryParams.values.enableFlag,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      export:exp
    };
  }

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'businessUnitCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'custDivisionName', headerName: '维度名称', menuTabs: ['filterMenuTab'] },
    { field: 'custDivisionValue', headerName: '维度值', menuTabs: ['filterMenuTab'] },
    { 
      field: 'custDivisionType', 
      headerName: '维度类型', 
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'] 
    },
    {
      field: 'parentCustDivisionType', 
      headerName: '父层类型', 
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
      cellClass: [...this.defaultColDef.cellClass, 'agGridCellNoField']
    },
    {
      field: 'parentCustDivisionName', headerName: '父层值', menuTabs: ['filterMenuTab'],
      cellClass: [...this.defaultColDef.cellClass, 'agGridCellNoField']
    },
    { 
      field: 'enableFlag', 
      headerName: '是否有效', 
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'] }
  ];

  expColumns = [
    { field: 'businessUnitCode', title: '事业部', width: 200, locked: false },
    { field: 'custDivisionName', title: '维度名称', width: 200, locked: false },
    { field: 'custDivisionValue', title: '维度值', width: 200, locked: false },
    { field: 'custDivisionType', title: '维度类型', width: 200, locked: false },
    { field: 'parentCustDivisionType', title: '父层类型', width: 200, locked: false },
    { field: 'parentCustDivisionName', title: '父层值', width: 200, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: false }
  ];
  expColumnsOptions: any[] = [
    { field: 'custDivisionType', options: this.nameOptions },
    { field: 'parentCustDivisionType', options: this.pNameOptions },
    { field: 'enableFlag', options: this.yesOrNo },
  ];

  //网格列的select的option设置
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.nameOptions;
        break;
      case 2:
        options = this.yesOrNo;
        break;
      case 3:
        options = this.pNameOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  clear() {
    this.queryParams.values = {
      scheduleRegionCode: this.appconfig.getActiveScheduleRegionCode(),
      custDivisionName: null,
      custDivisionValue: null,
      custDivisionType: null,
      enableFlag: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  add(item?: any) {
    this.modal
      .static(
        DemandPlanCustomerDivisionEditComponent,
        {
          i: { id: (item !== undefined ? item.id : null), scheduleregions: this.scheduleregions }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  remove(value: any) {
    this.querydata.Remove(value).subscribe(res => {
      if (res.code==200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.RemoveBath(this.selectionKeys).subscribe(res => {
          if (res.code==200) {
            this.msgSrv.success('删除成功');
            this.query();
          } else {
            this.msgSrv.error(res.msg);
          }
        });
      },
    });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryService.exportAction(this.httpAction, this.GetQueryParams(true), this.excelexport, this);
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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
      this.query();
    } else {
      this.setLoading(false);
    }
  }
  
}
