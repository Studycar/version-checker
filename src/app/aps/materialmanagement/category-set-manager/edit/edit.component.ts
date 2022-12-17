/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:08:57
 * @LastEditors: Zwh
 * @LastEditTime: 2019-11-04 22:34:07
 * @Note: ...
 */
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { CategorySetManagerEditService } from '../edit.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-category-set-manager-edit',
  templateUrl: './edit.component.html',
  providers: [CategorySetManagerEditService]
})
export class MaterialmanagementCategorySetManagerEditComponent implements OnInit {

  i: any;
  iClone: any;
  Istrue: boolean;
  applicationYesNo: any[] = [];
  segmentsQtyValidate = true;
  baseUrl = '/api/ps/pscategorysets/'; // 基路径
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: CommonQueryService,
    public editService: CategorySetManagerEditService,
    public appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    this.loadYesNO();
    this.loadData();
  }

  loadData() {
    console.log(this.i.id);
    /** 初始化编辑数据 */
    if (this.i.id != null) {
      this.Istrue = true;
      this.editService.Get(this.i.id).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
        // if (resultMes.Extra !== undefined && resultMes.Extra.length > 0) {
        //   const d = resultMes.Extra[0];
        //   // this.i = d;
        //   this.i = {
        //     Id: d.Id,
        //     CATEGORY_SET_CODE: d.CATEGORY_SET_CODE,
        //     DESCRIPTIONS: d.DESCRIPTIONS,
        //     SEGMENTS_QTY: d.SEGMENTS_QTY,
        //     CONSUME_SET: d.CONSUME_SET,
        //     ENABLE_FLAG: d.ENABLE_FLAG
        //   };
        //   this.iClone = Object.assign({}, this.i);
        // }
      });
    } else {
      this.Istrue = false;
      this.i.enableFlag = 'Y';
    }
  }

  public loadYesNO(): void {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationYesNo.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  modelValueValidate(value: number): void {
    const reg = /^[1-9]\d*$/;
    if (!reg.test(value.toString())) {
      this.msgSrv.warning(this.appTranslationService.translate('输入不合法，仅允许填整数！'));
      this.segmentsQtyValidate = false;
    } else {
      this.segmentsQtyValidate = true;
    }
  }

  save() {
    this.editService.Edit(this.i).subscribe(res => {
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
    this.i = Object.assign({}, this.iClone);
  }
}
