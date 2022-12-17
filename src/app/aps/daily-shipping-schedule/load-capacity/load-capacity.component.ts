import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { LoadCapacityService } from './load-capacity.service';
import { LoadCapacityRuleService } from '../load-capacity-rule/load-capacity-rule.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'load-capacity',
  templateUrl: './load-capacity.component.html',
  providers: [LoadCapacityService, LoadCapacityRuleService],
})
export class LoadCapacityComponent extends CustomBaseContext implements OnInit {
  // @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';

  public httpAction = { url: this.loadCapacityService.seachUrl, method: 'POST' };
  // 工厂
  public plantCodes: any[] = [];
  // 装运点
  public loadLocations: any[] = [];
  // 查询参数
  queryParams = {
    defines: [
      { field: 'strPlantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantCodes, eventNo: 1 } },
      { field: 'strLoadLocation', title: '装运点', required: false, ui: { type: UiType.select, options: this.loadLocations } },
      { field: 'strDateRange', title: '日期范围', required: false, ui: { type: UiType.dateRange } }
    ],
    values: {
      strPlantCode: this.appConfigService.getPlantCode(),
      strLoadLocation: '',
      strDateRange: []
    }
  };
  // 网格列定义
  columns = [
    { field: 'plantCode', headerName: '工厂', title: '工厂', tooltipField: 'plantCode', menuTabs: ['filterMenuTab'] },
    { field: 'strLoadDate', headerName: '日期', title: '日期', tooltipField: 'strLoadDate', menuTabs: ['filterMenuTab'] },
    { field: 'loadLocation', headerName: '发运区域', title: '发运区域', tooltipField: 'loadLocation', menuTabs: ['filterMenuTab'] },
    { field: 'strStartTime', headerName: '班次开始时间', title: '班次开始时间', tooltipField: 'ATTRIBUTE1', menuTabs: ['filterMenuTab'] },
    { field: 'tonnageForA', headerName: 'A类初始能力', title: 'A类初始能力', tooltipField: 'tonnageForA', menuTabs: ['filterMenuTab'] },
    { field: 'tonnageRemainForA', headerName: 'A类剩余能力', title: 'A类剩余能力', tooltipField: 'tonnageRemainForA', menuTabs: ['filterMenuTab'] },
    { field: 'tonnageForB', headerName: 'B类初始能力', title: 'B类初始能力', tooltipField: 'tonnageForB', menuTabs: ['filterMenuTab'] },
    { field: 'tonnageRemainForB', headerName: 'B类剩余能力', title: 'B类剩余能力', tooltipField: 'tonnageRemainForB', menuTabs: ['filterMenuTab'] },
    { field: 'tonnageForC', headerName: 'C类初始能力', title: 'C类初始能力', tooltipField: 'tonnageForC', menuTabs: ['filterMenuTab'] },
    { field: 'tonnageRemainForC', headerName: 'C类剩余能力', title: 'C类剩余能力', tooltipField: 'tonnageRemainForC', menuTabs: ['filterMenuTab'] },
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public loadCapacityService: LoadCapacityService,
    public loadCapacityRuleService: LoadCapacityRuleService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.clear();
    this.initPlantCodes();
    this.query();
  }

  clear() {
    this.queryParams.values = {
      strPlantCode: this.appConfigService.getPlantCode(),
      strLoadLocation: '',
      strDateRange: []
    };
  }

  /** 初始化 组织  下拉框*/
  initPlantCodes() {
    // 当前用户对应工厂
    this.queryParams.values.strPlantCode = this.appConfigService.getPlantCode();

    this.loadCapacityService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodes.push({ value: d.plantCode, label: d.plantCode });
      });

      if (this.plantCodes.length > 0) {
        this.plantCodeChanged(this.queryParams.values.strPlantCode);
      }
    });
  }

  plantCodeChanged(event: any) {
    // const dto = {
    //   plantCode: event
    // };
    console.log("event");
    console.log(event);
    this.loadLocations.length = 0;
    this.loadCapacityRuleService.QueryLocation(event).subscribe(result => {
      console.log("result");
        console.log(result);
      result.data.forEach(d => {
        this.loadLocations.push({ value: d, label: d });
      });
      console.log("loadLocations");
        console.log(this.loadLocations);
      if (this.loadLocations.length > 0) {
        this.queryParams.values.strLoadLocation = this.loadLocations[0].value;
      }
    });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    // const httpAction = { url: this.loadCapacityService.seachUrl, method: 'POST' };

    const dto = {
      plantCode: this.queryParams.values.strPlantCode,
      loadLocation: this.queryParams.values.strLoadLocation,
      fromDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[0]),
      endDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[1]),
      pageIndex: this._pageNo, 
      pageSize: this._pageSize ,
      export: false
    };

    this.commonQueryService.loadGridViewNew(this.httpAction, dto, this.context);
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = {
      plantCode: this.queryParams.values.strPlantCode,
      //loadLocation: this.queryParams.values.strLoadLocation,
      fromDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[0]),
      endDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[1]),
      pageIndex: this._pageNo, 
      pageSize: this._pageSize ,
      export: true
    };
    this.commonQueryService.exportAction(this.httpAction, dto, this.excelexport, this.context);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
