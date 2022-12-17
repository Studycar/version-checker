import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { EditService } from '../edit.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomTreeViewComponent } from '../../../../modules/base_module/components/custom-tree-view.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opdigitalization-workbench-batchmove',
  templateUrl: './batchMove.component.html',
  providers: [EditService]
})
export class ProcessScheduleOpdigitalizationWorkbenchBatchMoveComponent extends CustomBaseContext implements OnInit {
  public gridData: any[] = []; // grid 网格data数组
  public gridSelectionKeys: any[] = []; // grid 网格勾选项key集合
  public gridSelectRows: any[] = []; // grid 网格勾选项row集合

  /*  -------------------------MO树形选择--------------------------------- */
  public treeDataTable: any[] = []; // MO树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'CODE', title: '计划组/资源/MO', width: '250px' },
    { field: 'ITEM_CODE', title: '物料', width: '150px' },
    { field: 'DESCRIPTIONS_CN', title: '物料描述', width: '200px' },
    { field: 'FPC_LPC_TIME', title: '工单开始时间-工单结束时间', width: '260px' },
    { field: 'DEMAND_DATE', title: '需求时间', width: '140px' }
  ]; // MO树形显示列
  public selection: any[] = []; // 勾选项
  public expandtion: any[] = []; // 展开项
  public keyField = 'ID'; // 树节点key
  public valueLevel = 2; // 返回值来源的层级
  /*    ---------------------------------------------------------- */

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
  }

  ngOnInit(): void {
    this.setLoading(true);
    // 勾选的产线数组（key:PLANT_CODE + '|'+RESOURCE_CODE）
    const gridSelectLines = [];
    const gridSelectItemIds = [];
    // 1.获取勾选MO的产线和物料
    this.gridData.forEach(x => {
      if (this.gridSelectionKeys.findIndex(key => key === x.ID) > -1) {
        this.gridSelectRows.push(x);
        if (gridSelectLines.findIndex(k => k.PLANT_CODE === x.PLANT_CODE && k.RESOURCE_CODE === x.RESOURCE_CODE) === -1) {
          gridSelectLines.push({ PLANT_CODE: x.PLANT_CODE, SCHEDULE_GROUP_CODE: x.SCHEDULE_GROUP_CODE, RESOURCE_CODE: x.RESOURCE_CODE });
        }
        if (gridSelectItemIds.findIndex(k => k === x.ITEM_ID) === -1) {
          gridSelectItemIds.push(x.ITEM_ID);
        }
      }
    });
    // 2.获取物料工艺路线交集PLANT_CODE/SCHEDULE_GROUP_CODE/RESOURCE_CODE(排除已勾选产线)
    const PLANT_CODE = this.gridData[0].PLANT_CODE;
    this.editService.GetItemIntersection(PLANT_CODE, gridSelectItemIds).subscribe(result => {
      const data = []; // 树形数组
      const lineCodes = []; // 资源编码数组
      if (result.Extra !== undefined && result.Extra !== null) {
        // 提取计划组/产线
        result.Extra.forEach(x => {
          if (gridSelectLines.findIndex(k => k.PLANT_CODE === x.PLANT_CODE && k.RESOURCE_CODE === x.RESOURCE_CODE) === -1) {
            const lineId = x.RESOURCE_ID;
            const groupId = x.PLANT_CODE + '|' + x.SCHEDULE_GROUP_CODE;
            let group = data.find(k => k.ID === groupId);
            // 添加计划组
            if (group === undefined) {
              group = {
                ID: groupId,
                CODE: x.SCHEDULE_GROUP_CODE,
                ITEM_CODE: '',
                DESCRIPTIONS_CN: '',
                FPC_LPC_TIME: '',
                DEMAND_DATE: '',
                children: [],
                expand: true
              };
              data.push(group);
            }
            const line = {
              ID: lineId,
              CODE: x.RESOURCE_CODE,
              ITEM_CODE: '',
              DESCRIPTIONS_CN: '',
              FPC_LPC_TIME: '',
              DEMAND_DATE: '',
              children: [],
              expand: false
            };
            // 添加产线
            group.children.push(line);
            lineCodes.push(x.RESOURCE_CODE);
          }
        });

        // 3.加载目标MO
        if (lineCodes.length > 0) {
          const startDate = new Date();
          const endDate = this.editService.addMonths(startDate, 1);
          this.editService.Search('', PLANT_CODE, lineCodes, this.editService.formatDate(startDate), this.editService.formatDate(endDate), false).subscribe(res => {
            if (res !== null && res.Result !== null) {
              let line = null;
              lineCodes.forEach(RESOURCE_CODE => {
                data.forEach(group => {
                  group.children.forEach(item => {
                    if (item.CODE === RESOURCE_CODE) {
                      line = item;
                    }
                  });
                });
                // 添加MO
                res.Result.forEach(m => {
                  if (m.PLANT_CODE === PLANT_CODE && m.RESOURCE_CODE === RESOURCE_CODE) {
                    line.children.push({
                      ID: m.ID,
                      CODE: m.PROCESS_MAKE_ORDER_NUM,
                      ITEM_CODE: m.ITEM_CODE,
                      DESCRIPTIONS_CN: m.DESCRIPTIONS_CN,
                      FPC_LPC_TIME: m.FPC_TIME + '-' + m.LPC_TIME,
                      DEMAND_DATE: m.DEMAND_DATE
                    });
                  }
                });
              });
              // 去掉无MO的目标产线
              data.forEach(group => {
                group.children = group.children.filter(item => item.children.length > 0);
              });
            }
            this.treeDataTable = data;
            this.setLoading(false);
          });
        } else {
          this.treeDataTable = data;
          this.setLoading(false);
        }
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  @ViewChild('treeView', { static: true }) treeView: CustomTreeViewComponent;
  confirm() {
    this.treeView.select();
    if (this.selection.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择目标MO!'));
    } else {
      const targetMoIds = [];
      this.selection.forEach(x => { if (x.level === this.valueLevel) { targetMoIds.push(x[this.keyField]); } });
      if (targetMoIds.length !== 1) {
        this.msgSrv.warning(this.appTranslationService.translate('请选择一条目标MO!'));
      } else {
        // 执行批量调整逻辑
        this.editService.BatchMove(targetMoIds[0], this.gridSelectionKeys).subscribe(result => {
          if (result != null && result.Success) {
            this.msgSrv.success(this.appTranslationService.translate('批量调整成功！'));
          } else { this.msgSrv.error(this.appTranslationService.translate(result.Message || '批量调整失败！')); }
        });
        this.modal.close(true);
      }
    }
  }
}
