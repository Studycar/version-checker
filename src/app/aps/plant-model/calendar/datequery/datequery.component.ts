import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State, process } from '@progress/kendo-data-query';
import { QueryService } from '../query.service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { UiType } from '../../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { PlantModelCalendarDateQueryEditComponent } from './edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-datequery',
  templateUrl: './datequery.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarDateQueryComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  i: any;
  public selectBy = 'id'; // SHIFT_INTERVAL_CODE
  public enableOptions: any[] = [];

  public queryParams = {
    defines: [
      { field: 'scheduleGroupCode', title: '当前计划组', readonly: true, ui: { type: UiType.text } },
      { field: 'resourceCode', title: '当前资源', readonly: true, ui: { type: UiType.text } },
      { field: 'calendarCode', title: '当前日历', readonly: true, ui: { type: UiType.text } },
      { field: 'showCalendarDay', title: '日期', readonly: true, ui: { type: UiType.text } }
    ],
    values: {
      plantCode: '',
      scheduleGroupCode: '',
      resourceCode: '',
      calendarCode: '',
      showCalendarDay: '',
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
    { field: 'shiftCode', headerName: '车间班次编码' },
    { field: 'shiftName', headerName: '车间班次描述' },
    { field: 'shiftIntervalName', headerName: '班次' },
    { field: 'resourceCode', headerName: '资源' },
    { field: 'enableFlag', headerName: '是否有效', valueFormatter: 'ctx.optionsFind(value,1).label' },
    { field: 'showCalendarDay', headerName: '日期' },
    { field: 'showStartTime', headerName: '开始时间' },
    { field: 'showEndTime', headerName: '结束时间' },
    { field: 'restTime', headerName: '休息时间（小时）' },
    { field: 'lendCapacity', headerName: '借用能力（小时）' },
    { field: 'availableTime', headerName: '可用时间（小时）' },
    { field: 'efficency', headerName: '开动率%' },
    { field: 'availableCapacity', headerName: '可用产能（小时）' }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.enableOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public clear() {
    this.queryParams.values = {
      plantCode: this.i.plantCode,
      scheduleGroupCode: this.i.scheduleGroupCode,
      resourceCode: this.i.resourceCode,
      calendarCode: this.i.calendarCode,
      showCalendarDay: this.i.showCalendarDay,
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null }); }

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.setGridHeight({ topMargin: 340  /*网格上边框距离浏览器工具栏下边框的距离（像素）*/, bottomMargin: 0 });
    // 是否有效SYS_ENABLE_FLAG
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    this.clear();
    this.queryCommon();
  }
  public add(item?: any) {
    this.modal
      .static(PlantModelCalendarDateQueryEditComponent, { i: (item !== undefined ? this.clone(item) : { ID: null }) })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public query() {
    super.query();
    this.queryCommon();
  }
  private queryCommon() {
    this.queryParams.values.showCalendarDay = this.queryParams.values.showCalendarDay + " 00:00:00";
    this.queryParams.values.pageIndex = this.gridState.skip / this.gridState.take + 1;
    this.queryParams.values.pageSize = this.gridState.take;
    this.commonQueryService.loadGridViewNew({ url: this.commonQueryService.QueryResTimeUrl, method: 'POST' }, this.queryParams.values, this.context);
    // this.commonQueryService.QueryResTime(this.queryParams.values).subscribe(result => {
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
    // });
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

}
