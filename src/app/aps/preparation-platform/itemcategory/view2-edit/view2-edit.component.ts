import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ItemCategoryService } from '../../../../modules/generated_module/services/item-category-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-itemcategory-view2-edit',
  templateUrl: './view2-edit.component.html',
})
export class PreparationPlatformItemcategoryView2EditComponent implements OnInit {
  record: any = {};
  s: any;
  iClone: any;
  readOnly: Boolean = false;
  groupoptions: any[] = [];
  scheduleGroupoptions: any[] = [];
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private querydata: ItemCategoryService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.scheduleGroupoptions = this.s.schudlegroups;
    const tmpRegionCode = this.s.deliveryRegionCode;
    const tmpCategoryCode = this.s.categoryCode;
    if (this.s.id !== null) {
      this.readOnly = false;
      this.querydata.GetView2ById(this.s.id).subscribe(res => {
        this.commonquery.GetUserPlantGroup(res.data.plantCode, '').subscribe(res1 => {
          res1.Extra.forEach(element => {
            this.groupoptions.push({
              label: element.scheduleGroupCode,
              value: element.scheduleGroupCode
            });
          });
        });
        this.s = res.data;
        this.s.deliveryRegionCode = tmpRegionCode;
        this.s.categoryCode = tmpCategoryCode;
        this.groupChange(res.data.scheduleGroupCode);
        this.iClone = Object.assign({}, this.s);
      });
    } else {
    }
    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetUserPlantGroup(this.s.plantCode, '').subscribe(res => {
      res.Extra.forEach(element => {
        this.groupoptions.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode
        });
      });
    });
  }

  save() {
    this.querydata.EditView2(this.s).subscribe(res => {
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
    this.s.id = this.s.id || '';
    if (this.s.id !== '') {
      this.s = this.iClone;
      this.iClone = Object.assign({}, this.s);
    } else {
      this.s = {};
    }
    this.LoadData();
  }
  groupChange(value) {
    this.s.descriptions = '';
    const tmpObj = this.scheduleGroupoptions.find(x => x.value === value);
    if (tmpObj !== undefined) {
      this.s.descriptions = tmpObj.label;
    }
  }

}
