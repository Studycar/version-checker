import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { PlanningParametersService } from '../planning-parameters.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planning-parameters-edit',
  templateUrl: './edit.component.html',
  providers: [PlanningParametersService]
})
export class PlanningParametersEditComponent implements OnInit {

  constructor(
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: NzModalRef,
    private commonQueryService: CommonQueryService,
    private appTranslateService: AppTranslationService,
    private queryService: PlanningParametersService,
  ) { }

  params: any;
  paramsClone: any;
  title = '新增信息';
  editDisabled = false;
  whetherOptions: any[] = [];
  materialRangeOptions: any[] = [];
  planTypeOptions: any = [];
  planApplicationOptions: any = [];


  ngOnInit() {
    if (this.params.id !== undefined) {
      this.title = '编辑信息';
      this.editDisabled = true;
      this.queryService.getPlanParameterById(this.params.id).subscribe(res => {
        this.params = res.data;
        this.paramsClone = Object.assign({}, this.params);
      });
    }
    this.loadWhetherOptions();
    this.loadMaterialRangeOptions();
    this.loadPlanTypeOptions();
    this.loadPlanApplicationOptions();
  }

  loadWhetherOptions() {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.whetherOptions.length = 0;
      result.Extra.forEach(d => {
        this.whetherOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  loadMaterialRangeOptions() {
    this.commonQueryService.GetLookupByType('MRP_PLAN_INCLUDE_ITEMS').subscribe(res => {
      this.materialRangeOptions.length = 0;
      res.Extra.forEach(item => {
        this.materialRangeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  // 计划类型快码
  loadPlanTypeOptions() {
    this.commonQueryService.GetLookupByTypeRef('PS_PLAN_TYPE', this.planTypeOptions)
    console.log("planTypeOptions",this.planTypeOptions)
  }

  // 计划应用快码
  loadPlanApplicationOptions() {
    this.commonQueryService.GetLookupByTypeRef('PS_PLAN_APPLICATION', this.planApplicationOptions)
    console.log("planApplicationOptions",this.planApplicationOptions)
  }

  save() {
    this.queryService.update(this.params).subscribe(res => {
      if (res.code === 200) {
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

  clear() {
    this.params = this.paramsClone;
    this.paramsClone = Object.assign({}, this.params);
  }
}
