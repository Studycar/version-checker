/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-08-01 17:49:16
 * @LastEditors: Zwh
 * @LastEditTime: 2018-08-01 17:49:16
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ExecutablesManageService } from '../../../modules/generated_module/services/executables-manage-service';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { ConcurrentRequestExecutablesEditComponent } from './edit/edit.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-executables',
  templateUrl: './executables.component.html',
})
export class ConcurrentRequestExecutablesComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  context = this;

  public gridView = {
    data: null,
    total: 0
  };
  params: any = {};
  optionListAppName = [];
  execMethodOptions: any[] = [];
  constructor(
    public pro: BrandService,
    public msg: NzMessageService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private executablesManageService: ExecutablesManageService,
    private apptrans: AppTranslationService,
    private appconfig: AppConfigService,
    private msgSrv: NzMessageService) {
    super({ pro: pro, appTranslationSrv: apptrans, msgSrv: msgSrv, appConfigSrv: appconfig });

    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadMoreAppName();
    this.query();
  }

  public queryParams = {
    defines: [
      { field: 'EXECUTABLE_NAME', title: '执行简称', ui: { type: UiType.text } },
      { field: 'EXECUTION_FILE_NAME', title: '执行程序名称', ui: { type: UiType.text } },
      { field: 'APPLICATION_ID', title: '应用模块', ui: { type: UiType.select, options: this.optionListAppName } }
    ],
    values: {
      EXECUTABLE_NAME: '',
      EXECUTION_FILE_NAME: '',
      APPLICATION_ID: null
    }
  };

  public columns22 = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'applicationName', headerName: '应用模块', width: 120, menuTabs: ['filterMenuTab'] },
    {
      field: 'executableName', headerName: '执行简称', width: 230, tooltipField: 'EXECUTABLE_NAME', menuTabs: ['filterMenuTab']
    },
    { field: 'description', headerName: '描述', width: 210, tooltipField: 'DESCRIPTION', menuTabs: ['filterMenuTab'] },
    { field: 'executionMethodCode', headerName: '执行方法', width: 180, tooltipField: 'EXECUTION_METHOD_CODE', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    { field: 'executionFileName', headerName: '执行程序名称', width: 270, tooltipField: 'EXECUTION_FILE_NAME', menuTabs: ['filterMenuTab'] }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 2:
        options = this.execMethodOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  query() {
    this.loadItem();
  }

  getQueryParams() {
    return {
      applicationId: this.queryParams.values.APPLICATION_ID,
      executableName: this.queryParams.values.EXECUTABLE_NAME,
      executionFileName: this.queryParams.values.EXECUTION_FILE_NAME,
      description: '',
      executionMethodCode: '',
    };
  }

  loadItem() {
    /*this.params.executable_name = this.queryParams.values.EXECUTABLE_NAME;
    this.params.execution_file_name = this.queryParams.values.EXECUTION_FILE_NAME;
    this.params.APPLICATION_ID = this.queryParams.values.APPLICATION_ID;
    console.log(this.params);*/
    this.executablesManageService.QueryByPage(this.getQueryParams()).subscribe(result => {
      this.gridView = {
        data: result.data,
        total: result.data.length
      };
    });

    this.execMethodOptions.push({
      label: 'Dynamic Link Library',
      value: 'D'
    }, {
        label: 'Host',
        value: 'H'
      }, {
        label: 'PL/SQL Procedure',
        value: 'I'
      }, {
        label: 'WebService',
        value: 'W'
      }, {
        label: 'Request Set',
        value: 'R'
      });
  }

  add() {
    const param = {
      IsRefresh: false,
      operType: '新增',
      i: {}
    };
    this.modal
      .static(ConcurrentRequestExecutablesEditComponent, { param: param })
      .subscribe(() => {
        if (param.IsRefresh) {
          this.loadItem();
        }
      });
  }

  edit(record: any) {
    const param = {
      IsRefresh: false,
      operType: '编辑',
      i: record
    };
    this.modal.static(ConcurrentRequestExecutablesEditComponent, { param: param })
      .subscribe(() => {
        if (param.IsRefresh) {
          this.loadItem();
        }
      });

  }

  Delete(obj: any) {
    this.executablesManageService.Delete(obj.id).subscribe(res => {
      if (res.code === 200) {
        this.msg.success('删除成功');
        this.loadItem();
      } else {
        this.msg.error(res.msg);
      }
    });
  }

  loadMoreAppName(): void {
    this.executablesManageService.GetBaseApplication().subscribe(
      result => {
        result.data.forEach(d => {
          this.optionListAppName.push({
            label: d.applicationName,
            value: d.applicationId,
          });
        });
      });
  }

 /* // 排序事件
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridView = {
      data: orderBy(this.gridView.data, sort),
      total: this.gridView.total
    };
  }*/

  clear() {
    this.queryParams.values.EXECUTABLE_NAME = null;
    this.queryParams.values.EXECUTION_FILE_NAME = null;
    this.queryParams.values.APPLICATION_ID = null;
  }

  /*getExecMethodName(execMethodCode: string): string {
    let execMethodName;
    switch (execMethodCode) {
      case 'D': execMethodName = 'Dynamic Link Library'; break;
      case 'H': execMethodName = 'Host'; break;
      case 'I': execMethodName = 'PL/SQL Procedure'; break;
      case 'W': execMethodName = 'WebService'; break;
      case 'R': execMethodName = 'Request Set'; break;
    }
    return execMethodName;
  }*/

  expColumns = [
    { title: '应用模块', field: 'applicationName', width: 100, locked: true },
    { title: '执行简称', field: 'executableName', width: 100, locked: true },
    { title: '描述', field: 'description', width: 100, locked: false },
    { title: '执行方法', field: 'executionMethodCode', width: 100, locked: false },
    { title: '执行程序名称', field: 'executionFileName', width: 100, locked: false }
  ];
  expColumnsOptions = [
    { field: 'executionMethodCode', options: this.execMethodOptions }
  ];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    /*this.params.executable_name = this.queryParams.values.EXECUTABLE_NAME || '';
    this.params.execution_file_name = this.queryParams.values.EXECUTION_FILE_NAME || '';
    this.params.APPLICATION_ID = this.queryParams.values.APPLICATION_ID || '';*/
    this.executablesManageService.Query(this.getQueryParams()).subscribe(result => {
      this.excelexport.export(result.data);
    });
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.loadItem();
    this.setLoading(false);
  }
}
