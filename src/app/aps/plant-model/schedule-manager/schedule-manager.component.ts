import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { State, process } from '@progress/kendo-data-query';
import { ScheduleRegionDto } from './model';
import { ScheduleManagerEditService } from './edit.service';
import { map } from 'rxjs/operators/map';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from '../../base/message/query.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { ScheduleManagerService } from '../../../modules/generated_module/services/schedule-manager-service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { PlantModelScheduleManagerEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-schedule-manager',
  templateUrl: './schedule-manager.component.html',
  providers: [ScheduleManagerEditService, QueryService],
})
export class PlantModelScheduleManagerComponent extends CustomBaseContext implements OnInit {
  public showTab = false;
  public selectTabIndex = 1;
  public tabs = [
    { index: 1, active: true, name: '主要' },
    { index: 2, active: false, name: '其他' },
  ];
  public tabSelect(arg: any): void {
    this.selectTabIndex = arg.index;
    this.hiddenColumns = [];
    this.hideObjs.forEach(e => {
      if (e.tabIndex === this.selectTabIndex) {
        e.columns.forEach(i => {
          this.hiddenColumns.push(i.field);
        });
      }
    });
    this.initGridWidth();
  }
  public hideObjs = [
    {
      tabIndex: 1,
      columns: [
        { field: 'DEMAND_TIME_FENCE', title: '需求时间栏（天）' },
        { field: 'SCHEDULE_TIME_FENCE', title: '计划时间栏（天）' },
        { field: 'PLANNING_TIME_FENCE', title: '排产时间栏（天）' },
        { field: 'FIX_TIME_FENCE', title: '固定时间栏（天）' },
        { field: 'FORWARD_PLANNING_TIME_FENCE', title: '顺排时间栏（天）' },
        { field: 'RELEASE_TIME_FENCE', title: '下达时间栏（天）' },
        { field: 'ORDER_TIME_FENCE', title: '订单时间栏（天）' },
      ],
    },
    {
      tabIndex: 2,
      columns: [
        { field: 'PERIODIC_TIME', title: '计划滚动周期（天）' },
        { field: 'PLAN_START_TIME', title: '计划滚动起始时间' },
        { field: 'SUBSET_WARNINGDAYS', title: '父子集警告天数' },
        { field: 'SHIPMENTSET_WARNINGDAYS', title: '发运集警告天数' },
        { field: 'PLANNING_TYPE', title: '计划类型' },
        { field: 'ENABLE_FLAG', title: '是否有效' },
      ],
    },
  ];
  public hiddenColumns = [];


  public planAreaOptions: any[] = [];
  public enableOptions: any[] = [];
  public selectBy = 'SCHEDULE_REGION_ID';

  public queryParams = {
    defines: [
      { field: 'SCHEDULE_REGION_CODE', title: '事业部', ui: { type: UiType.string, options: this.planAreaOptions } },
      { field: 'DESCRIPTIONS', title: '事业部描述', ui: { type: UiType.string } },
      { field: 'ENABLE_FLAG', title: '是否有效', ui: { type: UiType.select, options: this.enableOptions } }
    ],
    values: {
      SCHEDULE_REGION_CODE: '',
      DESCRIPTIONS: '',
      ENABLE_FLAG: ''
    }
  };

  public columns = [
    { field: 'SCHEDULE_REGION_CODE', title: '事业部', width: 150, locked: true },
    { field: 'DESCRIPTIONS', title: '描述', width: 330, locked: false, ui: { tooltip: 1 } },
    { field: 'PLAN_START_TIME', title: '排产滚动开始时间', width: 190, locked: false },
    { field: 'PERIODIC_TIME', title: '排产滚动周期', width: 160, locked: false },
    { field: 'CALENDAR_CODE', title: '工作日历编码', width: 160, locked: false },
    { field: 'ENABLE_FLAG', title: '是否有效', width: 140, locked: false, ui: { type: 'select', options: this.enableOptions, index: 1 } },
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

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [
    { field: 'ENABLE_FLAG', options: this.enableOptions },
  ];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport, this.context);
  }
  httpAction = { url: this.scheduleManagerService.queryUrl, method: 'POST' };
  public query() {
    super.query();
    this.queryCommon();
  }
  private queryCommon() {
    this.commonQueryService.read(this.httpAction, this.queryParams.values, this.context);
  }
  public add(item?: any) {
    this.modal
      .static(PlantModelScheduleManagerEditComponent, { i: (item !== undefined ? this.clone(item) : { SCHEDULE_REGION_ID: null }), columns: this.columns })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  public remove(item?: any) {
  }
  public removeBatch() {
  }
  public clear() {
    this.queryParams.values = {
      SCHEDULE_REGION_CODE: '',
      DESCRIPTIONS: '',
      ENABLE_FLAG: ''
    };
  }
  public dataStateChange(state: State) {
    this.gridState = state;
    this.commonQueryService.read(this.httpAction);
  }

  constructor(
    private formBuilder: FormBuilder,
    private scheduleManagerService: ScheduleManagerService,
    private messageManageService: MessageManageService,
    public editService: ScheduleManagerEditService, /* grid行内单元格编辑 */
    public commonQueryService: QueryService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
  ) { super({ appTranslationSrv: null, msgSrv: msgSrv, appConfigSrv: null }); }

  ngOnInit() {
    // this.tabSelect({ index: 1 });
    this.messageManageService.GetEnableFlags().subscribe(result => {
      result.Extra.forEach(d => {
        this.enableOptions.push({
          label: d.LOOKUPNAME,
          value: d.LOOKUPCODE,
        });
      });
    });
    this.scheduleManagerService.GetScheduleRegion().subscribe(result => {
      // console.log(result);
      result.Extra.forEach(d => {
        this.planAreaOptions.push({
          label: d.SCHEDULE_REGION_CODE,
          value: d.SCHEDULE_REGION_CODE,
        });
      });
    });
    this.clear();
    this.viewAsync = this.commonQueryService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.queryCommon();
  }


  /* 以下代码为grid行内单元格编辑 */
  public queryObj = {
    schedule_region_code: '',
    planning_type: '',
    planning_code: '',
    description: '',
    planning_collaborative_method: '',
    language: '',
    desc: '',
  };
  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }
  public addHandler({ sender }) {
    sender.addRow(this.createFormGroup(new ScheduleRegionDto()));
  }
  public cancelHandler({ sender, rowIndex }) {
    sender.closeRow(rowIndex);
  }
  public saveHandler({ sender, formGroup, rowIndex }) {
    if (formGroup.valid) {
      this.editService.create(formGroup.value);
      sender.closeRow(rowIndex);
    }
  }
  public removeHandler({ sender, dataItem }) {
    this.editService.remove(dataItem);

    sender.cancelCell();
  }
  public saveChanges(grid: any): void {
    grid.closeCell();
    grid.cancelCell();

    this.editService.saveChanges();
  }
  public cancelChanges(grid: any): void {
    grid.cancelCell();

    this.editService.cancelChanges();
  }
  public reload(grid: any): void {
    this.editService.reset();
    this.editService.read(this.queryObj);
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      SCHEDULE_REGION_CODE: [
        dataItem.SCHEDULE_REGION_CODE,
        Validators.required,
      ],
      DESCRIPTIONS: [dataItem.DESCRIPTIONS],
      PLANNING_CODE: [dataItem.PLANNING_CODE, Validators.required],
      DESCRIPTION: [dataItem.DESCRIPTION],
      PERIODIC_TIME: [dataItem.PERIODIC_TIME, Validators.required],
      PLAN_START_TIME: [dataItem.PLAN_START_TIME, Validators.required],
      // PLAN_START_DATE: [dataItem.PLAN_START_DATE, Validators.required],
      SUBSET_WARNINGDAYS: [dataItem.SUBSET_WARNINGDAYS],
      SHIPMENTSET_WARNINGDAYS: [dataItem.SHIPMENTSET_WARNINGDAYS],
      PLANNING_TYPE: [dataItem.PLANNING_TYPE, Validators.required],
      ENABLE_FLAG: [dataItem.ENABLE_FLAG, Validators.required],
      DEMAND_TIME_FENCE: [dataItem.DEMAND_TIME_FENCE],
      SCHEDULE_TIME_FENCE: [dataItem.SCHEDULE_TIME_FENCE],
      PLANNING_TIME_FENCE: [dataItem.PLANNING_TIME_FENCE],
      FIX_TIME_FENCE: [dataItem.FIX_TIME_FENCE],
      FORWARD_PLANNING_TIME_FENCE: [dataItem.FORWARD_PLANNING_TIME_FENCE],
      RELEASE_TIME_FENCE: [dataItem.RELEASE_TIME_FENCE],
      ORDER_TIME_FENCE: [dataItem.ORDER_TIME_FENCE],
    });
  }

  public createEditFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      DESCRIPTIONS: [dataItem.DESCRIPTIONS],
      DESCRIPTION: [dataItem.DESCRIPTION],
      PERIODIC_TIME: [dataItem.PERIODIC_TIME, Validators.required], // Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])
      PLAN_START_TIME: [dataItem.PLAN_START_TIME, Validators.required],
      // PLAN_START_DATE: [dataItem.PLAN_START_DATE, Validators.required],
      SUBSET_WARNINGDAYS: [dataItem.SUBSET_WARNINGDAYS],
      SHIPMENTSET_WARNINGDAYS: [dataItem.SHIPMENTSET_WARNINGDAYS],
      PLANNING_TYPE: [dataItem.PLANNING_TYPE, Validators.required],
      ENABLE_FLAG: [dataItem.ENABLE_FLAG, Validators.required],
      DEMAND_TIME_FENCE: [dataItem.DEMAND_TIME_FENCE],
      SCHEDULE_TIME_FENCE: [dataItem.SCHEDULE_TIME_FENCE],
      PLANNING_TIME_FENCE: [dataItem.PLANNING_TIME_FENCE],
      FIX_TIME_FENCE: [dataItem.FIX_TIME_FENCE],
      FORWARD_PLANNING_TIME_FENCE: [dataItem.FORWARD_PLANNING_TIME_FENCE],
      RELEASE_TIME_FENCE: [dataItem.RELEASE_TIME_FENCE],
      ORDER_TIME_FENCE: [dataItem.ORDER_TIME_FENCE],
    });
  }
}
