import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { QueryService } from '../queryService';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PopupSelectComponent } from 'app/modules/base_module/components/popup-select.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-MarkupCharges-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})

export class PsMarkupChargesEditComponent implements OnInit {
  i: any;
  iClone: any;
  isLoading = false;
  readOnly: Boolean = false;
  title: String = '新增';
  markupElementOptions: any[] = [];
  yesOrNoOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) { }


  ngOnInit(): void {
    this.isLoading = true;
    this.LoadData();

    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.queryService.get(this.i.id).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.plantCode = this.appconfig.getPlantCode();
    }
    this.isLoading = false;
  }

  LoadData() {
    this.loadMarkupElement();
    this.loadYesOrNo();
  }

  
   /**
   * 加载快码 启用禁用
   */
    public loadYesOrNo(): void {
      this.queryService.GetLookupByType('FND_YES_NO')
        .subscribe(result => {
          result.Extra.forEach(d => {
            this.yesOrNoOptions.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          });
        });
    }

   /**
   * 加载快码 加价维度
   */
    public loadMarkupElement(): void {
      this.queryService.GetLookupByType('PS_MARKUP_ELEMENT')
        .subscribe(result => {
          result.Extra.forEach(d => {
            this.markupElementOptions.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          });
        });
    }
  
  save() {
    this.queryService.edit(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  
  close() {
    this.modal.destroy();
  }
  /**重置 */
  clear() {
    if (this.i.Id !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }



}
