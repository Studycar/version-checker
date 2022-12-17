import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { MessageProfileService } from 'app/modules/generated_module/services/message-profile-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { QueryService } from '../../baserespmanager/query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-messageprofile-rule-edit',
  templateUrl: './rule-edit.component.html',
  providers: [QueryService]
})
export class BaseMessageRuleEditComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplate2', { static: true }) customTemplate2: TemplateRef<any>;
  @ViewChild('customTemplate3', { static: true }) customTemplate3: TemplateRef<any>;

  profileId: any;
  logicOpratorOptions: any[] = [];
  sqlOpratorOptions: any[] = [];
  opratorOptions: any[] = [];
  yesOrNo: any[] = [];
  httpAction = {
    url: this.querydata.msgRuleUrl,
    method: 'POST'
  };

  public columns;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: NzModalRef,
    private querySerive: QueryService,
    private querydata: MessageProfileService,
    private appConfigService: AppConfigService,
    private appTranslationService: AppTranslationService,
    public msgSrv: NzMessageService,
    private commonquery: CommonQueryService,
    private modalService: NzModalService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.columns = [
      {
        colId: 0, field: '', headerName: '操作', width: 40, pinned: this.pinnedAlign, lockPinned: true,
        headerComponentParams: {
          template: this.headerTemplate
        },
        cellRendererFramework: CustomOperateCellRenderComponent,      // Component Cell Renderer
        cellRendererParams: {
          customTemplate: this.customTemplate         // Complementing the Cell Renderer parameters
        }
      },
      {
        colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
        checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
        headerComponentParams: {
          template: this.headerTemplate
        }
      },
      {
        field: 'TABLE_NAME', headerName: '表名', menuTabs: ['filterMenuTab'], tooltipField: 'TABLE_NAME', width: 200,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate1,
        }
      },
      {
        field: 'FIELD_NAME', headerName: '字段名', menuTabs: ['filterMenuTab'], tooltipField: 'TITLE', width: 100,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate2,
        }
      },
      {
        field: 'FIELD_VALUE', headerName: '字段值', menuTabs: ['filterMenuTab'], width: 80,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate3,
        }
      },
      {
        field: 'LOGIC_OPERATOR', headerName: '逻辑操作符', menuTabs: ['filterMenuTab'], width: 120,
        editable: true, cellEditor: 'agSelectCellEditor',
        cellEditorParams: (params) => {
          if (params.colDef.field === 'LOGIC_OPERATOR') {
            const values = [];
            this.logicOpratorOptions.forEach(pro => values.push(pro.label));
            return { values: values };
          }
        }
      },
      {
        field: 'SQL_OPERATOR', headerName: 'SQL类型', menuTabs: ['filterMenuTab'], width: 100,
        editable: true, cellEditor: 'agSelectCellEditor',
        cellEditorParams: (params) => {
          if (params.colDef.field === 'SQL_OPERATOR') {
            const values = [];
            this.sqlOpratorOptions.forEach(pro => values.push(pro.label));
            return { values: values };
          }
        }
      },
      {
        field: 'OPERATOR', headerName: '运算符', menuTabs: ['filterMenuTab'], width: 80,
        editable: true, cellEditor: 'agSelectCellEditor',
        cellEditorParams: (params) => {
          if (params.colDef.field === 'OPERATOR') {
            const values = [];
            this.opratorOptions.forEach(pro => values.push(pro.label));
            return { values: values };
          }
        }
      },
      {
        field: 'ENABLED', headerName: '启用', menuTabs: ['filterMenuTab'], width: 80,
        editable: true, cellEditor: 'agSelectCellEditor',
        cellEditorParams: (params) => {
          if (params.colDef.field === 'ENABLED') {
            const values = [];
            this.yesOrNo.forEach(pro => values.push(pro.label));
            return { values: values };
          }
        }
      }
    ];
    this.loadData();
    this.query();
  }

  private loadData() {
    this.querydata.GetLogicOprator().subscribe(result => {
      this.logicOpratorOptions.length = 0;
      if (result.Success) {
        result.Extra.forEach(element => {
          this.logicOpratorOptions.push({ value: element.Key, label: element.Value });
        });
      }
    });

    this.querydata.GetSqlOprator().subscribe(result => {
      this.sqlOpratorOptions.length = 0;
      if (result.Success) {
        result.Extra.forEach(element => {
          this.sqlOpratorOptions.push({ value: element.Key, label: element.Value });
        });
      }
    });

    this.querydata.GetOprator().subscribe(result => {
      this.opratorOptions.length = 0;
      if (result.Success) {
        result.Extra.forEach(element => {
          this.opratorOptions.push({ value: element.Key, label: element.Value });
        });
      }
    });

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage()).subscribe(res => {
      this.yesOrNo.length = 0;
      if (res.Success) {
        res.Extra.forEach(element => {
          this.yesOrNo.push({
            label: element.MEANING,
            value: element.LOOKUP_CODE
          });
        });
      }
    });
  }

  add() {
    const addDataItem = {
      Id: 0,
      TABLE_NAME: '',
      FIELD_NAME: '',
      FIELD_VALUE: '',
      LOGIC_OPERATOR: this.logicOpratorOptions[0].label,
      SQL_OPERATOR: this.sqlOpratorOptions[0].label,
      OPERATOR: this.opratorOptions[0].label,
      PROFILE_ID: this.profileId,
      ENABLED: this.yesOrNo[0].label
    };
    addDataItem.Id = new Date().getTime();
    this.gridData = [addDataItem, ...this.gridData];
  }

  delete() {
    if (this.selectionKeys.length > 0) {
      this.modalService.confirm({
        nzContent: this.appTranslationService.translate('删除选中的消息规则'),
        nzOnOk: () => {
          this.querydata.DeleteMsgRules(this.selectionKeys).subscribe(result => {
            if (result.Success) {
              this.modalService.success(this.appTranslationService.translate('删除成功'));
              this.queryCommon();
            } else {
              this.modalService.warning(this.appTranslationService.translate('删除失败，' + result.Message));
            }
          });
        },
      });
    } else {
      this.msgSrv.error(this.appTranslationService.translate('没有可用的消息规则'));
    }
  }

  remove(dataItem: any) {
    const deleteIndex = this.gridData.indexOf(dataItem);
    if (deleteIndex > -1) {
      this.gridData.splice(deleteIndex, 1);
    }
    this.gridData = this.clone(this.gridData);
  }

  save() {
    if (this.gridData.length < 1) {
      this.msgSrv.error(this.appTranslationService.translate('没有可用的消息规则'));
      return;
    }
    this.querydata.SaveMsgRules(this.gridData).subscribe(result => {
      if (result !== null && result.Success) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功！'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate('保存失败！' + result.Message));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.querySerive.loadGridView(this.httpAction, { profileId: this.profileId }, this.context);
  }

  selectKeys = 'Id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
}
