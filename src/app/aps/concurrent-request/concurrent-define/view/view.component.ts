import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ConcurrentDefineService } from '../../../../modules/generated_module/services/concurrent-define-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-define-view',
  templateUrl: './view.component.html',
})
export class ConcurrentRequestConcurrentDefineViewComponent implements OnInit {
  arrInclude: any[] = [];
  arrTypes: any[] = [];
  // types: any[] = [];
  // typeAll: any[] = [];
  i: any;
  Param: any;
  includeFlag: string;
  @ViewChild('sf', {static: false, read: SFComponent}) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      includeFlag: {
        type: 'string', title: this.appTranslationService.translate('包含/排除'), ui: {
          widget: 'select',
          change: (value: any) => this.includeChange(value),
        },
        enum: [],
      },
      typeCode: {
        type: 'string', title: this.appTranslationService.translate('类型'), ui: {
          widget: 'select',
          change: (value: any) => this.unitTypeChange(value),
        },
        enum: [],
      },
      typeId: {
        type: 'string', title: this.appTranslationService.translate('名称'), ui: {
          widget: 'select',
        },
        enum: [],
      },
    },
    required: ['includeFlag', 'typeCode', 'typeId'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    }
  };
  requestOptions: Array<{ label: string, value: any }> = [];
  programOptions: Array<{ label: string, value: any }> = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private concurrentDefineService: ConcurrentDefineService,
    private commonQueryService: CommonQueryService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    this.i = this.Param.obj;
    this.commonQueryService.GetLookupByTypeNew('FND_CONC_MGR_RULE_INCLUDE_FLAG').subscribe(result => {
      result.data.forEach(d => {
        this.arrInclude.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
      this.schema.properties.includeFlag.enum = this.arrInclude;
      this.sf.refreshSchema();
    });

    this.commonQueryService.GetLookupByTypeNew('FND_CONC_MGR_RULE_TYPE_CODE').subscribe(result => {
      result.data.forEach(d => {
        this.arrTypes.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
      this.schema.properties.typeCode.enum = this.arrTypes;
      this.sf.refreshSchema();
    });

    this.commonQueryService.GetLookupByTypeNew('FND_CONC_REQUEST_TYPE').subscribe(res => {
      res.data.forEach(item => {
        this.requestOptions.push({
          label: item.meaning,
          value: item.lookupCodeId
        });
      });
    });

    this.concurrentDefineService.GetTypeDetail().subscribe(res => {
      res.data.forEach(item => {
        this.programOptions.push({
          label: item.userConcurrentProgramName,
          value: item.id
        });
      });
    });

    /*this.concurrentDefineService.GetTypeDetail().subscribe(result => {
      result.Extra.forEach(d => {
        this.typeAll.push({
          label: d.TYPENAME,
          value: d.TYPEID,
          typeflag: d.TYPEFLAG
        });
      });
    });*/
  }

  save(value: any) {
    // value.concurrentManagerId = this.i.id;
    this.concurrentDefineService.AddRule(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.Param.IsRefresh = true;
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  includeChange(value: any) {
    this.includeFlag = value;
  }

  unitTypeChange(value: any) {
    /*this.types.splice(0, this.types.length);
    this.typeAll.forEach(d => {
      if (d.typeflag === value) {
        this.types.push({
          label: d.label,
          value: d.value,
        });
      }
    });*/

    this.schema.properties.includeFlag.default = this.includeFlag;
    this.schema.properties.typeCode.default = value;
    this.schema.properties.typeId.enum = value === 'P' ? this.programOptions : this.requestOptions;
    this.sf.refreshSchema();
  }

  close() {
    this.modal.destroy();
  }
}
