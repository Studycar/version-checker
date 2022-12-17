/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:15
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 11:18:20
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from './queryService';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { OperationManageService } from '../../../modules/generated_module/services/operation-manage-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { ProcessScheduleOperationmanageEditComponent } from './edit/edit.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'process-schedule-operationmanage',
  templateUrl: './operationmanage.component.html',
  providers: [QueryService]
})
export class ProcessScheduleOperationmanageComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  YesOrNo: any[] = [];
  context = this;
  plantoptions: any[] = [];

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions } },
      { field: 'processCode', title: '工序编码', ui: { type: UiType.text } },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.YesOrNo } }
    ],
    values: {
      plantCode: this.appService.getPlantCode(),
      processCode: '',
      enableFlag: null
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
        customTemplate: null,       // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'processCode', headerName: '工序编码', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'description', headerName: '描述', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'limitFlag', headerName: '是否瓶颈', menuTabs: ['filterMenuTab', 'columnsMenuTab'] }
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: true },
    { field: 'processCode', title: '工序编码', width: 200, locked: true },
    { field: 'description', title: '描述', width: 200, locked: true },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: true },
    { field: 'limitFlag', title: '是否瓶颈', width: 200, locked: true }
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private queryService: QueryService,
    private dataquery: OperationManageService,
    private appService: AppConfigService,
    private commonquery: CommonQueryService,
    private msgSrv: NzMessageService,
    private apptranslate: AppTranslationService,
    private nzModalS: NzModalService,
    private translateservice: AppTranslationService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.LoadData();
    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appService.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
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
    this.setGridWidth('operationmanage');
  }

  add(item?: any) {

    this.modal
      .static(
        ProcessScheduleOperationmanageEditComponent,
        {
          i: { id: (item !== undefined ? item.id : null) }
        },
        'lg'
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  copy(item?: any) {
    this.modal
      .static(
        ProcessScheduleOperationmanageEditComponent,
        {
          i: { id: (item !== undefined ? item.id : null), Type: 'copy' }
        },
        'lg'
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  httpAction = {
    url: this.dataquery.url1,
    method: 'GET',
    data: false
  };

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }

  LoadData() {
    this.dataquery.GetPlant().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appService.getPlantCode(),
      processCode: '',
      enableFlag: null
    };
  }

  remove(value: any) {
    this.dataquery.remove(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据');
      return;
    }
    this.nzModalS.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.dataquery.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }
  // 设置为瓶颈工序
  limitSetting() {
    if (this.selectionKeys.length !== 1) {
      this.msgSrv.warning('请选择一个工序作为瓶颈工序！');
      return;
    }
    this.nzModalS.confirm({
      nzContent: this.translateservice.translate('确定要设置为瓶颈工序吗？'),
      nzOnOk: () => {
        this.dataquery.SetLimitById(this.selectionKeys[0]).subscribe(res => {
          this.msgSrv.success('操作成功');
          this.query();
        });
      },
    });
  }
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {

    //this.queryService.exportAction(this.httpExportAction, this.GetQueryParams(), this.excelexport, this.context);
    this.queryService.exportAction(this.httpAction, this.queryParams.values, this.excelexport, this.context);
  }
  // import { QueryService } from './query.service';
  // public commonQueryService: QueryService,
  /**导出 */
  // @ViewChild('excelexport', { static: true })excelexport: CustomExcelExportComponent;
  // public export() {
  //   // this.loadOptions();
  //   super.export();
  //   this.commonQueryService.exportAction(
  //     { url: this.plantmaintainService.exportUrl, method: 'POST' },
  //     this.queryParams.values,
  //     this.excelexport,
  //     this.context,
  //   );
  // }


  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

}
