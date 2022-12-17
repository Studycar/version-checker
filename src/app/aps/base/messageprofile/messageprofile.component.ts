import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BaseMessageprofileEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { MessageProfileService } from 'app/modules/generated_module/services/message-profile-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BaseMessageRuleEditComponent } from './rule-edit/rule-edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-messageprofile',
  templateUrl: './messageprofile.component.html',
  providers: [QueryService]
})
export class BaseMessageprofileComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  msgTypeOptions: any[] = [];
  msgLevelOptions: any[] = [];
  msgRoleOptions: any[] = [];
  context = this;

  public queryParams = {
    defines: [
      { field: 'MESSGAE_TYPE', title: '类型', ui: { type: UiType.select, options: this.msgTypeOptions } },
      { field: 'TITLE', title: '标题', ui: { type: UiType.text } }
    ],
    values: {
      MESSGAE_TYPE: '',
      TITLE: ''
    }
  };

  httpAction = {
    url: this.querydata.url,
    method: 'POST'
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,      // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
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
      field: 'MESSGAE_TYPE', headerName: '消息类型', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label', width: 100
    },
    { field: 'TITLE', headerName: '标题', menuTabs: ['filterMenuTab'], tooltipField: 'TITLE', width: 180 },
    {
      field: 'MSG_LEVEL', headerName: '层级', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,2).label', width: 80
    },
    { field: 'VALUVE', headerName: '值', tooltipField: 'DESCRIPTIONS_CN', menuTabs: ['filterMenuTab'], width: 60 },
    {
      field: 'MSG_ROLE', headerName: '角色(接收？)', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,3).label', width: 120
    },
    { field: 'RECEIVER', headerName: '接收人', menuTabs: ['filterMenuTab'], width: 80 },
    { field: 'MSG_FORMAT', headerName: '消息格式', menuTabs: ['filterMenuTab'], width: 250 },
    { field: 'ENABLED', headerName: '是否启用', menuTabs: ['filterMenuTab'], width: 100 }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.msgTypeOptions;
        break;
      case 2:
        options = this.msgLevelOptions;
        break;
      case 3:
        options = this.msgRoleOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
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

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.LoadData();
    this.query();
  }

  LoadData() {
    this.querydata.GetMessageType().subscribe(result => {
      this.msgTypeOptions.length = 0;
      if (result.Success) {
        result.Extra.forEach(element => {
          this.msgTypeOptions.push({ value: element.Key, label: element.Value });
        });
      }
    });

    this.querydata.GetMSGLEVEL().subscribe(result => {
      this.msgLevelOptions.length = 0;
      if (result.Success) {
        result.Extra.forEach(element => {
          this.msgLevelOptions.push({ value: element.Key, label: element.Value });
        });
      }
    });

    this.querydata.GetMSGROLE().subscribe(result => {
      this.msgRoleOptions.length = 0;
      if (result.Success) {
        result.Extra.forEach(element => {
          this.msgRoleOptions.push({ value: element.Key, label: element.Value });
        });
      }
    });
  }

  add(item?: any) {
    this.modal
      .static(
        BaseMessageprofileEditComponent,
        { i: { Id: (item !== undefined ? item.Id : null) } },
        'lg'
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  query() {
    super.query();
    this.queryCommon();
  }

  GetqueryParams() {
    return {
      MESSGAE_TYPE: this.queryParams.values.MESSGAE_TYPE,
      TITLE: this.queryParams.values.TITLE,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

  queryCommon() {
    this.querySerive.loadGridView(this.httpAction, this.GetqueryParams(), this.context);
  }

  clear() {
    this.queryParams.values = {
      MESSGAE_TYPE: null,
      TITLE: ''
    };
  }

  httExportAction = {
    url: this.querydata.exportUrl,
    method: 'POST'
  };

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.querySerive.export(this.httExportAction, this.queryParams.values, this.excelexport);
  }

  selectKeys = 'Id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  remove(value: any) {
    this.querydata.Delete(value.Id).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  msgRuleDetail(dataItem: any) {
    this.modal.static(BaseMessageRuleEditComponent, { profileId: dataItem.Id }, 'lg').subscribe();
  }
}
