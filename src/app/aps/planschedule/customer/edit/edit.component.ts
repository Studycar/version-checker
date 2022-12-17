import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { deepCopy } from '@delon/util';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomerService } from '../customer.service';
import { PlantAreaService } from 'app/aps/demand-order-management/plant-area/plant-area.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-customer-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerService, PlantAreaService]
})
export class PlanscheduleCustomerEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  isModify = false;
  // 选项
  gradeList: any[] = [];
  enableList: any[] = [];
  regionList: any[] = [];
  areaList: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public appTranslationService: AppTranslationService,
    private editService: CustomerService,
    private areaService: PlantAreaService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.clear();
    this.loadOptionData();
  }

  loadOptionData() {
    this.commonQueryService.GetLookupByType('PP_PLN_CUSTOMER_DEGREE').subscribe(result => {
      this.gradeList.length = 0;
      result.Extra.forEach(d => {
        this.gradeList.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    this.commonQueryService.GetLookupByType('PS_CUSTOMER_STATUS').subscribe(result => {
      this.enableList.length = 0;
      result.Extra.forEach(d => {
        this.enableList.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    this.commonQueryService.GetAllScheduleRegion().subscribe(res => {
      this.regionList.length = 0;
      res.data.forEach(d => {
        this.regionList.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });
    this.loadArea();
  }
  // 切换计划区域
  regionChange() {
    this.editDto.areaCode = null;
    this.areaList.length = 0;
    this.loadArea();
  }
  // 区域
  loadArea() {
    console.log("scheduleRegionCode");
    console.log(this.editDto.scheduleRegionCode);
    this.areaService.GetDivisions({
      scheduleRegionCode: this.editDto.scheduleRegionCode,
      custDvisionType: 'DC',
      pareatDivisionId: '',
      enableFlag: '',
      export: true,
      QueryParams: { PageIndex: 1, PageSize: 20 }
    }).subscribe(result => {
      result.data.forEach(d => {
        this.areaList.push({
          label: d.custDivisionName,
          value: d.custDivisionValue,
        });
      });
    });
  }

  clear() {
    this.editDto = {
      Id: null,
      scheduleRegionCode: this.originDto.scheduleRegionCode
    };
    if (this.originDto.id) {
      this.isModify = true;
      this.editDto = deepCopy(this.originDto);
    }
  }

  save() {
    this.editService.save(this.editDto).subscribe(res => {
      console.log(res);
      
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
