import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { QueryService } from '../queryService';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-moexception-submit-exception',
  templateUrl: './submitException.component.html',
  providers: [QueryService]
})

export class PlanscheduleMoexceptionSubmitExceptionComponent implements OnInit {
  plantOptions: any[] = [];
  scheduleGroupOptions: any[] = [];
  resourceOptions: any[] = [];
  saveData: any = {};

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private commonQueryService: QueryService,
    private appConfigService: AppConfigService,
    private appTranslationService: AppTranslationService
  ) {

  }

  ngOnInit(): void {
    this.saveData = {
      plantCode: this.appConfigService.getPlantCode(),
      scheduleGroupCode: null,
      resourceCode: null,
    };
    // 加载工厂
    this.commonQueryService.GetUserPlant().subscribe(result => {
        // this.plantOptions.length = 0;
        result.Extra.forEach(d => {
          this.plantOptions.push({ value: d.plantCode, label: `${d.plantCode}(${d.descriptions})` });
        });
      });
      this.plantChange(this.saveData.plantCode);
}
  plantChange(value) {
    this.saveData.scheduleGroupCode = null;
    this.scheduleGroupOptions.length = 0;
    this.commonQueryService.GetUserPlantGroup(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.scheduleGroupOptions.push({
          label: `${element.scheduleGroupCode}(${element.descriptions})`,
          value: element.scheduleGroupCode,
        });
        // this.scheduleGroupChange('');
      });
    });
    this.scheduleGroupChange('');
  }

  scheduleGroupChange(value) {
    this.saveData.resourceCode = null;
    this.resourceOptions.length = 0;
    this.commonQueryService.GetUserPlantGroupLine(this.saveData.plantCode, value).subscribe(res => {
      res.Extra.forEach(element => {
        this.resourceOptions.push({
          label: `${element.resourceCode}(${element.descriptions})`,
          value: element.resourceCode,
        });
      });
    });
  }

  close() {
    this.modal.destroy();
  }

  save() {
    this.commonQueryService.SubmitRequest_Exception(this.saveData.plantCode, this.saveData.scheduleGroupCode, this.saveData.resourceCode).subscribe(result => {
      if (result !== null && result.code===200) {
        this.msgSrv.success(this.appTranslationService.translate('请求提交成功！请求ID:'.concat(result.msg)));
        this.modal.destroy();
      } else {
        this.msgSrv.error(this.appTranslationService.translate('请求提交失败！'.concat(result.msg)));
      }
    });
  }
}
