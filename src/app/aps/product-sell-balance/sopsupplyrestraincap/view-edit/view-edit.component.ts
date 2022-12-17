import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { SopSupplyRestrainCapService } from 'app/modules/generated_module/services/SopSupplyRestrainCapService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-supply-restrain-cap-view-edit',
  templateUrl: './view-edit.component.html',
})
export class SopSupplyRestrainCapViewEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  title: String = '新增';

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };

  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private queryService: SopSupplyRestrainCapService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService
  ) { }

  ngOnInit(): void {

  }

  public loadItems(
    plantCode: string,
    vendorNumber: string,
    searchValue: string,
    PageIndex: number,
    PageSize: number,
    ViewNo: number = 1,
  ) {
    // 加载物料
    this.queryService
      .getPlantVendorItemPageList(
        plantCode,
        vendorNumber,
        searchValue || '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
      });
  }

  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, this.i.vendorNumber, e.SearchValue, PageIndex, e.PageSize);
  }
  change1(event: any) {
    const value = this.i.itemId || '';
    if (value === '') {
      // 加载物料commonquery.getUserPlantItemPageList  dataservice.GetUserPlantItemPageList
      this.queryService.getPlantVendorItemPageList(this.i.plantCode, this.i.vendorNumber, event.Text || '', event.sender.pageSize).subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          this.i.itemId = res.data.content.find(x => x.itemCode === event.Text).itemId;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }

  /**保存 */
  save() {
    this.queryService.addView(this.i).subscribe(res => {
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
}
