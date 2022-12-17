import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { PlantModelCalendarMaintainComponent } from './maintain/maintain.component';
import { PlantModelCalendarTimeComponent } from './maintain/time/time.component';
import { PlantModelCalendarResourceShiftComponent } from './maintain/resourceshift/resourceshift.component';
import { PlantModelCalendarResourceTimeComponent } from './maintain/resourcetime/resourcetime.component';
import { PlantModelCalendarDateQueryComponent } from './datequery/datequery.component';
import { PlantModelCalendarMaintainCopyDateComponent } from './maintain/copy/date.component';
import { PlantModelCalendarMaintainCopyLineComponent } from './maintain/copy/line.component';
import { PlantModelCalendarBatchModifyComponent } from './maintain/batchmodify/batchmodify.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { PlantModelCalendarResourceTimeNewComponent } from './maintain/resourceTimeNew/resource-time-new.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar',
  templateUrl: './calendar.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarComponent extends CustomBaseContext
  implements OnInit {
  // 弹出方式打开参数-显示页面标题
  public pShowTitle = false;
  // 弹出方式打开参数-数字化工作台选中行
  public pGridSelectRow: any;

  // 按钮样式定义
  public nzSize = 'default'; // large default small
  public nzType = 'primary'; // primary default dashed danger
  // 下拉框数据项
  public plantOptions: any[] = [];
  public groupOptions: any[] = [];
  public lineOptions: any[] = [];
  public calendarOptions: any[] = [];
  public calendarDates: any[] = [];
  // 开动率批量修改-修改区绑定参数
  public batchModifyDto = {
    dateRange: [],
    calendarDayMin: '',
    calendarDayMax: '',
    enableFlag: '',
    showStartTime: new Date('1970-01-01 00:00:00'),
    showEndTime: new Date('1970-01-01 23:59:59'),
    isMoreDays: true,
    efficency: 100,
  };
  // 参数定义
  public queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        required: true,
        ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 },
      },
      {
        field: 'scheduleGroupCode',
        title: '计划组',
        required: true,
        ui: { type: UiType.select, options: this.groupOptions, eventNo: 2 },
      },
      {
        field: 'resourceCode',
        title: '资源',
        required: true,
        ui: { type: UiType.select, options: this.lineOptions , eventNo: 3},
      },
      {
        field: 'calendarCode',
        title: '日历编码',
        required: true,
        ui: { type: UiType.select, options: this.calendarOptions },
      },
    ],
    values: {
      scheduleRegionCode: '',
      plantCode: this.appConfigService.getPlantCode(),
      scheduleGroupCode: null,
      resourceCode: null,
      calendarCode: '',
      calendarDayMin: '',
      calendarDayMax: '',
    },
  };
  // 构造函数
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    public commonQueryService: QueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
  ) {
    super({
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
  }
  // 初始化
  ngOnInit() {
    this.setGridHeight({ topMargin: 215 });
    // 加载工厂
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });
        // 过滤事业部
        if(d.plantCode == this.queryParams.values.plantCode) {
          this.queryParams.values.scheduleRegionCode = d.scheduleRegionCode
          this.loadCalendarCode();
        }
      });
      // 数字化工作台传参初始化
      if (this.pShowTitle && this.pGridSelectRow !== undefined) {
        this.queryParams.values = {
          scheduleRegionCode: this.pGridSelectRow.scheduleRegionCode,
          plantCode: this.pGridSelectRow.plantCode,
          scheduleGroupCode: this.pGridSelectRow.scheduleGroupCode,
          resourceCode: this.pGridSelectRow.resourceCode,
          calendarCode: '',
          calendarDayMin: '',
          calendarDayMax: '',
        };
      } else {
        this.queryParams.values.plantCode = this.appConfigService.getPlantCode();
        // this.queryParams.values.scheduleRegionCode = this.plantOptions.find(
        //   x => x.value === this.queryParams.values.plantCode,
        // ).scheduleRegionCode || '';
      }
      this.loadGroup();
      this.loadLine();
    
      this.cloneQueryParams();

    });
  }

  // 切换工厂
  public changePlant(plantCode: string) {
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.resourceCode = null;
    this.queryParams.values.calendarCode = null;
    this.loadGroup();
    this.loadLine();
    const regionCode = this.plantOptions.find(x => x.value === plantCode).scheduleRegionCode ||
      '';
    // let result = this.plantOptions.filter(x => x.value == plantCode)
    // 切换事业部
    console.log(regionCode)
    if (regionCode !== this.queryParams.values.scheduleRegionCode) {
      this.queryParams.values.scheduleRegionCode = regionCode;
      this.loadCalendarCode(false);
    }
  }
  // 切换计划组
  public changeGroup(groupCode: string) {
    this.queryParams.values.resourceCode = null;
    console.log('changeGroup');
    console.log(this.queryParams);
    this.loadLine();
  }

  // 切换资源
  public changeResource(resourceCode: string){
    this.queryParams.values.calendarCode = null;
    this.getCalendarByResourceCode();
  }

  // 加载计划组
  private loadGroup() {
    this.groupOptions.length = 0;
    this.commonQueryService
      .GetUserPlantGroup(this.queryParams.values.plantCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.groupOptions.push({
            label: `${d.scheduleGroupCode}(${d.descriptions})`,
            value: d.scheduleGroupCode,
          });
        });
      });
  }
  // 加载资源产线
  private loadLine() {
    this.lineOptions.length = 0;
    if ((this.queryParams.values.plantCode || '') === '') return;
    this.commonQueryService
      .GetUserPlantGroupLine(
        this.queryParams.values.plantCode || '',
        this.queryParams.values.scheduleGroupCode || '',
      )
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.lineOptions.push({
            label: `${d.resourceCode}(${d.descriptions})`,
            value: d.resourceCode,
          });
        });
      });
  }
  // 加载工作日历编码
  private loadCalendarCode(isLoad: boolean = true) {
    this.calendarOptions.length = 0;
    this.commonQueryService
      .GetCalendarList({
        scheduleRegionCode:
          this.queryParams.values.scheduleRegionCode || ''
      })
      .subscribe(result => {
        result.data.forEach(d => {
          this.calendarOptions.push({
            label: `${d.calendarCode}(${d.descriptions})`,
            value: d.calendarCode,
            scheduleRegionCode: d.scheduleRegionCode,
          });
        });

        // 页面加载
        if (isLoad) {
          //通过资源编码获取关联的日历编码
          this.getCalendarByResourceCode();
        }
      });
  }
  // 通过资源编码获取关联的日历编码
  private getCalendarByResourceCode() {
      if ((this.queryParams.values.resourceCode || '') === '') return;
      this.commonQueryService.GetCalendarByResourceCode(
        this.queryParams.values.plantCode || '',
        this.queryParams.values.resourceCode || ''
      ).subscribe(result => {
        if (result !== null && result.data !== null) {
          this.queryParams.values.calendarCode = result.data[0];
          // Clone 查询参数值
          this.cloneQueryParams();
          // 数字化工作台传参初始化，默认加载产线日历数据
          if (this.pShowTitle && this.pGridSelectRow !== undefined) {
            this.queryCommon();
          }
        }

      });


  }
  // 重置
  public clear() {
    console.log('clear');
    console.log(this.queryParams);
    super.clear();
    this.queryParams.values = {
      scheduleRegionCode: '',
      plantCode: this.appConfigService.getPlantCode(),
      scheduleGroupCode: null,
      resourceCode: null,
      calendarCode: null,
      calendarDayMin: '',
      calendarDayMax: '',
    };
    // this.loadGroup();
    // this.loadLine();
    // this.loadCalendarCode(false);
  }
  // 查询
  public query() {
    // super.query();
    this.queryCommon();
  }
  // 查询/切换年月调用，获取资源产线日期范围的日历数据(参数{year:yyyy,month:mm})
  public queryCommon(event?: any) {
    if (this.isInValid(event !== undefined ? false : true)) return;
    this.commonQueryService
      .GetResTimeList(this.queryParams.values)
      .subscribe(result => {
        if (result !== null && result.extra !== null) {
          this.calendarDates.length = 0;
          result.extra.forEach(it => {
            this.calendarDates.push(it);
          });
        }
      });
  }

  /* ----------------------------------------------以下为功能按钮操作---------------------------------------------- */
  // 点击单元格查看资源产线日历（按日期yyyy-mm-dd）
  public openCellCalendar(event: string) {
    if (this.isInValid(false)) return;
    this.modal
      .static(
        PlantModelCalendarDateQueryComponent,
        {
          i: {
            plantCode: this.queryParams.values.plantCode,
            scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
            resourceCode: this.queryParams.values.resourceCode,
            calendarCode: this.queryParams.values.calendarCode,
            showCalendarDay: event,
          },
        },
        'lg',
      )
      .subscribe(() => { });
  }
  // 点击单元格checkbox 更新产线班次时段记录有效状态(参数{ checked: true/false, id: 'xx')
  public updateResourceTime(event: any) {
    this.commonQueryService
      .UpdateResTime(
        { id: event.id, enableFlag: event.checked === true ? 'Y' : 'N', type: '1' }
      )
      .subscribe(result => {
        if (result !== null && result.code !== 200) {
          this.msgSrv.error(
            this.appTranslationService.translate(result.msg),
          );
        }
      });
  }
  // 验证查询条件是否是无效
  private isInValid(showMsg = true): boolean {
    return (
      this.isEmpty(this.queryParams.values.plantCode, '工厂', showMsg) ||
      this.isEmpty(
        this.queryParams.values.scheduleGroupCode,
        '计划组',
        showMsg,
      ) ||
      this.isEmpty(this.queryParams.values.resourceCode, '资源', showMsg) ||
      this.isEmpty(this.queryParams.values.calendarCode, '日历编码', showMsg)
    );
  }
  // 为空校验
  private isEmpty(value: any, message: string, showMsg = true): boolean {
    let result = false;
    if ((value || '') === '') {
      result = true;
      if (showMsg)
        this.msgSrv.warning(
          this.appTranslationService.translate(message + '不能为空！'),
        );
    }
    return result;
  }

  /**批量修改 */
  public batchModify() {
    this.modal
      .static(
        PlantModelCalendarBatchModifyComponent,
        { userOrganization: this.clone(this.queryParams.values), i: this.batchModifyDto },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.queryCommon(true);
        }
      });
  }
  // 日历编码
  public openCalendar() {
    this.modal
      .static(
        PlantModelCalendarMaintainComponent,
        { userOrganization: this.clone(this.queryParams.values) },
        'lg',
      )
      .subscribe(() => { });
  }
  // 班次时段模板
  public openShiftTime() {
    this.modal
      .static(
        PlantModelCalendarTimeComponent,
        { userOrganization: this.clone(this.queryParams.values) },
        'lg',
      )
      .subscribe(() => { });
  }
  // 产线日历班次
  public openResourceShift() {
    this.modal
      .static(
        PlantModelCalendarResourceShiftComponent,
        { userOrganization: this.clone(this.queryParams.values) },
        'lg',
      )
      .subscribe(() => { });
  }
  /**日历维护 */
  public openResourceTime() {
    this.modal
      .static(
        PlantModelCalendarResourceTimeComponent,
        { userOrganization: this.clone(this.queryParams.values) },
        1000,
        477,
      )
      .subscribe(() => { });
  }
  openResourceTimeNew() {
    this.modal
      .static(
        PlantModelCalendarResourceTimeNewComponent,
        { userOrganization: this.clone(this.queryParams.values) },
        1000,
        477,
      )
      .subscribe(() => { });
  }
  // 日历复制（按日期）
  public openDateCopy() {
    if (this.isInValid(true)) return;
    this.modal
      .static(PlantModelCalendarMaintainCopyDateComponent, {
        i: this.clone(this.queryParams.values),
      })
      .subscribe(value => {
        if (value) {
          this.queryCommon(true);
        }
      });
  }
  /**工作日历复制（按产线） */
  public openLineCopy() {
    this.modal
      .static(PlantModelCalendarMaintainCopyLineComponent, {
        userOrganization: this.clone(this.queryParams.values),
      })
      .subscribe(value => {
        if (value) {
          this.queryCommon(true);
        }
      });
  }
}
