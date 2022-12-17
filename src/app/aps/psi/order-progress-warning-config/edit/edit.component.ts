import { Component, OnInit } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { QueryService } from "../query.service";

@Component({
  selector: 'order-progress-warning-config-edit',
  templateUrl: `./edit.component.html`,
  providers: [QueryService],
})
export class OrderProgressWarningConfigEditComponent implements OnInit {

  isModify: boolean = false;
  i: any;

  buCodeOptions: any[] = [];
  warnDimensionOptions: any[] = [];
  warnProjectOptions: any[] = [];
  warnConditionOptions: any[] = [];
  warnObjectOptions: any[] = [];
  baseList: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    public http: _HttpClient,
  ) { }
  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getById(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
        }
      })
    }
    this.loadData();
  }

  loadData() {
    this.getBuCodeOptions();
    this.getWarnDimensions();
    if(this.i.warnDimension) {
      this.getWarnProjects(this.i.warnDimension);
      this.getWarnConditions(this.i.warnDimension);
      this.getWarnObjects(this.i.warnDimension);
    }
  }

  // 获取事业部列表
  getBuCodeOptions() {
    this.buCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      res.data.forEach(d => {
        this.buCodeOptions.push({
          label: d.descriptions,
          value: d.scheduleRegionCode
        })
      });
    });
  }

  getWarnDimensions() {
    this.warnDimensionOptions.length = 0;
    this.queryService.GetLookupByTypeRef('SOP_WARN_DIMENSION', this.warnDimensionOptions);
  }

  getWarnProjects(warnDimension) {
    const code = 'SOP_WARN_PROJECT_' + warnDimension;
    this.queryService.GetLookupByTypeRef(code, this.warnProjectOptions);
  }

  getWarnConditions(warnDimension) {
    const code = 'SOP_WARN_CONDITION_' + warnDimension;
    this.queryService.GetLookupByTypeRef(code, this.warnConditionOptions);
  }

  getWarnObjects(warnDimension) {
    const code = 'SOP_WARN_OBJECT_' + warnDimension;
    this.queryService.GetLookupByTypeRef(code, this.warnObjectOptions);
  }

  buCodeOptionsChange(event: any) {
    const bu = this.buCodeOptions.find(item => item.value === this.i.businessUnitCode);
    if(bu) {
      this.i.businessUnit = bu.label;
    }
  }

  warnDimensionChange(event: any) {
    const warnDimension  = this.warnDimensionOptions.find(item => item.value === this.i.warnDimension);
    if(warnDimension) {
      this.i.warnDimensionDesc = warnDimension.label;
    }
    this.i.warnObject = null;
    this.i.warnProject = null;
    this.i.warnCondition = null;
    this.getWarnProjects(this.i.warnDimension);
    this.getWarnConditions(this.i.warnDimension);
    this.getWarnObjects(this.i.warnDimension);
  }

  optionChange(event: any, optionType: string) {
    let options = [];
    switch (optionType) {
      case 'warnProject':
        options = this.warnProjectOptions;
        break;
      case 'warnCondition':
        options = this.warnConditionOptions;
        break;
      case 'warnObject':
        options = this.warnObjectOptions;
        break;
      default:
        break;
    }
    const option = options.find(item => item.value === event);
    if(option) {
      this.i[optionType+'Desc'] = option.label;
    }
  }

  save(f) {
    this.queryService.save(this.i).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate("保存成功"));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  close() {
    this.modal.destroy();
  }
}