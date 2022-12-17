import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ConcurrentDefineService } from '../../../modules/generated_module/services/concurrent-define-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ConcurrentRequestConcurrentDefineViewComponent } from './view/view.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-rule',
  templateUrl: './concurrent-rule.component.html',
})
export class ConcurrentRequestConcurrentRuleComponent extends CustomBaseContext implements OnInit {
  i: any = {};

  customSpanStyle = {
    cursor: 'Pointer',
    'padding-left': '4px',
    'padding-right': '4px',
  };

  columns = [
    { headerName: '管理器名称', width: 130, field: 'userConcurrentManangerName', menuTabs: ['filterMenuTab'] },
    { headerName: '包含/排除', width: 130, field: 'includeFlag', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    { headerName: '类型', width: 130, field: 'typeCode', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { headerName: '名称', width: 130, field: 'names', menuTabs: ['filterMenuTab'] },
    {
      headerName: '操作',
      width: 80,
      field: '',
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
    }
  ];

  typeOptions: Array<{ label: string, value: any }> = [];
  includeFlagOptions: Array<{ label: string, value: any }> = [];

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.typeOptions;
        break;
      case 2:
        options = this.includeFlagOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private concurrentDefineService: ConcurrentDefineService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private pro: BrandService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[4].cellRendererParams.customTemplate = this.customTemplate;
    this.commonQueryService.GetLookupByTypeNew('FND_CONC_MGR_RULE_TYPE_CODE').subscribe(res => {
      res.data.forEach(item => {
        this.typeOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
    this.commonQueryService.GetLookupByTypeNew('FND_CONC_MGR_RULE_INCLUDE_FLAG').subscribe(res => {
      res.data.forEach(item => {
        this.includeFlagOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
    this.Query();
  }

  Query() {
    this.setLoading(true);
    this.concurrentDefineService.QueryRule(this.i.id).subscribe(result => {
      /*if (result.Extra != null && result.Extra.length !== undefined && result.Extra.length > 0) {
        this.gridData = result.Extra;
      }*/
      if (result.code === 200) {
        this.gridData = result.data.length ? result.data : [];
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg || '获取数据失败'));
      }
      this.setLoading(false);
    },
      errMsg => { },
      () => { }
    );
  }

  add() {
    const Param = {
      opertype: '新增',
      IsRefresh: false,
      obj: { concurrentManagerId: this.i.id }
    };
    this.modal
      .static(ConcurrentRequestConcurrentDefineViewComponent, { Param: Param })
      .subscribe(() => { if (Param.IsRefresh) { this.Query(); } });
  }

  remove(obj: any) {
    this.concurrentDefineService.RemoveRule([obj.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.Query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });

  }
}
