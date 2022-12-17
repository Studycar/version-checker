import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { BaseMenuGroupPluginChildEditService } from '../edit.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-menu-group-plugin-child-edit',
  templateUrl: './edit.component.html',
  providers: [BaseMenuGroupPluginChildEditService],
})
export class BaseMenuGroupPluginChildEditComponent implements OnInit {
  applications: any[] = []; // 绑定菜单使用
  applicationsAction: any[] = [];
  applicationRateType: any[] = [];
  record: any = {};
  i: any = {};
  iClone: any = {};
  // tslint:disable-next-line:no-inferrable-types
  IsDisable: boolean = false;
  Istrue: boolean;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: BaseMenuGroupPluginChildEditService,
    private commonQueryService: CommonQueryService,
    private appTranslationService: AppTranslationService

  ) { }

  ngOnInit(): void {
    this.loadRateType();
    this.loadData();
    this.iClone = Object.assign({}, this.i);
  }

  loadData() {
    // 新增顶级菜单绑定
    if (this.i.menuGroupType === 'MENUTOP') {

      this.Istrue = false;
      /** 初始化菜单名 下拉框*/
      this.editService.GetMenuTOP().subscribe(result => {
        result.data.forEach(d => {
          this.applications.push({
            label: d.menuName,
            value: d.menuId,
            tag: { functionName: d.functionName, menuType: d.menuType, applicationId: d.applicationId },
          });
        });
      });

    } else {
      if (this.i.menuGroupType === 'EDITMENU') {
        this.Istrue = true;
      } else {
        this.Istrue = false;
      }

      // 编辑菜单，新增同级菜单，新增下级菜单，如果组ID等于选中的菜单ID ，那么绑定顶级菜单   否则绑定子菜单
      if (this.i.menuGroupId === this.i.parentMenuId && this.i.menuGroupType !== 'ADDMENUCHILD') {
        /** 初始化菜单名 下拉框*/
        this.editService.GetMenuTOP().subscribe(result => {
          result.data.forEach(d => {
            this.applications.push({
              label: d.menuName,
              value: d.menuId,
              tag: { functionName: d.functionName, menuType: d.menuType, applicationId: d.applicationId },
            });
          });

        });
      } else {      /** 初始化菜单名 下拉框*/
        this.editService.GetMenuChild().subscribe(result => {
          result.data.forEach(d => {
            this.applications.push({
              label: d.menuName,
              value: d.menuId,
              tag: { functionName: d.functionName, menuType: d.menuType, applicationId: d.applicationId },
            });
          });

        });
      }
    }

    /** 初始化應用程序  下拉框*/
    this.commonQueryService.GetApplication().subscribe(result => {
      result.data.forEach(d => {
        this.applicationsAction.push({
          label: d.applicationName,
          value: d.id,
        });
      });

    });

    // if (this.i.MENU_GROUP_ID > 0) {
    //  /** 初始化编辑数据 */
    //  this.menuGroupPluginService.Get(this.i.MENU_GROUP_ID, this.i.LANGUAGE ).subscribe(result => {
    //     this.i = result.Extra[0];
    //  });
    // }

  }

  // 菜单类型
  public loadRateType(): void {



    this.commonQueryService.GetLookupByType('FND_MENU_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationRateType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  onChange(value: any) {
    this.applications.forEach(element => {
      if (element.value === value) {
        this.i.menuId = value;
        this.i.functionName = element.tag.functionName;
        this.i.menuType = element.tag.menuType;
        this.i.applicationId = element.tag.applicationId;
        return;
      }
    });
  }

  save() {
    this.editService.SaveMenuNEW(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

   /**重置 */
   clear() {
    if (this.i.menuGroupId !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
