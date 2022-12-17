import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { QueryService } from './query.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { PlantModelItemRelationEditComponent } from './edit/edit.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
/**
 * 跟单件提前期
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-item-relation-ag',
  templateUrl: './item-relation-ag.component.html',
  providers: [QueryService]
})
export class PlantModelItemRelationAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public upPlantOptions: any[] = [];
  public downPlantOptions: any[] = [];
  public categoryOptions: any[] = [];
  public enableOptions: any[] = [];
  public relationOptions: any[] = [];
  public queryParams = {
    defines: [
      { field: 'DOWNSTREAM_PLANT_CODE', title: '组织(父项)', ui: { type: UiType.select, options: this.downPlantOptions } },
      { field: 'DOWNSTREAM_VALUES', title: '类别/计划组/物料(父项)', ui: { type: UiType.string } },
      { field: 'UPSTREAM_PLANT_CODE', title: '组织(子项)', ui: { type: UiType.select, options: this.upPlantOptions } },
      { field: 'UPSTREAM_VALUES', title: '类别/计划组/物料(子项)', ui: { type: UiType.string } }
    ],
    values: {
      DOWNSTREAM_PLANT_CODE: this.appConfigService.getPlantCode(),
      DOWNSTREAM_VALUES: '',
      UPSTREAM_PLANT_CODE: this.appConfigService.getPlantCode(),
      UPSTREAM_VALUES: '',
    }
  };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 70, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate:  null,        // Complementing the Cell Renderer parameters
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
      field: 'category', headerName: '类别', width: 120,
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    { field: 'downstreamPlantCode', headerName: '组织(父项)', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'downstreamValuesCode', headerName: '类别/计划组/物料(父项)', width: 200, menuTabs: ['filterMenuTab'] },
    { field: 'upstreamPlantCode', headerName: '组织(子项)', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'upstreamValuesCode', headerName: '类别/计划组/物料(子项)', width: 200, menuTabs: ['filterMenuTab'] },
    {
      field: 'relationType', headerName: '相关性', width: 100,
      valueFormatter: 'ctx.optionsFind(value,3).label', menuTabs: ['filterMenuTab'],
      tooltipValueGetter: (params) => {
        let option = this.relationOptions.find(x => x.value === params.value);
        if (this.isNull(option)) {
          option = { value: params.value, label: params.value, description: params.value };
        }
        return option.description;
      },
    },
    { field: 'leadTime', headerName: '提前小时', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'earliestLeadDays', headerName: '最早提前小时', width: 100, menuTabs: ['filterMenuTab'] },
    {
      field: 'enabledFlag', headerName: '是否有效', width: 100,
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    }
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private messageManageService: MessageManageService,
    public commonQueryService: QueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.commonQueryService.GetLookupByTypeNew('FND_YES_NO').subscribe(result => {
      result.data.forEach(d => {
        this.enableOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonQueryService.GetLookupByTypeNew('PS_DIMENSION').subscribe(result => {
      result.data.forEach(d => {
        this.categoryOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.commonQueryService.GetAllPlant().subscribe(result => {
      result.data.forEach(d => {
        this.upPlantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
        this.downPlantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });

    // 相关性 PS_OPERATION_RELATION_TYPE
    this.commonQueryService.getCode('PS_OP_RELATION_TYPE','zh-CN').subscribe(res => {
      res.data.forEach(item => {
        this.relationOptions.push({
          label: item.meaning,
          value: item.lookupCode,
          description: item.description,
        });
      });
    });
    this.queryCommon();
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.categoryOptions;
        break;
      case 2:
        options = this.enableOptions;
        break;
      case 3:
        options = this.relationOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public clear() {
    this.queryParams.values = {
      DOWNSTREAM_PLANT_CODE: this.appConfigService.getPlantCode(),
      DOWNSTREAM_VALUES: '',
      UPSTREAM_PLANT_CODE: this.appConfigService.getPlantCode(),
      UPSTREAM_VALUES: '',
    };
  }

  httpAction = { url: this.commonQueryService.queryUrl, method: 'GET' };
  public query() {
    super.query();
    this.queryCommon();
  }
  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParams(), this.context);
  }

  getQueryParams() {
    return {
      upstreamPlantCode: this.queryParams.values.UPSTREAM_PLANT_CODE,
      upstreamValues: this.queryParams.values.UPSTREAM_VALUES,
      downstreamPlantCode: this.queryParams.values.DOWNSTREAM_PLANT_CODE,
      downstreamValues: this.queryParams.values.DOWNSTREAM_VALUES,
    };
  }

  public add(item?: any) {
    this.modal
      .static(PlantModelItemRelationEditComponent, { i: (item !== undefined ? this.clone(item) : { id: null }) })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public remove(item: any) {
    this.commonQueryService.Remove([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.commonQueryService
          .Remove(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'enabledFlag', options: this.enableOptions }, { field: 'category', options: this.categoryOptions }, { field: 'relationType', options: this.relationOptions }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction(this.httpAction, this.getQueryParams(), this.excelexport, this.context);
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
