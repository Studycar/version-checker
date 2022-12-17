import { Component, OnInit } from '@angular/core';
import { BaseBillNoRuleService } from './base-bill-no-rule-service.service';
import { BaseBillNoRuleDto } from './dtos/base-bill-no-rule-dto';
import { BaseBillNoRuleEditComponent } from './edit/edit.component';
import { ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { BaseBillNoRecordViewComponent } from './view/bill-no-record-view/bill-no-record-view.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from './query.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bill-no-rule-ag',
  templateUrl: './bill-no-rule-ag.component.html',
  styleUrls: ['./bill-no-rule-ag.component.css'],
  providers: [BaseBillNoRuleService, QueryService],
})
export class BaseBillNoRuleAgComponent extends CustomBaseContext implements OnInit {
  columns = [
    {
      colId: 1,
      cellClass: '',
      field: '',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: { template: this.headerTemplate },
    },
    {
      field: 'code',
      headerName: '规则编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'name',
      headerName: '规则名称',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'prefix',
      headerName: '前缀',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'dateFormat',
      headerName: '格式',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'noDigits',
      headerName: '流水位数',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'codeFormat',
      headerName: '编码格式',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'examples',
      headerName: '示例',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'sort',
      headerName: '排序',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'active',
      headerName: '启用',
      valueFormatter: 'ctx.valueFormatter(value)',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'attribute1',
      headerName: '是否被删除',
      valueFormatter: 'ctx.valueFormatter2(value)',
      menuTabs: ['filterMenuTab'],
    },
  ];

  private curBillNoRule: BaseBillNoRuleDto;

  billNoRuleList: Array<BaseBillNoRuleDto> = [];

  constructor(
    public pro: BrandService,
    private appConfigService: AppConfigService,
    public commonQueryService: QueryService,
    private billNoRuleService: BaseBillNoRuleService,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public translateservice: AppTranslationService,
    public modalService: NzModalService,
    private appGridStateService: AppGridStateService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: translateservice,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.selectableSettings.mode = 'single';
    this.gridOptions.rowSelection = 'single';
    this.GetRules();
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      this.gridApi.sizeColumnsToFit();
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('pcbuyer');
  }

  Save(addFlag: boolean) {
    this.curBillNoRule = this.billNoRuleList.find(
      rule => rule.id === this.selectionKeys[0],
    );
    if (addFlag) {
      this.curBillNoRule = new BaseBillNoRuleDto();
    } else if (this.curBillNoRule == null) {
      this.msgSrv.error(this.translateservice.translate('请选择要修改的数据'));
      return;
    }

    this.modal
      .static(BaseBillNoRuleEditComponent, {
        curBillNoRule: JSON.parse(JSON.stringify(this.curBillNoRule)),
      })
      .subscribe(value => {
        if (value) {
          this.GetRules();
        }
      });
  }

  Delete() {
    this.curBillNoRule = this.billNoRuleList.find(
      rule => rule.id === this.selectionKeys[0],
    );
    if (this.curBillNoRule == null) {
      this.msgSrv.error(this.translateservice.translate('请选择要删除的数据'));
      return;
    } else {
      this.modalService.confirm({
        nzContent: this.translateservice.translate('确定要删除吗？'),
        nzOnOk: () => {
          this.billNoRuleService
            .Delete(this.curBillNoRule.id)
            .subscribe(res => {
              if (res.code === 200) {
                this.msgSrv.success('删除成功');
                this.GetRules();
              } else {
                this.msgSrv.error(res.msg);
              }
            });
        },
      });
    }
  }

  GetRules() {
    const httpAction = {
      url: '/api/admin/basebillnorule/getRules',
      method: 'GET',
    };
    this.curBillNoRule = null;
    this.selectionKeys = [];
    this.commonQueryService.loadGridViewNew(httpAction, {}, this.context);
    this.billNoRuleService.GetRules().subscribe(result => {
      this.billNoRuleList = result.data.content;
    });
  }

  GetRecords() {
    this.curBillNoRule = this.billNoRuleList.find(
      rule => rule.id === this.selectionKeys[0],
    );
    if (this.curBillNoRule == null) {
      this.msgSrv.error(this.translateservice.translate('请选择工单生成规则'));
      return;
    }
    this.modal
      .static(BaseBillNoRecordViewComponent, { ruleId: this.curBillNoRule.id })
      .subscribe();
  }

  GetBillNoRule() {
    this.curBillNoRule = this.billNoRuleList.find(
      rule => rule.id === this.selectionKeys[0],
    );
    if (this.curBillNoRule == null) {
      this.msgSrv.error(this.translateservice.translate('请选择工单生成规则'));
      return;
    }
    if (!this.curBillNoRule.active) {
      this.msgSrv.error(this.translateservice.translate('该规则没有启用'));
      return;
    }
    this.billNoRuleService
      .GetBillNoRule(this.curBillNoRule.code)
      .subscribe(res => {
        this.msgSrv.success(res.data);
      });
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys('id');
    this.curBillNoRule = this.billNoRuleList.find(
      rule => rule.id === this.selectionKeys[0],
    );
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  public valueFormatter(value): any {
    console.log(value);
    if (value) {
      return '是';
    } else {
      return '否';
    }
  }

  public valueFormatter2(value): any {
    console.log(value);
    if (value === 'Del') {
      return '是';
    } else {
      return '否';
    }
  }
}
