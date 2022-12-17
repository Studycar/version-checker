import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { process } from '@progress/kendo-data-query';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-release-by-time',
  templateUrl: './product-release-by-time.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [QueryService],
  styles: [`.k-grid .no-padding{padding:0}
          .whole-cell{display:block;padding:0;margin:0;}
          .redCellStyle {color:red;}
          .blueCellStyle {color:blue;}
          .yellowCellStyle {color:#EAC100}
          .backColor0 {background-color:#ffffff !important}
          .backColor1 {background-color:#f5f7fa !important}
          .show-cell {
                background: white;
                border-left: 0.5px lightgrey solid !important;
                border-right: 0.5px lightgrey solid !important;
                border-bottom: 0.5px lightgrey solid !important;
            }`]
})
export class ProductReleaseByTimeComponent extends CustomBaseContext implements OnInit {

  // 工厂
  public plantCodes: any[] = [];
  // 物料
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  // 物料
  public columnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料',
      width: '100'
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    }
  ];

  // 查询参数
  queryParams = {
    defines: [
      { field: 'strPlantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantCodes } },
      {
        field: 'strItemForm', title: '物料编码从', ui: {
          type: UiType.popupSelect, valueField: 'ITEM_CODE', textField: 'ITEM_CODE', gridView: this.gridViewItems, columns: this.columnsItems,
          eventNo: 1
        }
      },
      {
        field: 'strItemTo', title: '物料编码至', ui: {
          type: UiType.popupSelect, valueField: 'ITEM_CODE', textField: 'ITEM_CODE', gridView: this.gridViewItems, columns: this.columnsItems,
          eventNo: 1
        }
      },
      { field: 'strEndDateTime', title: '截至日期', required: true, ui: { type: UiType.date } }
    ],
    values: {
      strPlantCode: this.appConfig.getPlantCode(),
      strItemForm: { value: '', text: '' },
      strItemTo: { value: '', text: '' },
      strEndDateTime: this.queryService.addDays(new Date(), 7)
    }
  };

  // 网格列
  public totalColumns: any[] = [
    { field: 'PLANT_CODE', headerName: '工厂', title: '工厂', width: 120, locked: true },
    { field: 'ITEM_ID', headerName: '物料编码', title: '物料编码', width: 120, locked: true },
    { field: 'ATTRIBUTE1', headerName: '物料描述', title: '物料描述', width: 120, locked: true },
    { field: 'RELEASE_TIME', headerName: '释放日期', title: '释放日期', width: 120, locked: true },
    { field: 'RELEASE_QTY', headerName: '累计释放数量', title: '累计释放数量', width: 120, locked: true },
    { field: 'REQ_QTY', headerName: '累计需求数量', title: '累计需求数量', width: 120, locked: true }];

  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    public pro: BrandService,
    public appConfig: AppConfigService,
    private confirmationService: NzModalService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfig });
    this.headerNameTranslate(this.totalColumns);
  }

  ngOnInit() {
    this.gridData = [];
    this.defaultColDef.sortable = false;
    this.clear();
    this.initPlantCodes();
    this.query();
  }

  /** 初始化 组织  下拉框*/
  initPlantCodes() {
    // 当前用户对应工厂
    this.queryParams.values.strPlantCode = this.appConfig.getPlantCode();
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodes.push({ value: d.PLANT_CODE, label: d.PLANT_CODE });
      });
    });
  }

  clear() {
    this.queryParams.values = {
      strPlantCode: this.appConfig.getPlantCode(),
      strItemForm: { value: '', text: '' },
      strItemTo: { value: '', text: '' },
      strEndDateTime: this.queryService.addDays(new Date(), 7)
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // 查询
  queryCommon() {
    // this.gridApi.paginationSetPageSize(this._pageSize);
    this.setLoading(true);
    const dto = {
      PLANT_CODE: this.queryParams.values.strPlantCode,
      ITEM_CODE_FROM: this.queryParams.values.strItemForm.text,
      ITEM_CODE_TO: this.queryParams.values.strItemTo.text,
      EndDateTime: this.queryParams.values.strEndDateTime,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize },
      IsExport: false
    };
    this.queryService.QueryMainData(dto).subscribe(result => {
      this.gridData = result.Extra;
      this.view = {
        data: process(result.Extra, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length,
          filter: this.gridState.filter
        }).data,
        total: result.TotalCount
      };
      this.setLoading(false);
    });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  // 导出
  export() {
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    const dto = {
      PLANT_CODE: this.queryParams.values.strPlantCode,
      ITEM_CODE_FROM: this.queryParams.values.strItemForm.text,
      ITEM_CODE_TO: this.queryParams.values.strItemTo.text,
      EndDateTime: this.queryParams.values.strEndDateTime,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize },
      IsExport: true
    };
    this.queryService.QueryMainData(dto).subscribe(result => {
      this.excelexport.export(result.Extra);
    });
  }

  // 页面大小选项
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  public onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      if (this.queryParams !== undefined) {
        this.queryCommon();
      }
    } else {
      this.setLoading(false);
    }
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.queryService.GetUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.Result;
      this.gridViewItems.total = res.TotalCount;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.strPlantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  // 提交供需平衡检查请求
  submitReq() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('系统将提交各时段释放量计算请求，是否继续生成?'),
      nzOnOk: () => {
        const dto = {
          PLANT_CODE: this.queryParams.values.strPlantCode,
          ITEM_CODE_FROM: this.queryParams.values.strItemForm.text,
          ITEM_CODE_TO: this.queryParams.values.strItemTo.text,
          EndDateTime: this.queryParams.values.strEndDateTime,
          QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize },
          IsExport: false
        };
        this.queryService.SubmitReq(dto).subscribe(res => {
          if (res.Success === true) {
            this.msgSrv.success('各时段释放量计算请求已提交，请等候处理');
            this.query();
          } else {
            this.msgSrv.error(res.Message);
          }
        });
      },
    });
  }
}
