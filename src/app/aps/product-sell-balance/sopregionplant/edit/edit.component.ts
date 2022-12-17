import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { SopRegionPlantService } from 'app/modules/generated_module/services/sopregionplant-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopregionplant-edit',
  templateUrl: './edit.component.html',
  providers: [SopRegionPlantService]
})
export class ProductSellBalanceSopregionplantEditComponent implements OnInit {
  record: any = {};
  i: any;
  regionOptions: any[] = [];
  plantOptions: any[] = [];
  title: String = '新增';
  plantTypeOptions: any[] = [];
  plantCode: String;
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopRegionPlantService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.title = '编辑';
      this.dataservice.GetById(this.i.id).subscribe(res => {
        this.getRegionOptions(res.data[0].businessUnitCode);
        this.i = res.data[0];
      });
    }
    this.LoadData();
  }


  LoadData() {
    this.plantOptions.length = 0;
    this.commonquery.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          tag: {
            scheduleRegionCode: d.scheduleRegionCode
          }
        });
      });
    });

    this.plantTypeOptions.length = 0;
    this.commonquery.GetLookupByType('PP_PLANT_TYPE').subscribe(res => {
      res.Extra.forEach(item => {
        this.plantTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
    console.log(this.plantChange);

  }

  // 工厂切换
  plantChange(event: string) {
    this.i.regionId = null;
    this.regionOptions.length = 0;
    this.plantOptions.forEach(element => {
      if (element.value === event) {
        this.i.businessUnitCode = element.tag.scheduleRegionCode;
        this.getRegionOptions(this.i.businessUnitCode);
      }
    });

  }

  getRegionOptions(businessCode: string) {
    this.regionOptions.length = 0;
    this.dataservice.GetRegionByBusiness(this.i.businessUnitCode).subscribe(res => {
      res.data.content.forEach(tmp => {
        this.regionOptions.push({
          label: tmp.custDivisionName,
          value: tmp.id
        });
      });
    });
  }

  save() {
    if (this.i.id === null) {
      this.dataservice.SaveForNew(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.dataservice.EditData(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('修改成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

}
