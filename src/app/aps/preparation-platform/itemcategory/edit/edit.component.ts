import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ItemCategoryService } from '../../../../modules/generated_module/services/item-category-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-itemcategory-edit',
  templateUrl: './edit.component.html',
})
export class PreparationPlatformItemcategoryEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  title: String = '新增';
  readOnly: Boolean = false;
  fdsourceoptions: any[] = [];
  calendaroptions: any[] = [];
  plantoptions: any[] = [];
  regionoptions: any[] = [];
  collectOptions: any[] = [];
  /**YES/NO */
  enableOptions: any[] = [];
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private dataService: ItemCategoryService,
    private appconfig: AppConfigService,
    private appTranslationService: AppTranslationService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.LoadData();
    if (this.i.id !== null) {
      this.title = '编辑';
      this.readOnly = true;
      this.plantChange(this.i.plantCode);
      this.dataService.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
       this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.enableFlag = 'Y';
      this.i.plantCode = this.appconfig.getPlantCode();
      this.plantChange(this.i.plantCode);
    }

  }

  LoadData() {
    this.commonquery.GetLookupByTypeLang('PC_DEMAND_COLLECT', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.collectOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByType('FND_YES_NO').subscribe(result => {
      result.Extra.forEach(element => {
        this.enableOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByType('PC_SOURCE_TYPE').subscribe(result => {
      result.Extra.forEach(element => {
        this.fdsourceoptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  save() {
      this.dataService.EditData(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
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
    this.i.id = this.i.id || '';
    if (this.i.Id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
  codeChange(value: any) {
    // this.dataService.GetName(this.i.categoryCode).subscribe(res => {
    //   this.i.categoryName = res.Extra.categoryName;
    // });
    this.i.categoryName = this.gridView1.data.find(x => x.categoryCode === value.Text).categoryDesc;

  }

  plantChange(value: any) {
    this.i.deliveryRegionCode = null;
    while (this.regionoptions.length !== 0) {
      this.regionoptions.pop();
    }
    this.i.deliveryCalendarCode = null;
    this.calendaroptions.length = 0;
    this.dataService.GetRegion(value).subscribe(res => {
      res.data.forEach(element => {
        this.regionoptions.push({
          label: element.deliveryRegionCode,
          value: element.deliveryRegionCode
        });
      });
      this.i.deliveryRegionCode = this.regionoptions[0].value;
    });


    this.commonquery.GetLookupByTypeLang('PC_DLY_CALENDAR_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.calendaroptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });


  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'categoryCode',
      title: '类别编码',
      width: '100'
    },
    {
      field: 'categoryCode',
      title: '类别名称',
      width: '100'
    }
  ];
  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(e.SearchValue, PageIndex, e.PageSize);
  }
  change1({ sender, event, Text }) {
    const value = this.i.categoryCode || '';
    if (value === '') {

      // 加载物料
      this.commonquery.GetCategoryPageList1(this.i.selectCategorySetCode,Text || '', 1, sender.PageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          this.i.categoryCode = res.data.find(x => x.categoryCode === Text).categoryCode;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('类别无效'));
        }
      });


    }

    this.dataService.GetName(Text).subscribe(res1 => {
      this.i.categoryName = res1.Extra.categoryName;
    });
  }
  // 加载物料
  public loadItems(categoryCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.GetCategoryPageList1(this.i.selectCategorySetCode,categoryCode || '',  PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }
}
