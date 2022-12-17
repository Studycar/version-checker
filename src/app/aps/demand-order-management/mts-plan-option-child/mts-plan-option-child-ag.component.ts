import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { MtsPlanOptionChildEditService } from './edit.service';
import { DemandOrderManagementMtsPlanOptionChildEditComponent } from './edit/edit.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-mts-plan-option-child-ag',
  templateUrl: './mts-plan-option-child-ag.component.html',
  providers: [MtsPlanOptionChildEditService],
})
export class DemandOrderManagementMtsPlanOptionChildAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  isLoading = false;
  // 绑定页面的数据来源
  public optionListloadSourceType: any[] = [];
  // 绑定页面的需求来源
  public optionListloadReqType = [];
  p: any = {};
  public pp = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.string }, readonly: true }
    ],
    values: {
      plantCode: ''
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
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
    { field: 'plantCode', headerName: '工厂', width: 70,tooltipField: 'userName', menuTabs: ['filterMenuTab'] },
    {
      field: 'subinventoryCode', headerName: '子库存',width: 100, tooltipField: 'description', menuTabs: ['filterMenuTab']
    },
    {
      field: 'subinventoryDescription', headerName: '子库存描述',width: 220, tooltipField: 'subinventoryDescription', menuTabs: ['filterMenuTab']
    },
    {
      field: 'planFlag', headerName: '是否参与计划',width: 120, tooltipField: 'planFlag', menuTabs: ['filterMenuTab']
    },
    {
      field: 'orderSources', headerName: '订单来源类型',width: 120,
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'sourceCategory', headerName: '需求类型',width: 140,
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    }
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.optionListloadSourceType;
        break;
      case 2:
        options = this.optionListloadReqType;
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
    private msgSrv: NzMessageService,
    public editService: MtsPlanOptionChildEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    // 自动填充列宽
    this.isSizeColumnsToFit = true;
    // this.customFormQueryComponent.showResetButton = false;
    this.gridHeight = 303;
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.pp.values.plantCode = this.p.plantCode;
    this.loadSourceType();
    this.loadReqType();
    // this.clear();
    this.queryCommon();
  }

  loadSourceType(): void {
    this.commonQueryService.GetLookupByType('PP_DM_SOURCE_SYSTEM').subscribe(result => {
      result.Extra.forEach(d => {
        if (d.attribute3 === 'Y') {
          this.optionListloadSourceType.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        }
      });
    });
  }

  // 绑定需求类型
  public loadReqType(): void {
    this.commonQueryService.GetLookupByType('PP_PLN_ORDER_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListloadReqType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  httpAction = { url: this.editService.seachUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.pp.values, this.context);
  }

  public add(item: any) {
    this.modal
      .static(DemandOrderManagementMtsPlanOptionChildEditComponent, {
        i: {
          id: (item !== undefined ? item.id : null),
          plantCode: (item !== undefined ? this.pp.values.plantCode : null)
        },
      }, 'lg'
      )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {

      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    console.log(this.selectionKeys);

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'orderSources', options: this.optionListloadSourceType },
  { field: 'sourceCategory', options: this.optionListloadReqType }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {

    super.export();
    this.commonQueryService.export(this.httpAction, this.pp.values, this.excelexport, this.context);
    //this.commonQueryService.export({ url: this.editService.seachUrl, method: 'POST' }, this.pp.values, this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.p.values, this.excelexport);
  }

  public clear() {
    this.pp.values = {
      plantCode: ''

    };
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
