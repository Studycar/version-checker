import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ScheduleStopProductionService } from '../../schedule-stop-production.service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'schedule-stop-production-detail-edit',
  templateUrl: './edit.component.html',
  providers: [ScheduleStopProductionService]
})
export class ScheduleStopProductionDetailEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  mainRecord: any;
  // 选项
  categoryList: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: ScheduleStopProductionService
  ) { }

  ngOnInit(): void {
    this.loadOptionData();
    this.clear();
  }

  loadOptionData() {
    this.editService.GetCategoryList(this.mainRecord.plantCode, '集中排产', '').subscribe(res => {

      res.data.content.forEach(d => {
        console.log('0: '+ d.categoryCode);
          this.categoryList.push({
            value: d.categoryCode, label: d.categoryDescription
          });
      });
    });
  }

  ngTextChange(event: any) {
    this.editDto.attribute1 = this.categoryList.find(x => x.value === event).label;
  }

  clear() {
    this.editDto = {
      id: null,
      plantCode: this.mainRecord.plantCode,
      resourceCode: this.mainRecord.resourceCode,
      attributeGroup: null,
      attribute1: null // 描述
    };
    if (this.originDto.id) {
      this.editDto = deepCopy(this.originDto);
    }
  }

  save() {
    this.editService.SaveGroup(this.editDto).subscribe(res => {
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
