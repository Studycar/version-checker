import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { UserItemCategoryService } from '../../../../modules/generated_module/services/user-itemcategory-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-user-item-category-edit',
  templateUrl: './edit.component.html',
})
export class PreparationPlatformUserItemCategoryEditComponent implements OnInit {
  i: any;
  title: String = '新增';
  plantoptions: any[] = [];
  employoptions: any[] = [];
  readOnly: Boolean = false;
  canSave = false;

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'categoryCode',
      title: '类别编码',
      width: '50'
    },
    {
      field: 'categoryDesc',
      title: '类别名称',
      width: '50'
    }
  ];
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private querydata: UserItemCategoryService,
    private appconfig: AppConfigService,
    private apptrans: AppTranslationService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.title = '编辑';
      this.readOnly = true;
      this.querydata.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
      });
      this.canSave = true;
    } else {
      this.i.enableFlag = 'Y';
      this.i.plantCode = this.appconfig.getPlantCode();
      this.plantChange(this.i.plantCode);
    }
    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    this.querydata.GetEmploy().subscribe(res => {
      res.data.content.forEach(element => {
        this.employoptions.push({
          label: element.userName,
          value: element.userName,
          desc: element.description,
        });
      });
    });
  }

  save() {
    this.querydata.save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.apptrans.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.apptrans.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  employchange(value: any) {
    this.i.fullName = this.employoptions.find(item => item.value === value).desc;
    /*this.querydata.GetFullName(value).subscribe(res => {
      this.i.DESCRIPTION = res.Extra.DESCRIPTION;
    });*/
  }


  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  change1({ sender, event, Text }) {
    const value = this.i.categoryCode || '';
    if (value !== '') {
      // 加载物料
      this.querydata.GetUserPlantCategoryPageList(this.i.plantCode, Text || '',  1, sender.PageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          this.i.categoryDesc = res.data.content.find(x => x.categoryCode === Text).categoryDesc;
          this.canSave = true;
        } else {
          this.msgSrv.warning(this.apptrans.translate('类别无效'));
          this.canSave = false;
        }
      });
    }
  }

  public loadItems(PLANT_CODE: string, CATEGORY_CODE: string, PageIndex: number, PageSize: number) {
    // 加载采购员
    this.querydata.GetUserPlantCategoryPageList(PLANT_CODE || '', CATEGORY_CODE || '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  plantChange(value: any) {
    this.i.categoryCode = '';
    this.i.categoryDesc = '';
    this.gridView1.data = [];
    this.gridView1.total = 0;
    this.loadItems(value, '', 1, 10);
  }

  changeName(value: any) {
    this.i.categorrDesc = this.gridView1.data.find(x => x.categoryCode === value.Text).categoryDesc;
    this.canSave = true;
  }

  clear() {
    if (this.i.id != null) {
      this.querydata.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
      });
    }
  }
}
