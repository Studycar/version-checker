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

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'routing-planning',
  templateUrl: './routing-planning.component.html',
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
export class RoutingPlanningComponent extends CustomBaseContext implements OnInit {

  // 工厂
  public plantCodes: any[] = [];
  // 类别名
  public categoryCodes: any[] = [];
  // 查询参数
  queryParams = {
    defines: [
      { field: 'strPlantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantCodes, eventNo: 1 } },
      { field: 'strCategoryCode', title: '产品族', ui: { type: UiType.select, options: this.categoryCodes } },
      { field: 'strPlanningDate', title: '月份', required: true, ui: { type: UiType.date } }
    ],
    values: {
      strPlantCode: this.appConfig.getPlantCode(),
      strCategoryCode: '',
      strPlanningDate: null
    }
  };
  // 静态列
  public staticColumns: any[] = [
    { field: 'PlantCode', headerName: '工厂', title: '工厂', width: 120, locked: true },
    { field: 'Month', headerName: '月份', title: '月份', width: 120, locked: true },
    { field: 'ProductFamily', headerName: '产品族', title: '产品族', width: 120, locked: true },
    { field: 'ForecastQty', headerName: '预测量', title: '预测量', width: 120, locked: true },
    { field: 'AvgReqQty', headerName: '日需求', title: '日需求', width: 120, locked: true },
    { field: 'Deviation', headerName: '波动', title: '波动', width: 120, locked: true },
    { field: 'AvgUPH', headerName: '平均UPH', title: '平均UPH', width: 120, locked: true },
    { field: 'MainResourceUnits', headerName: '主资源数', title: '主资源数', width: 120, locked: true },
    { field: 'AlterResourceUnits', headerName: '备选资源数', title: '备选资源数', width: 120, locked: true }];
  // 产线扩展列
  public extendColumns: any[] = [];
  // 所有列
  public totalColumns: any[] = [];

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
    this.setGridColumn();
    this.initPlantCodes();
    this.initCategoryCodes();
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

  /** 工厂变更*/
  plantCodeChanged(e: any) {
    this.initCategoryCodes();
  }

  /** 初始化 产品族  下拉框*/
  initCategoryCodes() {
    this.queryService.GetCategoryCodes(this.queryParams.values.strPlantCode).subscribe(result => {
      result.Extra.forEach(d => {
        this.categoryCodes.push({ value: d, label: d });
      });
    });
  }

  setGridColumn() {
    this.totalColumns = [];
    this.staticColumns.forEach(col => {
      this.totalColumns.push(col);
    });
    this.extendColumns.forEach(col => {
      this.totalColumns.push(col);
    });
  }

  clear() {
    this.queryParams.values = {
      strPlantCode: this.appConfig.getPlantCode(),
      strCategoryCode: '',
      strPlanningDate: new Date()
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // 查询
  queryCommon() {
    this.gridApi.paginationSetPageSize(this._pageSize);
    this.setLoading(true);
    const dto = {
      PLANT_CODE: this.queryParams.values.strPlantCode,
      PlanningDate: this.queryParams.values.strPlanningDate,
      CATEGORY_CODE: this.queryParams.values.strCategoryCode,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize },
      IsExport: false
    };
    this.queryService.QueryMainData(dto).subscribe(result => {
      this.createExtendColumns(result.Extra.resourceCodes);
      this.gridData = result.Extra.gridData;
      this.view = {
        data: process(result.Extra.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length,
          filter: this.gridState.filter
        }).data,
        total: result.TotalCount
      };
      this.setLoading(true);
    });
  }

  // 创建扩展列
  createExtendColumns(resourceCodes: any) {
    this.extendColumns = [];
    resourceCodes.forEach(res => {
      // 构造列
      const col = {
        field: res,
        title: res,
        headerName: res,
        width: 120,
        locked: true
      };
      this.extendColumns.push(col);
    });

    this.setGridColumn();
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
      PlanningDate: this.queryParams.values.strPlanningDate,
      CATEGORY_CODE: this.queryParams.values.strCategoryCode,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize },
      IsExport: true
    };

    this.queryService.QueryMainData(dto).subscribe(result => {
      this.excelexport.export(result.Extra.gridData);
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

  // 提交供需平衡检查请求
  submitReq() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('系统将提交请求工艺路线规划，是否继续生成?'),
      nzOnOk: () => {
        const dto = {
          PLANT_CODE: this.queryParams.values.strPlantCode,
          PlanningDate: this.queryParams.values.strPlanningDate
        };
        this.queryService.SubmitReq(dto).subscribe(res => {
          if (res.Success === true) {
            this.msgSrv.success('工艺路线规划请求已提交，请等候处理');
            this.query();
          } else {
            this.msgSrv.error(res.Message);
          }
        });
      },
    });
  }
}
