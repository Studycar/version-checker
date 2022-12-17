import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { UiType } from '../../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from '../query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { PlantModelCalendarMaintainEditComponent } from './edit/edit.component';
import { State, process } from '@progress/kendo-data-query';
import { PlantModelCalendarShiftComponent } from './shift/shift.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PlantModelCalendarShiftTimeComponent } from './shifttime/shifttime.component';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
/**
 * 日历班次
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-maintain',
  templateUrl: './maintain.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarMaintainComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public selectBy = 'id';
  expandForm = false;
  // 查询下拉框
  public regionOptions: any[] = [];
  public enableOptions: any[] = [];
  // 默认组织
  public userOrganization = {
    scheduleRegionCode: '',
    plantCode: '',
    scheduleGroupCode: '',
    resourceCode: '',
    calendarCode: '',
  };
  // 查询参数定义
  public queryParams = {
    values: {
      scheduleRegionCode:  this.appconfig.getActiveScheduleRegionCode(),
      calendarCode: '',
      descriptions: '',
      enableFlag: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
    },
  };

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 100,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      field: 'scheduleRegionCode',
      headerName: '事业部',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'calendarCode',
      headerName: '日历编码',
      tooltipField: 'PARAMETER_NAME',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'descriptions',
      headerName: '描述',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      headerName: '是否有效',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },
  ];

  // 构造函数
  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appconfig: AppConfigService,
    private comQueryService: CommonQueryService,
  ) {
    super({
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
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
    this.comQueryService.GetScheduleRegions().subscribe(result => {
      result.data.forEach(d => {
        this.regionOptions.push({
          value: d.scheduleRegionCode,
          label: d.scheduleRegionCode,
        });
      });
      this.queryCommon();
    });
    // 是否有效SYS_ENABLE_FLAG
    this.commonQueryService.GetLookupByTypeRef(
      'FND_YES_NO',
      this.enableOptions,
    );
  }
  // grid列下拉选项
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
    this.commonQueryService
      .QueryCalendar(this.queryParams.values)
      .subscribe(result => {
        if (result !== null && result.data.content !== null)
          this.view = {
            data: process(result.data.content, {
              sort: this.gridState.sort,
              skip: 0,
              take: this.gridState.take,
              filter: this.gridState.filter,
            }).data,
            total: result.data.totalPages,
          };
        this.setLoading(false);
      });
  }
  // 设置默认查询参数
  private setDefaultQueryParams() {
    this.queryParams.values.scheduleRegionCode =
      this.userOrganization.scheduleRegionCode || '';
    // this.queryParams.values.calendarCode = this.userOrganization.calendarCode || '';
    // 备份初始化查询参数
    this.cloneQueryParams();
  }

  selectKeys = 'id';

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
      .static(PlantModelCalendarMaintainEditComponent, {
        i: item !== undefined ? this.clone(item) : { id: null },
      })
      .subscribe(value => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  // 删除
  public remove(item: any) {
    this.commonQueryService.RemoveCalendar(item.id).subscribe(res => {
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
    if (this.selectionKeys.length < 1) return;
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录？'),
      nzOnOk: () => {
        this.commonQueryService
          .BatchRemoveCalendar(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(
                this.appTranslationService.translate('删除成功'),
              );
              this.queryCommon();
            } else {
              this.msgSrv.error(
                this.appTranslationService.translate(res.msg),
              );
            }
          });
      },
    });
  }
  // 班次
  public openShift(item: any) {
    this.modal
      .static(PlantModelCalendarShiftComponent, { i: item }, 'lg')
      .subscribe(() => {});
  }
  // 班次时段
  public openShiftTime(item: any) {
    this.modal
      .static(PlantModelCalendarShiftTimeComponent, { i: item }, 'lg')
      .subscribe(() => {});
  }
}
