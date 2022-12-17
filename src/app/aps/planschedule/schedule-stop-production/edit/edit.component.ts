import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { ScheduleStopProductionService } from '../schedule-stop-production.service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'schedule-stop-production-edit',
  templateUrl: './edit.component.html',
  providers: [ScheduleStopProductionService]

})
export class ScheduleStopProductionEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  // 选项
  plantCodeList: any[] = [];
  resourceList: any[] = [];
  yesOrNoList: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private editService: ScheduleStopProductionService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.clear();
    this.loadOptionData();
  }

  loadOptionData() {
   
    //初始化编辑信息     
    this.editDto = deepCopy(this.originDto); //Object.assign({}, this.originDto);

    this.editService.GetUserPlantNew().subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({ value: d.plantCode, label: d.plantCode });
      });
    });
    this.loadLine();

    this.editService.GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        //console.log('FND_YES_NO:' + element);
        this.yesOrNoList.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }
  loadLine() {
    this.resourceList.length = 0;
    this.editService.GetUserPlantGroupLine(this.editDto.plantCode, '').subscribe(result => {
      result.Extra.forEach(d => {
        this.resourceList.push({ value: d.resourceCode, label: d.resourceCode });
      });
    });
  }
  plantChange(event) {
    this.loadLine();
  }
  clear() {
    this.editDto = {
      Id: null,
      plantCode: this.appConfigService.getPlantCode(),
      resourceCode: null,
      maxDuration: null,
      dealTime: null,
      dealMethod: null,
      dealCost: null,
      enableFlag: 'Y'
    };

    if (this.originDto.id) {
      this.editDto = deepCopy(this.originDto);
    }
  }

  save() {
    this.editService.Save(this.editDto).subscribe(res => {
    if (res.code === 200) {
      this.msgSrv.success('保存成功');
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
