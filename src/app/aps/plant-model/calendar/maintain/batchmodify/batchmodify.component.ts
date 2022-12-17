/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:08:59
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-10 14:50:47
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State, process } from '@progress/kendo-data-query';
import { QueryService } from '../../query.service';
import { CustomBaseContext } from '../../../../../modules/base_module/components/custom-base-context.component';
import { UiType } from '../../../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-batchmodify',
  templateUrl: './batchmodify.component.html',
  styles: [`    
  :host ::ng-deep .ant-calendar-picker
  {
    width: 100% !important;
  }`],
  providers: [QueryService],
})
export class PlantModelCalendarBatchModifyComponent extends CustomBaseContext implements OnInit {
  expandForm = true;
  public expandForm1 = true;
  // 主界面参数- 默认组织
  public userOrganization = {
    scheduleRegionCode: '',
    plantCode: '',
    scheduleGroupCode: '',
    resourceCode: '',
  };
  // 修改区绑定参数
  public i = {
    lineIds: [],
    dateRange: [],
    calendarDayMin: '',
    calendarDayMax: '',
    enableFlag: '',
    showStartTime: new Date('1970-01-01 00:00:00'),
    showEndTime: new Date('1970-01-01 23:59:59'),
    isMoreDays: true,
    efficency: 100,
  };
  // grid keyfield
  public selectBy = 'id';
  // 下拉框数据项
  public regionOptions: any[] = [];
  public plantOptions: any[] = [];
  public groupOptions: any[] = [];
  public lineOptions: any[] = [];
  public enableOptions: any[] = [];

  // 查询区参数
  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '事业部', required: true, ui: { type: UiType.select, options: this.regionOptions, eventNo: 1 } },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 2 } },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.groupOptions, eventNo: 3 } },
      { field: 'resourceCode', title: '资源', ui: { type: UiType.select, options: this.lineOptions } }
    ],
    values: {
      scheduleRegionCode: '',
      plantCode: '',
      scheduleGroupCode: '',
      resourceCode:'',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  public columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '资源描述', tooltipField: 'descriptions', menuTabs: ['filterMenuTab'] }
  ];
  // 构造函数
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 210;
  }
  // 初始化
  ngOnInit(): void {
    // this.setGridHeight({ topMargin: 335  /*网格上边框距离浏览器工具栏下边框的距离（像素）*/, bottomMargin: 80 });
    // 设置默认查询参数
    this.setDefaultQueryParams();
    // 事业部
    this.commonQueryService.GetScheduleRegions()
      .subscribe(result => {
        result.data.forEach(d => {
          this.regionOptions.push({ value: d.scheduleRegionCode, label: d.scheduleRegionCode });
        });
      });
    // 工厂
    this.loadPlant();
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();
    // 是否有效SYS_ENABLE_FLAG
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    this.query();
  }
  // 查询
  public query() {
    super.query();
    this.queryCommon();
  }
  httpAction = { url: this.commonQueryService.seachUrl1, method: 'GET' };
 // 获取查询参数值
 private getQueryParamsValue(): any {
  return {
    regionCode: this.queryParams.values.scheduleRegionCode,
    plantCode: this.queryParams.values.plantCode,
    groupCode: this.queryParams.values.scheduleGroupCode,
    resourceCode: this.queryParams.values.resourceCode,
  };
}


  // 查询请求
  private queryCommon() {
    this.queryParams.values.pageIndex = this._pageNo;
    this.queryParams.values.pageSize = this._pageSize;
    this.setLoading(true);
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);
    // this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plantCode,this.queryParams.values.scheduleGroupCode,this.queryParams.values.resourceCode).subscribe(result => {
    //   if (result !== null && result.Extra !== null)
    //     this.view = {
    //       data: process(result.Extra, {
    //         sort: this.gridState.sort,
    //         skip: 0,
    //         take: this.gridState.take,
    //         filter: this.gridState.filter
    //       }).data,
    //       total: result.Extra.length
    //     };
    //   this.setLoading(false);
    // });
  
    // this.commonQueryService.GetUserPlantGroupLinePage(this.queryParams.values).subscribe(result => {
    //   if (result !== null && result.Result !== null)
    //     this.view = {
    //       data: process(result.Result, {
    //         sort: this.gridState.sort,
    //         skip: 0,
    //         take: this.gridState.take,
    //         filter: this.gridState.filter
    //       }).data,
    //       total: result.TotalCount
    //     };
    //   this.setLoading(false);
    // });
  }
  // 重置
  public clear() {
    super.clear();
    this.loadPlant(); // 加载工厂
    this.loadGroup();
    this.loadLine();
  }
  // 设置默认查询参数
  private setDefaultQueryParams() {
    this.queryParams.values.scheduleRegionCode = this.userOrganization.scheduleRegionCode || '';
    this.queryParams.values.plantCode = this.userOrganization.plantCode || '';
    // this.queryParams.values.scheduleGroupCode = this.userOrganization.scheduleGroupCode || '';
    // this.queryParams.values.resourceCode = this.userOrganization.resourceCode || '';
    this.cloneQueryParams();
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // // 页码切换
  // onPageChanged({ pageNo, pageSize }) {
  //   this.gridApi.paginationSetPageSize(pageSize);
  //   // this.gridApi.paginationGoToPage(pageNo - 1);
  //   // this.setLoading(false);
  //   this.queryCommon();
  // }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }


  // 确定修改
  public modify() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择记录!'));
      return;
    }
    // datetime to string
    this.i.showStartTime = this.commonQueryService.formatDateTime(this.i.showStartTime);
    this.i.showEndTime = this.commonQueryService.formatDateTime(this.i.showEndTime);
    this.i.calendarDayMin = this.commonQueryService.formatDateTime(this.i.dateRange[0]);
    this.i.calendarDayMax = this.commonQueryService.formatDateTime(this.i.dateRange[1]);
    this.i.lineIds = this.selectionKeys;

    this.commonQueryService.BatchModifyEfficency(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        // this.modal.close(true);
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(res.msg));
      }
    });
    this.i.showStartTime = new Date(this.i.showStartTime);
    this.i.showEndTime = new Date(this.i.showEndTime);
  }
  /**关闭 */
  public close() {
    this.modal.destroy();
  }
  // grid 下拉项替换
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.enableOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }
  /**切换事业部 */
  public regionChange(value: string) {
    this.queryParams.values.plantCode = null;
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.resourceCode = null;
    this.loadPlant(); // 加载工厂
    this.loadGroup();
    this.loadLine();
  }
  /**切换工厂 */
  public plantChange(value: string) {
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.resourceCode = null;
    this.loadGroup();
    this.loadLine();
  }
  /**切换计划组 */
  public groupChange(value: string) {
    this.queryParams.values.resourceCode = null;
    this.loadLine();
  }
  // 加载工厂
  private loadPlant() {
    this.plantOptions.length = 0;
    this.commonQueryService.GetUserPlant(this.queryParams.values.scheduleRegionCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.plantOptions.push({ value: d.plantCode, label: d.plantCode, scheduleRegionCode: d.scheduleRegionCode });
          if (this.queryParams.values.plantCode !== '' && this.queryParams.values.plantCode === d.plantCode) {
            this.queryParams.values.scheduleRegionCode = d.scheduleRegionCode;
          }
        });
      });
  }
  // 加载计划组
  private loadGroup() {
    this.groupOptions.length = 0;
    this.commonQueryService.GetUserPlantGroup(this.queryParams.values.plantCode || '', this.queryParams.values.scheduleRegionCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.groupOptions.push({ value: d.scheduleGroupCode, label: d.scheduleGroupCode });
        });
      });
  }
  // 加载产线
  private loadLine() {
    this.lineOptions.length = 0;
    if ((this.queryParams.values.plantCode || '') === '' && (this.queryParams.values.scheduleGroupCode || '') === '') return;
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plantCode || '', this.queryParams.values.scheduleGroupCode || '')
      .subscribe(result => {
        this.lineOptions.length = 0;
        result.Extra.forEach(d => {
          this.lineOptions.push({ value: d.resourceCode, label: d.resourceCode });
        });
      });
  }
}
