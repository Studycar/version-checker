import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { LoadShiftsService } from '../load-shifts.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'load-shifts-edit',
  templateUrl: './edit.component.html',
  providers: [LoadShiftsService]

})
export class LoadShiftsEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  // 工厂
  public plantCodes: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public loadShiftsService: LoadShiftsService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }


  ngOnInit(): void {
    this.clear();
    this.initPlantCodes();
  }

  startTime: Date | null = null;
  clear() {
    this.editDto = {
      id: null,
      plantCode: this.appConfigService.getPlantCode(),
      internal: 0,
      startTime: this.startTime,
    };
    if (this.originDto.id) {
      this.editDto = {
        id: this.originDto.id,
        plantCode: this.originDto.plantCode,
        internal: this.originDto.internal,
        startTime: new Date(this.originDto.startTime),
      };
    }
  }

  /** 初始化 组织  下拉框*/
  initPlantCodes() {
    this.loadShiftsService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodes.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  save() {
    this.loadShiftsService.Save(this.editDto).subscribe(res => {
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
