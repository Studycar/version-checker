/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:08:57
 * @LastEditors: Zwh
 * @LastEditTime: 2019-08-27 19:59:42
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { MtsPlanOptionEditService } from './edit.service';
import { DemandOrderManagementMtsPlanOptionEditComponent } from './edit/edit.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { DemandOrderManagementMtsPlanOptionChildAgComponent } from '../mts-plan-option-child/mts-plan-option-child-ag.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-mts-plan-option-ag',
  templateUrl: './mts-plan-option-ag.component.html',
  providers: [MtsPlanOptionEditService],
})
export class DemandOrderManagementMtsPlanOptionAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public optionListPlant: any[] = [];
  public optionLType: any[] = [];
  // 绑定页面的数据来源分类
  public optionListloadsourceCategory: Set<any> = new Set();
  // 绑定页面的转换来源
  public optionListloadConvert = [];
  // 绑定页面的需求来源
  public optionListloadReqType = [];
  // 绑定页面的数据收集参数
  public optionListloadCollection = [];
  isLoading = false;
  public queryParams = {
    defines: [

      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.optionListPlant } },
      { field: 'sourceType', title: '类型', ui: { type: UiType.select, options: this.optionLType, ngModelChange: this.onChangeSourceType } },
      { field: 'sourceCategory', title: '来源分类', ui: { type: UiType.select, options: this.optionListloadsourceCategory } },
    ],
    values: {
      plantCode: '',
      sourceType: '',
      sourceCategory: ''
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
    { field: 'plantCode', headerName: '工厂', tooltipField: 'plantCode', menuTabs: ['filterMenuTab'] },
    {
      field: 'sourceType', headerName: '类型', tooltipField: 'sourceType', menuTabs: ['filterMenuTab']
    },
    {
      field: 'sourceCategory', headerName: '来源分类', tooltipField: 'sourceCategory', menuTabs: ['filterMenuTab']
    },
    {
      field: 'commentary', headerName: '说明', tooltipField: 'commentary', menuTabs: ['filterMenuTab']
    },
    {
      field: 'prospectPeriod', headerName: '展望期', tooltipField: 'prospectPeriod', menuTabs: ['filterMenuTab']
    },
    {
      field: 'priority', headerName: '优先级', tooltipField: 'priority', menuTabs: ['filterMenuTab']
    },
    {
      field: 'convertOrderSources', headerName: '转换来源',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'reqType', headerName: '需求类型',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']

    },
    {
      field: 'dataCollectionParameters', headerName: '数据收集参数',
      valueFormatter: 'ctx.optionsFind(value,3).label', menuTabs: ['filterMenuTab']
    }
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.optionListloadConvert;
        break;
      case 2:
        options = this.optionListloadReqType;
        break;
      case 3:
        options = this.optionListloadCollection;
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
    public editService: MtsPlanOptionEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    // 自动填充列宽
    this.isSizeColumnsToFit = true;
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadType();
    this.loadplant();
    this.loadConvert();
    this.loadReqType();
    this.loadCollecton();
    this.clear();
    this.queryCommon();
  }

  loadType(): void {
    this.optionLType.push(
      {
        label: '需求',
        value: '需求',
      },
      {
        label: '供应',
        value: '供应',
      }
    );
  }

  loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
      this.queryParams.values.plantCode = this.appConfigService.getPlantCode();
    });
  }

  // 绑定需求来源
  public loadSource(): void {

    this.optionListloadsourceCategory.clear();
    if (this.queryParams.values.sourceType === '需求') {
      this.commonQueryService.GetLookupByType('PP_DM_SOURCE_SYSTEM').subscribe(result => {
        result.Extra.forEach(d => {
          if (d.attribute3 === 'Y') {
            this.optionListloadsourceCategory.add({
              label: d.meaning,
              value: d.lookupCode,
            });
          }
        });
      });
    }
    if (this.queryParams.values.sourceType === '供应') {
      this.commonQueryService.GetLookupByType('PP_MTS_SUPPLY_SOURCE_CATEGORY').subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListloadsourceCategory.add({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
    }
  }
  // 绑定转换订单来源
  public loadConvert(): void {
    this.commonQueryService.GetLookupByType('PP_DM_SOURCE_SYSTEM').subscribe(result => {
      result.Extra.forEach(d => {
        if (d.attribute3 === 'Y') {
          this.optionListloadConvert.push({
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
  // 绑定数据收集参数
  public loadCollecton(): void {
    this.commonQueryService.GetLookupByType('PP_MTS_DATA_COLLECTION_PARAMETER').subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListloadCollection.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  // 类型 值更新事件 重新绑来源分类
  onChangeSourceType(value: string): void {
    /** 重新绑定  物料*/
    this.loadSource();
  }

  httpAction = { url: this.editService.seachUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private cloneParam(): any {
    const dto = {
      plantCode: this.queryParams.values.plantCode ? this.queryParams.values.plantCode : this.appConfigService.getPlantCode(),      
      sourceType: this.queryParams.values.sourceType,
      sourceCategory: this.queryParams.values.sourceCategory     
    };
    return dto;
  }
  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.cloneParam(), this.context);
  }

  public add(item: any) {
    this.modal
      .static(DemandOrderManagementMtsPlanOptionEditComponent, {
        i: { id: (item !== undefined ? item.id : null) },
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

  // 弹出明细 分配窗口
  public detailHandler(item: any) {
    this.modal
      .static(DemandOrderManagementMtsPlanOptionChildAgComponent, {
        p: {
          id: item.id, // ID
          plantCode: item.plantCode
        }
      }, 'lg')
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'convertOrderSources', options: this.optionListloadConvert },
  { field: 'reqType', options: this.optionListloadReqType },
  { field: 'dataCollectionParameters', options: this.optionListloadCollection }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport, this.context);
    //this.commonQueryService.export({ url: this.editService.seachUrl, method: 'POST' }, this.queryParams.values, this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }

  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      sourceType: null,
      sourceCategory: null
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
