import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { SopDemandAnalysisdm } from '../../../../modules/generated_module/services/sopdemandanalysisdm-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopdemandanalysisdm-edit',
  templateUrl: './edit.component.html',
})
export class ProductSellBalanceSopdemandanalysisdmEditComponent implements OnInit {

  i: any;
  regionoptions: any[] = [];
  readOnly: Boolean = false;
  title: String = '新增';
  yesOrNo: any[] = [];
  // groupoptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopDemandAnalysisdm,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      /*this.dataservice.GetById(this.i.Id).subscribe(res => {
        this.plantChange(res.Extra.PLANT_CODE);
        this.i = res.Extra;
      });*/
    } else {
      this.i.enableFlag = 'Y';
      this.i.businessUnitCode = this.appconfig.getActiveScheduleRegionCode();
    }
    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetScheduleRegions().subscribe(res => {
      res.data.forEach(element1 => {
        this.regionoptions.push({
          label: element1.scheduleRegionCode,
          value: element1.scheduleRegionCode
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element1 => {
        this.yesOrNo.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });
  }

  save() {
    this.dataservice.save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
    /*if (this.i.Id === null) {
      this.dataservice.SaveForNew(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    } else {
      this.dataservice.EditData(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success('修改成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    }*/
  }

  close() {
    this.modal.destroy();
  }

  /*plantChange(value: any) {
    this.i.SCHEDULE_GROUP_CODE = null;
    this.groupoptions.length = 0;
    this.dataservice.GetGroup(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.groupoptions.push({
          label: element.SCHEDULE_GROUP_CODE,
          value: element.SCHEDULE_GROUP_CODE
        });
      });
    });
  }*/
}
