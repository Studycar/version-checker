import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryKitStatusService } from '../../../../modules/generated_module/services/query-kit-status-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppGridStateService } from '../../../../modules/base_module/services/app-gridstate-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'item-detailed.component',
  templateUrl: './item-detailed.component.html'
})
export class PreparationPlatformItemDetailedComponent extends CustomBaseContext implements OnInit {
  expandForm = false;
  selectItems: any[] = [];
  public createdItemsR: any[] = [];
  splitline: any = 1;
  public MoStatusOptions: any[] = [];
  public makebuycodes: any[] = [];
  public ExcMoStatusOptions: any[] = [];
  public Excmakebuycodes: any[] = [];
  public BuyersOptions: any[] = [];
  i: any;
  plantcode: any;
  itemcode: any;
  public gridView: GridDataResult;
  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    private modalS: NzModalRef,
    private msgSrv: NzMessageService,
    private queryKitStatusService: QueryKitStatusService,
    private appTranslationService: AppTranslationService,
    public commonQueryService: CommonQueryService,
    private confirmationService: NzModalService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 270;
  }
  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.commonQueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.ExcMoStatusOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    this.commonQueryService.GetLookupByType('PS_MAKE_BUY_CODE').subscribe(result => {
      result.Extra.forEach(d => {
        this.Excmakebuycodes.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    this.queryKitStatusService.getBuyers().subscribe(result => {
      if (result.Extra !== undefined && result.Extra !== null) {
        result.Extra.forEach(x => {
          this.BuyersOptions.push({
            label: x.FULL_NAME,
            value: x.EMPLOYEE_NUMBER,
          });
        });
      }
    });
    this.query();
  }

  public columns = [
    { field: 'makeOrderNum', headerName: '工单号', width: 100 },
    { field: 'makeOrderStatus', headerName: '工单状态', valueFormatter: 'ctx.optionsFind(value,1).label', width: 100 },
    { field: 'itemCode', headerName: '装配件编码', tooltipField: 'ITEM_CODE', width: 120 },
    { field: 'descriptions', headerName: '装配件描述', tooltipField: 'DESCRIPTIONS', width: 120 },
    { field: 'componentItemCode', headerName: '组件物料编码', tooltipField: 'COMPONENT_ITEM_CODE', width: 100 },
    { field: 'componentDescriptions', headerName: '物料描述', tooltipField: 'COMPONENT_DESCRIPTIONS', width: 100 },
    { field: 'startDate', headerName: '工单开始日期', width: 150 },
    { field: 'completedDate', headerName: '工单完成日期', width: 150 },
    { field: 'demandQuantity', headerName: '需求数量', width: 100 },
    { field: 'issuedQuantity', headerName: '已发料数', width: 100 },
    { field: 'existingQty', headerName: '现有量', width: 100 },
    { field: 'wayQty', headerName: '在途量', width: 100 },
    { field: 'standardKitShitqty', headerName: '标准齐套缺料量', width: 150 },
    { field: 'standardKitStatus', headerName: '标准齐套状态', width: 150 },
    { field: 'standardKitAssignedQty', headerName: '标准齐套已分配量', width: 150 },
    { field: 'standardKitDistributableQty', headerName: '标准齐套可分配量' },
    { field: 'extendKitShitqty', headerName: '扩展齐套缺料量', width: 150 },
    { field: 'extendKitStatus', headerName: '扩展齐套状态', width: 150 },
    { field: 'extendKitAssignedQty', headerName: '扩展齐套已分配量', width: 150 },
    { field: 'extendKitDistributableQty', headerName: '扩展齐套可分配量', width: 150 }
  ];

  expColumns = [
    { field: 'makeOrderNum', title: '工单号', width: 150, locked: false, ui: { tooltip: 1 } },
    { field: 'makeOrderStatus', title: '工单状态', width: 100, locked: false, ui: { type: 'select', index: 1, options: this.MoStatusOptions } },
    { field: 'itemCode', title: '装配件编码', width: 180, locked: false },
    { field: 'descriptions', title: '装配件描述', width: 150, locked: false, ui: { tooltip: 1 } },
    { field: 'DEMAND_DATE', title: '组件需求日期', width: 200, locked: false, ui: { tooltip: 1 } },
    { field: 'componentItemCode', title: '组件物料编码', width: 180, locked: false },
    { field: 'startDate', title: '工单开始日期', width: 200, locked: false },
    { field: 'completedDate', title: '工单完成日期', width: 200, locked: false },
    { field: 'componentDescriptions', title: '物料描述', width: 200, locked: false, ui: { tooltip: 1 } },
    { field: 'demandQuantity', title: '计划数量', width: 120, locked: false },
    { field: 'issuedQuantity', title: '已发料数', width: 120, locked: false },
    { field: 'existingQty', title: '现有量', width: 120, locked: false },
    { field: 'wayQty', title: '在途量', width: 120, locked: false },
    { field: 'standardKitShitqty', title: '标准齐套缺料量', width: 150, locked: false },
    { field: 'standardKitStatus', title: '标准齐套状态', width: 150, locked: false },
    { field: 'standardKitAssignedQty', title: '标准齐套已分配量', width: 150, locked: false },
    { field: 'standardKitDistributableQty', title: '标准齐套可分配量', width: 150, locked: false },
    { field: 'extendKitShitqty', title: '扩展齐套缺料量', width: 150, locked: false },
    { field: 'extendKitStatus', title: '扩展齐套状态', width: 150, locked: false },
    { field: 'extendKitAssignedQty', title: '扩展齐套已分配量', width: 150, locked: false },
    { field: 'extendKitDistributableQty', title: '扩展齐套可分配量', width: 150, locked: false },
    { field: 'ATTRIBUTE1', title: '处理顺序', width: 150, locked: false },
  ];

  httpAction = { url: this.queryKitStatusService.queryitemdetailUrl, method: 'GET', data: false };
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.MoStatusOptions;
        break;
      case 2:
        options = this.makebuycodes;
        break;
      case 3:
        options = this.BuyersOptions;
        break;
    }
    return options.find(x => x.value === value.toString()) || { label: value };
  }

  public query() {
    this.commonQueryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
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

  private getQueryParamsValue(): any {
    return {
      plantcode: this.plantcode,
      itemcode: this.itemcode,
      PAGE_INDEX: this._pageNo,
      PAGE_SIZE: this._pageSize
    };
  }

  expColumnsOptions = [
    { field: 'MAKE_ORDER_STATUS', options: this.ExcMoStatusOptions },
    { field: 'MAKE_BUY_CODE', options: this.Excmakebuycodes },
    { field: 'BUYER', options: this.BuyersOptions }
  ];
  expData: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  expUrl = '/afs/ServerPCQueryKitStatus/PCQueryKitStatus/ExportInfo-itemdetailed';
  public export() {
    this.commonQueryService.exportAction({ url: this.expUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport);
  }
}
