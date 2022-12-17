/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:12
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-01 10:15:39
 * 总部装关系数据查询
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { State } from '@progress/kendo-data-query';
import { PsAssemblyRelationService } from '../../../modules/generated_module/services/ps-assembly-relation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { PlanschedulePsassemblyrelationEditComponent } from './edit/edit.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { SelectService } from './selectService';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-psassemblyrelation',
  templateUrl: './psassemblyrelation.component.html',
  providers: [SelectService]
})
export class PlanschedulePsassemblyrelationComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  
  httpAction = { url: this.assemblyrelationservice.searchUrl, method: 'GET', data: false };
  public expandForm: Boolean = false;
  public mySelection: any[] = [];  
  /**上游资源值 */
  upresourcevalue: any[] = [];
  /**下游资源值 */
  downresourcevalue: any[] = [];
  categoryvalue = [];
  plantoptions: any[] = [];
  guess: Boolean = true;
  zyok: Boolean = true;
  YesOrNo: any[] = [];
  /**资源维度 */
  dimensionoptions: any[] = [];
  /**值类别 */
  categoryoptions: any[] = [];
  randomUserUrl: any;
  pageIndex: any;
  pageSize: any = 10;
  k: String;

  queryread: Boolean;
  /**查询参数 */
  public queryParams = {
    defines: [
      { field: 'resourceDimension', title: '资源维度', ui: { type: UiType.select, options: this.dimensionoptions, eventNo: 1 }, required: true },
      { field: 'category', title: '值类别', ui: { type: UiType.select, options: this.categoryoptions, eventNo: 2 }, required: true },
      { field: 'categoryValues', title: '类别值', ui: { type: UiType.scrollSelect, options: this.categoryvalue, extraEvent: { ScrollEventNo: 3, SearchEventNo: 4 } } },
      { field: 'upPlantCode', title: '上游工厂(子)', ui: { type: UiType.select, options: this.plantoptions, ngModelChange: this.upplantChange } },
      { field: 'upStreamValues', title: '上游资源值', ui: { type: UiType.select, options: this.upresourcevalue } },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.YesOrNo } },
      { field: 'doPlantcCde', title: '下游工厂(父)', ui: { type: UiType.select, options: this.plantoptions, ngModelChange: this.downplantChange } },
      { field: 'downStreamValues', title: '下游资源值', ui: { type: UiType.select, options: this.downresourcevalue } },
    ],
    values: {
      resourceDimension: '1',
      category: '1',
      categoryValues: '',
      upPlantCode: '',
      upStreamValues: '',
      enableFlag: '',
      doPlantcCde: '',
      downStreamValues: '',
      isExport: false
    }
  };
  /**表格列 */
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 70, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'resourceDimension', headerName: '资源维度', width: 100,  menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1).label'},
    { field: 'scheduleRegionCode', headerName: '计划区域', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'category', headerName: '值类别', width: 100, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,2).label'},
    { field: 'categoryValues', headerName: '类别值', width: 200, tooltipField: 'CATEGORY_VALUES', menuTabs: ['filterMenuTab'] },
    { field: 'upstreamPlantCode', headerName: '上游工厂(子)', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'upstreamValues', headerName: '上游资源值', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'upstreamResDesc', headerName: '上游资源描述', width: 200, tooltipField: 'UPSTREAM_RES_DESC', menuTabs: ['filterMenuTab'] },
    { field: 'downstreamPlantCode', headerName: '下游工厂(父)', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'downstreamValues', headerName: '下游资源值', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'downstreamResDesc', headerName: '下游资源描述', width: 200, tooltipField: 'DOWNSTREAM_RES_DESC', menuTabs: ['filterMenuTab'] },
    { field: 'orderBaseFlag', headerName: '跟单件', width: 100, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,3).label'},
    { field: 'enableFlag', headerName: '是否有效', width: 100, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,3).label'}
  ];
  /**导出列 */
  // expColumns = [
  //   { field: 'resourceDimension', title: '资源维护', width: 200, locked: true },
  //   { field: 'scheduleRegionCode', title: '计划区域', width: 200, locked: true },
  //   { field: 'upstreamPlantCode', title: '上游工厂(子)', width: 200, locked: true },
  //   { field: 'upstreamValues', title: '上游资源值', width: 200, locked: true },
  //   { field: 'upstreamResEdsc', title: '上游资源描述', width: 200, locked: true },
  //   { field: 'category', title: '值类别', width: 200, locked: true },
  //   { field: 'categoryValues', title: '类别值', width: 200, locked: true },
  //   { field: 'orderBaseFlag', title: '跟单标识', width: 200, locked: true },
  //   { field: 'downstreamPlantCode', title: '下游工厂(父)', width: 200, locked: true },
  //   { field: 'downstreamValues', title: '下游资源值', width: 200, locked: true },
  //   { field: 'downstreamResDesc', title: '下游资源描述', width: 200, locked: true },
  //   { field: 'enableFlag', title: '是否有效', width: 200, locked: true }
  // ];

  expColumns = this.columns;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    public commonQuery: CommonQueryService,
    public assemblyrelationservice: PsAssemblyRelationService,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    private translateservice: AppTranslationService,
    private appconfig: AppConfigService,
    public selectService: SelectService
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.dimensionoptions;
        break;
      case 2:
        options = this.categoryoptions;
        break;
      case 3:
        options = this.YesOrNo;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  /**页面初始化 */
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.queryread = true;
    this.pageIndex = 1;
    this.k = '';
    this.query();
    this.LoadData();
    this.categorychange(this.queryParams.values.category);
  }
  /**加载方法 */
  LoadData() {
    // 工厂
    this.commonQuery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element1 => {
        this.plantoptions.push({
          label: element1.plantCode,
          value: element1.plantCode
        });
      });
    });
    // 资源维度
    this.commonQuery.GetLookupByTypeLang('PS_ASSEMBLYRELATION_DIMENSION_OPTIONS', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.dimensionoptions.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });
    // 值类别
    this.commonQuery.GetLookupByTypeLang('PS_ASSEMBLYRELATION_CATEGORY', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.categoryoptions.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });
    // 是、否
    this.commonQuery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.YesOrNo.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });
  }
  /**增加、编辑 */
  add(item?: any) {
    this.modal
      .static(
        PlanschedulePsassemblyrelationEditComponent,
        { i: { Id: (item !== undefined ? item.id : null) } },
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
  /**重置 */
  public clear() {
    this.queryParams.values = {
      resourceDimension: null,
      upStreamValues: null,
      category: null,
      categoryValues: null,
      upPlantCode: null,
      enableFlag: null,
      doPlantcCde: null,
      downStreamValues: null,
      isExport: false
    };
  }
  /**查询 */
  query() {
    this.queryParams.values.isExport = false;
    super.query();
    this.commonQuery.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }

  /**导出 */
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.queryParams.values.isExport = true;
    this.commonQuery.exportAction(this.httpAction, this.queryParams.values, this.excelexport);
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.commonQuery.read(this.httpAction, this.queryParams.values);
  }

  /**删除 */
  remove(item: any) {
    this.assemblyrelationservice.remove(item.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  /**切换值类别 */
  categorychange(value: any) {
    this.categoryvalue.length = 0;
    if (value === null) {
      return;
    }
    this.queryParams.values.categoryValues = null;
    this.guess = false;
    this.pageIndex = 1;
    this.LandMoreItem();
  }

  /**切换资源维度 */
  dimensionchange(value: any) {
    this.zyok = false;
    this.upplantChange(this.queryParams.values.upPlantCode);
    this.downplantChange(this.queryParams.values.doPlantcCde);   
  }
   /**切换上游工厂 */
   upplantChange(value: any) {
    this.upresourcevalue.length = 0;  
    this.queryParams.values.upStreamValues = null; 
    if (this.queryParams.values.resourceDimension === '1') {
      this.assemblyrelationservice.GetResource(value).subscribe(res => {
        res.data.forEach(element => {
          this.upresourcevalue.push({
            label: element.resourceCode,
            value: element.resourceCode
          });
        });
      });
    } else {
      this.assemblyrelationservice.GetGroup(value).subscribe(res => {
        res.data.forEach(element => {
          this.upresourcevalue.push({
            label: element.scheduleGroupCode,
            value: element.scheduleGroupCode
          });
        });
      });
    }
  }
  /**切换下游工厂 */
  downplantChange(value: any) {
    this.downresourcevalue.length = 0;  
    this.queryParams.values.downStreamValues = null;
    if (this.queryParams.values.resourceDimension === '1') {
      this.assemblyrelationservice.GetResource(value).subscribe(res => {
        res.data.forEach(element => {
          this.downresourcevalue.push({
            label: element.resourceCode,
            value: element.resourceCode
          });
        });
      });

    } else {
      this.assemblyrelationservice.GetGroup(value).subscribe(res => {
        res.data.forEach(element => {
          this.downresourcevalue.push({
            label: element.scheduleGroupCode,
            value: element.scheduleGroupCode
          });
        });
      });
    }
  }

  LandMoreItem() {
    this.randomUserUrl = '/api/ps/psresourcelinkage/getValues?category=' + this.queryParams.values.category + '&pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize + '&k=' + this.k;
    this.selectService.getRandomNameList(this.randomUserUrl).subscribe(data => {
      data.forEach(element1 => {
        this.categoryvalue.push({
          label: element1,
          value: element1
        });
      });
    });
    this.pageIndex++;
  }

  onSearch(value: string): void {
    this.pageIndex = 1;
    this.categoryvalue.length = 0;
    this.k = value;
    this.LandMoreItem();
  }

  selectKeys = 'Id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
