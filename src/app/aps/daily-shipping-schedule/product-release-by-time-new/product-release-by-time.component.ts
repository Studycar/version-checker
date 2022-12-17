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
export class ProductReleaseByTimeNewComponent extends CustomBaseContext implements OnInit {

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
      field: 'stockCode',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'stockName',
      title: '物料说明',
      width: '100'
    }
  ];

  // 查询参数
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantCodes } },
      {
        field: 'strStock', title: '物料编码', ui: {
          type: UiType.popupSelect, valueField: 'stockCode', textField: 'stockCode', gridView: this.gridViewItems, columns: this.columnsItems,
          eventNo: 1
        }
      },
      { field: 'releaseDate', title: '释放日期', required: true, ui: { type: UiType.date } }
    ],
    values: {
      plantCode: this.appConfig.getPlantCode(),
      strStock: { value: '', text: '' },
      releaseDate: this.queryService.addDays(new Date(), 7)
    }
  };

  // 网格列
  public totalColumns: any[] = [
    { field: 'plantCode', headerName: '工厂', width: 120, },
    { field: 'stockCode', headerName: '物料编码', width: 120, },
    { field: 'stockName', headerName: '物料说明', width: 120, },
    { field: 'releaseDate', headerName: '释放日期', width: 120, },
    { field: 'totalQuantity', headerName: '累计释放数量', width: 120, },
    { field: 'totalDemand', headerName: '累计需求数量', width: 120, },
    { field: 'unit', headerName: '单位', width: 120, },
    { field: 'batchNum', headerName: '批号', width: 120, },
    { field: 'coilBatchNum', headerName: '来料批号', width: 120, },
    { field: 'toleranceThickness', headerName: '厚度下工差', width: 120, },
    { field: 'weigth', headerName: '实宽', width: 120, },
    { field: 'steelStandart', headerName: '规格尺寸', width: 120, },
    { field: 'steelType', headerName: '钢种', width: 120, valueFormatter: 'ctx.optionsFind(value,1).label' },
    { field: 'surface', headerName: '表面', width: 120, valueFormatter: 'ctx.optionsFind(value,2).label' },
    { field: 'grade', headerName: '等级', width: 120, },
    { field: 'batchNumRemarks', headerName: '批号备注', width: 120, },
    { field: 'quantityOnHand', headerName: '现存量', width: 120, },
    { field: 'availableQuantity', headerName: '可用量', width: 120, },
    { field: 'stockType', headerName: '库存类型', width: 120, },
    { field: 'cusCode', headerName: '客户编码', width: 120, },
    { field: 'cusAbbreviation', headerName: '客户简称', width: 120, },
    { field: 'parentNo', headerName: '母卷号', width: 120, },
    { field: 'coating', headerName: '胶膜（垫纸）/保护材料', width: 120, },
    { field: 'place', headerName: '产地', width: 120, },
    { field: 'originalWeigth', headerName: '原重', width: 120, },
    { field: 'unitWeigth', headerName: '单重', width: 120, },
    { field: 'grossWeigth', headerName: '毛重', width: 120, },
    // { field: 'lockPlanNo', headerName: '锁计划单号', width: 120, },
    { field: 'qualityInformation', headerName: '品质信息', width: 120, },
    { field: 'thickness', headerName: '实厚', width: 120, },
    { field: 'length', headerName: '长度', width: 120, },
    // { field: 'manufacturerCode', headerName: '厂商代号', width: 120, },
    { field: 'location', headerName: '库位', width: 120, },
    // { field: 'remarks', headerName: '备注', width: 120, },
    // { field: 'lockSo', headerName: '锁库SO', width: 120, },
    // { field: 'lockOperation', headerName: '锁库操作', width: 120, },
    { field: 'lockTime', headerName: '锁库时间', width: 120, },
    { field: 'warehouseTime', headerName: '入库时间', width: 120, },
    // { field: 'stockReason', headerName: '现货原因', width: 120, },
  ];

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
    this.queryParams.values.plantCode = this.appConfig.getPlantCode();
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantCodes.push({
          label: d.plantCode,
          value: d.plantCode,
        })
      })
    });
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfig.getPlantCode(),
      strStock: { value: '', text: '' },
      releaseDate: this.queryService.addDays(new Date(), 7)
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' }
  // 查询
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    return {
      plantCode: this.queryParams.values.plantCode,
      stockCode: this.queryParams.values.strStock.text,
      releaseDate: this.queryService.formatDate(this.queryParams.values.releaseDate),
      pageIndex: this._pageNo, 
      pageSize: this._pageSize,
      isExport: isExport
    };
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  // 导出
  export() {
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

  public loadItems(stockCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.queryService.getProductions({
      stockCodeOrName: stockCode,
      pageIndex: PageIndex,
      pageSize: PageSize
    }).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(e.SearchValue, PageIndex, e.PageSize);
  }

  isVisible: boolean = false;
  day: number;
  handleCancel() {
    this.isVisible = false;
    this.day = null;
  }
  
  // 提交供需平衡检查请求
  submitReq() {
    this.isVisible = true;
  }

  handleOk() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('系统将提交释放量计算请求，是否继续生成?'),
      nzOnOk: () => {
        this.queryService.SubmitReq(this.day).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(res.msg);
            this.isVisible = false;
            this.day = null;
            this.query();
          } else {
            this.msgSrv.error(res.msg);
          }
        });
      },
    });
  }

}
