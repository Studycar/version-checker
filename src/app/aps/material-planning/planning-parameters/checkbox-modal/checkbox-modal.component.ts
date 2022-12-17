import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { PlanningParametersService } from '../planning-parameters.service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'checkbox-modal',
  templateUrl: './checkbox-modal.component.html',
  providers: [PlanningParametersService]
})
export class CheckboxModalComponent implements OnInit {

  constructor(
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: NzModalRef,
    private appTranslateService: AppTranslationService,
    private queryService: PlanningParametersService,
  ) { }

  title: string;
  type: string;
  planName: string;
  plantCode: string;
  params: any;
  checkboxArr: any[] = [];

  ngOnInit() {
    this.query();
  }

  query() {
    let obj: any;
    obj = {
      planName: '',
      plantCode: ''
    }
    console.log('pppppppppp1111' + this.planName);
    obj.planName = this.planName;
    obj.plantCode = this.plantCode;
    console.log('pppppppppp2222' + this.planName);
    if (this.type === 'demand') {
      this.queryService.queryPlanPlantDemand(obj).subscribe(res => {
        res.data.forEach(item => {
          item.enableFlag = item.enableFlag === 'Y';
        });
        this.checkboxArr = res.data;
      });
    } else {
      this.queryService.queryPlanPlantSupply(obj).subscribe(res => {
        res.data.forEach(item => {
          item.enableFlag = item.enableFlag === 'Y';
        });
        this.checkboxArr = res.data;
      });
    }
  }

  save() {
    const listSave = deepCopy(this.checkboxArr);
    listSave.forEach(item => {
      item.enableFlag = item.enableFlag ? 'Y' : 'N';
    });
    //let obj: any;
    //obj.planName = this.planName;
    //obj.plantCode = this.plantCode;
    if (this.type === 'demand') {
      this.queryService.savePlanPlantDemand(listSave).subscribe(res => {
        if (res.code = 200) {
          this.msgSrv.success(this.appTranslateService.translate('保存成功!'));
          this.modal.close();
        } else {
          this.msgSrv.error(this.appTranslateService.translate(res.msg));
        }
      });
    } else {
      this.queryService.savePlanPlantSupply(listSave).subscribe(res => {
        if (res.code = 200) {
          this.msgSrv.success(this.appTranslateService.translate('保存成功!'));
          this.modal.close();
        } else {
          this.msgSrv.error(this.appTranslateService.translate(res.msg));
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
