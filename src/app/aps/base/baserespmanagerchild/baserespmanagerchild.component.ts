import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { RespmanagerService } from '../../../modules/generated_module/services/respmanager-service';
import { BaseBaserespmanagerchildEditComponent } from './edit/edit.component';
import { BaseResprequestgroupComponent } from '../resprequestgroup/resprequestgroup.component';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { CommonInputDto } from '../../../modules/generated_module/dtos/common-input-dto';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-baserespmanagerchild',
  templateUrl: './baserespmanagerchild.component.html',
  providers: [QueryService]
})
export class BaseBaserespmanagerchildComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  params: any = {};
  expandForm = false;
  p: any;
  public queryParamsOption: any;
  public menugroupids: any[] = [];
  public languageOptions: any[] = [];
  public applicationOptions: any[] = [];
  public selectBy = 'menuGroupId';
  public queryParams = {

    selectMenuGroupId: this.menugroupids
  };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    { field: 'respsName', width: 150, headerName: '职责名称', menuTabs: ['filterMenuTab'] },
    { field: 'menuGroupName', width: 150, headerName: '菜单组', menuTabs: ['filterMenuTab'] },
    {
      field: 'applicationCode', width: 150, headerName: '应用模块',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },

    { field: 'startDate', width: 170, headerName: '生效日期', menuTabs: ['filterMenuTab'] },
    { field: 'endDate', width: 170, headerName: '失效日期', menuTabs: ['filterMenuTab'] },
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
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private respmanagerService: RespmanagerService,
    private messageManageService: MessageManageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public pro: BrandService,
    private appConfigService: AppConfigService,
    private queryService: CommonQueryService,
    public commonQueryService: QueryService

  )
  // tslint:disable-next-line:one-line
  {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 265;
  }
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.clear();
    this.loadOptions();
    this.query();
  }

  private loadOptions() {
    this.respmanagerService.GetMenuGroupOption(this.p.language).subscribe(result => {
      this.menugroupids.length = 0;
      result.data.forEach(d => {
        this.menugroupids.push({
          label: d.menuGroupName,
          value: d.id,
        });
      });
    });

    this.commonQueryService.GetApplicationNew().subscribe(result => {
      this.applicationOptions.length = 0;
      result.Extra.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationName,
          value: d.applicationCode,
        });
      });
    });
  }
  httpAction = { url: this.respmanagerService.seachChildUrl, method: 'POST' };
  public query() {
    super.query();
    this.loadOptions();
    this.queryCommon();
  }
  private queryCommon() {
    //this.queryParamsOption = { respId: this.p.respId, menuId: this.queryParams.selectMenuGroupId, language: this.p.language };
    this.queryParamsOption = { respId: this.p.respId, menuId: (this.queryParams.selectMenuGroupId.length !== 0 ? this.queryParams.selectMenuGroupId : null), language: this.p.language };
    //console.log('kkkkkkkkkkkkkkkkkkmenuId:' + this.queryParams.selectMenuGroupId);

    this.commonQueryService.loadGridViewNew(this.httpAction, this.queryParamsOption, this.context);
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'applicationCode', options: this.applicationOptions }, { field: 'language', options: this.languageOptions }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.loadOptions();
    super.export();
    this.queryParamsOption = { respId: this.p.respId, menuGroupId: this.queryParams.selectMenuGroupId, language: this.p.language };
    this.commonQueryService.exportAction({ url: this.respmanagerService.exportChildUrl, method: 'POST' }, this.queryParamsOption, this.excelexport, this.context);
  }

  add() {
    this.modal
      .static(
        BaseBaserespmanagerchildEditComponent,
        { i: { respsName: this.p.respsName, respId: this.p.respId, language: this.p.language, NEWFLAG: 'Y', menugroupids: this.menugroupids } },
        'lg',
    )
      .subscribe(() => {
        this.query();
      });
  }

  remove(item: any) {
    item.id = item.id;
    this.respmanagerService.Remove(item).subscribe(res => {
      this.msgSrv.success('删除成功');
      this.query();
    });
  }

  public modifyda(item: any) {
    this.modal
      .static(
        BaseBaserespmanagerchildEditComponent,
        { i: { id: (item !== undefined ? item.id : null), menuGroupId: (item !== undefined ? item.menuGroupId : null), respID: (item !== undefined ? item.respID : null), respsName: (item !== undefined ? item.respsName : null), startDate: (item !== undefined ? item.startDate : null), endDate: (item !== undefined ? item.endDate : null), NEWFLAG: 'N', menugroupids: this.menugroupids } },
        'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public clear() {
    this.queryParams.selectMenuGroupId = [];
  }
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}


