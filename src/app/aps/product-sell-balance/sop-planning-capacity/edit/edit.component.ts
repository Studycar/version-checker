import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { deepCopy } from '@delon/util';
import { SopPlanningCapacityService } from '../sop-planning-capacity.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-planning-capacity-edit',
  templateUrl: './edit.component.html',
  providers: [SopPlanningCapacityService]

})
export class ProductSellBalanceSopPlanningCapacityEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  isModify = false;
  // 选项
  plantCodeList: any[] = [];
  saleTypeList: any[] = [];
  capacityList: any[] = [];
  days = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public appTranslationService: AppTranslationService,
    private editService: SopPlanningCapacityService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.clear();
    this.loadOptionData();
  }

  loadOptionData() {
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }
    this.editService.GetUserPlantNew().subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({ value: d.plantCode, label: d.plantCode, scheduleRegionCode: d.scheduleRegionCode });
      });
      this.plantChange(this.editDto.plantCode);
    });
    this.editService.GetLookupByType('SOP_SALES_TYPE').subscribe(result => {
      this.saleTypeList.length = 0;
      result.Extra.forEach(d => {
        this.saleTypeList.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  plantChange(event) {
    const search = this.plantCodeList.find(t => t.value === event);
    let scheduleRegionCode = '';
    if (search !== undefined) {
      scheduleRegionCode = search.scheduleRegionCode;
    }
    this.editService.getDemandDivisions(scheduleRegionCode).subscribe(result => {
      this.capacityList.length = 0;
      result.data.forEach(d => {
        this.capacityList.push({
          label: d.divisionValue,
          value: d.divisionValue,
        });
      });
    });
  }

  getAverageData() {
    this.editService.getAverageData(this.editDto).subscribe(result => {
      if (result.data) {
        this.editDto = result.data;
      }
    });
  }

  clear() {
    this.editDto = {
      id: null,
      plantCode: this.appConfigService.getPlantCode()
    };
    if (this.originDto.id) {
      this.isModify = true;
      this.editDto = deepCopy(this.originDto);
    }
  }

  save() {
    this.editService.save(this.editDto).subscribe(res => {
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
