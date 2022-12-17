import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators/map';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppGridStateService } from '../../../../modules/base_module/services/app-gridstate-service';
import { PreparationPlatformItemDetailedComponent } from '../item-detailed/item-detailed.component';
import { QueryKitStatusService } from '../../../../modules/generated_module/services/query-kit-status-service';
import { QueryService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CacheService } from '../../query-kit-modal-route/cache.service';
import { Router } from '@angular/router';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'working-material',
  templateUrl: './working-material.component.html',
  providers: [QueryService, CommonQueryService]
})
export class PreparationPlatformWorkingMaterialComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  expandForm = false;
  selectItems: any[] = [];
  public applicationYesNo: any[] = [];
  params: any = {};
  splitline: any = 1;
  plantCode: any;
  itemCode:any;
  itemId:any;
  makeOrderNum: any;
  public IsQueryAll = false;
  public makebuycodes: any[] = [];
  public MoStatusOptions: any[] = [];
  public gridView: GridDataResult;
  // public viewAsync: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 15,
  };
  i: any;
  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    private modalS: NzModalRef,
    private msgSrv: NzMessageService,
    private queryKitStatusService: QueryKitStatusService,
    private appTranslationService: AppTranslationService,
    public commonQueryService: CommonQueryService,
    private confirmationService: NzModalService,
    public editService: QueryService,
    private cache: CacheService,
    private router: Router,
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 270;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.commonQueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.MoStatusOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonQueryService.GetLookupByType('PS_MAKE_BUY_CODE').subscribe(result => {
      result.Extra.forEach(d => {
        this.makebuycodes.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.query();
  }

  // public columns = [
  //   {
  //     colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
  //     headerComponentParams: {
  //       template: this.headerTemplate
  //     },
  //     cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
  //     cellRendererParams: {
  //       customTemplate: null,      // Complementing the Cell Renderer parameters
  //     }
  //   },
  //   { field: 'makeOrderNum', headerName: '工单号', width: 100 },
  //   { field: 'makeOrderStatus', headerName: '工单状态', valueFormatter: 'ctx.optionsFind(value,1).label', width: 100 },
  //   { field: 'startDate', headerName: '工单开始日期', width: 150 },
  //   { field: 'completedDate', headerName: '工单完成日期', width: 150 },
  //   { field: 'componentItemCode', headerName: '组件物料编码', width: 120 },
  //   { field: 'componentDescriptions', headerName: '物料描述', tooltipField: 'componentDescriptions', width: 100 },
  //   { field: 'demandQuantity', headerName: '需求数量', width: 100 },
  //   { field: 'issuedQuantity', headerName: '已发料数', width: 100 },
  //   { field: 'existingqty', headerName: '现有量', width: 80 },
  //   { field: 'wayqty', headerName: '在途量', width: 80 },
  //   { field: 'standardKitShtqty', headerName: '标准齐套缺料量', width: 150 },
  //   { field: 'standardKitStatus', headerName: '标准齐套状态', width: 150 },
  //   { field: 'standardKitAssignedQty', headerName: '标准齐套已分配量', width: 150 },
  //   { field: 'standardKitDistributableQty', headerName: '标准齐套可分配量', width: 150 },
  //   { field: 'extendKitShtqty', headerName: '扩展齐套缺料量', width: 150 },
  //   { field: 'extendKitStatus', headerName: '扩展齐套状态', width: 150 },
  //   { field: 'extendKitAssignedQty', headerName: '扩展齐套已分配量', width: 150 },
  //   { field: 'extendKitDistributableQty', headerName: '扩展齐套可分配量', width: 150 },
  // ];

  public columns = [
    { field: 'makeOrderNum', headerName: '工单号', width: 100 },
    { field: 'makeOrderStatus', headerName: '工单状态', valueFormatter: 'ctx.optionsFind(value,1).label', width: 100 },
    { field: 'itemCode', headerName: '装配件编码', tooltipField: 'itemCode', width: 120 },
    { field: 'descriptions', headerName: '装配件描述', tooltipField: 'descriptions', width: 120 },
    { field: 'componentItemCode', headerName: '组件物料编码', tooltipField: 'componentItemCode', width: 100 },
    { field: 'componentDescriptions', headerName: '物料描述', tooltipField: 'componentDescriptions', width: 100 },
    { field: 'startDate', headerName: '工单开始日期', width: 150 },
    { field: 'completedDate', headerName: '工单完成日期', width: 150 },
    { field: 'demandQuantity', headerName: '需求数量', width: 100 },
    { field: 'issuedQuantity', headerName: '已发料数', width: 100 },
    { field: 'existingQty', headerName: '现有量', width: 100 },
    { field: 'wayQty', headerName: '在途量', width: 100 },
    { field: 'standardKitShtqty', headerName: '标准齐套缺料量', width: 150 },
    { field: 'standardKitStatus', headerName: '标准齐套状态', width: 150 },
    { field: 'standardKitAssignedQty', headerName: '标准齐套已分配量', width: 150 },
    // { field: 'standardKitDistributableQty', headerName: '标准齐套可分配量' },
    { field: 'attribute4', headerName: '扩展齐套缺料量', width: 150 },
    { field: 'attribute5', headerName: '扩展齐套状态', width: 150 },
    { field: 'attribute3', headerName: '扩展齐套已分配量', width: 150 },
    { field: 'attribute2', headerName: '扩展齐套时间点', width: 150 },
    // { field: 'extendKitDistributableQty', headerName: '扩展齐套可分配量', width: 150 }，
    { field: 'extendKitShtqty', headerName: '广义扩展齐套缺料量', width: 150 },
    { field: 'extendKitStatus', headerName: '广义扩展齐套状态', width: 150 },
    { field: 'extendKitAssignedQty', headerName: '广义扩展齐套已分配量', width: 150 },
  ];

  public expColumns = [
    { field: 'makeOrderNum', headerName: '工单号', width: 100 },
    { field: 'makeOrderStatus', headerName: '工单状态', ui: { type: 'select', index: 4, options: this.MoStatusOptions }, width: 100 },
    { field: 'startDate', headerName: '工单开始日期', width: 150 },
    { field: 'completedDate', headerName: '工单完成日期', width: 150 },
    { field: 'componentItemCode', headerName: '组件物料编码', width: 120 },
    { field: 'componentDescriptions', headerName: '物料描述', width: 100 },
    { field: 'demandQuantity', headerName: '需求数量', width: 100 },
    { field: 'issuedQuantity', headerName: '已发料数', width: 100 },
    { field: 'existingqty', headerName: '现有量', width: 80 },
    { field: 'wayqty', headerName: '在途量', width: 80 },
    { field: 'standardKitShtqty', headerName: '标准齐套缺料量', width: 150 },
    { field: 'standardKitStatus', headerName: '标准齐套状态', width: 150 },
    { field: 'standardKitAssignedQty', headerName: '标准齐套已分配量', width: 150 },
    { field: 'standardKitDistributableQty', headerName: '标准齐套可分配量', width: 150 },
    { field: 'extendKitShtqty', headerName: '扩展齐套缺料量', width: 150 },
    { field: 'extendKitStatus', headerName: '扩展齐套状态', width: 150 },
    { field: 'extendKitAssignedQty', headerName: '扩展齐套已分配量', width: 150 },
    { field: 'extendKitDistributableQty', headerName: '扩展齐套可分配量', width: 150 },
  ];
  // httpAction = { url: this.queryKitStatusService.querymaterialUrl, method: 'POST', data: false };
  httpAction = { url: this.queryKitStatusService.queryitemdetailUrl, method: 'POST' };
  public query() {
    this.IsQueryAll = false;
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  private getQueryParamsValue(isExport: boolean): any {
    return {
      plantCode: this.plantCode,
      makeOrderNum: this.makeOrderNum,
      // componentItemId: this.componentItemId,
      // componentItemCode: this.componentItemCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport
    };
  }

  public queryAllItem() {
    this.IsQueryAll = true;
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.MoStatusOptions;
        break;
    }
    return options.find(x => x.value === value.toString()) || { label: value };
  }

  public itemdetail(item: any) {
    this.cache.plantCode = item.plantCode;
    this.cache.componentItemId = item.componentItemId;
    this.cache.componentItemCode = item.componentItemCode;
    this.cache.moStatusOptions = [...this.MoStatusOptions];
    this.cache.makeBuyCodes = [...this.makebuycodes];
    this.cache.type = 'mo';
    this.router.navigate(['/preparation-platform/querykitstatus/query-kit-modal']).then(r => { });
    /*this.modal
      .static(PreparationPlatformItemDetailedComponent, {
        plantcode: item.PLANT_CODE,
        itemcode: item.COMPONENT_ITEM_CODE,
        MoStatusOptions: this.MoStatusOptions,
        makebuycodes: this.makebuycodes
      })
      .subscribe((value) => {
        if (value) {
          // this.query();
        }
      });*/
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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

  expColumnsOptions = [
    { field: 'makeOrderStatus', options: this.MoStatusOptions },
  ];
  expData: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonQueryService.exportAction(this.httpAction, this.getQueryParamsValue(true), this.excelexport);
  }
}
