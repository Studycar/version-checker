import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pcrequisition-management-cancelconfirm',
  templateUrl: './cancelconfirm.component.html',
  providers: [QueryService],
})
export class PcRequisitionManagementCancelConfireComponent implements OnInit, AfterViewInit {
  @ViewChild("f", { static: false }) f;
  record: any = {};
  today:Date= new Date();
  public i: any;  //传入参数
  public closedReason: string;  //传入参数

  title: String = '新增';
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private queryservice: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private appTranslate: AppTranslationService,
  ) { }

  ngOnInit(): void {
    this.closedReason= "";
  }

  ngAfterViewInit() {
    console.log(this.f);
  }

  abc(){
    console.log(this.f);
  }

  save() {
    if (this.i.closedReason === null || this.i.closedReason === undefined || this.i.closedReason ==="" )
    {
      this.msgSrv.error(this.appTranslate.translate("请填写原因"));
    } else
    {
    this.modal.close({Canceled:false , data: this.i.closedReason});
    }
   }

  close() {
    this.modal.destroy({Canceled:true, data:null});
  }
}

