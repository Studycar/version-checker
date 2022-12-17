import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { MoManagerService } from '../../../../modules/generated_module/services/mo-manager-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-momanager-edit',
  templateUrl: './edit.component.html',
})
export class PlanscheduleMomanagerEditComponent implements OnInit {
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
  flagOne: Boolean = false; // 资源，参与排产标识，最早开始时间，验货时间, 固定时间
  flagOneR: Boolean = false; // 已发放：最早开始时间，验货时间, 固定时间
  flagTwo: Boolean = false; // 尾单标识，尾单原因
  flagThree: Boolean = false; // 状态
  flagFour: Boolean = false; // 工单数量
  flagFive: Boolean = false; // 备注
  flagOneVersion: Boolean = false; // 工艺版本，ABGS状态能选

  // 绑定资源表
  public gridViewResources: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsResources: any[] = [
    {
      field: 'scheduleGroupCode',
      width: 120,
      title: '计划组',
    },
    {
      field: 'resourceCode',
      width: 120,
      title: '资源',
    },
    {
      field: 'resourceDesc',
      width: 120,
      title: '资源描述',
    },
    {
      field: 'manufLineCode',
      width: 120,
      title: '产线编码',
    },
    {
      field: 'manufLineName',
      width: 120,
      title: '产线描述',
    },
    {
      field: 'priority',
      width: 80,
      title: '优先级',
    },
  ];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private moservice: MoManagerService,
    private commonquery: PlanscheduleHWCommonService,
    private appconfig: AppConfigService,
    private appTranslationService: AppTranslationService,
  ) {}

  ngOnInit(): void {
    this.isOpen = true;
    this.LoadData();
  }

  LoadData() {
    this.moservice.GetById(this.i.id).subscribe(res => {
      this.i = res.data;
      this.iClone = Object.assign({}, this.i);
      this.techVersion = this.i.techVersion;

      if (
        res.data.makeOrderStatus === 'A' ||
        res.data.makeOrderStatus === 'G'
      ) {
        this.flagOneVersion = true;
        this.flagOne = false;
        this.flagThree = true;
        this.flagTwo = true;
        this.flagFour = false;
        this.flagFive = false;
      } else if (res.data.makeOrderStatus === 'B') {
        this.flagOneVersion = true;
        this.flagOne = true;
        this.flagThree = true;
        this.flagTwo = true;
        this.flagFour = true;
        this.flagFive = true;
      } else if (res.data.makeOrderStatus === 'S') {
        this.flagOneVersion = false;
        this.flagOne = false;
        this.flagThree = false;
        this.flagTwo = false;
        this.flagFour = false;
        this.flagFive = false;
      } else if (res.data.makeOrderStatus === 'R') {
        this.flagOneR = true;
        // this.flagOneVersion = true;
        // this.flagOne = false;
        // this.flagThree = false;
        // this.flagTwo = false;
        // this.flagFour = true;
        // this.flagFive = false;
      } else if (
        res.data.makeOrderStatus === 'C' ||
        res.data.makeOrderStatus === 'O' ||
        res.data.makeOrderStatus === 'H'
      ) {
        this.flagOneVersion = true;
        this.flagOne = true;
        this.flagThree = true;
        this.flagTwo = true;
        this.flagFour = true;
        this.flagFive = false;
      } else if (
        res.data.makeOrderStatus === 'P' ||
        res.data.makeOrderStatus === 'D'
      ) {
        this.flagOneVersion = true;
        this.flagOne = true;
        this.flagThree = true;
        this.flagTwo = false;
        this.flagFour = true;
        this.flagFive = false;
      }

      this.commonquery
        .GetResourceByItem(res.data.itemCode, this.techVersion)
        .subscribe(res1 => {
          res1.data.forEach(element => {
            this.resourceoptions.push({
              label: element,
              value: element,
            });
          });
          /*if (this.resourceoptions.filter(item => item.value === this.i.RESOURCE_CODE).length === 0) {
            this.resourceoptions.push({
              label: this.i.RESOURCE_CODE,
              value: this.i.RESOURCE_CODE,
            });
          }*/
        });

      this.commonquery
        .GetThenVersionByItem(res.data.itemCode)
        .subscribe(res1 => {
          res1.data.forEach(element => {
            this.optionVersion.push({
              label: element,
              value: element,
            });
          });
        });

      // // add by jianl 获取模具
      // this.commonquery
      //   .GetItemMolds({
      //     ITEM_CODE: res.data.itemCode,
      //     PLANT_CODE: this.i.plantCode
      //       ? this.i.plantCode
      //       : this.appconfig.getPlantCode(),
      //   })
      //   .subscribe(moldResp => {
      //     moldResp.Extra.forEach(element => {
      //       this.optionsMold.push({
      //         label: element.descriptions,
      //         value: element.mouldCode,
      //       });
      //     });
      //   });
    });

    // statusoptions
    this.commonquery
      .GetLookupByTypeLang('PS_MAKE_ORDER_STATUS', this.appconfig.getLanguage())
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
            label: element,
            value: element,
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
            label: element,
            value: element,
          });
        });
        if (this.resourceoptions.length > 0) {
          this.i.resourceCode = this.resourceoptions[0].value;
        }
      });
  }

  /**
   * 仓库弹出查询
   * @param {any} e
   */
   public searchResources(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadResources(
      PageIndex,
      e.PageSize,
    );
  }

  /**
   */
  public loadResources(
    pageIndex: number,
    pageSize: number,
  ) {
    this.commonquery
      .getResourceInfoByItem({
        plantCode: this.i.plantCode,
        itemId: this.i.itemId,
      })
      .subscribe(res => {
        this.gridViewResources.data = res.data;
        this.gridViewResources.total = res.data.length;
      });
  }

  //  行点击事件， 给参数赋值
  onResourcesSelect(e: any) {
    this.saveResources(e.Row);
  }

  saveResources(data) {
    this.i.scheduleGroupCode = data.scheduleGroupCode;
    this.i.resourceCode = data.resourceCode;
    this.i.resourceDesc = data.resourceDesc;
    this.i.manufLineCode = data.manufLineCode;
    this.i.manufLineName = data.manufLineName;
  }

  clearResources() {
    this.i.scheduleGroupCode = '';
    this.i.resourceCode = '';
    this.i.resourceDesc = '';
    this.i.manufLineCode = '';
    this.i.manufLineName = '';
  }

  save() {
    if (this.techVersion !== this.i.techVersion) {
      this.i.attribute5 = 'true';
    } else {
      this.i.attribute5 = 'false';
    }
    this.moservice.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        if (this.i.attribute5 === 'true') {
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
      this.i.scheduleFlag = 'N';
    } else {
      this.i.scheduleFlag = 'Y';
    }
  }

  scheduleChange(value: any) {
    if (value === 'Y') {
      this.i.backlogFlag = 'N';
    } else {
      this.i.backlogFlag = 'Y';
    }
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
