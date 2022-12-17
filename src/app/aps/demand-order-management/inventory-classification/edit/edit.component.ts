import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { InventoryClassificationService } from '../inventory-classification.service';
import Timer = NodeJS.Timer;

@Component({
  selector: 'app-inventory-classification-edit',
  templateUrl: './edit.component.html',
  providers: [InventoryClassificationService]
})
export class InventoryClassificationEditComponent implements OnInit {

  constructor(
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private modalRef: NzModalRef,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appTranslateService: AppTranslationService,
    private queryService: InventoryClassificationService,
  ) { }

  title = '新增信息';
  i: any;
  iClone: any;
  plantOptions: Array<{ label: string, value: any }> = [];
  inventoryModeOptions: Array<{ label: string, value: any }> = [];
  categoryOptions: Array<{ label: string, value: any }> = [];
  whetherOptions: Array<{ label: string, value: any }> = [];
  pageIndex = 1;
  pageSize = 10;
  isLoading = false;
  categorySetCode = '库存分类';
  categorySearchKey = '';
  timeoutRecord: Timer;
  enterTimeInterval = 500; // 库存分类框输入发起请求的时间间隔，毫秒

  ngOnInit() {
    this.getPlantOptions();
    this.getInventoryModeOptions();
    this.getWhetherOptions();
    if (!this.i.id) {
      // 新增
      this.getCategoryOptions();
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.i.enableFlag = 'Y';
    } else {
      // 编辑
      this.title = '编辑信息';
      this.queryService.queryDataItemInfo(this.i.id).subscribe(res => {
        this.i = res.data[0];
        this.iClone = Object.assign({}, this.i);
        this.commonQueryService.GetCategoryPageList1(this.categorySetCode, this.categorySearchKey, this.pageIndex, this.pageSize).subscribe(result => {
          result.data.content.forEach(d => {
            this.categoryOptions.push({
              label: d.categoryCode,
              value: d.categoryCode,
            });
          });
          if (!this.categoryOptions.find(item => item.value === this.i.categoryCode)) {
            this.categoryOptions.unshift({
              label: this.i.categoryCode,
              value: this.i.categoryCode,
            });
          }
        });
      });
    }
  }

  getPlantOptions() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  getInventoryModeOptions() {
    this.commonQueryService.GetLookupByType('INV_PLAN_MODEL').subscribe(res => {
      res.Extra.forEach(item => {
        this.inventoryModeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  getWhetherOptions() {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(res => {
      res.Extra.forEach(item => {
        this.whetherOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  getCategoryOptions(categoryCode: string = '') {
    this.isLoading = true;
    this.commonQueryService.GetCategoryPageList1(
      this.categorySetCode,
      categoryCode,
      this.pageIndex,
      this.pageSize
    ).subscribe(res => {
      this.isLoading = false;
      if (this.pageIndex === 1) {
        this.categoryOptions.length = 0;
      }
      res.data.content.forEach(item => {
        this.categoryOptions.push({
          label: item.categoryCode,
          value: item.categoryCode
        });
      });
    });
  }

  onCategoryScroll() {
    this.pageIndex++;
    this.getCategoryOptions(this.categorySearchKey);
  }

  onCategorySearch(val: string) {
    if (!this.timeoutRecord) {
      this.timeoutRecord = setTimeout(() => {
        this.pageIndex = 1;
        this.categorySearchKey = val;
        this.getCategoryOptions(this.categorySearchKey);
      }, this.enterTimeInterval);
    } else {
      clearTimeout(this.timeoutRecord);
      this.timeoutRecord = setTimeout(() => {
        this.pageIndex = 1;
        this.categorySearchKey = val;
        this.getCategoryOptions(this.categorySearchKey);
      }, this.enterTimeInterval);
    }
  }

  save() {
    this.queryService.saveDataItem(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslateService.translate('保存成功！'));
        this.modalRef.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg));
      }
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modalRef.destroy();
  }
}
