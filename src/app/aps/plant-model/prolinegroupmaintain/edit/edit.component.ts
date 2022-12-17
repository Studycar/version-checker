import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { PlantMaintainService } from '../../../../modules/generated_module/services/plantmaintain-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { ProLineGroupMaintainService } from '../../../../modules/generated_module/services/prolinegroupmaintain-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-prolinegroupmaintain-edit',
  templateUrl: './edit.component.html'
})
export class PlantModelProlinegroupmaintainEditComponent implements OnInit {
  isModify = false;
  scheduleregions: any[] = [];
  processarithmetics: any[] = [];
  schedulealgorithms: any[] = [];
  plantcodes: any[] = [];
  enableflags: any[] = [];
  linkagelevels: any[] = [];
  queryParams: any[] = [];
  record: any = {};
  i: any;
  iClone: any;
  // tslint:disable-next-line:no-inferrable-types
  Istrue: boolean = false;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appconfig: AppConfigService,
    public prolinegroupmaintainService: ProLineGroupMaintainService,
    private appTranslationService: AppTranslationService,
    private commonqueryService: CommonQueryService,
    private plantmaintainService: PlantMaintainService,
  ) { }

  ngOnInit(): void {
    if (this.i.NEWFLAG === 'Y') {
      this.i.scheduleStartTime = new Date();
      this.i.schedulePeriod = 1;
      this.i.enableFlag = 'Y';
      this.i.plantCode = this.appconfig.getPlantCode();
      this.LoadScheduleRegion();
      this.Istrue = false;
    } else {
      this.isModify = true;
      this.Istrue = true;
      this.scheduleregions = this.i.scheduleregions;

    }
    this.loadData();
  }
  loadData() {

    this.commonqueryService
    .GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.enableflags.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

    /** 初始化 联动层级  下拉框*/
    this.commonqueryService
    .GetLookupByTypeLang('PS_LINKAGE_LEVEL', this.appconfig.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.linkagelevels.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

    /** 初始化 组织  下拉框*/
    this.commonqueryService.GetUserPlant('', this.appconfig.getUserId()).subscribe(result => {
      result.Extra.forEach(d => {
        this.plantcodes.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });

    this.commonqueryService.GetLookupByType('PS_PLANNING_BASIC_ALGORITHM').subscribe(result => {
      result.Extra.forEach(d => {
        this.schedulealgorithms.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    if (this.i.ID != null) {
      /** 初始化编辑数据 */
      this.prolinegroupmaintainService.GetInfo(this.i.ID).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      }
      );
    }

  }

  public LoadScheduleRegion() {
    /** 根据工厂获取事业部  下拉框*/
    this.scheduleregions.length = 0;
    this.i.scheduleRegionCode = '';
    this.prolinegroupmaintainService.GetScheduleRegionByPlant(this.i.plantCode).subscribe(result => {
      result.data.forEach(d => {
        this.scheduleregions.push({
          label: d.descriptions,
          value: d.scheduleRegionCode,
        });
        this.i.scheduleRegionCode = this.scheduleregions[0].value;
      });
    });

  }

  save() {
    if (this.i.scheduleStartTime !== null && this.i.scheduleStartTime !== undefined) {
      this.i.scheduleStartTime = this.commonqueryService.formatDateTime((this.i.scheduleStartTime).toString());
    }
    this.prolinegroupmaintainService.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
  /**重置 */
  clear() {
    if (this.i.ID !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
