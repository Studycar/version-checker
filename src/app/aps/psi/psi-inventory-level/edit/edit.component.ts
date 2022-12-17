import { Component, OnInit } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { QueryService } from "../query.service";

@Component({
  selector: 'psi-inventory-level-edit',
  templateUrl: `./edit.component.html`,
  providers: [QueryService],
})
export class PsiInventoryLevelEditComponent implements OnInit {

  isModify: boolean = false;
  i:any;

  buCodeOptions: any[] = [];
  plantOptions: any[] = [];
  typeValueOptions: any[] = [];
  typeList = [{ value: 'PLANT', label: '工厂' }, { value: 'BASE', label: '基地' }];
  baseList = []; // 基地
  
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
    }
    this.loadData();
  }

  loadData() {
    this.getBuCodeOptions();
    if(this.i.businessUnitCode) {
      this.getOrganizationOptions();
      this.getBase();
    }
    if(this.i.type) {
      const type = this.i.type;
      if(type === 'PLANT') {
        // 切换工厂对应得类型值
        this.typeValueOptions = this.plantOptions
      } else {
        // 切换基地对应得类型值
        this.typeValueOptions = this.baseList;
      }
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

  buCodeOptionsChange(value) {
    this.i.typeValue = null;
    this.i.plantCode = null;
    const bu = this.buCodeOptions.find(item => item.value === this.i.businessUnitCode);
    if(bu) {
      this.i.businessUnit = bu.label;
    }
    this.getOrganizationOptions();
    this.getBase();
  }

  getOrganizationOptions() {
    const params = {
      businessUnitCode: this.i.businessUnitCode
    };
    this.plantOptions.length = 0;
    this.queryService.getPlant(params).subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
          value: d.plantCode,
        })
      })
    })
  }

  getBase() {
    this.baseList.length = 0;
    this.queryService.getBase({
      businessUnitCode: this.i.businessUnitCode
    }).subscribe(res => {
      res.data.forEach(d => {
        this.baseList.push({
          label: d.plantCode,
          value: d.plantCode,
        })
      })
    })
  }

  typeValueChange(event: any) {
    this.i.plantCode = this.i.typeValue;
    const typeValue = this.typeValueOptions.find(item => item.value === this.i.typeValue);
    if(typeValue) {
      this.i.descriptions = typeValue.label;
    }
  }

  typeChange(event: any) {
    this.i.typeValue = null;
    const type = this.i.type;
    if(type === 'PLANT') {
      // 切换工厂对应得类型值
      this.typeValueOptions = this.plantOptions
    } else {
      // 切换基地对应得类型值
      this.typeValueOptions = this.baseList;
    }
  }

  save(f) {
    this.queryService.save(this.isModify,this.i).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      }else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  close() {
    this.modal.destroy();
  }
}