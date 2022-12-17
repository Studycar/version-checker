/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-08-10 11:28:17
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-17 15:13:37
 * @Note: ...
 */
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { MaterialmanagementCategorymanageService } from '../../../../modules/generated_module/services/materialmanagement-categorymanage-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-categorymanage-edit',
  templateUrl: './edit.component.html',
})
export class MaterialmanagementCategorymanageEditComponent implements OnInit {
  title: String = '新增';
  applicationset: any = [];
  i: any;
  iClone: any;
  illegal: string[] = [];
  isModify: boolean;
  SEGMENTS: string[] = [];
  count: number;
  yesOrNo: any[] = [];
  categoryCodeValidate = true;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public categorymanageService: MaterialmanagementCategorymanageService,
    public commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    public appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    if (this.i.id != null) {
      this.title = '编辑';
      this.isModify = true;
    } else {
      this.isModify = false;
      this.i.enableFlag = 'Y';
    }
    this.loadData();
  }

  loadData() {
    /**
     * 初始化编辑信息
     */
    if (this.i.id != null) {
      this.categorymanageService.Get(this.i.id).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      }
      );
    }
    /* 初始化类别集相关*/
    this.categorymanageService.GetCategorySet().subscribe(result => {
      result.data.forEach(d => {
        this.applicationset.push({
          label: d.categorySetCode,
          value: d.categorySetCode,
          tag: {
            CATEGORY_SET_DESC: d.categorySetDesc,
            CNT: d.segmentsQty
          }
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.yesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }

  /**类别集改变事件 */
  changeset(value: any) {
    this.applicationset.forEach(element => {
      if (element.value === value) {
        this.i.categorySetCode = element.label;
        this.i.categorySetDesc = element.tag.CATEGORY_SET_DESC;
        this.i.segmentsQty = element.tag.CNT;
        return;
      }
    });
    this.i.categoryCode = null;
    this.i.categoryDesc = null;
  }

  /**保存事件 */
  save() {
    this.categorymanageService.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  /**根据段数判断类别是否合法+对类别段进行赋值 */
  some(event: any) {
    this.illegal = event.target.value.split('.');
    // tslint:disable-next-line:parameter;
    if (this.illegal.length !== parseInt(this.i.segmentsQty, 10)) {
      this.categoryCodeValidate = false;
      this.msgSrv.error('类别名不符合规则');
      // this.i.categoryCode = '';
      this.i.segment1 = null;
      this.i.segment2 = null;
      this.i.segment3 = null;
      this.i.segment4 = null;
      this.i.segment5 = null;
      this.i.segment6 = null;
      this.i.segment7 = null;
      this.i.segment8 = null;
      this.i.segment9 = null;
      this.i.segment10 = null;
    } else {
      this.categoryCodeValidate = true;
      for (this.count = 0; this.count <= this.illegal.length; this.count++) {
        this.SEGMENTS[this.count] = this.illegal[this.count];
      }
      this.i.segment1 = this.SEGMENTS[0];
      this.i.segment2 = this.SEGMENTS[1];
      this.i.segment3 = this.SEGMENTS[2];
      this.i.segment4 = this.SEGMENTS[3];
      this.i.segment5 = this.SEGMENTS[4];
      this.i.segment6 = this.SEGMENTS[5];
      this.i.segment7 = this.SEGMENTS[6];
      this.i.segment8 = this.SEGMENTS[7];
      this.i.segment9 = this.SEGMENTS[8];
      this.i.segment10 = this.SEGMENTS[9];
    }

  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
