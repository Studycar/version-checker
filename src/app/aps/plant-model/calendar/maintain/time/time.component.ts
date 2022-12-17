import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State, process } from '@progress/kendo-data-query';
import { QueryService } from '../../query.service';
import { CustomBaseContext } from '../../../../../modules/base_module/components/custom-base-context.component';
import { UiType } from '../../../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';
import { PlantModelCalendarTimeEditComponent } from './edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-time',
  templateUrl: './time.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarTimeComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  expandForm = false;
  // 默认组织
  public userOrganization = {
    scheduleRegionCode: '',
    plantCode: '',
    scheduleGroupCode: '',
    resourceCode: '',
    calendarCode: '',
  };
  public selectBy = 'ID';
  // 下拉选项
  public calendarOptions: any[] = [];
  public shiftOptions: any[] = [];
  public shiftIntervalOptions: any[] = [];
  // 查询参数定义
  public queryParams = {
    // defines: [
    //   { field: 'calendarCode', title: '日历编码', ui: { type: UiType.select, options: this.calendarOptions, eventNo: 1 } },
    //   { field: 'shiftCode', title: '班次', ui: { type: UiType.select, options: this.shiftOptions } }
    // ],
    values: {
      calendarCode: '',
      shiftCode: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'calendarCode', headerName: '日历编码', menuTabs: ['filterMenuTab'] },
    { field: 'shiftCode', headerName: '车间班次编码', tooltipField: 'PARAMETER_NAME', menuTabs: ['filterMenuTab'] },
    { field: 'shiftName', headerName: '车间班次描述', menuTabs: ['filterMenuTab'] },
    { field: 'shiftIntervalCode', headerName: '班次', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'showStartTime', headerName: '开始时间', menuTabs: ['filterMenuTab'] },
    { field: 'showEndTime', headerName: '结束时间', menuTabs: ['filterMenuTab'] },
    { field: 'restTime', headerName: '休息时间(小时)', menuTabs: ['filterMenuTab'] },
    { field: 'lendCapacity', headerName: '借用时间(小时)', menuTabs: ['filterMenuTab'] },
    { field: 'efficency', headerName: '开动率', menuTabs: ['filterMenuTab'] }
  ];

  // grid下拉选项查找
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.shiftIntervalOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
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
    this.setDefaultQueryParams();
    // 日历编码
    this.commonQueryService.GetCalendarList({}).subscribe(result => {
      this.calendarOptions.length = 0;
      result.data.forEach(d => {
        this.calendarOptions.push({
          label: d.calendarCode,
          value: d.calendarCode,
          scheduleRegionCode: d.scheduleRegionCode
        });
      });
    });
    // 班次编码
    this.loadShift();
    // 时段模板SHIFT_CODE
    this.commonQueryService.GetLookupByTypeRef('PS_SHIFT_CODE', this.shiftIntervalOptions);
    this.queryCommon();
  }
  // 重置
  public clear() {
    super.clear();
    // 班次编码
    this.loadShift();
  }
  // 设置默认查询参数
  private setDefaultQueryParams() {
    this.queryParams.values.calendarCode = this.userOrganization.calendarCode;
    // 备份初始化查询参数
    this.cloneQueryParams();
  }

  // 切换日历编码
  public calendarChange(value: any) {
    this.queryParams.values.shiftCode = null;
    // 班次
    this.loadShift();
  }
  // 加载班次
  private loadShift() {
    // 班次编码
    this.commonQueryService.GetShiftListRef({ calendarCode: this.queryParams.values.calendarCode }, this.shiftOptions);
  }
  // 查询
  public query() {
    super.query();
    this.queryCommon();
  }
  // 查询请求
  private queryCommon() {
    this.queryParams.values.pageIndex = this._pageSize;
    this.queryParams.values.pageSize = this._pageSize;
    this.setLoading(true);
    this.commonQueryService.QueryTime(this.queryParams.values).subscribe(result => {
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
  selectKeys = 'Id';

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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
      .static(PlantModelCalendarTimeEditComponent, { i: (item !== undefined ? this.clone(item) : { ID: null }) })
      .subscribe((value) => { if (value) { this.queryCommon(); } });
  }
  // 删除
  public remove(item: any) {
    this.commonQueryService.RemoveTime(item.ID).subscribe(res => {
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
          .BatchRemoveTime(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
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
