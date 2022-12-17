import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ItemCategoryService } from '../../../../modules/generated_module/services/item-category-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { bindCallback } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-itemcategory-view-edit',
  templateUrl: './view-edit.component.html',
})
export class PreparationPlatformItemcategoryViewEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  plantoptions: any[] = [];
  cateoptions: any[] = [];
  /**送货区域 */
  regionoptions: any[] = [];
  readOnly: Boolean = false;
  yesnoOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private querydata: ItemCategoryService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService
  ) {}

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.readOnly = true;
      this.querydata.GetViewById(this.i.id).subscribe(res => {
        this.i = res.data;
        this.plantChange(this.i.plantCode);
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.enableFlag = 'Y';
      this.plantChange(this.i.plantCode);
    }

    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetLookupByType('FND_YES_NO').subscribe(result => {
      // this.yesnoOptions.length = 0;
      result.Extra.forEach(d => {
        this.yesnoOptions.push({
          label: d.meaning,
          value: d.lookupCode
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

    // this.querydata.GetCategory().subscribe(res => {
    //   res.Extra.forEach(element => {
    //     this.cateoptions.push({
    //       label: element.categoryCode,
    //       value: element.categoryCode
    //     });
    //   });
    // });
  }

  save() {    
      this.querydata.EditView(this.i).subscribe(res => {
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
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
  plantChange(value: any) {
    this.regionoptions = [];
    this.querydata.GetRegion(value).subscribe(res => {
      res.data.forEach(element => {
        this.regionoptions.push({
          label: element.deliveryRegionCode,
          value: element.deliveryRegionCode
        });
      });
    });
  }

}
