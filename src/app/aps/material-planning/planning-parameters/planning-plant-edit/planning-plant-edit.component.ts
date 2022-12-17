import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { PlanningParametersService } from '../planning-parameters.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planning-plant-edit',
  templateUrl: './planning-plant-edit.component.html',
  providers: [PlanningParametersService]
})
export class PlanningPlantEditComponent implements OnInit {

  constructor(
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: NzModalRef,
    private commonQueryService: CommonQueryService,
    private appTranslateService: AppTranslationService,
    private queryService: PlanningParametersService,
  ) { }

  planName: string;
  plantOptions: any[] = [];
  params = {
    plantCode: '',
    plantDesc: ''
  };

  ngOnInit() {
    this.loadPlantOptions();
  }

  loadPlantOptions() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      this.plantOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode,
          desc: item.descriptions
        });
      });
    });
  }

  onPlantChange(value: string) {
    this.params.plantDesc = this.plantOptions.find(item => item.value === value).desc;
  }

  save() {
    const saveData = Object.assign({}, this.params, { planName: this.planName });
    this.queryService.savePlanPlant(saveData).subscribe(res => {
      if (res.code=200) {
        this.msgSrv.success(this.appTranslateService.translate('保存成功！'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
