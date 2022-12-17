import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { PlantCalendarService } from '../plant-calendar.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-calendar-copy',
  templateUrl: './copy.component.html',
  providers: [PlantCalendarService]
})
export class PlantCalendarCopyComponent implements OnInit {

  constructor(
    public http: _HttpClient,
    private modalRef: NzModalRef,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private appTranslateService: AppTranslationService,
    private queryService: PlantCalendarService,
  ) { }

  params = {
    sourcePlant: null,
    targetPlant: []
  };
  sourcePlantOptions: Array<{label: string, value: any}> = [];
  targetPlantOptions: Array<{label: string, value: any, disabled: boolean}> = [];
  queryParams: { [key: string]: any };

  ngOnInit() {
    this.loadTargetPlantOptions();
    this.loadResourcePlantOptions();
  }

  onSourcePlantChange(sourcePlant: string) {
    this.targetPlantOptions.forEach(item => {
      item.disabled = item.value === sourcePlant;
    });
    const index = this.params.targetPlant.indexOf(sourcePlant);
    if (index >= 0) {
      this.params.targetPlant.splice(index, 1);
      this.params.targetPlant = [...this.params.targetPlant];
    }
  }

  loadTargetPlantOptions() {
    this.commonQueryService.GetUserPlantNew( this.appConfigService.getUserId()).subscribe(res => {
      this.targetPlantOptions.length = 0;
      res.data.forEach(item => {
        this.targetPlantOptions.push({
          label: item.plantCode,
          value: item.plantCode,
          disabled: false
        });
      });
    });
  }

  loadResourcePlantOptions() {
    this.queryService.getSourcePlantOptions(this.queryParams).subscribe(res => {
      const sourcePlantSet = new Set<string>();
      res.data.content.forEach(item => {
        sourcePlantSet.add(item.plantCode);
      });
      this.sourcePlantOptions.length = 0;
      for (const item of sourcePlantSet) {
        this.sourcePlantOptions.push({
          label: item,
          value: item
        });
      }
    });
  }

  confirm() {

    


    this.queryService.copyPlantCalendar(this.params.sourcePlant, this.params.targetPlant).subscribe(res => {
      if (res.code = 200) {
        this.msgSrv.success(this.appTranslateService.translate('复制成功！'));
        this.modalRef.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg));
      }
    });
  }

  close() {
    this.modalRef.destroy();
  }
}
