/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:05
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-02 16:10:08
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './viewservice';
import { getDate } from 'date-fns';
import { BaseBaseparameterViewEditComponent } from './../view-edit/view-edit.component';
import { BaseParameterService } from '../../../../modules/generated_module/services/base-parameter-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-baseparameter-view',
  templateUrl: './view.component.html',
  providers: [QueryService]
})
export class BaseBaseparameterViewComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  record: any = {};
  j: any;
  title: String = '明细';
  context = this;
  public gridView: GridDataResult;
  public gridData: any[] = [];
  public pageSize = 10;
  public skip = 0;
  public mySelection: any[] = [];
  public applicationOptions: any[] = [];
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 20,
  };
  public datenow: any;
  public mydate: any;
  public cachesave = {
    PARAMETER_ID: '',
    SYS_ENABLED_FLAG: '',
    USER_ENABLED_FLAG: '',
    REG_ENABLED_FLAG: '',
    RESP_ENABLED_FLAG: '',
    PLANT_ENABLED_FLAG: ''
  };
  public s: any;
  public list: any[] = [];
  public queryParams = {
    parameterId: '',
    language: ''
  };

  k: any;
  YesOrNo: any[] = [];

  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private viewservice: QueryService,
    private ParameterService: BaseParameterService,
    public translateservice: AppTranslationService,
    public appService: AppConfigService,
    private commonquery: CommonQueryService
  ) {
    super({ appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 303;
  }
  expColumns = [
    { field: 'parameterValue', title: '参数值', width: 200, locked: true },
    { field: 'levelText', title: '参数级别', width: 200, locked: true },
    { field: 'linkText', title: 'LINK', width: 200, locked: true }
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.viewservice.exportAction(
      this.httpAction,
      this.queryParams,
      this.excelexport
    );
  }

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 100,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'parameterValue', headerName: '参数值', menuTabs: ['filterMenuTab'] },
    { field: 'levelText', headerName: '参数级别', tooltipField: 'levelText', menuTabs: ['filterMenuTab'] },
    {
      field: 'linkText', headerName: 'LINK', menuTabs: ['filterMenuTab']
    }
  ];

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.queryParams = {
      parameterId: this.j.Id,
      language: this.j.language
    };
    this.query();
    this.loadData();
  }

  private loadData() {
    this.commonquery.GetLookupByTypeLang('FND_PARAMETER_LEVEL', this.appService.getLanguage()).subscribe(res => {
        res.Extra.forEach(element => {
          this.YesOrNo.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });

        this.ParameterService.GetById(this.j.Id, this.j.language).subscribe(res1 => {
          this.cachesave.SYS_ENABLED_FLAG = res1.data.sysEnabledFlag;
          this.cachesave.REG_ENABLED_FLAG = res1.data.regEnabledFlag;
          this.cachesave.RESP_ENABLED_FLAG = res1.data.respEnabledFlag;
          this.cachesave.USER_ENABLED_FLAG = res1.data.userEnabledFlag;
          this.cachesave.PLANT_ENABLED_FLAG = res1.data.plantEnabledFlag;
          this.cachesave.PARAMETER_ID = res1.data.id;
          // this.cachesave.PARAMETER_ID = res.Extra.ID;
          this.pro();
        });
      });
  }

  public remove(item: any) {
    this.ParameterService.Remove1(item.parameterValueId).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  private httpAction = {
    url: this.ParameterService.seachUrlfordetail,
    method: 'GET'
  };

  query() {
    this.viewservice.loadGridViewNew(this.httpAction, this.queryParams, this.context);
  }

  add(item?: any) {
    this.modal
      .static(
      BaseBaseparameterViewEditComponent,
      { m: { parameterId: this.cachesave.PARAMETER_ID, parameterValueId: (item !== undefined ? item.parameterValueId : null), list: this.list, language: this.j.language } },
      'lg',
    )
      .subscribe(
      (value) => {
        if (value) {
          this.query();
        }
      }
      );
  }

  /**jianl注释，不知道谁做的，写死了，暂时没有很好的思路解决；
   * 这里的值应该与快码 FND_PARAMETER_LEVEL 的值保持一致 */
  pro() {
    if (this.cachesave.SYS_ENABLED_FLAG === 'Y') {
      this.list.push({ label: this.YesOrNo.find(s => s.value === '1').label, value: 1 });
    }
    if (this.cachesave.REG_ENABLED_FLAG === 'Y') {
      this.list.push({ label: this.YesOrNo.find(s => s.value === '2').label, value: 2 });
    }
    if (this.cachesave.RESP_ENABLED_FLAG === 'Y') {
      this.list.push({ label: this.YesOrNo.find(s => s.value === '4').label, value: 4 });
    }
    if (this.cachesave.USER_ENABLED_FLAG === 'Y') {
      this.list.push({ label: this.YesOrNo.find(s => s.value === '5').label, value: 5 });
    }
    if (this.cachesave.PLANT_ENABLED_FLAG === 'Y') {
      this.list.push({ label: this.YesOrNo.find(s => s.value === '3').label, value: 3 });
    }
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
