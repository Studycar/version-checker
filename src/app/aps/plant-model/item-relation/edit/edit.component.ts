import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../query.service';
import { MessageManageService } from '../../../../modules/generated_module/services/message-manage-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-item-relation-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class PlantModelItemRelationEditComponent implements OnInit {
  isModify = false;
  i: any;
  iClone: any;
  category = '';

  public categoryOptions: any[] = [];
  /**子项工厂 */
  public upPlantOptions: any[] = [];
  public downPlantOptions: any[] = [];
  public upValueOptions: any[] = [];
  public downValueOptions: any[] = [];
  public enableOptions: any[] = [];
  public relationOptions: any[] = [];
  /* 切换类别 */
  categoryChange(value: any) {
    this.category = value;
    this.i.downstreamValues = null;
    this.i.upstreamValues = null;
    this.downValueOptions.length = 0;
    this.upValueOptions.length = 0;
    this.downSearchCode = '';
    this.upSearchCode = '';
    this.loadDownValue(this.i.scheduleRegionCode, this.i.downstreamPlantCode);
    this.loadUpValue(this.i.scheduleRegionCode, this.i.upstreamPlantCode);
  }
  /* 切换父项工厂 */
  downPlantChange(value: any) {
    this.i.downstreamValues = null;
    this.downValueOptions.length = 0;
    this.downSearchCode = '';
    this.downPlantOptions.forEach(element => {
      if (element.value === value) {
        this.i.scheduleRegionCode = element.scheduleRegionCode;
        this.loadUpPlants(this.i.scheduleRegionCode);
        this.loadDownValue(this.i.scheduleRegionCode, value);
      }
    });
    this.i.upstreamPlantCode = null;
    this.i.upstreamValues = null;
  }
  /* 切换子项工厂 */
  upPlantChange(value: any) {
    this.i.upstreamValues = null;
    this.upValueOptions.length = 0;
    this.upSearchCode = '';
    this.upPlantOptions.forEach(element => {
      if (element.value === value) {
        this.i.scheduleRegionCode = element.scheduleRegionCode;
        this.loadUpValue(this.i.scheduleRegionCode, value);
      }
    });
  }
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private messageManageService: MessageManageService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.loadData();

    if (!this.i.id) {
      this.i.upstreamPlantCode = this.appConfigService.getPlantCode();
      this.i.downstreamPlantCode = this.appConfigService.getPlantCode();
      this.i.scheduleRegionCode = this.appConfigService.getActiveScheduleRegionCode();
      this.i.enabledFlag = 'Y';
      this.loadUpPlants(this.i.scheduleRegionCode);
    } else {
      this.category = this.i.category;
      this.setItemsDefaultOptions();
      this.loadUpPlants(this.i.scheduleRegionCode);
      this.loadDownValue(this.i.scheduleRegionCode, this.i.downstreamPlantCode);
      this.loadUpValue(this.i.scheduleRegionCode, this.i.upstreamPlantCode);
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
      /** 初始化编辑数据 */
      /*this.queryService.Get(this.i.ID).subscribe(resultMes => {
        this.i = resultMes.Extra;
        this.iClone = Object.assign({}, this.i);
      });*/
    }
  }
  /* 加载子项工厂 */
  loadUpPlants(region = '') {
    this.queryService.GetAllPlant(region).subscribe(result => {
      this.upPlantOptions.length = 0;
      result.data.forEach(d => {
        this.upPlantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode
        });
      });
    });
  }

  /* 物料/库存分类一次加载的记录数 */
  private pageSize = 10;
  /* 父项物料/库存分类页码 */
  private downPageIndex = 0;
  private downSearchCode = '';
  /* 子项物料/库存分类页码 */
  private upPageIndex = 0;
  private upSearchCode = '';
  /* 分页加载物料 */
  loadItems(options: any[], PLANT_CODE: string, ITEM_ID: string, ITEM_CODE: string, PageIndex: number, PageSize: number, IsNew: boolean = false) {
    this.queryService.getUserPlantItemPageList(PLANT_CODE, ITEM_CODE, '', PageIndex, PageSize, ITEM_ID).subscribe(result => {
      if (result !== null && result.data !== null) {
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
  /* 分页加载库存分类 */
  loadCategories(options: any[], categoryCode: string, PageIndex: number, PageSize: number, IsNew: boolean = false) {
    const categorySetCode = '库存分类';
    this.queryService.GetCategoryPageList1(categorySetCode, categoryCode, PageIndex, PageSize).subscribe(result => {
      if (result !== null && result.data !== null) {
        if (IsNew) options.length = 0;
        result.data.content.forEach(d => {
          options.push({
            label: d.categoryCode,
            value: d.categoryCode,
          });
        });
      }
    });
  }
  /* 父项物料/库存分类scroll */
  downScroll(event: any) {
    if (this.category === '1') {
      this.downPageIndex++;
      this.loadItems(this.downValueOptions, this.i.downstreamPlantCode, '', this.downSearchCode, this.downPageIndex, this.pageSize);
    } else if (this.category === '2') {
      this.downPageIndex++;
      this.loadCategories(this.downValueOptions, this.downSearchCode, this.downPageIndex, this.pageSize);
    }
  }
  /* 父项物料/库存分类search */
  downSearch(event: any) {
    if (this.category === '1') {
      this.downSearchCode = event;
      this.downPageIndex = 1;
      this.downValueOptions.length = 0;
      this.loadItems(this.downValueOptions, this.i.downstreamPlantCode, '', this.downSearchCode, this.downPageIndex, this.pageSize, true);
    } else if (this.category === '2') {
      this.downSearchCode = event;
      this.downPageIndex = 1;
      this.downValueOptions.length = 0;
      this.loadCategories(this.downValueOptions, this.downSearchCode, this.downPageIndex, this.pageSize, true);
    }
  }
  /* 子项物料/库存分类scroll */
  upScroll(event: any) {
    if (this.category === '1') {
      this.upPageIndex++;
      this.loadItems(this.upValueOptions, this.i.upstreamPlantCode, '', this.upSearchCode, this.upPageIndex, this.pageSize);
    } else if (this.category === '2') {
      this.upPageIndex++;
      this.loadCategories(this.upValueOptions, this.upSearchCode, this.upPageIndex, this.pageSize);
    }
  }
  /* 子项物料/库存分类search */
  upSearch(event: any) {
    if (this.category === '1') {
      this.upSearchCode = event;
      this.upPageIndex = 1;
      this.downValueOptions.length = 0;
      this.loadItems(this.upValueOptions, this.i.upstreamPlantCode, '', this.upSearchCode, this.upPageIndex, this.pageSize, true);
    } else if (this.category === '2') {
      this.upSearchCode = event;
      this.upPageIndex = 1;
      this.downValueOptions.length = 0;
      this.loadCategories(this.upValueOptions, this.upSearchCode, this.upPageIndex, this.pageSize, true);
    }
  }
  /**类别/计划组/物料（父项） */
  loadDownValue(region: string, plantCode: string) {
    switch (this.category) {
      /* 物料 */
      case '1':
        this.downPageIndex = 1;
        this.loadItems(this.downValueOptions, plantCode, '', '', this.downPageIndex, this.pageSize);
        break;
      /* 库存分类 */
      case '2':
        this.downPageIndex = 1;
        this.loadCategories(this.downValueOptions, '', this.downPageIndex, this.pageSize);
        break;
      /* 计划组 */
      case '3':
        this.queryService.GetUserPlantGroup(this.i.downstreamPlantCode, region).subscribe(result => {
          result.Extra.forEach(d => {
            this.downValueOptions.push({
              label: d.scheduleGroupCode,
              value: d.scheduleGroupCode,
            });
          });
        });
        break;
    }
  }
  /**类别/计划组/物料（子项） */
  loadUpValue(region: string, plantCode: string) {
    switch (this.category) {
      /* 物料 */
      case '1':
        this.upPageIndex = 1;
        this.loadItems(this.upValueOptions, plantCode, '', '', this.upPageIndex, this.pageSize);
        break;
      /* 库存分类 */
      case '2':
        this.upPageIndex = 1;
        this.loadCategories(this.upValueOptions, '', this.upPageIndex, this.pageSize);
        break;
      /* 计划组 */
      case '3':
        this.queryService.GetUserPlantGroup(this.i.upstreamPlantCode, region).subscribe(result => {
          result.Extra.forEach(d => {
            this.upValueOptions.push({
              label: d.scheduleGroupCode,
              value: d.scheduleGroupCode,
            });
          });
        });
        break;
    }
  }
  /* 页面加载初始化数据 */
  loadData() {
    /* 加载类别集 */
    this.queryService.GetLookupByTypeNew('PS_DIMENSION').subscribe(result => {
      result.data.forEach(d => {
        this.categoryOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    /* 加载父项工厂 */
    this.queryService.GetAllPlant().subscribe(result => {
      result.data.forEach(d => {
        this.downPlantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode
        });
      });
    });
    /* 加载是否有效 */
    this.queryService.GetLookupByTypeNew('FND_YES_NO').subscribe(result => {
      result.data.forEach(d => {
        this.enableOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    // 相关性 PS_OPERATION_RELATION_TYPE
    this.queryService.GetLookupByTypeNew('PS_OP_RELATION_TYPE').subscribe(res => {
      res.data.forEach(item => {
        this.relationOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
  }
  /* 设置物料默认选项 */
  private setItemsDefaultOptions() {
    // 物料初始化默认值
    if (this.category === '1' || this.category === '2') {
      this.downValueOptions.length = 0;
      this.upValueOptions.length = 0;
      this.downValueOptions.push({
        label: this.i.downstreamValuesCode,
        value: this.i.downstreamValues,
      });
      this.upValueOptions.push({
        label: this.i.upstreamValuesCode,
        value: this.i.upstreamValues,
      });
    }
  }
  save() {
    this.queryService.Save(this.i).subscribe(res => {
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

  clear() {
    this.i = Object.assign({}, this.iClone);
    this.setItemsDefaultOptions();
    this.downSearchCode = '';
    this.upSearchCode = '';
    this.category = this.i.category;
    this.loadUpPlants(this.i.scheduleRegionCode);
    this.loadDownValue(this.i.SCHEDULE_REGION_CODE, this.i.DOWNSTREAM_PLANT_CODE);
    this.loadUpValue(this.i.SCHEDULE_REGION_CODE, this.i.UPSTREAM_PLANT_CODE);
  }
}
