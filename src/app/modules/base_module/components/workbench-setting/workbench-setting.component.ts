import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { deepCopy } from '@delon/util';
import { CustomBaseContext } from '../custom-base-context.component';
import { WorkbenchSettingService } from './workbench-setting.service';
import { DefType } from './workbench-setting.type';

@Component({
  selector: 'workbench-setting-imp',
  templateUrl: './workbench-setting.component.html',
  styleUrls: ['./workbench-setting.component.scss'],
  providers: [WorkbenchSettingService],
})
export class WorkbenchSettingComponent implements OnInit {
  gridApi = null;
  columnApi = null;
  agGrid = null;
  @Input() context: CustomBaseContext;

  @Output() updateClick = new EventEmitter();

  /** checkbox 数据 */
  checkboxDefined: DefType[][] = [];

  /** agGrid对应的状态名 */
  stateKey: string;
  stateKeyForDefinde: string;

  /** 执行变更操作使用的agGrid列状态 */
  agGridState;

  constructor(private workbenchSettingService: WorkbenchSettingService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.columnApi = this.context.gridColumnApi;
    this.gridApi = this.context.gridApi;
    this.agGrid = this.context.agGridElement;
    this.checkboxDefined = this.workbenchSettingService.getCheckboxData(
      this.columnApi,
      this.gridApi,
    );
    this.stateKey = this.agGrid.nativeElement.getAttribute('stateOriginKey');
    this.stateKeyForDefinde = this.agGrid.nativeElement.getAttribute('stateDefinedKey');
    this.agGridState = this.columnApi.getColumnState();
  }

  /**
   * 恢复agGrid列初始状态
   */
  reset() {
    //update by jianl，getOriginCheckboxData有可能返回null值，所以做一个判断
    const originVal = this.workbenchSettingService.getOriginCheckboxData(
      this.stateKeyForDefinde,
      this.columnApi,
      this.gridApi,
    );
    if (originVal === null || originVal === undefined) {
      this.checkboxDefined = this.workbenchSettingService.getCheckboxData(
        this.columnApi,
        this.gridApi,
      );
    } else {
      this.checkboxDefined = originVal;
    }
    this.agGridState = this.workbenchSettingService.getAGOriginState(
      this.stateKeyForDefinde,
    );
  }

  /**   * 更新agGrid列状态
   */
  updateState() {
    this.columnApi.setColumnState(this.agGridState);
    this.updateClick.emit();
  }

  /**
   * 记录变更
   * @param checked
   * @param r 行
   * @param c 列
   */
  change(checked, r, c) {
    const item = this.checkboxDefined[r][c];
    const colId = item.colId;
    const len = this.agGridState.length;

    item.hide = !checked;

    for (let cs = 0; cs < len; cs++) {
      if (this.agGridState[cs].colId === colId) {
        this.agGridState[cs].hide = !checked;
        return;
      }
    }
  }

  resetTable() {
    if(this.context) {
      this.context.agGridStateDirective.reset();
      this.reset();
    }

  }
}
