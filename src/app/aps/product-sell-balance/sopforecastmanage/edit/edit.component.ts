/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:09:02
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-15 15:09:02
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SopForeastManageService } from 'app/modules/generated_module/services/sopforecastmanage-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopforecastmanage-edit',
  templateUrl: './edit.component.html',
})
export class ProductSellBalanceSopforecastmanageEditComponent implements OnInit {
  i: any;
  title: any;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopForeastManageService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.Id !== null) {
      this.title = '编辑';
      /*this.dataservice.GetById(this.i.Id).subscribe(res => {
        this.i = res.Extra;
      });*/
    }

    this.LoadData();

  }

  LoadData() {

  }

  save() {
    this.dataservice.EditData(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('修改成功');
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
