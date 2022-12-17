import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ConcurrentRequestConcurrentProgramParameterEditComponent } from './edit/edit.component';
import { ConcurrentProgramManageService } from '../../../modules/generated_module/services/concurrent-program-manage-service';
import { NzMessageService } from '../../../../../node_modules/ng-zorro-antd';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-program-parameter',
  templateUrl: './concurrent-program-parameter.component.html',
})
export class ConcurrentRequestConcurrentProgramParameterComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public gridView: GridDataResult = {
    data: [],
    total: 0,
  };
  i: any = {};
  parentLoadData: Function;
  parameterArray: any = [];
  context = this;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msg: NzMessageService,
    private concurrentProgramManageService: ConcurrentProgramManageService,
    private apptrans: AppTranslationService,
    private msgSrv: NzMessageService,
    private appconfig: AppConfigService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: apptrans,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.gridHeight = 270;
    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
  }

  query() {
    super.query();
    this.loadData();
  }

  loadData() {
    this.concurrentProgramManageService.GetParameter(this.i.concurrentProgramId, this._pageNo, this._pageSize).subscribe(result => {
      this.gridView = {
        data: result.data.content,
        total: result.data.totalElements,
      };
      this.parameterArray = [];
      result.data.content.forEach(d => {
        this.parameterArray.push({
          label: d.endUserColumnName,
          value: d.endUserColumnName,
        });
      });
    });
  }

  add() {
    const param = {
      operType: '新增',
      i: {
        id: null,
        concurrentProgramId: this.i.concurrentProgramId,
      },
    };
    this.modal
      .static(ConcurrentRequestConcurrentProgramParameterEditComponent, {
        param: param,
      })
      .subscribe(() => this.query());
  }

  edit(record: any) {
    record.concurrentProgramId = this.i.concurrentProgramId;
    const param = {
      operType: '编辑',
      i: record,
    };
    this.modal
      .static(
        ConcurrentRequestConcurrentProgramParameterEditComponent,
        { param: param },
        'lg',
      )
      .subscribe(() => {
        this.query();
      });
  }

  save() {
    this.concurrentProgramManageService.UpdateConflictParameter(
        this.i.concurrentProgramId,
        this.i.conflictParameter,
      )
      .subscribe(res => {
        if (res.code === 200) {
          this.msg.success('保存成功');
          this.parentLoadData();
        } else {
          this.msg.error(res.msg);
        }
      });
  }

  Delete(obj: any) {
    this.concurrentProgramManageService.DeleteParameter([obj.id]).subscribe(res => {
      if (res.code === 200) {
        this.msg.success('删除成功');
        this.query();
      } else {
        this.msg.success(res.msg);
      }
    });
  }

  public columns22 = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      field: 'columnSeqNum',
      headerName: '序号',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'endUserColumnName',
      headerName: '参数',
      width: 120,
      tooltipField: 'endUserColumnName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'description',
      headerName: '参数描述',
      tooltipField: 'description',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enabledFlag',
      headerName: '有效',
      valueFormatter:  function(params) {
        return params.value === 'Y' ? '是' : '否';
      },
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'confictFlag',
      headerName: '互斥',
      valueFormatter:  function(params) {
        return params.value === 'Y' ? '是' : '否';
      },
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'flexValueSetName',
      headerName: '值集',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'defaultType',
      headerName: '默认值类型',
      valueFormatter:  function(params) {
        return params.value === 'S' ? 'SQL Statement' : 'CONSTANT';
      },
      width: 110,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'defaultValue',
      headerName: '默认值',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'requiredFlag',
      headerName: '必须',
      valueFormatter: function(params) {
        return params.value === 'Y' ? '是' : '否';
      },
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rangeCode',
      headerName: '范围',
      valueFormatter: function(params) {
        return params.value === 'L' ? 'Low' : 'High';
      },
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'displayFlag',
      headerName: '显示',
      width: 80,
      valueFormatter:  function(params) {
        return params.value === 'Y' ? '是' : '否';
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'displaySize',
      headerName: '显示大小',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'maximumDescriptionLen',
      headerName: '说明大小',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'userPromptName',
      headerName: '提示',
      width: 120,
      menuTabs: ['filterMenuTab'],
    }
  ];

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
      this.query();
    } else {
      this.setLoading(false);
    }
  }
}
