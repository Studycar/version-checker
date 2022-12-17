import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { SopMouldCapacityService } from '../../../../modules/generated_module/services/sopmouldcapacity-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-mould-capacity-edit',
  templateUrl: './edit.component.html',
  providers: [SopMouldCapacityService]
})
export class SopMouldCapacityEditComponent implements OnInit {

  title: String = '编辑信息';
  enableflags: any[] = [];
  isLoading = false;
  // tslint:disable-next-line:no-inferrable-types
  IsDisable: boolean = false;
  isModify: boolean;
  queryParams: any[] = [];
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private commonQueryService: CommonQueryService,
    public sopMouldCapacityService: SopMouldCapacityService,
    private appConfigService: AppConfigService,
  ) {
  }

  ngOnInit(): void {
    if (!this.i.id) {
      this.title = '新增信息';
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.IsDisable = false;
      this.loadData();
    } else {
      this.loadData();
      this.IsDisable = true;
      this.iClone = Object.assign({}, this.i);
    }
  }

  loadData() {
    this.loadplant();
  }


  save() {
    this.sopMouldCapacityService.edit(this.i).subscribe(res => {
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

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  // 绑定页面的下拉框Plant
  optionListPlant = [];

  public loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra;
    });
  }

  onCurrentMonthChange(date: Date): void {
    this.i.currentMonth = date;
  }
}
