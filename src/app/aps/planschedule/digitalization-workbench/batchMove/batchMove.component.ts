import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { EditService } from '../edit.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomTreeViewComponent } from '../../../../modules/base_module/components/custom-tree-view.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-batchmove',
  templateUrl: './batchMove.component.html',
  providers: [EditService]
})
export class PlanscheduleDigitalizationWorkbenchBatchMoveComponent extends CustomBaseContext implements OnInit {
  public gridData: any[] = []; // grid 网格data数组
  public gridSelectionKeys: any[] = []; // grid 网格勾选项key集合
  public gridSelectRows: any[] = []; // grid 网格勾选项row集合

  /*  -------------------------MO树形选择--------------------------------- */
  public treeDataTable: any[] = []; // MO树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'code', title: '计划组/资源/MO', width: '250px' },
    { field: 'itemCode', title: '物料', width: '150px' },
    { field: 'descriptionsCn', title: '物料描述', width: '200px' },
    { field: 'fpcLpcTime', title: '工单开始时间-工单结束时间', width: '260px' },
    { field: 'demandDate', title: '需求时间', width: '140px' }
  ]; // MO树形显示列
  public selection: any[] = []; // 勾选项
  public expandtion: any[] = []; // 展开项
  public keyField = 'id'; // 树节点key
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
      if (this.gridSelectionKeys.findIndex(key => key === x.id) > -1) {
        this.gridSelectRows.push(x);
        if (gridSelectLines.findIndex(k => k.plantCode === x.plantCode && k.resourceCode === x.resourceCode) === -1) {
          gridSelectLines.push({ plantCode: x.plantCode, scheduleGroupCode: x.scheduleGroupCode, resourceCode: x.resourceCode });
        }
        if (gridSelectItemIds.findIndex(k => k === x.itemId) === -1) {
          gridSelectItemIds.push(x.itemId);
        }
      }
    });

    // 2.获取物料工艺路线交集PLANT_CODE/SCHEDULE_GROUP_CODE/RESOURCE_CODE(排除已勾选产线)
    const plantCode = this.gridData[0].plantCode;
    this.editService.GetItemIntersection(plantCode, gridSelectItemIds).subscribe(result => {
      const data = []; // 树形数组
      const lineCodes = []; // 资源编码数组
      if (result.extra !== undefined && result.extra !== null) {
        // 提取计划组/产线
        result.extra.forEach(x => {
          if (gridSelectLines.findIndex(k => k.plantCode === x.plantCode && k.resourceCode === x.resourceCode) === -1) {
            const lineId = x.resourceId;
            const groupId = x.plantCode + '|' + x.scheduleGroupCode;
            let group = data.find(k => k.id === groupId);
            // 添加计划组
            if (group === undefined) {
              group = {
                id: groupId,
                code: x.scheduleGroupCode,
                itemCode: '',
                descriptionsCn: '',
                fpcLpcTime: '',
                demandDate: '',
                children: [],
                expand: true
              };
              data.push(group);
            }
            const line = {
              id: lineId,
              code: x.resourceCode,
              itemCode: '',
              descriptionsCn: '',
              fpcLpcTime: '',
              demandDate: '',
              children: [],
              expand: false
            };
            // 添加产线
            group.children.push(line);
            lineCodes.push(x.resourceCode);
          }
        });

        // 3.加载目标MO
        if (lineCodes.length > 0) {
          const startDate = new Date();
          const endDate = this.editService.addMonths(startDate, 1);
          this.editService.Search('', plantCode, null, lineCodes, this.editService.formatDate(startDate), this.editService.formatDate(endDate), false).subscribe(res => {
            if (res !== null && res.data !== null) {
              let line = null;
              lineCodes.forEach(resourceCode => {
                data.forEach(group => {
                  group.children.forEach(item => {
                    if (item.code === resourceCode) {
                      line = item;
                    }
                  });
                });
                // 添加MO
                res.data.forEach(m => {
                  if (m.plantCode === plantCode && m.resourceCode === resourceCode) {
                    line.children.push({
                      id: m.id,
                      code: m.makeOrderNum,
                      itemCode: m.itemCode,
                      descriptionsCn: m.descriptionsCn,
                      fpcLpcTime: m.fpcTime + '-' + m.lpcTime,
                      demandDate: m.demandDate
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
      this.setLoading(false);
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
          if (result != null && result.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('批量调整成功！'));
          } else { this.msgSrv.error(this.appTranslationService.translate(result.msg || '批量调整失败！')); }
        });
        this.modal.close(true);
      }
    }
  }
}
