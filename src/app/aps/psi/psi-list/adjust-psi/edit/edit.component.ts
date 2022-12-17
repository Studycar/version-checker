// 修改生产均价
import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'adjust-psi-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class AdjustPsiEditComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {

  }

  isModify = false;
  i: any;
  iClone: any;
  marketCategory: any[] = [];
  saleChannelOptions: any[] = [
    { value: '1', label: '线上' },
    { value: '2', label: '线下' },
  ];

  gridData: any[] = [];

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    }
  }

  marketCategoryChange(event) {
    const { marketCategory, channel } = this.i;
    if (marketCategory && channel) {
      this.gridData.forEach(item => {
        if (item.marketCategory === marketCategory && item.channel === channel) {
          this.i.sum = item.prodAvgPrice;
        }
      })
    } else {
      this.i.sum = null;
    }
  }

  channelChange(event) {
    const { marketCategory, channel } = this.i;
    if (marketCategory && channel) {
      this.gridData.forEach(item => {
        if (item.marketCategory === marketCategory && item.channel === channel) {
          this.i.sum = item.prodAvgPrice;
        }
      })
    } else {
      this.i.sum = null;
    }
  }

  // 保存
  save(value: any) {
    console.log('save', this.i);
  }

  // 关闭
  close() {
    this.modal.destroy();
  }
  // 重置
  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
