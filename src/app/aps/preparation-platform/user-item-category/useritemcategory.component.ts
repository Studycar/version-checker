/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:14
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 10:35:58
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
// import { QueryService } from './queryservice';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { map } from 'rxjs/operators';
import { process, State } from '@progress/kendo-data-query';
import { UserItemCategoryService } from '../../../modules/generated_module/services/user-itemcategory-service';
import { PreparationPlatformUserItemCategoryEditComponent } from './edit/edit.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-useritemcategory',
  templateUrl: './useritemcategory.component.html',
  // providers: [QueryService]
})
export class PreparationPlatformUseritemcategoryComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    // private queryservice: QueryService,
    private querydata: UserItemCategoryService,
    private msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
    private appConfigService: AppConfigService,
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  useroptions: any[] = [];
  plantoptions: any[] = [];
  whetherOptions: any[] = [];

  httpAction = {
    url: this.querydata.url,
    method: 'GET',
    data: false
  };
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsItems: any[] = [
    {
      field: 'categoryCode',
      title: '类别编码',
      width: '100'
    },
    {
      field: 'categoryDesc',
      title: '类别名称',
      width: '100'
    }
  ];
  public queryParams = {
    defines: [
      { field: 'txtPlantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantoptions } },
      { field: 'txtUser', title: '用户', ui: { type: UiType.select, options: this.useroptions } },
      { field: 'txtcategory', title: '物料类别', ui: { type: UiType.popupSelect, valueField: 'categoryCode', textField: 'categoryCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 1 } }
    ],
    values: {
      txtPlantCode: this.appConfigService.getPlantCode(),
      txtUser: '',
      txtcategory: { value: '', text: '' }
    }
  };

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
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'employeeNumber', headerName: '用户名', menuTabs: ['filterMenuTab'] },
    { field: 'fullName', headerName: '人员名称', menuTabs: ['filterMenuTab'] },
    { field: 'categoryCode', headerName: '物料类别', menuTabs: ['filterMenuTab'] },
    { field: 'categoryDesc', headerName: '类别描述', menuTabs: ['filterMenuTab'] },
    {
      field: 'enableFlag',
      headerName: '是否有效',
      menuTabs: ['filterMenuTab'],
      valueFormatter: function(params) {
        return params.value === 'Y' ? '是' : '否';
      }
    }
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: true },
    { field: 'employeeNumber', title: '人员编码', width: 200, locked: true },
    { field: 'fullName', title: '人员名称', width: 200, locked: true },
    { field: 'categoryCode', title: '物料类别', width: 200, locked: true },
    { field: 'categoryDesc', title: '类别描述', width: 200, locked: true },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: true }
  ];
  expColumnsOptions = [
    { field: 'enableFlag', options: this.whetherOptions }
  ];
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    /*this.viewAsync = this.queryservice.pipe(
      map(data => process(data, this.gridState))
    );*/
    this.querydata.GetEmploy().subscribe(res => {
      res.data.content.forEach(element => {
        this.useroptions.push({
          label: element.userName,
          value: element.userName
        });
      });
    });

    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(item => {
        this.whetherOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });

    this.query();
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('pcbuyer');
  }

  add(item?: any) {
    this.modal
      .static(
      PreparationPlatformUserItemCategoryEditComponent,
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

  GetQueryParams(isExport: boolean = false) {
    return {
      plantCode: this.queryParams.values.txtPlantCode ? this.queryParams.values.txtPlantCode : this.appConfigService.getPlantCode(),
      user: this.queryParams.values.txtUser,
      categoryCode: this.queryParams.values.txtcategory.text,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
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
      txtPlantCode: this.appConfigService.getPlantCode(),
      txtUser: null,
      txtcategory: { value: '', text: '' }
    };
    this.gridViewItems.data = [];
    this.gridViewItems.total = 0;
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.delete(this.selectionKeys).subscribe(res => {
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
    this.querydata.delete([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.apptranslate.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.apptranslate.translate(res.msg));
      }
    });
  }

  public loadItems(PLANT_CODE: string, CATEGORY_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.querydata.GetUserPlantCategoryPageList(PLANT_CODE || '', CATEGORY_CODE || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.txtPlantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonquery.export(this.httpAction, this.GetQueryParams(true), this.excelexport, this);
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }

  // 页码切换
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
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

}
