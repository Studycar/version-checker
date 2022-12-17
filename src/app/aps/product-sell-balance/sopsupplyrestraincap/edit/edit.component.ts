import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { SopSupplyRestrainCapService } from 'app/modules/generated_module/services/SopSupplyRestrainCapService';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-supply-restrain-cap-edit',
  templateUrl: './edit.component.html',
})
export class SopSupplyRestrainCapEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  title: String = '新增';
  readOnly: Boolean = false;
  plantoptions: any[] = [];
  vendorOptions: any[] = [];

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

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private dataService: SopSupplyRestrainCapService,
    private msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private appTranslationService: AppTranslationService
  ) {}

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.title = '编辑';
      this.dataService.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
        this.iClone = Object.assign({}, this.i);
      });
      this.readOnly = true;
    } else {
      this.readOnly = false;
      this.i.plantCode = this.appconfig.getPlantCode();
      this.i.enableFalg = 'Y';
    }

    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    this.dataService.getVendors().subscribe(res => {
      res.data.forEach(element => {
        this.vendorOptions.push({
          label: element.vendorNumber,
          value: element.vendorNumber,
          d: element.vendorName
        });
      });
    });
  }
  
  save() {
    this.dataService.save(this.i).subscribe(res => {
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
  /**重置 */
  clear() {
    this.i = this.iClone;
    this.iClone = Object.assign({}, this.i);
  }

  search2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(e.SearchValue, PageIndex, e.PageSize);
  }
  change2({ sender, event, Text }) {
    // const value = this.i.VENDOR_NUMBER || '';
    this.dataService.getVendorPageList(Text || '', '', 1, sender.PageSize).subscribe(res => {
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
    this.dataService.getVendorPageList(VENDOR_NUMBER || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView2.data = res.data.content;
      this.gridView2.total = res.data.totalElements;
    });
  }

  vendorChange(value: any) {
    const vendorNumber = typeof value === 'string' ? value : value.Text;
    if (typeof value !== 'string') {
      this.i.vendorName = '';
    }
    this.i.vendorName = value.Row.vendorName;
  }
}
