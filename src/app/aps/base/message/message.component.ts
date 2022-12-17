import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { BaseMessageEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { State, process } from '../../../../../node_modules/@progress/kendo-data-query';
import { map } from '../../../../../node_modules/rxjs/operators';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-message',
  templateUrl: './message.component.html',
  providers: [QueryService]
})
export class BaseMessageComponent extends CustomBaseContext implements OnInit {
  public selectBy = 'MESSAGEID';
  public languageOptions: any[] = [];
  public applicationOptions: any[] = [];
  public queryParams = {
    defines: [
      { field: 'strMessageCode', title: '消息代码', ui: { type: UiType.string } },
      { field: 'strMessageText', title: '消息', ui: { type: UiType.string } },
      { field: 'strDescription', title: '描述', ui: { type: UiType.string } },
      { field: 'strLanguage', title: '语言', ui: { type: UiType.select, options: this.languageOptions } }
    ],
    values: {
      strMessageCode: '',
      strMessageText: '',
      strDescription: '',
      strLanguage: this.appConfigService.getLanguage()
    }
  };
  public columns = [
    // { field: 'MESSAGE_ID', title: '消息ID', width: 120, locked: true },
    { field: 'MESSAGECODE', title: '消息代码', width: 150, locked: true },
    { field: 'MESSAGETEXT', title: '消息', width: 320, locked: false, ui: { tooltip: 1 } },
    { field: 'APPLICATIONCODE', title: '应用模块', width: 150, locked: false, ui: { type: 'select', index: 1, options: this.applicationOptions } },
    { field: 'DESCRIPTION', title: '描述', width: 350, locked: false, ui: { tooltip: 1 } },
    { field: 'LANGUAGE', title: '语言', width: 100, locked: false, ui: { type: 'select', index: 2, options: this.languageOptions } }
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationOptions;
        break;
      case 2:
        options = this.languageOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private messageManageService: MessageManageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService }); }

  ngOnInit() {
    this.messageManageService.GetLanguages().subscribe(result => {
      result.Extra.forEach(d => {
        this.languageOptions.push({
          label: d.LOOKUPNAME,
          value: d.LOOKUPCODE,
        });
      });
    });
    this.loadOptions();
    this.clear();
    this.viewAsync = this.commonQueryService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.queryCommon();
  }
  private loadOptions() {
    this.messageManageService.GetAppliaction(this.queryParams.values.strLanguage).subscribe(result => {
      this.applicationOptions.length = 0;
      result.data.forEach(d => {
        this.applicationOptions.push({
          label: d.APPLICATION_NAME,
          value: d.APPLICATION_CODE,
        });
      });
    });
  }
  httpAction = { url: this.messageManageService.queryUrl, method: 'POST' };
  public query() {
    super.query();
    this.loadOptions();
    this.queryCommon();
  }
  private queryCommon() {
    this.commonQueryService.read(this.httpAction, this.queryParams.values, this.context);
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    this.commonQueryService.read(this.httpAction);
  }

  public add(item?: any) {
    this.modal
      .static(BaseMessageEditComponent, { i: { MESSAGEID: (item !== undefined ? item.MESSAGEID : null), LANGUAGE: (item !== undefined ? item.LANGUAGE : null) } })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public remove(item: any) {
    this.messageManageService.Remove(item.MESSAGEID).subscribe(res => {
      // if (res.Success) {
      //   this.msgSrv.success(this.appTranslationService.translate('删除成功'));
      //   this.queryCommon();
      // } else {
      //   this.msgSrv.error(this.appTranslationService.translate(res.Message));
      // }
    });
  }

  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.messageManageService
          .removeBatch(this.selectionKeys)
          .subscribe(res => {
            // if (res.Success) {
            //   this.msgSrv.success(this.appTranslationService.translate('删除成功'));
            //   this.queryCommon();
            // } else {
            //   this.msgSrv.error(this.appTranslationService.translate(res.Message));
            // }
          });
      },
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'APPLICATIONCODE', options: this.applicationOptions }, { field: 'LANGUAGE', options: this.languageOptions }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.loadOptions();
    super.export();
    // this.commonQueryService.exportAction({ url: this.messageManageService.exportUrl, method: 'POST' }, this.queryParams.values, this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }

  public clear() {
    this.queryParams.values = {
      strMessageCode: '',
      strMessageText: '',
      strDescription: '',
      strLanguage: this.appConfigService.getLanguage()
    };
  }
}
