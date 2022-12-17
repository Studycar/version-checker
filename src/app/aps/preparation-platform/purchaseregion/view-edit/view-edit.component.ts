import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { PurchaseRegionService } from '../../../../modules/generated_module/services/purchase-region-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-purchaseregion-view-edit',
  templateUrl: './view-edit.component.html',
})
export class PreparationPlatformPurchaseregionViewEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  title: String = '新增';
  warehouseoptions: any[] = [];
  /**是否 */
  yesnoOptions: any[] = [];

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'subinventoryCode',
      title: '子库编码',
      width: '100'
    },
    {
      field: 'subinventoryDescription',
      title: '子库描述',
      width: '100'
    }
  ];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private queryService: PurchaseRegionService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.commonQueryService.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      this.yesnoOptions.length = 0;
      res.data.forEach(element => {
        this.yesnoOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    if (this.i.id !== null) {
      this.title = '编辑';
      this.queryService.GetSubById(this.i.id).subscribe(res => {
        this.i = res.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.defaultWarehouseFlag = 'Y';
    }
    /**加载子库数据 */
    // this.loadWareHouse('', 1, 10);
  }

  /**保存 */
  save() {
    this.queryService.saveSubData(this.i).subscribe(res => {
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
  /**重置 */
  clear() {
    this.i = this.iClone;
    this.iClone = Object.assign({}, this.i);
  }

  /**Lov弹出搜索 */
  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadWareHouse(e.SearchValue, PageIndex, e.PageSize);
  }
  /**子库值改变 */
  change1({ sender, event, Text }) {
    this.queryService.GetWareHouse(this.i.plantCode, Text || '', 1, sender.PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
      if (res.data.totalElements === 1) {
        this.i.warehouseCode = res.data.content[0].subinventoryCode;
      } else {
        this.msgSrv.warning(this.appTranslationService.translate('子库无效'));
        this.i.warehouseCode = '';
      }
    });
  }
  /**加载子库数据 */
  public loadWareHouse(WAREHOUSE_CODE: string, PageIndex: number, PageSize: number) {
    this.queryService.GetWareHouse(this.i.plantCode, WAREHOUSE_CODE || '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }
}
