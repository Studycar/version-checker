import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { EditService } from '../edit.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectableSettings } from '@progress/kendo-angular-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opdigitalization-workbench-chooseline',
  templateUrl: './chooseLine.component.html',
  // styleUrls: ['../../../../../assets/css/common.css'],
  providers: [EditService]
})
export class ProcessScheduleOpdigitalizationWorkbenchChooseLineComponent extends CustomBaseContext implements OnInit {
  public querySelection; // 查询选中的资源
  public i = {
    SCHEDULE_REGION_CODE: '',
    PLANT_CODE: '',
    SCHEDULE_GROUP_CODE: '',
    RESOURCE_CODE: '',
    start_date: null,
    merge_days: null,
    production_hours: null,
    ATTRIBUTE1: 'Z', // 集约类型
    item_ext_type_id1: '',
    item_ext_type_id2: '',
    item_ext_type_id3: '',
    item_ext_type_id4: ''
  };
  public itemExtOptions1 = []; // 集中优先级1（类别集所有数据）
  public itemExtOptions2 = []; // 集中优先级2（排除集中优先级1的值）
  public extTypeOptions = [{ value: 'N', label: 'N型' }, { value: 'Z', label: 'Z型' }]; // 集约类型：N时间优先、Z资源优先
  public start_date = null; // 开始时间（保存初始值）
  /* grid checkbox选择设置 */
  public selectableSettings: SelectableSettings = {
    enabled: true,
    checkboxOnly: true,
    mode: 'multiple' /*  'multiple'  'single'   */
  };

  // 显示区列定义
  public columns = [
    { field: 'RESOURCE_CODE', title: '资源', width: 170 },
    { field: 'DESCRIPTIONS', title: '资源描述', width: 350, ui: { toolTip: 1 } },
    { field: 'start_date', title: '开始时间', width: 200, ui: { type: 'dateTime' } }];
  // 允许编辑的列
  editColumns = ['start_date'];
  // grid 单元格点击编辑
  public cellClickHandler({ sender, rowIndex, column, columnIndex, dataItem, isEdited }) {
    if (!isEdited && this.editColumns.indexOf(column.field) > -1) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }
  // 是否允许关闭cell
  allowCellClose = false;
  // grid 单元格关闭编辑
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid || !this.allowCellClose) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      // 新值替换原值
      // for (const filed in formGroup.value) {
      //   dataItem[filed] = formGroup.value[filed];
      // }
      this.allowCellClose = false;
    }
  }
  // 生成编辑cell
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'start_date': dataItem.start_date
    });
  }
  // 时间选择确定
  public datePickerOnOk(event: any) {
    this.allowCellClose = true;
  }
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    public editService: EditService,
    private formBuilder: FormBuilder,
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
  }

  ngOnInit(): void {
    this.setGridHeight({ topMargin: 330, bottomMargin: 80 });
    this.i.ATTRIBUTE1 = 'Z';
    this.loadGroup();
    // 获取类别集
    this.editService.GetCategorySet('').subscribe(res => {
      if (res !== null && res.extra !== null) {
        this.itemExtOptions1.length = 0;
        res.extra.forEach(d => {
          this.itemExtOptions1.push({ value: d.CATEGORY_SET_CODE, label: d.DESCRIPTIONS });
        });
      }
    });
  }
  // 集中优先级1值变更事件
  extTypeId1Change(event) {
    this.i.item_ext_type_id2 = '';
    this.itemExtOptions2 = this.itemExtOptions1.filter(d => d.value !== event);
  }
  // 加载计划组（开始时间）
  loadGroup() {
    this.editService.GetScheduleGroup(this.i.PLANT_CODE, this.i.SCHEDULE_GROUP_CODE).subscribe(result => {
      if (result !== null && result.Extra !== null) {
        const SCHEDULE_START_TIME = result.Extra.SCHEDULE_START_TIME;
        const FIX_TIME_FENCE = result.Extra.FIX_TIME_FENCE || 0;
        const now = new Date();
        const dateTime = new Date(this.editService.formatDate(now) + ' ' + this.editService.getTimeString(SCHEDULE_START_TIME));
        this.start_date = this.editService.addDays(dateTime, FIX_TIME_FENCE);
        this.i.start_date = this.start_date;
      }
      this.loadLine();
    });
  }
  // 加载资源
  loadLine() {
    this.setLoading(true);
    this.editService.GetUserPlantGroupLineOrderByCode(this.i.PLANT_CODE, this.i.SCHEDULE_GROUP_CODE, true).subscribe(result => {
      if (result !== null && result.extra !== null) {
        const data = [];
        result.extra.forEach(d => {
          if (!this.isNull(this.querySelection) && this.querySelection.findIndex(x => x.CODE === d.RESOURCE_CODE) > -1) {
            data.push({ ...d, start_date: null });
          }
        });
        this.view = { data: data, total: data.length };
        this.setStartDate();
        this.setLoading(false);
      }
    });
  }
  // 设置开始时间
  setStartDate() {
    this.view.data.forEach(d => {
      if (this.editService.CompareDate(this.editService.formatDateTime(this.i.start_date), this.editService.formatDateTime(d.start_date)) >= 0) {
        d.start_date = this.i.start_date;
      }
    });
  }
  // 开始时间变更事件
  startDateChange() {
    const now = new Date();
    if (this.editService.CompareDate(this.editService.formatDateTime(this.i.start_date), this.editService.formatDateTime(now)) >= 0) {
      this.setStartDate();
    }
  }
  // 资源列表开始时间不能小于开始时间
  disabledDate = (endValue: Date): boolean => {
    return endValue.getTime() < this.i.start_date.getTime();
  }

  public clear() {
    this.i = {
      SCHEDULE_REGION_CODE: this.i.SCHEDULE_REGION_CODE,
      PLANT_CODE: this.i.PLANT_CODE,
      SCHEDULE_GROUP_CODE: this.i.SCHEDULE_GROUP_CODE,
      RESOURCE_CODE: this.i.RESOURCE_CODE,
      start_date: this.start_date,
      merge_days: null,
      production_hours: null,
      ATTRIBUTE1: 'Z',
      item_ext_type_id1: null,
      item_ext_type_id2: null,
      item_ext_type_id3: null,
      item_ext_type_id4: null
    };
    this.selectionKeys.length = 0;
  }

  close() {
    this.modal.destroy();
  }

  confirm() {
    if (this.selectionKeys.length > 0) {
      const dtos = [];
      let inValid = false;
      this.view.data.forEach(x => {
        if (this.selectionKeys.findIndex(key => key === x.ID) > -1) {
          if (this.editService.CompareDate(this.editService.formatDateTime(this.i.start_date), this.editService.formatDateTime(x.start_date)) > 0) {
            inValid = true;
            return;
          } else {
            dtos.push({
              SCHEDULE_REGION_CODE: this.i.SCHEDULE_REGION_CODE,
              PLANT_CODE: this.i.PLANT_CODE,
              SCHEDULE_GROUP_CODE: this.i.SCHEDULE_GROUP_CODE,
              RESOURCE_CODE: x.RESOURCE_CODE,
              start_date: this.editService.formatDateTime(x.start_date),
              merge_days: this.i.merge_days,
              production_hours: this.i.production_hours,
              ATTRIBUTE1: this.i.ATTRIBUTE1,
              item_ext_type_id1: this.i.item_ext_type_id1,
              item_ext_type_id2: this.i.item_ext_type_id2,
              item_ext_type_id3: this.i.item_ext_type_id3,
              item_ext_type_id4: this.i.item_ext_type_id4,
            });
          }
        }
      });
      if (inValid) {
        this.msgSrv.warning(this.appTranslationService.translate('资源开始时间不能小于开始时间！'));
        return;
      }
      this.editService.SubmitRequest_ChooseSchedule(dtos).subscribe(result => {
        if (result !== null && result.Success) {
          this.msgSrv.success(this.appTranslationService.translate(result.Message || '集约请求提交成功！'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(result.Message || '集约请求提交失败！'));
        }
      });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请选择资源!'));
    }
  }
}
