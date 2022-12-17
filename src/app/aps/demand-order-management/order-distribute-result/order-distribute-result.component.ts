import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { SopDemandAnalysisdm } from 'app/modules/generated_module/services/sopdemandanalysisdm-service';
import { HttpMethod } from 'app/modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { OrderDistributeResultService } from './order-distribute-result.service';
import { SopPlanningCapacityService } from 'app/aps/product-sell-balance/sop-planning-capacity/sop-planning-capacity.service';
import { Subject } from 'rxjs';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'order-distribute-result',
  templateUrl: './order-distribute-result.component.html',
  providers: [OrderDistributeResultService, SopPlanningCapacityService],
  styles: [`
  .warnning  { background-color:rgb(250,210,162); }
  `]
})
export class DemandOrderManagementOrderDistributeResultComponent extends CustomBaseContext implements OnInit {
  public exportFileName: String = '分单结果展示-汇总'; // 导出的文件名
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplate2', { static: true }) customTemplate2: TemplateRef<any>;
  public batchList: any[] = [];
  public usedTypeList: any[] = [];
  public regionList: any[] = [];
  public plantList: any[] = [];
  public capacityTypeList: any[] = [];
  public division1List: any[] = [];
  public division2List: any[] = [];
  public division3List: any[] = [];
  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '事业部', required: true, ui: { type: UiType.select, options: this.regionList, ngModelChange: this.regionChange } },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantList } },
      { field: 'capacityType', title: '产能分类', ui: { type: UiType.select, options: this.capacityTypeList } },
      { field: 'division1', title: '第一维度', ui: { type: UiType.select, options: this.division1List } },
      { field: 'division2', title: '第二维度', ui: { type: UiType.select, options: this.division2List } },
      { field: 'division3', title: '第三维度', ui: { type: UiType.select, options: this.division3List } },
      { field: 'bacthNumber', title: '批次号', ui: { type: UiType.select, options: this.batchList } },
      // TODO: 因数据库拼写错误，所以这里也要拼错
      { field: 'START_DATE', title: '开始日期', required: true, ui: { type: UiType.date } },
      { field: 'END_DATE', title: '结束日期', ui: { type: UiType.date } }
    ],
    values: {
      scheduleRegionCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: null,
      capacityType: null,
      division1: null,
      division2: null,
      division3: null,
      START_DATE: this.queryService.addDays(new Date(), -7),
      END_DATE: null,
      bacthNumber: null
      // TODO: 因数据库拼写错误，所以这里也要拼错
    }
  };

  //#region   表格内容
  public tabs = [{
    index: 1, active: true, name: '汇总', hiddenColumns: [
      'bacthNumber',
      // TODO: 因数据库拼写错误，所以这里也要拼错
      'reqNumber',
      'reqLineNum',
      'itemCode',
      'itemDesc',
      'demandDate',
      'reqQty',
      'priority',
      'usedType'
    ]
  },
  {
    index: 2, active: false, name: '明细', hiddenColumns: []
  }];
  tabFirstFlag = Array(this.tabs.length).fill(true);

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.usedTypeList;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  constructor(public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    private appTranslationService: AppTranslationService,
    private queryService: OrderDistributeResultService,
    private sopDemandAnalysisdmService: SopDemandAnalysisdm,
    private sopCapacityService: SopPlanningCapacityService,
    public appGridStateService: AppGridStateService,
    private appConfigService: AppConfigService) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      commonQuerySrv: queryService,
      appGridStateService: appGridStateService
    });
    this.setGridHeight({ topMargin: 155, bottomMargin: this.pagerHeight + 45 });
  }

  ngOnInit() {
    this.columns = [
      {
        // TODO: 因数据库拼写错误，所以这里也要拼错
        field: 'bacthNumber',
        headerName: '批次号',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'scheduleRegionCode',
        headerName: '事业部',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'capacityType',
        headerName: '产能分类',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'division1',
        headerName: '第一维度',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'division2',
        headerName: '第二维度',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'division3',
        headerName: '第三维度',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'reqNumber',
        headerName: '订单号',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'reqLineNum',
        headerName: '行号',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'itemCode',
        headerName: '产品编码',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'itemDesc',
        headerName: '产品名称',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'demandDate',
        headerName: '需求日期',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'reqQty',
        headerName: '需求数量',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      },
      {
        field: 'plantCode',
        headerName: '分配工厂',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate1,
        },
      }
      ,
      {
        field: 'distributionDate',
        headerName: '分配日期',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate2,
        },
      }
      ,
      {
        field: 'allocationQty',
        headerName: '分配数量',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      }
      ,
      {
        field: 'priority',
        headerName: '订单优先级',
        menuTabs: ['filterMenuTab', 'columnsMenuTab']
      }
      ,
      {
        field: 'usedType',
        headerName: '占用类型',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
        valueFormatter: 'ctx.optionsFind(value,1).label'
      }
    ];
    this.gridData = [];
    this.headerNameTranslate(this.columns);
    this.cloneQueryParams();
    this.init();
  }

  /**
   * 初始化
   */
  protected init(): void {
    // 占用类型
    this.queryService.GetLookupByTypeRef('PP_ALLOCATION_TYPE', this.usedTypeList);
    // 批次号
    this.queryService.GetBatchNoList().subscribe(res => {
      res.data.forEach(data => {
        this.batchList.push({ value: data, label: data });
      });
    });
    // 事业部
    this.queryService.GetAllScheduleRegion().subscribe(res => {
      res.data.forEach(data => {
        this.regionList.push({ value: data.scheduleRegionCode, label: data.scheduleRegionCode });
      });
    });
    // 工厂
    this.loadPlant();
    // 产能分类
    this.loadCapacityType();
    // 维度
    this.loadDivision();
  }
  // 加载工厂
  loadPlant() {
    this.queryParams.values.plantCode = null;
    this.plantList.length = 0;
    this.queryService.GetUserPlant(this.queryParams.values.scheduleRegionCode).subscribe(res => {
      res.Extra.forEach(data => {
        this.plantList.push({ value: data.plantCode, label: data.plantCode });
      });
    });
  }
  // 加载产能分类
  loadCapacityType() {
    this.queryParams.values.capacityType = null;
    this.capacityTypeList.length = 0;
    this.sopCapacityService.getDemandDivisions(this.queryParams.values.scheduleRegionCode, '').subscribe(
      res => {
        res.data.forEach(item => {
          this.capacityTypeList.push({ value: item.divisionValue, label: item.divisionValue });
        });
      }
    );
  }
  // 加载需求维度
  loadDivision() {
    this.queryParams.values.division1 = null;
    this.queryParams.values.division2 = null;
    this.queryParams.values.division3 = null;
    this.division1List.length = 0;
    this.division2List.length = 0;
    this.division3List.length = 0;
    this.sopDemandAnalysisdmService.GetDemand(this.queryParams.values.scheduleRegionCode).subscribe(res => {
      res.data.forEach(data => {
        if (data !== '产能分类')
          this.division1List.push({ value: data, label: data });
      });
      this.division1List.forEach(item => {
        this.division2List.push(item);
        this.division3List.push(item);
      });
    });
  }
  // 切换事业部
  regionChange() {
    // 工厂
    this.loadPlant();
    // 产能分类
    this.loadCapacityType();
    // 维度
    this.loadDivision();
  }

  // 查询请求结果
  public result: any;
  // 设置网格数据源
  public setGridData() {
    if (!this.isNull(this.result)) {
      if (this.selectIndex === 1) {
        this.exportFileName = '分单结果展示-汇总';
        this.gridData = this.result.sumList || [];
      } else {
        this.gridData = this.result.detailList || [];
        this.exportFileName = '分单结果展示-明细';
      }
    }
  }

  expColumns = this.columns;
  expColumnsOptions = [{ field: 'usedType', options: this.usedTypeList }];
  /**
   * 导出
   */
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }

  /**
   * 查询
   */
  public query() {
    super.query();
    this.queryCommon();
  }

  /**
   * 查询的公共方法
   */
  public queryCommon() {
    const params = this.getQueryParams();
    this.queryService.loadGridView({
      url: this.queryService.QueryUrl,
      method: HttpMethod.get
    }, params, this.context,
      (result) => {
        // 数据预处理
        console.log('数据预处理');
        this.result = result.data;
        this.columnRename();
      },
      () => {
        this.setGridData();
        // 回调
        console.log('回调:');
        console.log(this.gridData);
      });
  }
  // 修改type=1分配工厂/type=2分配日期
  Save(dataItem: any, type: number) {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate((type === 1 ? '是否确认修改分配工厂?' : '是否确认修改分配日期?')),
      nzOnOk: () => {
        this.queryService.Save(dataItem).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('保存成功'));
            dataItem.distributionDate = this.queryService.formatDateTime(dataItem.distributionDate);
            dataItem.distRibutionDateEdit = false;
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }
  // 编辑分配日期
  onClick(dataItem: any) {
    dataItem.distRibutionDateEdit = true;
  }
  /**
   * 列名替换
   */
  public columnRename() {
    // 替换维度 列名
    const dimensions = ['division1', 'division2', 'division3'];
    dimensions.forEach(d => {
      if (!this.isNull(this.queryParams.values[d])) {
        this.curTabColumns.find(it => it.field === d).headerName = this.queryParams.values[d];
      } else {
        const title = this.queryParams.defines.find(it => it.field === d).title;
        this.curTabColumns.find(it => it.field === d).headerName = title;
      }
    });
    this.gridApi.setColumnDefs([]);
    this.gridApi.setColumnDefs(this.curTabColumns);
  }

  /**
   * 构造查询参数
   */
  public getQueryParams(): any {
    const dto = this.clone(this.queryParams.values);
    dto.IsExport = true;
    return dto;
  }

  /* tab切换 */
  selectIndex = 1;
  tabSubject = new Subject<{ index: number, curColDef: any[], columnApi: any, gridApi: any }>();
  curTabColumns: any[] = [];

  tabSelect(arg: any): void {
    if (arg.index == null) {
      this.selectIndex = 1;
    } else {
      this.selectIndex = arg.index;
    }

    const curDisabledColumns = this.tabs.find(h => h.index === this.selectIndex).hiddenColumns;
    this.curTabColumns = this.columns.filter(c => !curDisabledColumns.find(cc => cc === c.field));
    this.tabSubject.next({
      index: this.selectIndex,
      curColDef: this.curTabColumns,
      columnApi: this.gridColumnApi,
      gridApi: this.gridApi,
    });
    setTimeout(() => {
      this.setGridData();
    });
    this.gridApi.redrawRows();
  }

  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabSelect({ index: 1 });
  }
}
