import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { MenuQueryService } from '../query.service';
import { MenuManagerManageService } from 'app/modules/generated_module/services/menu-manager-manage-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-menumanager-edit',
  templateUrl: './edit.component.html',
  providers: [MenuQueryService]
})
export class BaseMenumanagerEditComponent implements OnInit {

  languageOptions: any[] = [];
  applicationOptions: any[] = [];
  menuTypeOptions: any[] = [];
  windowTypeOptions: any[] = [];
  functionOptions: any[] = [];
  isModify = false;
  @Input()
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private queryService: MenuQueryService,
    private menuManagerManageService: MenuManagerManageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    /* 初始化语言 */
    this.queryService.GetLookupByTypeRef('FND_LANGUAGE', this.languageOptions);
    this.queryService.GetLookupByTypeRef('FND_MENU_TYPE', this.menuTypeOptions);
    this.queryService.GetLookupByTypeRef('FND_WINDOW_TYPE', this.windowTypeOptions);
    /** 初始化應用程序 */
    this.applicationOptions.length = 0;
    this.queryService.GetApplicationNew().subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationName,
          value: d.id,
        });
      });
    });
    /** 初始化功能 */
    this.queryService.GetFunctions('', this.i.language).subscribe(result => {
      result.data.content.forEach(d => {
        this.functionOptions.push({
          label: d.functionName,
          value: d.id,
        });
      });
    });

    if (this.i.menuId != null) {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.queryService.Get(this.i.menuId, this.i.language).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.startDate = new Date();
    }
  }

  save(value: any) {
    this.i.menuId = this.i.menuId || '';
    if (this.i.menuId !== '') {
      value.menuId = this.i.menuId;
      value.attribute2 = this.i.attribute2;
    } else {
      value.menuId = null;
    }
    this.queryService.Save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
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
