import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class MaterialmanagementItemCategoryAssignEditComponent implements OnInit {
  i: any;
  iClone: any;
  isModify = false;
  plantOptions: any[] = [];
  itemOptions: any[] = [];
  categorySetOptions: any[] = [];
  categoryOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    public commonQueryService: QueryService,
    private appConfigService: AppConfigService,
  ) { }

  ngOnInit(): void {
    // 加载工厂
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(d => {
        this.plantOptions.push(
          {
            label: d.plantCode,
            value: d.plantCode,
          }
        );
      });
    });
    // 加载物料
    // this.loadItems();  
     /* 加载类别集*/
     this.commonQueryService.GetCategorySet('').subscribe(result => {
      result.data.forEach(d => {
        this.categorySetOptions.push({
          label: d.categorySetCode,
          value: d.categorySetCode
        });
      });
    });

    if (this.i.id !== null && this.i.id !== undefined) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
      /**
       *  edit by zonghp
       *  类别获取不符合统一初始化，需将获取类别数组的代码移到各自新增编辑情况中
       *  编辑是需要先获取到类别集再获取类别
       *  因类别有分页，初始化是只是获取到第一页的数据，第一页的数据可能不包含该条编辑数据的类别
       *  所以需要判断当获取的类别数据中没有该条数据类别时，继续加载下一页的数据
       */
      this.commonQueryService.Get(this.i.id).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
        // this.i = resultMes.Extra;
        this.commonQueryService.GetCategoryPageList1(this.i.categorySetCode, this.categorySearchCode, this.pageIndex, this.pageSize).subscribe(res => {
          if (res && res.data) {
            res.data.content.forEach(d => {
              this.categoryOptions.push({
                label: d.categoryCode,
                value: d.categoryCode,
              });
            });
          }
          // 递归很耗时间和资源，所以如果第一页没有目标值，直接将目标值放进数组第一位，但是后面如果加载到目标值所在页，数组中会有两条重复数据
          if (this.categoryOptions.find(item => item.value === this.i.categoryCode) === undefined) {
            this.categoryOptions.unshift({
              label: this.i.categoryCode,
              value: this.i.categoryCode
            });
          }
        });
        // 如果采用递归加载，目标类别所在页码很大，将会很耗时间和资源
        // this.setScrollDefaultOptions();
      });
    } else {
      this.loadCategories(this.categoryOptions, this.i.categorySetCode || '', this.categorySearchCode, this.pageIndex, this.pageSize);
      this.i.plantCode = this.appConfigService.getPlantCode();
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
    const value = this.i.itemId || '';
    if (value === '') {
      // 加载物料
      this.commonQueryService.getUserPlantItemPageList(this.i.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        if(res.data.totalElements === 1) {
          this.i.itemId = res.data.content.find(x => x.itemCode === Text).itemId;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }
  // 加载物料
  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  // 工厂切换
  plantChange() {
    this.i.itemId = '';
    this.i.itemCode = this.i.itemCode !== null ? null : '';
    // this.loadItems();
  }

  gridView2: GridDataResult;
  columns2: any[] = [
    {
      field: 'categoryCode',
      title: '类别',
      width: '100'
    },
    {
      field: 'descriptions',
      title: '类别描述',
      width: '100'
    }
  ];
  search2(e: any) {
    let data = [];
    if (e.SearchValue !== '' && e.SearchValue !== null && e.SearchValue !== undefined) {
      data = this.categoryOptions.filter(x => x.categoryCode === e.SearchValue);
    } else {
      data = this.categoryOptions;
    }
    this.gridView2 = {
      data: data.slice(Number(e.Skip), Number(e.Skip) + Number(e.PageSize)),
      total: data.length
    };
  }
  // 类别集切换
  categorySetChange() {
    this.i.categoryCode = '';
    this.categoriesSearch('');
  }
  /* 设置scroll下拉菜单默认选项 */
  private setScrollDefaultOptions() {
    // 初始化默认值
    this.commonQueryService.GetCategoryPageList1(this.i.categorySetCode, this.categorySearchCode, this.pageIndex, this.pageSize).subscribe(res => {
      if (res && res.data) {
        res.data.content.forEach(d => {
          this.categoryOptions.push({
            label: d.categoryCode,
            value: d.categoryCode,
          });
        });
      }
      if (this.categoryOptions.find(item => item.value === this.i.categoryCode) === undefined) {
        this.pageIndex++;
        this.setScrollDefaultOptions();
      }
    });
  }
  /* 分页加载类别 */
  public loadCategories(options: any[], categorySetCode: string, categoryCode: string, PageIndex: number, PageSize: number, IsNew: boolean = false) {
    this.commonQueryService.GetCategoryPageList1(categorySetCode, categoryCode, PageIndex, PageSize).subscribe(result => {
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
  private categorySearchCode = '';
  private pageIndex = 1;
  private pageSize = 500;
  /* 类别scroll */
  categoriesScroll(event: any) {
    this.pageIndex++;
    this.loadCategories(this.categoryOptions, this.i.categorySetCode || '', this.categorySearchCode, this.pageIndex, this.pageSize);
  }
  /* 类别search */
  categoriesSearch(event: any) {
    this.categorySearchCode = event;
    this.pageIndex = 1;
    this.categoryOptions.length = 0;
    this.loadCategories(this.categoryOptions, this.i.categorySetCode || '', this.categorySearchCode, this.pageIndex, this.pageSize, true);
  }

  save(value: any) {
    if (this.i.itemCode === '') {
      this.msgSrv.warning(this.appTranslationService.translate('物料不能为空'));
      return;
    }
    if (this.i.itemCode !== '' && (this.i.itemId === undefined || this.i.itemId === '')) {
      this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
      return;
    }
    if (this.i.categoryCode === undefined || this.i.categoryCode === '') {
      this.msgSrv.warning(this.appTranslationService.translate('类别不能为空'));
      return;
    }
    this.commonQueryService.Save(this.i).subscribe(res => {
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

  clear() {
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
