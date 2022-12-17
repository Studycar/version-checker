import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PriceQueryService } from '../queryService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopproductprice-edit',
  templateUrl: './edit.component.html',
  providers: [PriceQueryService]
})
export class ProductSellBalanceSopProductPriceEditComponent implements OnInit {
  i: any;
  regionOptions: any[] = [];
  plantOptions: any[] = [];
  itemOptions = [];
  readOnly: Boolean = false;
  title: String = '新增';

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private queryService: PriceQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
    } else {
      this.i.buCode = this.appconfig.getActiveScheduleRegionCode();
      this.i.plantCode = this.appconfig.getPlantCode();
    }
    this.LoadData();
  }

  LoadData() {
    this.queryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(element => {
        this.regionOptions.push({
          label: element.scheduleRegionCode,
          value: element.scheduleRegionCode
        });
      });
    });
    this.LoadPlant(this.i.buCode);
    this.plantChange(this.i.plantCode);
  }
  LoadPlant(value: any) {
    this.queryService.GetUserPlant(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  save() {
    console.log("看看i");
    console.log(this.i);
    this.queryService.Save(this.i).subscribe(res => {
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

  plantChange(value: any) {
    this.onSearch('');
  }
  // 物料编码查询
  searchCode = '';
  pageIndex = 1;
  pageSize = 20;
  /* 物料search */
  onSearch(event: any) {
    this.searchCode = event;
    this.pageIndex = 1;
    this.itemOptions.length = 0;
    this.loadItems(this.itemOptions, this.i.plantCode, '', this.searchCode, this.pageIndex, this.pageSize, true);
  }
  /* 物料scroll */
  onScroll(event: any) {
    this.pageIndex++;
    this.loadItems(this.itemOptions, this.i.plantCode, '', this.searchCode, this.pageIndex, this.pageSize);
  }
  /* 分页加载物料 */
  loadItems(options: any[], plantCode: string, itemId: string, itemCode: string, PageIndex: number, PageSize: number, IsNew: boolean = false) {
    this.queryService.getUserPlantItemPageList(plantCode, itemCode, '', PageIndex, PageSize, itemId).subscribe(result => {
      if (result !== null && result.data.content !== null) {
        if (IsNew) options.length = 0;
        result.data.content.forEach(d => {
          options.push({
            label: d.itemCode,
            value: d.itemId,
          });
        });
      }
    });
  }
}
