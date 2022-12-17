import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SopMaterialPurchaseMaintenanceService } from '../../../../modules/generated_module/services/sopmaterialpurchasemaintenance-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopmaterialpurchasemaintenance-batch-modify',
  templateUrl: './batch-modify.component.html',
})
export class ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent implements OnInit {
  record: any = {};
  i: any;
  yesOption: any[] = [];
  noOption: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public querydata: SopMaterialPurchaseMaintenanceService
  ) { }

  ngOnInit(): void {
    this.yesOption = this.i.yesOp;
    this.noOption = this.i.noOp;
  }

  close() {
    this.modal.destroy();
  }

  yesCon(value: any) {
    if (this.noOption !== null) {
      if (this.noOption.length > 0) {
        this.querydata.updateBatch(this.noOption, 'Y').subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success('保存成功');
            this.modal.close(true);
          } else {
            this.msgSrv.error(res.msg);
          }
        });
      }
    } else {
      this.modal.close(true);
    }
  }

  noCon(value: any) {
    if (this.yesOption !== null) {
      if (this.yesOption.length > 0) {
        this.querydata.updateBatch(this.yesOption, 'N').subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success('保存成功');
            this.modal.close(true);
          } else {
            this.msgSrv.error(res.msg);
          }
        });
      }
    } else {
      this.modal.close(true);
    }
  }
}
