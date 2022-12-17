import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { deepCopy } from '@delon/util';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { SalesPolicyService } from '../sales-policy.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sales-policy-edit',
  templateUrl: './edit.component.html',
  providers: [SalesPolicyService]

})
export class DemandOrderManagementSalesPolicyEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  isModify = false;
  // 选项
  regionList: any[] = [];
  salesRegionList: any[] = [];
  salesAreaList: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private commonQueryService: CommonQueryService,
    public appTranslationService: AppTranslationService,
    private editService: SalesPolicyService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.clear();
    this.loadOptionData();
  }

  loadOptionData() {
    // 事业部
    this.editService.GetAllScheduleRegion().subscribe(result => {
      this.regionList.length = 0;
      result.data.forEach(d => {
        this.regionList.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });
    // 销售公司
    this.loadSalesRegion();
    // 区域
    this.loadSalesArea();
  }
  // 销售公司
  loadSalesRegion() {
    this.editService.GetDivisions({
      scheduleRegionCode: this.editDto.scheduleRegionCode,
      custDivisionType: 'REGION',
      pareatDivisionId: '',
      enableFlag: 'Y',
      IsExport: true,
      pageIndex: 1,
      pageSize: 20,
    }).subscribe(result => {
      this.salesRegionList.length = 0;
      result.data.content.forEach(d => {
        this.salesRegionList.push({
          label: d.custDivisionName,
          value: d.custDivisionName,
        });
      });
    });
  }
  // 区域
  loadSalesArea() {
    this.editService.GetDivisions({
      scheduleRegionCode: this.editDto.scheduleRegionCode,
      //custDivisionType: 'DC',
      //pareatDivisionId: this.editDto.salesRegion,
      enableFlag: 'Y',
      IsExport: true,
      pageIndex: 1,
      pageSize: 20,
    }).subscribe(result => {
      this.salesAreaList.length = 0;
      result.data.content.forEach(d => {
        this.salesAreaList.push({
          label: d.custDivisionName,
          value: d.custDivisionName,
        });
      });
    });
  }
  regionChange() {
    this.loadSalesRegion();
    this.loadSalesArea();
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
    },
    // {
    //   field: 'PLANT_CODE',
    //   title: '工厂',
    //   width: '100'
    // }
  ];
  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems('', e.SearchValue, PageIndex, e.PageSize);
  }
  change1({ sender, event, Text }) {
    const value = this.editDto.ITEM_CODE || '';
    if (value === '') {
      // 加载物料
      this.editService.GetItems({
        scheduleRegionCode: this.editDto.scheduleRegionCode,
        PLANT_CODE: '',
        ITEM_CODE: Text,
        ENABLE_FLAG: 'Y',
        IsExport: false,
        QueryParams: { PageIndex: 1, PageSize: sender.PageSize }
      }).subscribe(res => {
        this.gridView1.data = res.Result;
        this.gridView1.total = res.TotalCount;
        if (res.TotalCount === 1) {
          this.editDto.ITEM_ID = res.Result.find(x => x.ITEM_CODE === Text).ITEM_ID;
        } else if (res.TotalCount > 1) {
          this.msgSrv.warning(this.appTranslationService.translate('多个相同物料，请选择指定！'));
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效！'));
        }
      });
    }
  }

  // 加载物料
  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // // 加载物料
    // this.editService.GetItems({
    //   scheduleRegionCode: this.editDto.scheduleRegionCode,
    //   PLANT_CODE: PLANT_CODE,
    //   ITEM_CODE: ITEM_CODE,
    //   ENABLE_FLAG: 'Y',
    //   IsExport: false,
    //   QueryParams: { PageIndex: PageIndex, PageSize: PageSize }
    // }).subscribe(res => {
    //   const datas = [];
    //   res.Result.forEach(item => {
    //     if (datas.findIndex(t => t.ITEM_CODE === item.ITEM_CODE) === -1) {
    //       datas.push(item);
    //     }
    //   });
    //   this.gridView1.data = datas;
    //   this.gridView1.total = res.TotalCount;
    // });
    this.commonQueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  clear() {
    this.editDto = {
      id: null,
      scheduleRegionCode: this.originDto.scheduleRegionCode
    };
    if (this.originDto.id !== null && this.originDto.id !== undefined) {
      this.isModify = true;
      this.editDto = deepCopy(this.originDto);
    }
  }

  save() {
    this.editService.Save(this.editDto).subscribe(res => {
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
}
