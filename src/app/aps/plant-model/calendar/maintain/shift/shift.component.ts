import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State, process } from '@progress/kendo-data-query';
import { QueryService } from '../../query.service';
import { CustomBaseContext } from '../../../../../modules/base_module/components/custom-base-context.component';
import { UiType } from '../../../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';
import { PlantModelCalendarShiftEditComponent } from './edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-shift',
  templateUrl: './shift.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarShiftComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  // 日历班次参数
  i: any;
  public selectBy = 'ID';
  public enableOptions: any[] = [];
  // 查询参数定义（无效的）
  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '事业部', ui: { type: UiType.text } },
      { field: 'calendarCode', title: '日历编码', ui: { type: UiType.text } }
    ],
    values: {
      scheduleRegionCode: '',
      calendarCode: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };
  // grid列定义
  // public columns = [
  //   { field: 'shiftCode', title: '班次编码', width: 200, locked: false },
  //   { field: 'descriptions', title: '班次描述', width: 320, locked: false },
  //   { field: 'enableFlag', title: '是否有效', width: 200, locked: false, ui: { type: 'select', index: 1 } }
  // ];

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,        // Complementing the Cell Renderer parameters
      }
    },
    { field: 'shiftCode', headerName: '车间班次编码', menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '车间班次描述', tooltipField: 'PARAMETER_NAME', menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] }
  ];

  // grid下拉选项查找
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
    // super.clear();
  }
  // 构造函数
  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appconfig: AppConfigService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 265;
  }
  // 初始化
  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    // this.setGridHeight({ topMargin: 245  /*网格上边框距离浏览器工具栏下边框的距离（像素）*/, bottomMargin: 80 });
    this.setDefaultQueryParams();
    // 是否有效SYS_ENABLE_FLAG
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    this.queryCommon();
  }
  // 设置默认查询参数
  private setDefaultQueryParams() {
    this.queryParams.values.scheduleRegionCode = this.i.scheduleRegionCode || '';
    this.queryParams.values.calendarCode = this.i.calendarCode || '';
    // 备份初始化查询参数
    this.cloneQueryParams();
  }
  // 查询
  public query() {
    super.query();
    this.queryCommon();
  }
  // 查询请求
  private queryCommon() {
    this.queryParams.values.pageIndex = this._pageNo;
    this.queryParams.values.pageSize = this._pageSize;
    this.setLoading(true);
    this.commonQueryService.QueryShift(this.queryParams.values).subscribe(result => {
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
      .static(PlantModelCalendarShiftEditComponent, { i: (item !== undefined ? this.clone(item) : { scheduleRegionCode: this.i.scheduleRegionCode, calendarCode: this.i.calendarCode, shiftCode: '', ID: null }) })
      .subscribe((value) => { if (value) { this.queryCommon(); } });
  }
  // 删除
  public remove(item: any) {
    this.commonQueryService.RemoveShift(item.ID).subscribe(res => {
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
          .BatchRemoveShift(this.selectionKeys)
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
