import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { PlantMaintainService } from '../../../../modules/generated_module/services/plantmaintain-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-plantmaintain-edit',
  templateUrl: './edit.component.html'

})
export class PlantModelPlantmaintainEditComponent implements OnInit {
  isModify = false;
  /**事业部集合 */
  scheduleregions: any[] = [];
  buorgids: any[] = [];
  enableflags: any[] = [];
  operatingunits: any[] = [];
  masterorganizationids: any[] = [];
  purchasingPlantCodes: any[] = [];
  organizationids: any[] = [];
  wotypes: any[] = [];
  // motypes: any[] = [];
  queryParams: any[] = [];
  record: any = {};
  i: any;
  iClone: any;
  Istrue: boolean;
  IsReaded = false;
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    private plantmaintainService: PlantMaintainService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    if (this.i.NEWFLAG === 'Y') {
      this.IsReaded = false;
    } else {
      this.isModify = true;
      this.Istrue = true;
      this.IsReaded = true;
    }
    this.loadData();
  }

  loadData() {
    this.scheduleregions = this.i.scheduleregions;
    /** 初始化 是否有效  下拉框*/
    this.commonQueryService
    .GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.enableflags.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

    if (this.i.NEWFLAG === 'Y') {
      this.i.ENABLEFLAG = 'Y';
    }

    /** 初始化   下拉框*/
    this.commonQueryService
    .GetLookupByTypeLang('PS_DISCRETE_JOB_TYPE', this.appConfigService.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.wotypes.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

    this.commonQueryService
    .GetLookupByTypeLang('SAP_PURCHASING_ORGANIZATION', this.appConfigService.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.purchasingPlantCodes.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });


    /*this.motypes.length = 0;
    this.plantmaintainService.GetMoType().subscribe(result => {
      result.data.forEach(d => {
        this.motypes.push({
          label: d.descriptions,
          value: d.moType,
        });
      });

    });*/

    /** 初始化 业务实体  下拉框*/
    this.commonQueryService
    .GetLookupByTypeLang('PS_PLANT_OPERATING_UNIT', this.appConfigService.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.operatingunits.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

    if (this.i.PLANTID != null) {
      /** 初始化编辑数据 */
      this.plantmaintainService.GetInfo(this.i.PLANTID).subscribe(result => {
        this.i = result.data;
        this.i.scheduleRegionCode = result.data.scheduleRegionCode;
        this.iClone = Object.assign({}, this.i);
      }
      );
    }
  }

  save() {
    this.plantmaintainService.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        if (this.i.NEWFLAG === 'Y') {
          this.i.organizationids.push({
            label: this.i.plantCode,
            value: this.i.plantCode
          });
        }
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
    if (this.i.PLANTID !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
