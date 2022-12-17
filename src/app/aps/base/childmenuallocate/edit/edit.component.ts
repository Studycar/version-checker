import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { MenuManagerManageService } from '../../../../modules/generated_module/services/menu-manager-manage-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-childmenuallocate-edit',
  templateUrl: './edit.component.html',
})
export class BaseChildmenuallocateEditComponent implements OnInit {

  title = '编辑信息';
  childMenuOptions: any[] = [];
  menuGroupOptions: any[] = [];
  i: any;
  iClone: any;
  MENU_TYPE: any;
  isModify = true;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private menuManagerManageService: MenuManagerManageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if (this.i.ID == null) {
      this.title = '新增信息';
      this.isModify = false;
    }
    this.loadData();
  }

  change(value: any) {
   const selectedItem = this.childMenuOptions.find(item => item.value === value);
    this.i.FUNCTION_NAME = selectedItem.tag.FUNCTION_NAME;
    this.i.MENU_TYPE_NAME = selectedItem.tag.MENU_TYPE_NAME;
  }

  loadData() {
    /* 初始化子菜单 */
    this.childMenuOptions.length = 0;
    this.menuManagerManageService.GetMenus('', this.i.LANGUAGE).subscribe(result => {
      result.Extra.forEach(d => {
        if (this.i.PARENT_MENU_ID !== d.MENU_ID) {
          this.childMenuOptions.push({
            label: d.MENU_NAME,
            value: d.MENU_ID,
            tag: { FUNCTION_NAME: d.FUNCTION_NAME, MENU_TYPE_NAME: d.MENU_TYPE_NAME },
          });
        }
      });
    });
    /** 初始化菜单组 */
    this.menuGroupOptions.length = 0;
    this.menuManagerManageService.GetMenuGroups(this.i.LANGUAGE).subscribe(result => {
      result.Extra.forEach(d => {
        this.menuGroupOptions.push({
          label: d.MENU_GROUP_NAME,
          value: d.MENU_GROUP_ID,
        });
      });
    });
    if (this.i.ID != null) {
      /** 初始化编辑数据 */
      this.menuManagerManageService.GetChild(this.i.ID, this.i.LANGUAGE).subscribe(resultMes => {
        this.i = resultMes.Extra;
        this.i.MENU_TYPE_NAME = this.MENU_TYPE;
        this.iClone = Object.assign({}, this.i);
      });
    }
  }

  save() {
    this.menuManagerManageService.EditChild(this.i).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
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
