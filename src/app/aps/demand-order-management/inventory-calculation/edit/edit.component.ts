import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { InventoryCalculationService } from '../inventory-calculation.service';

@Component({
  selector: 'app-inventory-calculation-edit',
  templateUrl: './edit.component.html',
  providers: [InventoryCalculationService],
})
export class InventoryCalculationEditComponent implements OnInit {

  constructor(
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: NzModalRef,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appTranslateService: AppTranslationService,
    private queryService: InventoryCalculationService,
  ) { }

  title = '新增信息';
  i: any;
  selectIndex: number;
  iClone: any;
  scheduleRegionOptions: Array<{label: string, value: any}> = [];
  inventoryModeOptions: Array<{label: string, value: any}> = [];
  summaryPeriodOptions: Array<{label: string, value: any}> = [];
  plantOptions: Array<{label: string, value: any}> = [];
  sourceTypeOptions: Array<{label: string, value: any}> = [];
  gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  materialColumnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    }
  ];
  categoryColumnsItems: any[] = [
    { field: 'CATEGORY_CODE', title: '类别', width: '100' },
    { field: 'DESCRIPTIONS', title: '描述', width: '100' }
  ];
  defineRequired = false;

  ngOnInit() {
    if (this.selectIndex === 0) {
      this.getScheduleRegionOptions();
      this.getInventoryModeOptions();
      this.getSummaryPeriodOptions();
    } else if (this.selectIndex === 1) {
      this.getPlantOptions('');
      this.getSourceType();
    }
    if (!this.i.Id) {
      // 新增
    } else {
      // 编辑
      this.title = '编辑信息';
      if (this.selectIndex === 0) {
        this.queryService.getSummaryPeriodItemInfo(this.i.Id).subscribe(res => {
          this.i = res.Extra[0];
          this.iClone = Object.assign({}, this.i);
          this.defineRequired = this.i.TIME_FENCE === 'CUSTOMIZE';
          this.getPlantOptions(this.i.SCHEDULE_REGION_CODE);
        });
      } else {
        this.queryService.getPlanParameterItemInfo(this.i.Id).subscribe(res => {
          this.i = res.Extra[0];
          this.iClone = Object.assign({}, this.i);
        });
      }
    }
  }

  getInventoryModeOptions() {
    this.commonQueryService.GetLookupByType('INV_PLAN_MODEL').subscribe(res => {
      res.Extra.forEach(item => {
        this.inventoryModeOptions.push({
          label: item.MEANING,
          value: item.LOOKUP_CODE,
        });
      });
    });
  }

  getSummaryPeriodOptions() {
    this.commonQueryService.GetLookupByType('INV_SUMMARY_PERIOD').subscribe(res => {
      res.Extra.forEach(item => {
        this.summaryPeriodOptions.push({
          label: item.MEANING,
          value: item.LOOKUP_CODE
        });
      });
    });
  }

  getSourceType() {
    this.queryService.getCategorySet('').subscribe(res => {
      res.Extra.forEach(item => {
        this.sourceTypeOptions.push({
          label: item.CATEGORY_SET_CODE,
          value: item.CATEGORY_SET_CODE
        });
      });
      this.sourceTypeOptions.unshift({
        label: '物料',
        value: '物料'
      });
    });
  }

  getScheduleRegionOptions() {
    this.commonQueryService.GetScheduleRegions().subscribe(res => {
      res.extra.forEach(item => {
        this.scheduleRegionOptions.push({
          label: item.SCHEDULE_REGION_CODE,
          value: item.SCHEDULE_REGION_CODE
        });
      });
    });
  }

  getPlantOptions(division: string) {
    this.commonQueryService.GetUserPlant(division).subscribe(res => {
      this.plantOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.PLANT_CODE,
          value: item.PLANT_CODE
        });
      });
    });
  }

  onDivisionChange(val: string) {
    this.i.PLANT_CODE = null;
    this.getPlantOptions(val);
  }

  onTimeFenceChange(value: string) {
    if (value === 'CUSTOMIZE') {
      this.defineRequired = true;
    } else {
      this.defineRequired = false;
    }
  }

  clearSourceCode(value: any, type: string) {
    if (type === 'plantCode' && this.i.SOURCE_TYPE !== '物料') return;
    this.i.SOURCE_ID = '';
    this.i.SOURCE_CODE = '';
    this.i.SOURCE_DESC = '';
  }

  onMaterialRowSelect({sender, Row, Value, Text}) {
    this.i.SOURCE_DESC = Row.DESCRIPTIONS_CN;
  }

  onCategoryRowSelect({sender, Row, Value, Text}) {
    this.i.SOURCE_DESC = Row.DESCRIPTIONS;
  }

  searchMaterialItems(e: any) {
    if (!this.i.PLANT_CODE) {
      this.msgSrv.warning(this.appTranslateService.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadMaterialItems(this.i.PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
  }

  loadMaterialItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.GetUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.Result;
      this.gridViewItems.total = res.TotalCount;
    });
  }

  searchCategoryItems(e: any) {
    const pageIndex = e.Skip / e.PageSize + 1;
    this.loadCategoryItems(this.i.SOURCE_TYPE, e.SearchValue, pageIndex, e.PageSize);
  }

  loadCategoryItems(categorySetCode: string, categoryCode: string, pageIndex: number, pageSize: number) {
    this.queryService.getCategoryData(categorySetCode || '', categoryCode || '', pageIndex, pageSize).subscribe(res => {
      this.gridViewItems.data = res.Result;
      this.gridViewItems.total = res.TotalCount;
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  save() {
    if (this.selectIndex === 0) {
      this.queryService.editSummaryPeriodItem(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success(this.appTranslateService.translate('保存成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslateService.translate(res.Message));
        }
      });
    } else {
      this.queryService.editPlanParameterItem(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success(this.appTranslateService.translate('保存成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslateService.translate(res.Message));
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
