import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { deepCopy } from '@delon/util';
import { QueryService } from '../queryService.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-supply-cap-customized-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]

})
export class ProductSellBalanceSopSupplyCapCustomizedEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  isModify = false;
  // 选项
  plantList: any[] = [];
  aslList: any[] = [];

  // 绑定物料
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
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
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public appTranslationService: AppTranslationService,
    private queryService: QueryService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.clear();
    this.loadOptionData();
    this.loadVendor();
  }

  loadOptionData() {
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantList.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  plantChange(event) {
    this.clearItem();
    this.clearVendor();
  }

  clearItem() {
    this.editDto.itemId = '';
    this.editDto.itemCode = '';
    this.editDto.itemDesc = '';
  }

  clearVendor() {
    this.editDto.vendorNumber = null;
    this.editDto.vendorName = '';
    this.editDto.percent = '';
    this.aslList.length = 0;
  }

  clear() {
    this.editDto = {
      id: null,
      plantCode: this.appConfigService.getPlantCode()
    };
    if (this.originDto && this.originDto.id) {
      this.isModify = true;
      this.editDto = deepCopy(this.originDto);
    }
  }

  save() {
    let currentMonth = '';
    if (this.editDto.currentMonth !== null && this.editDto.currentMonth !== '') {
      currentMonth = this.queryService.getYearNum(this.editDto.currentMonth) + '-' + this.queryService.getMonthNum(this.editDto.currentMonth);
    }
    this.editDto.currentMonth = currentMonth;
    this.queryService.saveSopSupplyCapCustomized(this.editDto).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  public loadItems(plantCode: string, itemCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.queryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.editDto.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  onTextChanged({ sender, event, Text }) {
    this.editDto.itemCode = Text || '';
    if (this.editDto.itemCode !== '') {
      // 加载物料
      this.queryService.getUserPlantItemPageList(this.editDto.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          const itemData = res.data.content.find(x => x.itemCode === Text);
          this.editDto.itemId = itemData.itemId;
          this.editDto.itemCode = itemData.itemCode;
          this.editDto.itemDesc = itemData.descriptionsCn;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
          this.clearItem();
        }
      });
    } else {
      this.clearItem();
    }
    this.clearVendor();
    this.loadVendor();
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.editDto.itemId = e.Row.itemId;
    this.editDto.itemCode = e.Text;
    this.editDto.itemDesc = e.Row.descriptionsCn;

    this.loadVendor();
  }

  /**加载合格供应商 */
  loadVendor() {
    this.aslList.length = 0;
    if (this.editDto.plantCode !== '' && this.editDto.itemCode !== '') {
      this.queryService.queryApprovedVendorList(this.editDto.plantCode, this.editDto.itemCode).subscribe(res => {
        res.data.content.forEach(p => {
          this.aslList.push({
            value: p.vendorNumber,
            label: p.vendorNumber + '-' + p.vendorName,
            vendorName: p.vendorName,
            percent: p.allocationPercent,
          });
        });
      });
    }
  }

  vendorChange(event) {
    const vendor = this.aslList.find(p => p.value === this.editDto.vendorNumber);
    if (vendor) {
      this.editDto.vendorName = vendor.vendorName;
      this.editDto.percent = vendor.percent;
    }
  }
  
}
