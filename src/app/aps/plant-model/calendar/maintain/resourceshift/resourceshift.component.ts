import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State, process } from '@progress/kendo-data-query';
import { QueryService } from '../../query.service';
import { CustomBaseContext } from '../../../../../modules/base_module/components/custom-base-context.component';
import { UiType } from '../../../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';
import { PlantModelCalendarResourceShiftEditComponent } from './edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-resourceshift',
  templateUrl: './resourceshift.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarResourceShiftComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  expandForm = false;
  // 默认组织
  public userOrganization = {
    scheduleRegionCode: '',
    plantCode: '',
    scheduleGroupCode: '',
    resourceCode: '',
    calendarCode: ''
  };
  public selectBy = 'ID';
  // 下拉选项
  public regionOptions: any[] = [];
  public plantOptions: any[] = [];
  public groupOptions: any[] = [];
  public lineOptions: any[] = [];
  public calendarOptions: any[] = [];
  public shiftOptions: any[] = [];
  public enableOptions: any[] = [];
  // 查询参数定义
  public queryParams = {
    // defines: [
    //   { field: 'scheduleRegionCode', title: '事业部', required: true, ui: { type: UiType.select, options: this.regionOptions, eventNo: 1 } },
    //   { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 2 } },
    //   { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.groupOptions, eventNo: 3 } },
    //   { field: 'resourceCode', title: '资源', ui: { type: UiType.select, options: this.lineOptions, eventNo: 4 } },
    //   { field: 'resourceDescriptions', title: '资源描述', ui: { type: UiType.text } },
    //   { field: 'calendarCode', title: '日历编码', readonly: true, ui: { type: UiType.select, options: this.calendarOptions, eventNo: 5 } },
    //   { field: 'shiftCode', title: '班次', ui: { type: UiType.select, options: this.shiftOptions } },
    //   { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.enableOptions } }
    // ],
    values: {
      scheduleRegionCode: '',
      plantCode: '',
      scheduleGroupCode: null,
      resourceCode: null,
      resourceDescriptions: '',
      calendarCode: null,
      shiftCode: null,
      enableFlag: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };
  // grid 列定义
  // public columns = [
  //   { field: 'scheduleRegionCode', title: '事业部', width: 120, locked: false },
  //   { field: 'plantCode', title: '工厂', width: 120, locked: false },
  //   { field: 'scheduleGroupCode', title: '计划组', width: 120, locked: false },
  //   { field: 'resourceCode', title: '资源', width: 120, locked: false },
  //   { field: 'resourceDescriptions', title: '资源描述', width: 200, locked: false, ui: { tooltip: 1 } },
  //   { field: 'calendarCode', title: '日历编码', width: 120, locked: false },
  //   { field: 'shiftCode', title: '班次编码', width: 120, locked: false },
  //   { field: 'SHIFT_NAME', title: '班次描述', width: 120, locked: false },
  //   { field: 'enableFlag', title: '是否有效', width: 120, locked: false, ui: { type: 'select', index: 1 } }
  // ];

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,       // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'scheduleRegionCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'resourceDescriptions', headerName: '资源描述', tooltipField: 'resourceDescriptions', menuTabs: ['filterMenuTab'] },
    { field: 'calendarCode', headerName: '日历编码', menuTabs: ['filterMenuTab'] },
    { field: 'shiftCode', headerName: '车间班次编码', menuTabs: ['filterMenuTab'] },
    { field: 'SHIFT_NAME', headerName: '车间班次描述', menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] }
  ];

  // grid列下拉选项查找
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.enableOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }
  // 重置
  public clear() {
    super.clear();
    // 日历
    this.loadCalendar();
    // 工厂
    this.loadPlant();
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();
  }
  // 构造函数
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
    this.gridHeight = 265;
  }
  // 初始化
  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    // this.setGridHeight({ topMargin: 255  /*网格上边框距离浏览器工具栏下边框的距离（像素）*/, bottomMargin: 80 });
    // 设置默认查询参数
    this.setDefaultQueryParams();
    // 事业部
    this.commonQueryService.GetScheduleRegions()
      .subscribe(result => {
        result.data.forEach(d => {
          this.regionOptions.push({ value: d.scheduleRegionCode, label: d.scheduleRegionCode });
        });
      });
    // 日历
    this.loadCalendar(true);
    // 工厂
    this.loadPlant();
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine(true);
    // 是否有效SYS_ENABLE_FLAG
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    this.queryCommon();
  }
  // 设置默认查询参数
  private setDefaultQueryParams() {
    this.queryParams.values.scheduleRegionCode = this.userOrganization.scheduleRegionCode || '';
    this.queryParams.values.plantCode = this.userOrganization.plantCode || '';
    // this.queryParams.values.scheduleGroupCode = this.userOrganization.scheduleGroupCode || '';
    // this.queryParams.values.resourceCode = this.userOrganization.resourceCode || '';
    this.queryParams.values.calendarCode = this.userOrganization.calendarCode || '';
  }
  // 切换区域
  public regionChange(value: string) {
    this.queryParams.values.calendarCode = null;
    this.queryParams.values.plantCode = null;
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.resourceCode = null;
    this.queryParams.values.resourceDescriptions = null;
    this.loadCalendar();
    this.loadPlant(); // 工厂
    this.loadGroup();
    this.loadLine(true);
  }
  // 切换日历
  public calendarChange(value: string) {
    this.queryParams.values.shiftCode = null;
    // 班次编码
    this.commonQueryService.GetShiftListRef({ calendarCode: this.queryParams.values.calendarCode || '' }, this.shiftOptions);
  }
  // 切换工厂
  public plantChange(value: string) {
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.resourceCode = null;
    this.queryParams.values.resourceDescriptions = '';
    this.loadGroup();
    this.loadLine();
  }
  // 切换计划组
  public groupChange(value: string) {
    this.queryParams.values.resourceCode = null;
    this.queryParams.values.resourceDescriptions = '';
    this.loadLine();
  }
  // 切换资源
  public resourceChange(value: string) {
    if (this.lineOptions.length > 0 && (value || '') !== '') {
      const line = this.lineOptions.find(x => x.value === value);
      this.queryParams.values.resourceDescriptions = line.DESCRIPTIONS || '';
    } else {
      this.queryParams.values.resourceDescriptions = '';
    }
  }
  // 加载工厂
  private loadPlant() {
    this.plantOptions.length = 0;
    this.commonQueryService.GetUserPlant(this.queryParams.values.scheduleRegionCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.plantOptions.push({ value: d.plantCode, label: d.plantCode });
        });
      });
  }
  // 加载日历编码
  private loadCalendar(isLoad: boolean = false) {
    // 日历编码
    // this.commonQueryService.GetCalendarListRef({ scheduleRegionCode: this.queryParams.values.scheduleRegionCode || '' }, this.calendarOptions);
    this.calendarOptions.length = 0;
    this.commonQueryService.GetCalendarList({ scheduleRegionCode: this.queryParams.values.scheduleRegionCode || '' }).subscribe(result => {
      result.data.forEach(d => {
        this.calendarOptions.push({
          label: d.calendarCode,
          value: d.calendarCode,
          scheduleRegionCode: d.scheduleRegionCode
        });
      });
      const calendar = this.calendarOptions.find(x => x.scheduleRegionCode === this.queryParams.values.scheduleRegionCode);
      this.queryParams.values.calendarCode = calendar.value || '';
      // 加载班次
      this.calendarChange('');
      if (isLoad) {
        // 备份初始化查询参数
        this.cloneQueryParams();
      }
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
  // 加载资源产线
  private loadLine(isLoad: boolean = false) {
    this.lineOptions.length = 0;
    if ((this.queryParams.values.plantCode || '') === '') return;
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plantCode || '', this.queryParams.values.scheduleGroupCode || '')
      .subscribe(result => {
        this.lineOptions.length = 0;
        result.Extra.forEach(d => {
          this.lineOptions.push({ value: d.resourceCode, label: d.resourceCode, DESCRIPTIONS: d.DESCRIPTIONS });
        });
        if (isLoad) {
          this.resourceChange(this.queryParams.values.resourceCode);
        }
      });
  }
  // 查询
  public query() {
    super.query();
    this.queryCommon();
  }
  // 查询请求
  private queryCommon() {
    // this.queryParams.values.pageIndex = this.gridState.skip / this.gridState.take + 1;
    // this.queryParams.values.pageSize = this.gridState.take;
    this.queryParams.values.pageIndex = this._pageNo;
    this.queryParams.values.pageSize = this._pageSize;
    this.setLoading(true);
    this.commonQueryService.QueryResShift(this.queryParams.values).subscribe(result => {
      if (result !== null && result.data !== null) {
        this.gridData = result.data.content;
        this.view = {
          data: process(result.data.content, {
            sort: this.gridState.sort,
            skip: 0,
            take: this.gridState.take,
            filter: this.gridState.filter
          }).data,
          total: result.data.totalElements === undefined ? 0 : result.data.totalElements,
        };
      }
      this.setLoading(false);
    });
  }
  selectKeys = 'Id';

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
  // 新增
  public add(item?: any) {
    this.modal
      .static(PlantModelCalendarResourceShiftEditComponent, {
        i: (item !== undefined ? this.clone(item) : {
          ID: null
        })
      })
      .subscribe((value) => { if (value) { this.queryCommon(); } });
  }
  // 删除
  public remove(item: any) {
    this.commonQueryService.RemoveResShift(item.ID).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.queryCommon();
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
      nzContent: this.appTranslationService.translate('是否确认删除该记录？'),
      nzOnOk: () => {
        this.commonQueryService
          .BatchRemoveResShift(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200 ) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }
}
