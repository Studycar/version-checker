/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:08:59
 * @LastEditors: Zwh
 * @LastEditTime: 2019-08-22 20:44:12
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State, process } from '@progress/kendo-data-query';
import { QueryService } from '../../query.service';
import { CustomBaseContext } from '../../../../../modules/base_module/components/custom-base-context.component';
import { UiType, QueryParamDefineObject } from '../../../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-resourcetime',
  templateUrl: './resourcetime.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarResourceTimeComponent extends CustomBaseContext implements OnInit {

  expandForm = false;
  treeLevel = 0;
  dtDateTypeSelectDefault: any[] = [
    { 'isWork': '一', 'IS_WORK_V': 'Monday', level: this.treeLevel },
    { 'isWork': '二', 'IS_WORK_V': 'Tuesday', level: this.treeLevel },
    { 'isWork': '三', 'IS_WORK_V': 'Wednesday', level: this.treeLevel },
    { 'isWork': '四', 'IS_WORK_V': 'Thursday', level: this.treeLevel },
    { 'isWork': '五', 'IS_WORK_V': 'Friday', level: this.treeLevel }
  ];
  dtDateTypeSelect = [...this.dtDateTypeSelectDefault];
  // 默认组织
  public userOrganization = {
    scheduleRegionCode: '',
    plantCode: '',
    scheduleGroupCode: '',
    resourceCode: '',
    calendarCode: ''
  };
  public selectBy = 'id'; // shiftIntervalCode
  // 下拉选项
  public plantOptions: any[] = [];
  public regionOptions: any[] = [];
  public groupOptions: any[] = [];
  public lineOptions: any[] = [];
  public shiftOptions: any[] = [];
  public enableOptions: any[] = [];
  public shiftIntervalOptions: any[] = [];
  public calendarOptions: any[] = [];
  dataFieldDefault = 'Monday,Tuesday,Wednesday,Thursday,Friday';
  dataField = { 'isWork': this.dataFieldDefault };

  // 工作时间树形选择列
  columnDateType: any[] = [
    { field: 'IS_WORK_V', title: '英文', width: '200px' },
    { field: 'isWork', title: '中文', width: '200px' }
  ];

  dtDate: any[] = [
    { 'isWork': '一', 'IS_WORK_V': 'Monday' },
    { 'isWork': '二', 'IS_WORK_V': 'Tuesday' },
    { 'isWork': '三', 'IS_WORK_V': 'Wednesday' },
    { 'isWork': '四', 'IS_WORK_V': 'Thursday' },
    { 'isWork': '五', 'IS_WORK_V': 'Friday' },
    { 'isWork': '六', 'IS_WORK_V': 'Saturday' },
    { 'isWork': '日', 'IS_WORK_V': 'Sunday' }
  ];

  /*  -------------------------树形选择（产线复选）--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'resourceCode', title: '名称', width: '200px' },
    { field: 'descriptions', title: '描述', width: '200px' }
  ]; // 产线树形显示列
  public selection: any[] = []; // 选中项
  /*    ---------------------------------------------------------- */

  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '事业部', required: true, ui: { type: UiType.select, options: this.regionOptions, eventNo: 1 } },
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'scheduleGroupCode', title: '计划组', required: true, ui: { type: UiType.select, options: this.groupOptions, eventNo: 2 } },
      { field: 'resourceCode', title: '资源', required: true, ui: { type: UiType.treeSelect, options: [], columns: this.treeNodeColumns, selection: [], keyField: 'id', valueField: 'resourceCode', valueLevel: 0 } },
      { field: 'calendarCode', title: '日历编码', required: true, readonly: true, ui: { type: UiType.select, options: this.calendarOptions } },
      { field: 'shiftCode', title: '车间班次', required: true, ui: { type: UiType.select, options: this.shiftOptions, eventNo: 4 } },
      { field: 'IS_SATURDAY_WORK', title: '设置周六为工作日', ui: { type: UiType.checkbox } },
      { field: 'showStartTime', title: '开始日期', required: true, ui: { type: UiType.date } },
      { field: 'showEndTime', title: '结束日期', required: true, ui: { type: UiType.date } },
      { field: 'IS_SUNDAY_WORK', title: '设置周日为工作日', ui: { type: UiType.checkbox } }
    ],
    values: {
      scheduleRegionCode: null,
      plantCode: null,
      scheduleGroupCode: null,
      resourceCode: null,
      calendarCode: null,
      shiftCode: null,
      showStartTime: new Date(),
      showEndTime: '',
      IS_SATURDAY_WORK: false,
      IS_SUNDAY_WORK: false,
      isWork: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  // 返回指定field的参数定义项,找不到时返回undefined
  public findDefine(field: string = 'resourceCode'): QueryParamDefineObject {
    const result = this.queryParams.defines.find(x => x.field === field);
    return result;
  }

  public columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'calendarCode', headerName: '日历编码', menuTabs: ['filterMenuTab'] },
    { field: 'shiftCode', headerName: '车间班次编码', tooltipField: 'PARAMETER_NAME', menuTabs: ['filterMenuTab'] },
    { field: 'shiftIntervalCode', headerName: '班次', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'showStartTime', headerName: '开始时间', menuTabs: ['filterMenuTab'] },
    { field: 'showEndTime', headerName: '结束时间', menuTabs: ['filterMenuTab'] },
    { field: 'restTime', headerName: '休息时间(小时)', menuTabs: ['filterMenuTab'] },
    { field: 'efficency', headerName: '开动率(%)', menuTabs: ['filterMenuTab'] },
    { field: 'lendCapacity', headerName: '借用能力(小时)', menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] }
  ];

  // grid列选项查找
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.shiftIntervalOptions;
        break;
      case 2:
        options = this.enableOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }
  // 重置
  public clear() {
    super.clear();
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();

    // 日历编码
    this.loadCalendarCode();
    // 班次
    this.loadShift();
    setTimeout(() => {
      this.dataField = { 'isWork': this.dataFieldDefault };
      this.dtDateTypeSelect = [...this.dtDateTypeSelectDefault];
    });
  }

  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 140;
  }

  ngOnInit(): void {
    // this.setGridHeight({ topMargin: 255  /*网格上边框距离浏览器工具栏下边框的距离（像素）*/, bottomMargin: 80 });
    this.setDefaultQueryParams();
    // 事业部
    this.regionOptions.length = 0;
    this.commonQueryService.GetScheduleRegions().subscribe(result => {
      result.data.forEach(d => {
        this.regionOptions.push({ value: d.scheduleRegionCode, label: d.scheduleRegionCode });
      });
    });
    // 工厂
    this.loadUserPlant();
    // 计划组
    this.loadGroup();
    // 日历编码
    this.loadCalendarCode();

    // 是否有效SYS_ENABLE_FLAG
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    // 时段模板SHIFT_CODE
    this.commonQueryService.GetLookupByTypeRef('PS_SHIFT_CODE', this.shiftIntervalOptions);

  }
  // 设置默认查询参数
  private setDefaultQueryParams() {
    console.log('setDefaultQueryParams');
    console.log(this.userOrganization);
    this.queryParams.values.scheduleRegionCode = this.userOrganization.scheduleRegionCode;
    this.queryParams.values.calendarCode = this.userOrganization.calendarCode;
    this.queryParams.values.plantCode = this.userOrganization.plantCode;
    // this.queryParams.values.scheduleGroupCode = this.userOrganization.scheduleGroupCode;
    // this.queryParams.values.resourceCode = this.userOrganization.resourceCode;
    // 备份初始化查询参数
    this.cloneQueryParams();
  }
  // 切换区域
  public regionChange(value: string) {
    this.queryParams.values.plantCode = null;
    // 工厂
    this.loadUserPlant();

  }
  // 切换工厂
  public plantChange(value: string) {
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.plantCode = null;
    this.queryParams.values.resourceCode = null;
    this.queryParams.values.calendarCode = null;
    if ((value || '') !== '') {
      const plantInfo = this.plantOptions.find(x => x.value === value);
      this.queryParams.values.plantCode = plantInfo.value || '';
    }
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();
    // 班次
    this.loadShift();
  }



  // 加载工厂
  private loadUserPlant() {
    this.plantOptions.length = 0;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });
      });
    });
  }

  // 加载计划组
  private loadGroup() {
    this.groupOptions.length = 0;
    if ((this.queryParams.values.plantCode || '') === '') return;
    this.commonQueryService.GetUserPlantGroup(this.queryParams.values.plantCode || '', this.queryParams.values.scheduleRegionCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.groupOptions.push({ value: d.scheduleGroupCode, label: d.scheduleGroupCode, plantCode: d.plantCode });
        });
      });
  }
  // 切换计划组
  public groupChange(value: string) {
    this.queryParams.values.resourceCode = null;
    if ((value || '') !== '') {
      const groupInfo = this.groupOptions.find(x => x.value === value);
      this.queryParams.values.plantCode = groupInfo.plantCode || '';
    }
    this.loadLine();
  }
  // 切换资源
  public resourceChange(resourceCode: string){
    this.queryParams.values.calendarCode = null;
    this.commonQueryService.GetCalendarByResourceCode(
      this.queryParams.values.plantCode || '',
      this.queryParams.values.resourceCode || ''
    ).subscribe(result => {
      if (result !== null && result.data !== null) {
        this.queryParams.values.calendarCode = result.data[0];
        this.loadShift();
      }

    });

  }

  // 切换工作日历编码
  public calendarChange(value: string) {
    this.queryParams.values.shiftCode = null;
    if ((value || '') !== '') {
      this.queryParams.values.calendarCode = value || '';
    }
    this.loadShift();
  }
  // 加载资源产线
  private loadLine() {
    this.lineOptions.length = 0;
    if ((this.queryParams.values.plantCode || '') === '') return;
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plantCode || '', this.queryParams.values.scheduleGroupCode || '')
      .subscribe(result => {
        this.lineOptions = result.Extra;
        this.findDefine().ui.options = result.Extra; // 注意：数据加载完再赋值
      });
  }
  // 加载班次
  private loadShift() {
    this.shiftOptions.length = 0;
    if ((this.queryParams.values.calendarCode || '') === '') return;
    // 班次编码
    this.commonQueryService.GetShiftList({
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode || '',
      calendarCode: this.queryParams.values.calendarCode || ''
    }).subscribe(result => {
      if (result.data !== undefined && result.data.length > 0) {
        result.data.forEach(d => {
          if (d.enableFlag === 'Y') {
            this.shiftOptions.push({
              value: d.shiftCode,
              label: d.descriptions
            });
          }
        });
      }
    });
  }

  // 加载工作日历编码
  private loadCalendarCode(isLoad: boolean = true) {
    this.calendarOptions.length = 0;
    this.commonQueryService
      .GetCalendarList({
        scheduleRegionCode:
          this.queryParams.values.scheduleRegionCode || '',
      })
      .subscribe(result => {
        result.data.forEach(d => {
          this.calendarOptions.push({
            label: d.calendarCode,
            value: d.calendarCode,
            scheduleRegionCode: d.scheduleRegionCode,
          });
        });


      });
  }

  // 切换产线(此方法废弃，按日历编码取班次)
  public lineChange(value: string) {
    this.queryParams.values.shiftCode = null;
    // 班次编码
    this.commonQueryService.GetResShiftList({ plantCode: this.queryParams.values.plantCode || '', resourceCode: value }).subscribe(result => {
      this.shiftOptions.length = 0;
      result.data.forEach(d => {
        this.shiftOptions.push({
          value: d.shiftCode,
          label: d.shiftName
        });
        if (value !== '' && value !== undefined) {
          this.queryParams.values.calendarCode = d.calendarCode;
        }
      });
    });
  }
  // 切换班次
  public shiftChange(value: string) {
    // this.query();
  }
  // 查询
  public query() {
    super.query();
    this.queryCommon();
  }
  // 查询请求
  private queryCommon() {
    if (this.isInValid()) {
      return;
    }
    this.selectionKeys.length = 0;
    this.queryParams.values.pageIndex = this._pageNo;
    this.queryParams.values.pageSize = this._pageSize;
    const dto = {
      calendarCode: this.queryParams.values.calendarCode,
      shiftCode: this.queryParams.values.shiftCode,
      pageIndex: this.queryParams.values.pageIndex,
      pageSize: this.queryParams.values.pageSize
    };
    this.setLoading(true);
    this.commonQueryService.QueryTime(dto).subscribe(result => {
      if (result !== null && result.data !== null)
        this.view = {
          data: process(result.data.content, {
            sort: this.gridState.sort,
            skip: 0,
            take: this.gridState.take,
            filter: this.gridState.filter
          }).data,
          total: result.data.totalElements === undefined ? 0 : result.data.totalElements,
        };
      this.setLoading(false);
    });
  }
  // 验证是否有效
  private isInValid(): boolean {
    return this.isEmpty(this.queryParams.values.scheduleRegionCode, '事业部')
      || this.isEmpty(this.queryParams.values.scheduleGroupCode, '计划组')
      || this.isEmpty(this.queryParams.values.resourceCode, '资源')
      || this.isEmpty(this.queryParams.values.calendarCode, '日历编码')
      || this.isEmpty(this.queryParams.values.shiftCode, '车间班次编码')
      || this.isEmpty(this.queryParams.values.showStartTime, '开始日期')
      || this.isEmpty(this.queryParams.values.showEndTime, '结束日期');
  }
  // 为空判断
  private isEmpty(value: any, message: string): boolean {
    let result = false;
    if (value === undefined || value === null || value === '') {
      result = true;
      this.msgSrv.warning(this.appTranslationService.translate(message + '不能为空！'));
    }
    return result;
  }
  selectKeys = 'id';

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    // this.gridApi.paginationGoToPage(pageNo - 1);
    // this.setLoading(false);
    this.queryCommon();
  }
  // 获取班次参数（初始化/删除）
  private getParamValues() {
    this.dtDateTypeSelect.forEach(x => {
      this.queryParams.values.isWork = this.queryParams.values.isWork + x.IS_WORK_V + ',';
    });
    return {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      plantCode: this.queryParams.values.plantCode,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      resourceCode: this.queryParams.values.resourceCode.split(',')[0],
      calendarCode: this.queryParams.values.calendarCode,
      shiftCode: this.queryParams.values.shiftCode,
      showStartTime: this.commonQueryService.formatDateTime(this.queryParams.values.showStartTime),
      showEndTime: this.commonQueryService.formatDateTime(this.queryParams.values.showEndTime),
      IS_SATURDAY_WORK: this.queryParams.values.IS_SATURDAY_WORK,
      IS_SUNDAY_WORK: this.queryParams.values.IS_SUNDAY_WORK,
      isWork: this.queryParams.values.isWork,
      timeIds: this.selectionKeys,
      resourceCodes: this.queryParams.values.resourceCode.split(','),
    };
  }
  // 初始化日历
  public init() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择记录!'));
      return;
    }
    this.setLoading(true);

    this.getParamValues()
    this.commonQueryService
      .InitResTime(this.getParamValues())
      .subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('初始化成功'));
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
        this.setLoading(false);
      });
  }
  // 删除
  public remove(item: any) {
    this.commonQueryService.RemoveResTime(this.getParamValues(), item.id, this.queryParams.values.resourceCode.split(',')).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }
  // 批量删除
  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录日历？'),
      nzOnOk: () => {
        this.commonQueryService
          .BatchRemoveResTime(this.getParamValues())
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              // this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }
}
