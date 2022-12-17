import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { RespmanagerService } from '../../../modules/generated_module/services/respmanager-service';
import { BaseResprequestgroupEditComponent } from './edit/edit.component';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators/map';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { CommonInputDto } from '../../../modules/generated_module/dtos/common-input-dto';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-resprequestgroup',
  templateUrl: './resprequestgroup.component.html',
  providers: [QueryService],
})
export class BaseResprequestgroupComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  expandForm = false;
  public languages: any[] = [];
  public applications: any[] = [];
  p: any;
  public queryParamsOption: any;
  public mySelection: any[] = [];
  public queryParams = {
    // defines: [

    //   { field: 'strRequestGroup', title: '请求组', ui: { type: UiType.string } },
    // ],
    // values: {
    requestGroupName: ''
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
    { field: 'requestGroupName', width: 250, headerName: '请求组名称', menuTabs: ['filterMenuTab'] },
    {
      field: 'applicationId', width: 250, headerName: '应用模块',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    }
  ];


  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applications;
        break;
      case 2:
        options = this.languages;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }


  constructor(private http: _HttpClient,
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



  // public onStateChange(state: State) {
  //   this.gridState = state;
  //   this.editService.read();
  // }

  // public application(strcode: string): any {
  //   return this.applications.find(x => x.value === strcode);
  // }
  // public query() {
  //   this.editService.read(this.queryParams);
  // }


  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    // this.queryParams = { StrRespsID: this.p.RESPID, StrLanguage: this.p.LANGUAGE };
    // this.view = this.editService.pipe(
    //   map(data => process(data, this.gridState)),
    // );
    this.loadOptions();
    this.query();

  }
  private loadOptions() {
    /* 应用模块 */
    this.commonQueryService.GetApplicationNew().subscribe(result => {
      result.Extra.forEach(d => {
        this.applications.push({
          label: d.applicationName,
          value: d.id,
        });
      });
      console.log('loadOptions');
      console.log(result.Extra);
      console.log(this.applications);
    });
  }
  httpAction = { url: this.respmanagerService.seachRequestUrl, method: 'POST' };
  public query() {
    super.query();
    this.loadOptions();
    this.queryCommon();
  }
  private queryCommon() {
    this.queryParamsOption = { respId: this.p.respId, requestGroupName: this.queryParams.requestGroupName };
    this.commonQueryService.loadGridViewNew(this.httpAction, this.queryParamsOption, this.context);
  }
  public remove(obj: any) {
    this.respmanagerService.RemoveRespRequestGroup(obj).subscribe(res => {
      this.msgSrv.success('删除成功');
      this.query();
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'applicationId', options: this.applications }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.loadOptions();
    super.export();
    this.queryParamsOption = { respId: this.p.respId, requestGroupName: this.queryParams.requestGroupName };
    this.commonQueryService.exportAction({ url: this.respmanagerService.exportRequestUrl, method: 'POST' }, this.queryParamsOption, this.excelexport, this.context);
  }

  add() {
    this.modal
      .static(
        BaseResprequestgroupEditComponent,
        { i: { respId: this.p.respId, language: this.p.language, id: '0' } },
        'lg',
    )
      .subscribe(() => {
        this.query();
      });
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




