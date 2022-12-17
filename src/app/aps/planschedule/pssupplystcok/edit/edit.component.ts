import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { PcBuyerService } from '../../../../modules/generated_module/services/pc-buyer-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsSupplyStcokService } from 'app/modules/generated_module/services/PsSupplyStcokService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-pssupplystcok-edit',
  templateUrl: './edit.component.html',
})
export class PlanschedulePsSupplyStcokEditComponent implements OnInit {
  i: any;
  plantOptions: any[] = [];
  Istrue: boolean;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private queryservice: PsSupplyStcokService,
    private appTranslationService: AppTranslationService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.Istrue = true;
      this.queryservice.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
      });
    } else {
      this.Istrue = false;
    }

    this.LoadData();
  }

  LoadData() {
    // 加载工厂
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element1 => {
        this.plantOptions.push({
          label: element1.plantCode,
          value: element1.plantCode
        });
      });
    });
  }

  save() {
    this.queryservice.save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
    /*if (this.i.id !== null) {
      this.queryservice.EditData(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    } else {
      this.queryservice.SaveForNew(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    }*/
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    if (this.i.id != null) {
      this.queryservice.GetById(this.i.Id).subscribe(res => {
        this.i = res.data;
      });
    }
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
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
  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }
  change1({ sender, event, Text }) {
    const value = this.i.itemCode || '';
    if (value !== '') {
      // 加载物料
      this.commonquery.getUserPlantItemPageList(this.i.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          this.i.itemId = res.data.content.find(x => x.itemCode === Text).itemId;
          this.i.itemCode = res.data.content.find(x => x.itemCode === Text).itemCode;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }
  // 加载物料
  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  gridView2: GridDataResult = {
    data: [],
    total: 0
  };
  columns2: any[] = [
    {
      field: 'vendorNumber',
      title: '供应商编码',
      width: '100'
    },
    {
      field: 'vendorName',
      title: '供应商名称',
      width: '100'
    }
  ];

  search2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(e.SearchValue, PageIndex, e.PageSize);
  }
  change2({ sender, event, Text }) {
    // const value = this.i.VENDOR_NUMBER || '';
    this.queryservice.getVendorPageList(Text || '', '', 1, sender.PageSize).subscribe(res => {
      this.gridView2.data = res.data.content;
      this.gridView2.total = res.data.totalElements;
      if (res.data.totalElements === 1) {
        this.i.vendorNumber = res.data.content[0].vendorName;
      } else {
        this.msgSrv.warning(this.appTranslationService.translate('供应商无效'));
        this.i.vendorNumber = '';
      }
    });
  }

  public loadVendor(VENDOR_NUMBER: string, PageIndex: number, PageSize: number) {
    this.queryservice.getVendorPageList(VENDOR_NUMBER || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView2.data = res.data.content;
      this.gridView2.total = res.data.totalElements;
    });
  }

}

