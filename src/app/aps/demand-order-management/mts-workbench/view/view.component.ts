import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { State, process } from '@progress/kendo-data-query';
import { QueryService } from '../query.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-mts-workbench-view',
  templateUrl: './view.component.html',
  providers: [QueryService],
})
export class DemandOrderManagementMtsWorkbenchViewComponent extends CustomBaseContext implements OnInit {
  title: String = '需求-现有量明细';
  iParam: any;
  public gridData: any[] = [];
  fixColName: any[] = [];
  supplyStatus: any[] = [];
  sources: any[] = [];
  expandForm = false;
  public totalCount = 0;
  public mySelection: any[] = [];
  columns: any[] = [];
  myGridRowKey: any;
  gridHeight = document.body.clientHeight - 300;
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null }); }

  public ngOnInit(): void {
    this.fixColName = this.iParam.fixColName;
    this.sources = this.iParam.sources;
    this.loadOptions();
    if (this.iParam.strType === '需求') {
      this.title = '需求明细';
      this.columns = [{ field: 'plantCode', headerName: '工厂', width: 90, locked: true },
      { field: 'itemCode', headerName: '物料编码', width: 150, locked: true },
      { field: 'reqDate', headerName: '需求日期', width: 140, locked: false },
      { field: 'reqQty', headerName: '需求数量', width: 120, locked: false },
      { field: 'reqSource', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'], headerName: '需求来源类型', width: 150, locked: false },
      { field: 'reqSourceCategory', valueFormatter: 'ctx.optionsFind(value,2).ATTRIBUTE3', headerName: '需求来源分类', width: 150, locked: false },
      { field: 'reqNumber', headerName: '需求单号', width: 150, locked: false },
      { field: 'reqLineNum', headerName: '需求单行号', width: 120, locked: false }

      ];
      this.myGridRowKey = { tb: 'PP_MTS_PEGGING' };
    } else if (this.iParam.strType === '供应') {
      this.title = '供应明细';
      this.columns = [{ field: 'plantCode', headerName: '工厂', width: 90, locked: true },
      { field: 'itemCode', headerName: '物料编码', width: 150, locked: true },
      { field: 'supplyDate', headerName: '供应日期', width: 140, locked: false },
      { field: 'supplyQty', headerName: '供应数量', width: 120, locked: false },
      { field: 'supplySource', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'], headerName: '供应来源类型', width: 150, locked: false },
      { field: 'supplySourceCategory', valueFormatter: 'ctx.optionsFind(value,2).ATTRIBUTE3', headerName: '供应来源分类', width: 150, locked: false },
      { field: 'supplyNumber', headerName: '供应单号', width: 150, locked: false },
      { field: 'supplyLineNum', headerName: '供应单行号', width: 120, locked: false }

      ];
      this.myGridRowKey = { tb: 'PP_MTS_PEGGING' };
    } else if (this.iParam.strType === 'OtherInfo') {// 例外信息
      this.title = '例外信息';
      this.columns = [{ field: 'plantCode', headerName: '工厂', width: 90, locked: true },
      { field: 'itemCode', headerName: '物料编码', width: 150, locked: true },
      { field: 'supplyDate', headerName: '供应日期', width: 140, locked: false },
      { field: 'supplyQty', headerName: '供应数量', width: 100, locked: false },
      { field: 'supplySource', valueFormatter: 'ctx.optionsFind(value,1).label', headerName: '供应来源类型', width: 150, locked: false },
      { field: 'supplySourceCategory', valueFormatter: 'ctx.optionsFind(value,2).ATTRIBUTE3', headerName: '供应来源分类', width: 150, locked: false },
      { field: 'supplyNumber', headerName: '供应单号', width: 150, locked: false },
      { field: 'supplyLineNum', headerName: '供应单行号', width: 120, locked: false },
      { field: 'supplyStatus', valueFormatter: 'ctx.optionsFind(value,3).label', headerName: '供应状态', width: 120, locked: false },
      { field: 'action', headerName: '建议活动', width: 150, locked: false },
      { field: 'newSupplyDate', headerName: '建议供应时间', width: 120, locked: false },
      { field: 'matchQty', headerName: '建议数量', width: 150, locked: false }
      ];
      this.myGridRowKey = { tb: 'PP_MTS_PEGGING' };
    }
    this.clear();
    this.query();
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    if (optionsIndex === 1) {
      options = this.sources;
      return options.find(x => x.value === value) || { label: value };
    } else if (optionsIndex === 2) {
      options = this.fixColName;
      return options.find(x => x.ATTRIBUTE2 === value) || { ATTRIBUTE3: value };
    } else if (optionsIndex === 3) {
      options = this.supplyStatus;
      return options.find(x => x.value === value) || { label: value };
    }

  }

  query() {
    super.query();
    this.loadOptions();
    this.queryCommon();
  }

  queryCommon() {
    // this.iParam.pageIndex = this.lastPageNo;
    // this.iParam.pageSize = this.lastPageSize;
    const param = {
      type: this.iParam.strType || null,
      plantCode: this.iParam.strPlantCode || null,
      itemCode: this.iParam.strItemCodeFrom || null,
      fieldName: this.iParam.strfieldName || null,
      titleName: this.iParam.strtitleName || null,
      startBegin: this.iParam.startBegin || null,
      reqSource: this.iParam.strReqSource || null,
      reqSourceCategory: this.iParam.strReqSourceCategory || null,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: false,
    };
    this.commonQueryService.SearchDetail(param).subscribe(result => {
      this.gridData.length = 0;
      this.totalCount = result.data.totalElements;
      this.gridData = result.data.content;
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };
    });
  }

  public export() {
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    this.expColumns = [];
    if (this.iParam.strType === '需求') {
      this.expColumns = [{ field: 'plantCode', title: '工厂', width: 90, locked: true },
      { field: 'itemCode', title: '物料编码', width: 150, locked: true },
      { field: 'reqDate', title: '需求日期', width: 140, locked: false },
      { field: 'reqQty', title: '需求数量', width: 120, locked: false },
      { field: 'reqSource', title: '需求来源类型', width: 150, locked: false },
      { field: 'reqSourceCategory', title: '需求来源分类', width: 150, locked: false },
      { field: 'reqNumber', title: '需求单号', width: 150, locked: false },
      { field: 'reqLineNum', title: '需求单行号', width: 120, locked: false }
      ];
    } else if (this.iParam.strType === '供应') {
      this.expColumns = [{ field: 'plantCode', title: '工厂', width: 90, locked: true },
      { field: 'itemCode', title: '物料编码', width: 150, locked: true },
      { field: 'supplyDate', title: '供应日期', width: 140, locked: false },
      { field: 'supplyQty', title: '供应数量', width: 120, locked: false },
      { field: 'supplySource', title: '供应来源类型', width: 150, locked: false },
      { field: 'supplySourceCategory', title: '供应来源分类', width: 150, locked: false },
      { field: 'supplyNumber', title: '供应单号', width: 150, locked: false },
      { field: 'supplyLineNum', title: '供应单行号', width: 120, locked: false }
      ];
    } else if (this.iParam.strType === 'OtherInfo') {// 例外信息
      this.expColumns = [{ field: 'plantCode', title: '工厂', width: 90, locked: true },
      { field: 'itemCode', title: '物料编码', width: 150, locked: true },
      { field: 'supplyDate', title: '供应日期', width: 140, locked: false },
      { field: 'supplyQty', title: '供应数量', width: 100, locked: false },
      { field: 'supplySource', title: '供应来源类型', width: 150, locked: false },
      { field: 'supplySourceCategory', title: '供应来源分类', width: 150, locked: false },
      { field: 'supplyNumber', title: '供应单号', width: 150, locked: false },
      { field: 'supplyLineNum', title: '供应单行号', width: 120, locked: false },
      { field: 'supplyStatus', title: '供应状态', width: 120, locked: false },
      { field: 'action', title: '建议活动', width: 150, locked: false },
      { field: 'newSupplyDate', title: '建议供应时间', width: 120, locked: false },
      { field: 'matchQty', title: '建议数量', width: 150, locked: false }
      ];
    }

    // this.iParam.pageIndex = 0;
    // this.iParam.pageSize = 0;//导出
    const param = {
      type: this.iParam.strType || null,
      plantCode: this.iParam.strPlantCode || null,
      itemCode: this.iParam.strItemCodeFrom || null,
      fieldName: this.iParam.strfieldName || null,
      titleName: this.iParam.strtitleName || null,
      startBegin: this.iParam.startBegin || null,
      reqSource: this.iParam.strReqSource || null,
      reqSourceCategory: this.iParam.strReqSourceCategory || null,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: true,
    };
    this.commonQueryService.SearchDetail(param).subscribe(result => {
      if (this.iParam.strType === '需求') {
        result.data.content.forEach(d => {
          const sourcesTmp = this.sources.find(x => x.value === d.reqSource);
          if (sourcesTmp !== undefined) {
            d.reqSource = sourcesTmp.label;
          }
          const fixColNameTmp = this.fixColName.find(x => x.ATTRIBUTE2 === d.reqSourceCategory);
          if (fixColNameTmp !== undefined) {
            d.reqSourceCategory = fixColNameTmp.ATTRIBUTE3;
          }

        });
      } else if (this.iParam.strType === '供应') {
        result.data.content.forEach(d => {
          const sourcesTmp = this.sources.find(x => x.value === d.supplySource);
          if (sourcesTmp !== undefined) {
            d.supplySource = sourcesTmp.label;
          }
          const fixColNameTmp = this.fixColName.find(x => x.ATTRIBUTE2 === d.supplySourceCategory);
          if (fixColNameTmp !== undefined) {
            d.supplySourceCategory = fixColNameTmp.ATTRIBUTE3;
          }

        });
      } else if (this.iParam.strType === 'OtherInfo') {
        result.data.content.forEach(d => {
          const sourcesTmp = this.sources.find(x => x.value === d.supplySource);
          if (sourcesTmp !== undefined) {
            d.supplySource = sourcesTmp.label;
          }
          const fixColNameTmp = this.fixColName.find(x => x.ATTRIBUTE2 === d.supplySourceCategory);
          if (fixColNameTmp !== undefined) {
            d.supplySourceCategory = fixColNameTmp.ATTRIBUTE3;
          }
          const supplyStatusTmp = this.supplyStatus.find(x => x.value === d.supplyStatus);
          if (supplyStatusTmp !== undefined) {
            d.supplyStatus = supplyStatusTmp.label;
          }
        });
      }
      this.gridData.length = 0;
      this.gridData = result.data.content;
      this.excelexport.export(this.gridData);
    });

  }

  private loadOptions() {
    this.commonQueryService.GetLookupByTypeNew('PP_MTS_SUPPLY_STATUS').subscribe(result => {
      this.supplyStatus.length = 0;
      result.data.forEach(d => {
        this.supplyStatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }
  public dataStateChange(state: State) {
    this.gridState = state;
    this.queryCommon();
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

}
