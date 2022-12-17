import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { DemandOrderSplitMergeService } from '../../../../modules/generated_module/services/demand-order-split-merge';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import Timer = NodeJS.Timer;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demand-order-split-merge-edit',
  templateUrl: './edit.component.html',
})
export class DemandOrderManagementDemandOrderSplitMergeEditComponent implements OnInit {
  title: String = '新增';
  i: any;
  iClone: any;
  sourcetypeoptions = [];
  Istrue: boolean;
  randomUserUrl: string;
  pageIndex = 1;
  pageSize = 10;
  k = '';
  plantOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public modaltoService: DemandOrderSplitMergeService,
    public commonservice: AppConfigService,
    public commonQuery: CommonQueryService,
    public appTranslationService: AppTranslationService,
  ) {}

  ngOnInit(): void {
    this.commonQuery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode,
        });
      });
    });
    if (!this.i.id) {
      this.Istrue = false;
      this.i.plantCode = this.commonservice.getPlantCode();
    } else {
      this.title = '编辑';
      this.Istrue = true;
      this.i = Object.assign({}, this.i);
      this.iClone = Object.assign({}, this.i);
      this.sourcetypeoptions.push({
        label: this.i.sourceCode,
        value: this.i.sourceCode,
      });
      if (this.i.sourceType === '1') {
        this.loadItems(this.sourcetypeoptions, this.i.plantCode, this.k, this.pageIndex, this.pageSize, false);
      } else {
        this.loadCategories(this.sourcetypeoptions, this.i.plantCode, this.k, this.pageIndex, this.pageSize, false);
      }
    }
  }

  loadCategories(
    options: any[],
    plantCode: string,
    categoryCode: string,
    pageIndex: number,
    pageSize: number,
    isNew: boolean,
  ) {
    this.modaltoService.getCategories(plantCode, categoryCode, pageIndex, pageSize).subscribe(res => {
      if (isNew) {
        options.length = 0;
      }
      res.data.forEach(item => {
        options.push({
          label: item,
          value: item,
        });
      });
    });
  }

  loadItems(
    options: any[],
    plantCode: string,
    itemCode: string,
    pageIndex: number,
    pageSize: number,
    isNew: boolean
  ) {
    this.commonQuery.getUserPlantItemPageList(plantCode, itemCode, '', pageIndex, pageSize).subscribe(res => {
      if (isNew) {
        options.length = 0;
      }
      res.data.content.forEach(item => {
        options.push({
          label: item.itemCode,
          value: item.itemCode,
        });
      });
    });
  }

  typeChange(value: any) {
    this.sourcetypeoptions.length = 0;
    this.i.sourceCode = null;
    this.pageIndex = 1;
    this.k = '';
    if (value === '1') {
      this.loadItems(
        this.sourcetypeoptions,
        this.i.plantCode,
        this.k,
        this.pageIndex,
        this.pageSize,
        true
      );
    } else {
      this.loadCategories(
        this.sourcetypeoptions,
        this.i.plantCode,
        this.k,
        this.pageIndex,
        this.pageSize,
        true
      );
    }
  }

  onPlantChange(val: string) {
    if (this.i.sourceType) {
      this.typeChange(this.i.sourceType);
    }
  }

  save() {
    //将拆分基数属性删除，用合并基数的值替代拆分基数
    this.i.splitQty = this.i.mergeQty;
    console.log(this.i)
    this.modaltoService.save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  loadMore(): void {
    this.pageIndex++;
    if (this.i.sourceType === '1') {
      this.loadItems(
        this.sourcetypeoptions,
        this.i.plantCode,
        this.k,
        this.pageIndex,
        this.pageSize,
        false
      );
    } else {
      this.loadCategories(
        this.sourcetypeoptions,
        this.i.plantCode,
        this.k,
        this.pageIndex,
        this.pageSize,
        false
      );
    }
  }

  /**
   * 搜索
   */
  searchEvent: Timer;
  onSearch(value: string): void {
    this.k = value;
    this.pageIndex = 1;
    if (this.searchEvent) {
      clearTimeout(this.searchEvent);
    }
    this.searchEvent = setTimeout(() => {
      if (this.i.sourceType === '1') {
        this.loadItems(
          this.sourcetypeoptions,
          this.i.plantCode,
          this.k,
          this.pageIndex,
          this.pageSize,
          true
        );
      } else {
        this.loadCategories(
          this.sourcetypeoptions,
          this.i.plantCode,
          this.k,
          this.pageIndex,
          this.pageSize,
          true
        );
      }
    }, 500);
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
