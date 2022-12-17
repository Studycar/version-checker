import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BaseFlexValueSetsManageService } from 'app/modules/generated_module/services/base-flex-value-sets-manage-service';

@Component({
  selector: 'base-flex-value-sets-detail2',
  templateUrl: './detail2.component.html',
  styleUrls: ['./detail2.component.css']
})
export class BaseFlexValueSetsDetail2Component implements OnInit {
  i: any;
  /**参数描述 */
  paramsDes: any = {};
  allGetters: any[];

  constructor(
    private modal: NzModalRef,
    private modal1: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public translateservice: AppTranslationService,
    private baseFlexValueSetsManageService: BaseFlexValueSetsManageService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    /** 获取所有的getter以供选择 */
    this.baseFlexValueSetsManageService.loadAllGetters()
      .subscribe(result => {
        if (result.Extra !== null) {
          this.allGetters = result.Extra;
        }
      });

    if (this.i.flexValueSetId !== null) {
      /** 初始化编辑数据 */
      this.baseFlexValueSetsManageService.GetBase_Flex_Validation_Tables(this.i.flexValueSetId)
        .subscribe(result => {
          if (result.data !== null && result.data.flexValueSetId !== null) {
            this.i = result.data;
          }

          // 加载参数格式
          this.baseFlexValueSetsManageService.loadGetterParamsSimple(this.i.applicationTableName)
            .subscribe(result2 => {
              this.paramsDes = result2.Extra;
            });
        });
    }
  }

  getterSelectChange(event) {
    console.log(event);
    this.baseFlexValueSetsManageService.loadGetterParamsSimple(event)
      .subscribe(result2 => {
        this.paramsDes = result2.Extra;
      });
  }

  close() {
    this.modal.close(true);
    this.modal.destroy();
  }

  save() {
    const paramObj = Object.assign({}, this.i);
    this.baseFlexValueSetsManageService.EditBase_Flex_Validation_TablesNoTest(paramObj)
      .subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.translateservice.translate('保存成功'));
          this.modal.destroy();
        } else {
          this.msgSrv.error(this.translateservice.translate(res.msg));
        }
      });
  }
}
