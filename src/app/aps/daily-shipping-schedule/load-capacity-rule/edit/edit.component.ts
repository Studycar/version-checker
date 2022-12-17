import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { LoadCapacityRuleService } from '../load-capacity-rule.service';
import { LoadShiftsService } from '../../load-shifts/load-shifts.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'load-capacity-rule-edit',
  templateUrl: './edit.component.html',
  providers: [LoadCapacityRuleService, LoadShiftsService]

})
export class LoadCapacityRuleEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  // 工厂
  public plantCodes: any[] = [];
  // 装运点
  public loadLocations: any[] = [];
  // 开始时间
  public loadInternals: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public loadCapacityRuleService: LoadCapacityRuleService,
    public loadShiftsService: LoadShiftsService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,    
    private appTranslationService: AppTranslationService,
  ) { }


  ngOnInit(): void {
    this.initPlantCodes();
    this.clear();
  }

  clear() {
    this.editDto = {
      id: null,
      plantCode: this.appConfigService.getPlantCode(),
      loadLocation: null,
      enableDate: new Date(),
      disableDate: null,
      internal: 0,
      tonnageForA: 0,
      tonnageForB: 1,
      tonnageForC: 2,
    };

    console.log('originDto:'+ this.originDto);
    if (this.originDto.id) {
      this.editDto = {
        id: this.originDto.id,
        plantCode: this.originDto.plantCode,
        loadLocation: this.originDto.loadLocation,
        enableDate: this.originDto.enableDate,
        disableDate: this.originDto.disableDate,
        internal: this.originDto.internal,
        tonnageForA: this.originDto.tonnageForA,
        tonnageForB: this.originDto.tonnageForB,
        tonnageForC: this.originDto.tonnageForC,
      };
    }

    this.ngPlantCodeModelChange(this.editDto.plantCode);
  }

  /** 初始化 组织  下拉框*/
  initPlantCodes() {
    this.loadCapacityRuleService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodes.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  ngPlantCodeModelChange(event: any) { 
    this.loadLocations.length = 0;
    this.loadCapacityRuleService.QueryLocation(event).subscribe(result => {
      result.data.forEach(d => {
        this.loadLocations.push({ value: d, label: d });
      });
    });

    const dto = {
      plantCode: event,
      isExport: true
    };
    this.loadInternals.length = 0;
    this.loadShiftsService.QueryInternals(dto).subscribe(result => {
      result.data.content.forEach(d => {
        this.loadInternals.push({ value: d.internal, label: d.attribute1 });
      });
    });
  }

  save() {
    this.loadCapacityRuleService.Save(this.editDto).subscribe(res => {
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
}
