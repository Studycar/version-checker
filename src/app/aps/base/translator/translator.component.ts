// 多语言翻译

import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { STColumn } from '@delon/abc';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseTranslatorEditService } from './edit.service';
import { map } from 'rxjs/operators/map';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
// import { BaseTranslatorDetailComponent } from './detail/translator-detail.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TranslatorEditComponent } from './edit/edit.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { BaseTranslatorInputDto } from '../../../modules/generated_module/dtos/base-translator-input-dto';
import { BaseTranslstorService } from '../../../modules/generated_module/services/basetranslator-service';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { QueryService } from './query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'translator',
  templateUrl: './translator.component.html',
  providers: [QueryService, BaseTranslatorEditService],
})

export class TranslatorComponent extends CustomBaseContext implements OnInit {
  expandForm = false;
  public GridView: Observable<GridDataResult>;
  applicationOptions: any[] = [];
  applications: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];
  public QueryLan: any[] = [];
  public CurLng: any;
  // kendoHeight = document.body.clientHeight - 302;
  // public context = this;
  public queryParams = {
    defines: [
      { field: 'languageCode', title: '语言代码', ui: { type: UiType.select, options: this.QueryLan}  },
      { field: 'devLanguageRd', title: '原文', ui: { type: UiType.string } },
    ],
    values: {
      languageCode: '',
      devLanguageRd: '',
      PAGE_INDEX: this.gridState.skip / this.gridState.take + 1,
      PAGE_SIZE: this.gridState.take
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    public editService: BaseTranslatorEditService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    public TranslstorService: BaseTranslstorService,
    public queryService: QueryService,
    public appConfigService: AppConfigService,
    public appTranslationService: AppTranslationService,
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService }); }

  // queryParams: any = {};
  public clear() {
    this.queryParams.values = {
      languageCode: '',
      devLanguageRd: '',
      PAGE_INDEX: this.gridState.skip / this.gridState.take + 1,
      PAGE_SIZE: this.gridState.take
    };
  }
  httpAction = { url: this.TranslstorService.GetLngMapping, method: 'GET', data: false };
  public query() {
    super.query();
    this.queryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  expColumns = [
    { field: 'languageCode', title: this.appTranslationService.translate('语言代码'), width: 200, locked: true },
    { field: 'devLanguageRd', title: this.appTranslationService.translate('原文'), width: 300, locked: false },
    { field: 'translatedText', title: this.appTranslationService.translate('译文'), width: 300, locked: false },
  ];
  expColumnsOptions: any[] = [
    { field: 'languageCode', options: this.QueryLan },
  ];

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    // this.gridData.length = 0;
    this.queryService.exportAction({ url: this.queryService.exportUrl, method: 'GET'}, this.getQueryParamsValue(), this.excelexport);
  }

  public add(item?: any) {
     this.modal
     .static(
      TranslatorEditComponent,
       {
         i: {
           ID: (item !== undefined ? item.ID : null),
           devLanguageId: (item !== undefined ? item.devLanguageId : null),
           languageCode: (item !== undefined ? item.languageCode : null),
           devLanguageRd: (item !== undefined ? item.devLanguageRd : null),
           translatedText: (item !== undefined ? item.translatedText : null),
           LOCKED: (item !== undefined ? item.LOCKED : null),
           operationFlag: (item !== undefined ? 'N' : 'Y')// Y表示新增，N表示修改
         },
         CODEOptions: this.QueryLan,
         CurLng: this.CurLng,
      },
       'lg', (item !== undefined ? item.FROM_ORGANIZATION_CODE : null)
   )
     .subscribe((res) => {
       if (res) {
        this.query();
       }
     });
  }

  public remove(item: any) {
    const dto = {
      id: item.id,
      devLanguageId: item.devLanguageId,
      devLanguageRd: item.devLanguageRd,
      translatedText: item.translatedText,
      languageCode : item.languageCode,
      attribute1 : item.attribute1
    };
    this.editService.Remove(dto).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '删除成功'));
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.CurLng = this.appConfigService.getLanguage();
    this.queryParams.values.languageCode = this.CurLng;
    // this.clear();
    this.GridView = this.queryService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.LoadData();
    // this.query();
  }

  private getQueryParamsValue(): any {
    return {
      languageCode: this.queryParams.values.languageCode,
      devLanguageRd: this.queryParams.values.devLanguageRd,
      PAGE_INDEX: this.gridState.skip / this.gridState.take + 1,
      PAGE_SIZE: this.gridState.take
    };
  }

  public LoadData(): any {
    // this.QueryLan.unshift({ label: '　', value: '', });

    /** 初始化 系统支持的语言类型 */
    this.queryService.GetLookupByType('FND_LANGUAGE').subscribe(result => {
      result.Extra.forEach(d => {
        this.QueryLan.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.QueryLan;
        break;
    }
    return options.find(x => x.value === value ) || { label: value };
  }

  public application(id: string): any {
    return this.applications.find(x => x.APPLICATION_ID === id);
  }
  // (pageChange)="pageChange($event)"
  public pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.gridState.take = event.take;
    this.queryService.read(this.httpAction);
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.queryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }
}
