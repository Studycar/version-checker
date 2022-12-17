import { Component, OnInit } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { SalesOrderQueryService } from "../../query.service";

@Component({
  selector: 'planschedule-hw-sales-order-detail-high-price',
  templateUrl: './high-price.component.html',
  providers: [SalesOrderQueryService]
})
export class SalesOrderDetailHighPriceComponent implements OnInit {
  i: any = {};
  id: string = '';

  constructor(
    public modal: NzModalRef,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public queryService: SalesOrderQueryService,
    public http: _HttpClient,
    private ideSubmitService: IdeSubmitService
  ) {
  }

  ngOnInit() {
    this.initData()
  }

  initData() {
    if (this.id) {
      this.queryService.getDetailedOne(this.id).subscribe(res => {
        if(res.code === 200 && res.data) {
          this.i = {
            ...res.data,
            attribute2: ''
          };
        } else {
          this.msgSrv.error(res.msg || '获取详情数据失败')
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  save() {
    const params = {
      id: this.id,
      attribute2: this.i.attribute2
    };
    this.queryService.detailSaveForm(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
        this.goToIdeFlow()
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  goToIdeFlow() {
    this.ideSubmitService.navigate('ideSalesOrderHighPrice', {
      getFormParams: {
        url: this.queryService.getDetailedOneUrl,
        method: 'POST',
        params: { id: this.i.id }
      },
      flowType: 'highPrice'
    })
  }

}