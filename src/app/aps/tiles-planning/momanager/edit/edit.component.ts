import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { MoManagerService } from '../../../../modules/generated_module/services/mo-manager-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-momanager-edit',
  templateUrl: './edit.component.html',
})
export class TilesPlanscheduleMomanagerEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  title: String = '编辑';
  techVersion = '';
  readOnly: Boolean = true;
  sk: Boolean = true;
  public s1: Boolean = false;
  resourceoptions: any[] = [];
  statusoptions: any[] = [];
  optionVersion: any[] = [];
  optionsMold: any[] = []; // 磨具下拉
  isOpen = false;
  yesOrNo: any[] = [];

  EDIT_DISABLE: Boolean = true;//编辑状态下，不可编辑的字段，全部禁用
  lpcTimeDisable: boolean = false; //排产结束时间编辑状态
  fixScheduleTimeDisable: boolean = false;//固定时间
  earliestStartTimeDisable: boolean = false;//最早开始时间
  moQtyDisable: boolean = false;//工单数量
  makeOrderStatusDisable: boolean = false;//工单状态
  palletQtyDisable: boolean = false; //打托数量编辑状态
  commentsDisable: boolean = false; //工单备注
  productionTimeLengthDisable: boolean = false; //工单时长
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private moservice: MoManagerService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
  ) { }

  ngOnInit(): void {
    this.isOpen = true;
    this.LoadData();
  }

  canUpdateProdLength = true;
  MaxNum: number;
  LoadData() {
    this.moservice.GetById_java(this.i.id).subscribe(res => {
      this.i = res.data;
      this.i.oldMakeOrderStatus = this.i.makeOrderStatus;
      this.i.oldProdTimeLengthSet = this.i.prodTimeLengthSet;
      this.i.oldLpcTime = this.i.lpcTime;
      this.MaxNum = this.i.moQty;
      this.canUpdateProdLength = this.i.groupId === null || this.i.groupIndex === 1;

      this.iClone = Object.assign({}, this.i);
      this.techVersion = this.i.techVersion;

      if (res.data.makeOrderStatus === 'D') {
        //已取消的工单，只允许修改工单状态字段
        this.lpcTimeDisable = true; //排产结束时间编辑状态
        this.fixScheduleTimeDisable = true;//固定时间
        this.earliestStartTimeDisable = true;//固定时间
        this.moQtyDisable = true;//工单数量
        this.makeOrderStatusDisable = false;//工单状态
        this.palletQtyDisable = true; //打托数量编辑状态
        this.commentsDisable = false; //工单备注
      } else if (res.data.makeOrderStatus === 'O') {
        this.lpcTimeDisable = true; //排产结束时间编辑状态
        this.fixScheduleTimeDisable = true;//固定时间
        this.earliestStartTimeDisable = true;//固定时间
        this.moQtyDisable = true;//工单数量
        this.makeOrderStatusDisable = true;//工单状态
        this.palletQtyDisable = true; //打托数量编辑状态
        this.commentsDisable = false; //工单备注
      }

      if (res.data.oaResult === '0' || res.data.oaResult === '1') {
        this.palletQtyDisable = true;
      }
      if (res.data.TOTAL_COMPLETE === 'Y') {
        this.lpcTimeDisable = true; //排产结束时间编辑状态
        this.fixScheduleTimeDisable = true;//固定时间
        this.earliestStartTimeDisable = true;//固定时间
        this.moQtyDisable = true;//工单数量
        this.makeOrderStatusDisable = true;//工单状态
        this.palletQtyDisable = true; //打托数量编辑状态
        this.commentsDisable = false; //工单备注
      }
      if (res.data.oaResult === '0' || res.data.oaResult === '1') {
        this.palletQtyDisable = true;
      }

      //合并工单，只能编辑时间和备注
      if (res.data.groupIndex2 === 1) {
        this.lpcTimeDisable = false; //排产结束时间编辑状态
        this.fixScheduleTimeDisable = false;//固定时间
        this.earliestStartTimeDisable = false;//最早开始时间
        this.moQtyDisable = true;//工单数量
        this.makeOrderStatusDisable = true;//工单状态
        this.palletQtyDisable = true; //打托数量编辑状态
        this.commentsDisable = false; //工单备注
      }

      //合并工单的散单，支持编辑状态
      if (res.data.groupId2 && res.data.groupIndex2 !== 1) {
        this.lpcTimeDisable = true; //排产结束时间编辑状态
        this.fixScheduleTimeDisable = true;//固定时间
        this.earliestStartTimeDisable = false;//最早开始时间
        this.moQtyDisable = true;//工单数量
        this.makeOrderStatusDisable = false;//工单状态
        this.palletQtyDisable = true; //打托数量编辑状态
        this.commentsDisable = true; //工单备注
        this.productionTimeLengthDisable = true;
      }

      this.moQtyDisable = true;//所有工单数量都不允许编辑

      console.log('this.readOnly', this.readOnly);

      this.commonquery
        .GetResourceByItem(res.data.itemCode, this.techVersion)
        .subscribe(res1 => {
          res1.data.forEach(element => {
            this.resourceoptions.push({
              label: element.resourceCode,
              value: element.resourceCode,
            });
          });
          /*if (this.resourceoptions.filter(item => item.value === this.i.resourceCode).length === 0) {
            this.resourceoptions.push({
              label: this.i.resourceCode,
              value: this.i.resourceCode,
            });
          }*/
        });

      this.moservice
        .GetThenVersionByItem(res.data.itemCode)
        .subscribe(res1 => {
          res1.data.forEach(element => {
            this.optionVersion.push({
              label: element.techVersion,
              value: element.techVersion,
            });
          });
        });

      // add by jianl 获取模具
      this.moservice
        .GetItemMolds({
          itemCode: res.data.itemCode,
          plantCode: this.i.plantCode
            ? this.i.plantCode
            : this.appconfig.getPlantCode(),
        })
        .subscribe(moldResp => {
          
          moldResp.data.forEach(element => {
            this.optionsMold.push({
              label: element.DESCRIPTIONS,
              value: element.MOULD_CODE,
            });
          });
        });
    });

    // statusoptions
    this.commonquery.GetLookupByTypeLang('PS_MAKE_ORDER_STATUS', this.appconfig.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.statusoptions.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });

    this.commonquery
      .GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.yesOrNo.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });
  }

  // 改变资源选版本
  public onChangeResource(value: string): void {
    this.optionVersion = [];
    this.commonquery
      .GetThenVersionByItem(this.i.itemCode, value)
      .subscribe(res1 => {
        res1.data.forEach(element => {
          this.optionVersion.push({
            label: element.techVersion,
            value: element.techVersion,
          });
        });
      });
  }

  // 改变版本选资源
  public onChangeVersion(value: string): void {
    this.resourceoptions = [];
    this.commonquery
      .GetResourceByItem(this.i.itemCode, value)
      .subscribe(res1 => {
        res1.data.forEach(element => {
          this.resourceoptions.push({
            label: element.resourceCode,
            value: element.resourceCode,
          });
        });
        if (this.resourceoptions.length > 0) {
          this.i.resourceCode = this.resourceoptions[0].value;
        }
      });
  }

  save() {
    if (this.techVersion !== this.i.techVersion) {
      this.i.ATTRIBUTE5 = 'true';
    } else {
      this.i.ATTRIBUTE5 = 'false';
    }
    this.moservice.edit_java(this.i).subscribe(res => {
      if (res.code === 200) {
        if (this.i.ATTRIBUTE5 === 'true') {
          this.msgSrv.success('保存成功，重新生成工序工单。');
        } else {
          this.msgSrv.success('保存成功');
        }
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  backChange(value: any) {
    if (value === 'Y') {
      this.i.SCHEDULE_FLAG = 'N';
    } else {
      this.i.SCHEDULE_FLAG = 'Y';
    }
  }

  scheduleChange(value: any) {
    if (value === 'Y') {
      this.i.BACKLOG_FLAG = 'N';
    } else {
      this.i.BACKLOG_FLAG = 'Y';
    }
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  isCounting = false;
  /**更新工单的完成时间 */
  changeLPCTime() {
    this.isCounting = true;
    this.moservice.countmocap(this.i).subscribe(res => {
      if (res.code ===200) {
        this.isCounting = false;
        this.i.productionTimeLength = res.data;
      } else {
        this.msgSrv.error(res.msg || '计算生产时长失败');
      }
    });
  }
}
