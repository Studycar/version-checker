/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:15
 * @LastEditors: Zwh
 * @LastEditTime: 2019-05-05 09:17:10
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { QueryService } from './queryService';
import { OperationLeadTimeService } from '../../../modules/generated_module/services/operation-leadtime-service';
import { ProcessScheduleOperationLeadTimeEditComponent } from './edit/edit.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'process-schedule-operation-lead-time',
  templateUrl: './operation-lead-time.component.html',
  providers: [QueryService]
})
export class ProcessScheduleOperationLeadTimeComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private dataquery: OperationLeadTimeService,
    private appService: AppConfigService,
    private commonquery: CommonQueryService,
    private modalService: NzModalService,
    private translateservice: AppTranslationService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  YesOrNo: any[] = [];
  context = this;
  plantoptions: any[] = [];

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions } },
      { field: 'category', title: '类别/计划组/物料', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: this.appService.getPlantCode(),
      category: ''
    }
  };

  public columns = [
    // {
    //   colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate
    //   },
    //   cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
    //   cellRendererParams: {
    //     customTemplate: `<span title="{{ '编辑' | translate}}" (click)="ctx.add(dataItem)" class="pointer">
    //                           <i class="anticon anticon-edit"></i>
    //                       </span>
    //                       <nz-divider nzType="vertical"></nz-divider>
    //                       <span title="{{ '删除' | translate}}" nz-popconfirm nzTitle="{{ '是否确认删除该记录?' | translate}}" (nzOnConfirm)="ctx.remove(dataItem);"
    //                           class="pointer">
    //                           <i class="anticon anticon-delete"></i>
    //                       </span>`         // Complementing the Cell Renderer parameters
    //   }
    // },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'category', headerName: '类型', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'categoryValue', headerName: '类别/计划组/描述', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'upstreamProcessCode', headerName: '上游工序编码', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'downstreamProcessCode', headerName: '下游工序编码', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'relationType', headerName: '工序相关性', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'leadTime', headerName: '提前小时', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { fiedl: 'usage', headerName: '单位用量', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', menuTabs: ['filterMenuTab', 'columnsMenuTab'] }
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: true },
    { field: 'category', title: '类型', width: 200, locked: true },
    { field: 'categoryValue', title: '类别/计划组/描述', width: 200, locked: true },
    { field: 'upstreamProcessCode', title: '上游工序编码', width: 200, locked: true },
    { field: 'downstreamProcessCode', title: '下游工序编码', width: 200, locked: true },
    { field: 'relationType', title: '工序相关性', width: 200, locked: true },
    { field: 'leadTime', title: '提前小时', width: 200, locked: true },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: true }
  ];

  ngOnInit() {
    this.query();
    this.LoadData();
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
    this.setGridWidth('operation-lead-time');
  }

  add(item?: any) {
    this.modal
      .static(
        ProcessScheduleOperationLeadTimeEditComponent,
        {
          i: { id: (item !== undefined ? item.id : null) }
        },
        'lg'
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  httpAction = {
    url: this.dataquery.url1,
    method: 'GET',
    data: false
  };

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryService.loadGridViewNew(this.httpAction, this.queryParams.values, this);
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
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
      category: ''
    };
  }

  remove(value: any) {
    this.dataquery.remove(value).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.dataquery.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryService.export(this.httpAction, this.queryParams.values, this.excelexport, this);
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    console.log(event)
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
