import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'injection-molding-changeover-time-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class InjectionMoldingChangeoverTimeEditComponent implements OnInit, OnDestroy {

  i: any;
  iClone: any;
  statusClone: { mouldCodeDisabled: boolean, colorTypeDisabled: boolean, mouldCodeRequired: boolean, colorTypeRequired: boolean } = {
    mouldCodeDisabled: false,
    mouldCodeRequired: false,
    colorTypeDisabled: false,
    colorTypeRequired: false
  };
  title: String = '新增信息';
  plantOptions: any[] = [];
  changeoverTypeOptions: any[] = [];
  colorTypeOptions: any[] = [];
  whetherEffectiveOptions: any[] = [];
  mouldCodeOptions: any[] = [];
  mouldCodeDisabled = false;
  colorTypeDisabled = false;
  mouldCodeRequired = false;
  colorTypeRequired = false;
  subject = new BehaviorSubject('');
  obs: any;     // 用于存放观察者以取消订阅释放内存

  constructor(
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private modal: NzModalRef,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appTranslateService: AppTranslationService
  ) { }

  ngOnInit() {
    if (this.i.id !== null) {
      this.title = '编辑信息';
      /*this.getItemDataById().subscribe(res => {
        console.log('!!!!!!!!', res);
      });*/
      this.getItemDataById();
    } else {
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.i.enableFlag = 'Y';
      this.subject.next(this.i.plantCode);
    }
    this.obs = this.subject.subscribe({
      next: v => {
        if (v) {
          this.getmouldCodes(v);
        }
      }
    });
    this.loadData();
  }

  ngOnDestroy() {
    this.obs.unsubscribe();
  }

  getItemDataById() {
    this.queryService.getItemDataById(this.i.id).subscribe(res => {
      this.i = res.Result[0];
      this.iClone = Object.assign({}, this.i);
      if (this.i.switchType === 'switchColor') {
        this.mouldCodeDisabled = true;
        this.colorTypeDisabled = false;
        this.mouldCodeRequired = false;
        this.colorTypeRequired = true;
      } else {
        this.mouldCodeDisabled = false;
        this.colorTypeDisabled = true;
        this.mouldCodeRequired = true;
        this.colorTypeRequired = false;
      }
      this.statusClone.mouldCodeDisabled = this.mouldCodeDisabled;
      this.statusClone.colorTypeDisabled = this.colorTypeDisabled;
      this.statusClone.mouldCodeRequired = this.mouldCodeRequired;
      this.statusClone.colorTypeRequired = this.colorTypeRequired;
      this.subject.next(this.i.plantCode);
    });
  }

  changeoverTypeValueChange(value) {
    if (value === 'SWITCH_COLOR') {
      this.mouldCodeDisabled = true;
      this.colorTypeDisabled = false;
      this.mouldCodeRequired = false;
      this.colorTypeRequired = true;
      this.i.mouldCode = null;
    } else {
      this.mouldCodeDisabled = false;
      this.colorTypeDisabled = true;
      this.mouldCodeRequired = true;
      this.colorTypeRequired = false;
      this.i.colorTypeFrom = null;
      this.i.colorTypeTo = null;
    }
  }

  plantValueChange(value) {
    this.i.mouldCode = null;
    this.getmouldCodes(value);
  }

  getmouldCodes(plantCode: string) {
    this.queryService.getMouldCodes(plantCode).subscribe(res => {
      this.mouldCodeOptions.length = 0;
      res.data.forEach(item => {
        this.mouldCodeOptions.push({
          label: item.mouldCode,
          value: item.mouldCode
        });
      });
      /*if (this.mouldCodeOptions.indexOf(this.i.mouldCode) < 0) {
        this.i.mouldCode = '';
      }*/
    });
  }

  loadData() {
    this.commonQueryService.GetUserPlant('', this.appConfigService.getUserId()).subscribe(res => {
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
    this.commonQueryService.GetLookupByTypeLang('PIJ_SWITCH_TIME_TYPE', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(item => {
        this.changeoverTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
    this.commonQueryService.GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(item => {
        this.whetherEffectiveOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });

    this.commonQueryService.GetLookupByTypeLang('PIJ_COLOR_TYPE', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(item => {
        this.colorTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
  }

  save() {
    if (this.i.switchType === 'SWITCH_COLOR' && (!this.i.colorTypeFrom || !this.i.colorTypeTo)) {
      this.msgSrv.error(this.appTranslateService.translate('当换型类型为换色时， 颜色类型从和颜色类型至不能为空！'));
      return;
    } else if ((this.i.switchType === 'SWITCH_MOULD' || this.i.switchType === 'SWITCH_MATERIAL') && !this.i.mouldCode) {
      this.msgSrv.error(this.appTranslateService.translate('当换型类型为换模或换料时，模具编码不能为空！'));
      return;
    }
    this.queryService.add(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslateService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg || '保存失败'));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
  /**重置 */
  clear() {
    if (this.i.Id !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
      this.getmouldCodes(this.i.plantCode);
      this.mouldCodeDisabled = this.statusClone.mouldCodeDisabled;
      this.colorTypeDisabled = this.statusClone.colorTypeDisabled;
      this.mouldCodeRequired = this.statusClone.mouldCodeRequired;
      this.colorTypeRequired = this.statusClone.colorTypeRequired;
    } else {
      this.i = {};
    }
  }
}
