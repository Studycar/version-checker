import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { EditService } from '../edit.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opdigitalization-workbench-setResourceAndRate',
  templateUrl: './setResourceAndRate.component.html',
  providers: [EditService],
  styles: [`
  .inline {
    display: inline-block;
  }

  .left {
    width:70%;
    left: 0px;
  }

  .right {
    width:30%;
    float:right;
    right: 0px;
  }
`],
})
export class ProcessScheduleOpdigitalizationWorkbenchSetResourceAndRateComponent extends CustomBaseContext implements OnInit {
  gridHeight = 300;
  // 受影响的资源（待刷新）
  linesReturn = [];
  // grid 勾选项（传参）
  public gridSelectKeys: any[] = [];
  keysLength = 0;
  public i: any = {
    PLANT_CODE: '',
    SCHEDULE_GROUP_CODE: '',
    RESOURCE_CODE: '',
    RATE_TYPE: '',
    RATE: 1
  };
  iClone: any = {
    PLANT_CODE: '',
    SCHEDULE_GROUP_CODE: '',
    RESOURCE_CODE: '',
    RATE_TYPE: '',
    RATE: 1
  };
  optionListPlantGroup: any[] = [];
  optionListProductLine: any[] = [];
  applicationRateType: any[] = [];
  // 显示区列定义
  public columns = [
    {
      colId: 1, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      valueFormatter: function (params) {
        // params.node.selected = true;
      }
    },
    {
      field: 'PROCESS_MAKE_ORDER_NUM', headerName: '工序工单', width: 200
    },
    {
      field: 'ITEM_CODE', headerName: '物料', width: 150
    },
    { field: 'DESCRIPTIONS_CN', headerName: '物料描述', width: 450, tooltipField: 'DESCRIPTIONS_CN' }
  ];
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService
  ) {
    super({ pro: null, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
  }

  ngOnInit(): void {
    this.InitData();
    this.loadplantGroup();
    this.loadRateType();
    this.GetResourceAndRate();
  }

  InitData() {
    this.editService.Search('', '', [], '', '', false, this.gridSelectKeys).subscribe(result => {
      if (result.Result !== null || result.Result.length > 0) {
        this.gridData = result.Result;
        this.keysLength = this.gridData.length;
        setTimeout(() => {
          this.gridApi.selectAll();
        }, 100);
        console.log(this.selectionKeys);
      }
    });
  }
  GetResourceAndRate() {
    this.editService.GetResourceAndRate(this.gridSelectKeys[0]).subscribe(result => {
      if (result != null) {
        if (result.Success) {
          this.iClone = result.Extra;
          this.clear();
        }
      }
    });
  }

  close() {
    if (this.keysLength > this.gridSelectKeys.length) {
      this.modal.close(true);
    } else {
      this.modal.destroy();
    }
  }
  PLANT_CODE = '';
  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {
    this.loadproductLine();
  }

  public loadplantGroup(): void {
    this.editService.GetUserPlantGroup(this.PLANT_CODE).subscribe(result => {
      this.optionListPlantGroup.length = 0;
      result.Extra.forEach(d => {
        this.optionListPlantGroup.push({
          label: d.SCHEDULE_GROUP_CODE,
          value: d.SCHEDULE_GROUP_CODE,
        });
      });

      if (this.optionListPlantGroup.length > 0) {
        this.onChangeGroup(this.optionListPlantGroup[0].value);
      }
    });
  }

  public loadproductLine(): void {
    this.editService.GetUserPlantGroupLine(this.PLANT_CODE, this.i.SCHEDULE_GROUP_CODE).subscribe(result => {
      this.optionListProductLine.length = 0;
      result.Extra.forEach(d => {
        this.optionListProductLine.push({
          label: d.RESOURCE_CODE,
          value: d.RESOURCE_CODE,
        });
      });

      if (this.i.SCHEDULE_GROUP_CODE === this.iClone.SCHEDULE_GROUP_CODE) {
        this.i.RESOURCE_CODE = this.iClone.RESOURCE_CODE;
      } else {
        this.i.RESOURCE_CODE = this.optionListProductLine[0].value;
      }
    });
  }

  public loadRateType(): void {
    this.editService.GetLookupByType('PS_RATE_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationRateType.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });
  }

  confirm() {
    if (this.selectionKeys.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('未选择任何记录！'));
      return;
    }
    if (this.isNull(this.i.PLANT_CODE)) {
      this.i.PLANT_CODE = this.PLANT_CODE;
    }
    this.editService.SetResourceAndRate(this.selectionKeys, this.i)
      .subscribe(result => {
        if (result != null) {
          if (result.Success) {
            // 获取要刷新的资源
            if (this.linesReturn.findIndex(l => l === this.i.RESOURCE_CODE) === -1) {
              this.linesReturn.push(this.i.RESOURCE_CODE);
            }
            this.gridApi.getSelectedRows().forEach(row => {
              if (this.linesReturn.findIndex(l => l === row.RESOURCE_CODE) === -1) {
                this.linesReturn.push(row.RESOURCE_CODE);
              }
            });
            this.msgSrv.success(this.appTranslationService.translate(result.Message || '操作成功!'));
            if (this.gridSelectKeys.length === this.selectionKeys.length) {
              this.modal.close(true);
            } else {
              this.gridSelectKeys = this.gridSelectKeys.filter(t => this.selectionKeys.findIndex(key => key === t) === -1);
              this.gridData = this.gridData.filter(t => this.gridSelectKeys.findIndex(key => key === t[this.selectBy]) > -1);
            }
          } else {
            this.msgSrv.error(this.appTranslationService.translate('操作失败!<br/>' + result.Message));
          }
        }
      });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
    this.onChangeGroup(this.i.SCHEDULE_GROUP_CODE);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
    console.log(this.selectionKeys);
  }
}
