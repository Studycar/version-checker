import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomTreeViewComponent } from '../../../../modules/base_module/components/custom-tree-view.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-refresh',
  templateUrl: './refresh.component.html',
  // styleUrls: ['../../../../../assets/css/common.css']
})
export class PlanscheduleDigitalizationWorkbenchRefreshComponent implements OnInit {

  /*  -------------------------产线树形选择--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'code', title: '名称', width: '50%' },
    { field: 'description', title: '描述', width: '50%' }
  ]; // 产线树形显示列
  public keyField = 'id'; // 树节点key
  public selection: any[] = [];
  /*    ---------------------------------------------------------- */
  // 查询参数
  public i: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService
  ) {
    // super();
  }

  ngOnInit(): void {
    this.treeDataTable = this.i.treeDataTable;
    this.selection = this.i.selection;
  }

  public query() {
    // super.query();
    this.selection = [];
    this.treeDataTable = this.i.treeDataTableAll;
  }

  public clear() {
    this.i = {
      regionCode: '',
      plantCode: '',
      treeDataTable: [],
      selection: [],
      expand: []
    };
    this.treeDataTable = [];
  }

  close() {
    this.modal.destroy();
  }

  @ViewChild('treeView', {static: true}) treeView: CustomTreeViewComponent;
  confirm() {
    this.treeView.select();
    if (this.selection.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择资源!'));
    } else {
      // 计划发布只允许选择一个计划组
      if (this.i.type === 2) {
        const groupCodes = [];
        this.selection.forEach(x => {
          if (x.level === 1 && groupCodes.findIndex(y => x.parent.code === y) === -1) {
            groupCodes.push(x.parent.code);
          }
        });
        if (groupCodes.length > 1) {
          this.msgSrv.warning(this.appTranslationService.translate('请选择相同计划组的资源进行发布!'));
          return;
        }
      }
      this.modal.close(true);
    }
  }
}
