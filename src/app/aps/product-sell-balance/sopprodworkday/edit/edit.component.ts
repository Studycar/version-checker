import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { SopMaterialResourceCorrelationService } from 'app/modules/generated_module/services/sopmaterialresourcecorrelation-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { SopProdWorkdayService } from 'app/modules/generated_module/services/sopprodworkday-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopprodworkday-edit',
  templateUrl: './edit.component.html',
})
export class ProductSellBalanceSopprodworkdayEditComponent implements OnInit {
  record: any = {};
  i: any;
  plantoptions: any[] = [];
  readOnly: Boolean = false;
  title: String = '新增';
  groupoptions: any[] = [];
  resourceOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopProdWorkdayService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    if (this.i.Id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.dataservice.GetById(this.i.Id).subscribe(res => {
        this.plantChange(res.Extra.PLANT_CODE);
        this.groupChange(res.Extra.SCHEDULE_GROUP_CODE);
        this.i = res.Extra;
      });
    } else {
      this.i.PLANT_CODE = this.appconfig.getPlantCode();
      this.plantChange(this.i.PLANT_CODE);
    }
    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element1 => {
        this.plantoptions.push({
          label: element1.PLANT_CODE,
          value: element1.PLANT_CODE
        });
      });
    });
  }

  save() {
    if (this.i.Id === null) {
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
    }
  }

  close() {
    this.modal.destroy();
  }

  plantChange(value: any) {
    this.i.SCHEDULE_GROUP_CODE = null;
    this.groupoptions.length = 0;
    this.dataservice.GetSchedule(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.groupoptions.push({
          label: element.SCHEDULE_GROUP_CODE,
          value: element.SCHEDULE_GROUP_CODE
        });
      });
    });
  }

  groupChange(value: any) {
    this.i.RESOURCE_CODE = null;
    this.resourceOptions.length = 0;
    this.dataservice.GetResource(this.i.PLANT_CODE, value).subscribe(res => {
      res.Extra.forEach(element => {
        this.resourceOptions.push({
          label: element.RESOURCE_CODE,
          value: element.RESOURCE_CODE
        });
      });
    });
  }

  that = this;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.i.END_DATE) {
      return false;
    }
    return startValue > this.i.END_DATE;
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.i.START_DATE) {
      return false;
    }
    return endValue < this.i.START_DATE;
  }

  onStartChange(date: Date): void {
    this.i.START_DATE = date;
  }

  onEndChange(date: Date): void {
    this.i.END_DATE = date;
  }

}
