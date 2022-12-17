import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { PlantCalendarService } from '../plant-calendar.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-calendar-edit',
  templateUrl: './edit.component.html',
  providers: [PlantCalendarService]
})
export class PlantCalendarEditComponent implements OnInit {

  constructor(
    public http: _HttpClient,
    private modalRef: NzModalRef,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private appTranslateService: AppTranslationService,
    private queryService: PlantCalendarService,
  ) { }

  title = '新增信息';
  params: any;
  paramsClone: any;
  plantOptions: any[] = [];
  isUpdate = false;

  ngOnInit() {
    if (this.params.id !== undefined) {
      this.title = '编辑信息';
      this.isUpdate = true;
      this.queryService.getPlantCalendarById(this.params.id).subscribe(res => {
        this.params = Object.assign({}, this.params, res.data);
        this.paramsClone = Object.assign({}, this.params);
      });
    } else {
      this.params.plantCode = this.appConfigService.getPlantCode();
    }
    this.loadPlantOptions();
  }

  onPlantChange(val: string) {
    this.params.plantDesc = this.plantOptions.find(item => item.value === val).desc;

  }

  loadPlantOptions() {
    this.commonQueryService.GetUserPlantNew(this.appConfigService.getUserId()).subscribe(res => {
      this.plantOptions.length = 0;
      res.data.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode,
          desc: item.descriptions
        });
      });
      if (!this.isUpdate) {
        this.params.plantDesc = this.plantOptions.find(item => item.value === this.appConfigService.getPlantCode()).desc;
      }
    });
  }

  save() {
    this.queryService.savePlantCalendar(this.params, this.isUpdate).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslateService.translate('保存成功！'));
        this.modalRef.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg));
      }
    });
  }

  close() {
    this.modalRef.destroy();
  }

  clear() {
    this.params = this.paramsClone;
    this.paramsClone = Object.assign({}, this.params);
  }
}
