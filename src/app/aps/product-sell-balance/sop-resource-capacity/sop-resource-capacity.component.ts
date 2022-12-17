import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { QueryService } from './edit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SopResourceCapacityEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { SopResourceCapacityManageService } from '../../../modules/generated_module/services/sopresourcecapacity-manage-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { SopResourceCapacityImportComponent } from './import/import.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';

@Component({
  selector: 'sop-resource-capacity-manage',
  templateUrl: './sop-resource-capacity.component.html',
  providers: [QueryService],
})
export class SopResourceCapacityManageComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  expandForm = false;
  applicationOptions: any[] = [];
  application: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];
  context = this;
  YesOrNo: any[] = [];

  // 下拉框数据项
  public plantOptions: any[] = [];
  public groupOptions: any[] = [];
  public lineOptions: any[] = [];

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 }, required: true },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.groupOptions, eventNo: 2 }, required: true },
      { field: 'resourceCode', title: '线体', ui: { type: UiType.select, options: this.lineOptions, eventNo: 3 } },
      { field: 'currentMonth', title: '月份', ui: { type: UiType.monthPicker } },
      { field: 'workDay', title: '开工天数', ui: { type: UiType.text } },
      { field: 'workHour', title: '开工时长', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: '',
      scheduleRegionCode: '',
      scheduleGroupCode: '',
      resourceCode: '',
      currentMonth: '',
      workDay: null,
      workHour: null,
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
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
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '线体', menuTabs: ['filterMenuTab'] },
    { field: 'currentMonth', headerName: '月份', menuTabs: ['filterMenuTab'] },
    { field: 'workDay', headerName: '开工天数（D）', menuTabs: ['filterMenuTab'] },
    { field: 'workHour', headerName: '开工时长（H）', menuTabs: ['filterMenuTab'] },
  ];

  public clear() {
    this.queryParams.values = {
      plantCode: this.appService.getPlantCode(),
      scheduleGroupCode: '',
      scheduleRegionCode: '',
      resourceCode: '',
      workHour: null,
      workDay: null,
      currentMonth: ''
    };
  }

  httpAction = {
    url: this.sopResourceCapacityManageService.seachUrl,
    method: 'GET',
    data: false
  };

  getQueryParams(): { [key: string]: any } {
    return {
      plantCode: this.queryParams.values.plantCode,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      resourceCode: this.queryParams.values.resourceCode,
      workHour: this.queryParams.values.workHour,
      workDay: this.queryParams.values.workDay,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }


  public query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.queryservice.loadGridViewNew(this.httpAction, this.getQueryParams(), this.context);
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,  // 模态对话框
    private formBuilder: FormBuilder,
    public queryservice: QueryService,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    private translateservice: AppTranslationService,
    private sopResourceCapacityManageService: SopResourceCapacityManageService,
    private commonquery: CommonQueryService,
    private appService: AppConfigService,
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  public add(item?: any) {
    this.modal
      .static(
        SopResourceCapacityEditComponent,
        { i: { id: (item !== undefined ? item.id : null) } },
        'md',
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

    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.sopResourceCapacityManageService.RemoveBath(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.translateservice.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.translateservice.translate(res.msg));
          }
        });
      },
    });
  }

  remove(value: any) {
    this.sopResourceCapacityManageService.RemoveBath([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.translateservice.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg));
      }
    });
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.queryservice.read(this.httpAction, this.queryParams);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    this.getPlantCodes();
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
  // 加载工厂
  getPlantCodes() {
    this.commonquery.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });
        this.loadGroup();
      });
    });
  }

  // 切换工厂
  public changePlant(plantCode: string) {
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.resourceCode = null;
    this.loadGroup();
    this.loadLine();
    const regionCode =
      this.plantOptions.find(x => x.value === plantCode).scheduleRegionCode ||
      '';
    // 切换事业部
    if (regionCode !== this.queryParams.values.scheduleRegionCode) {
      this.queryParams.values.scheduleRegionCode = regionCode;
    }
  }
  // 切换计划组
  public changeGroup(groupCode: string) {
    this.queryParams.values.resourceCode = null;
    console.log('changeGroup');
    console.log(this.queryParams);
    this.loadLine();
  }

  // 切换资源
  public changeResource(resourceCode: string) {

  }

  // 加载计划组
  private loadGroup() {
    this.groupOptions.length = 0;
    this.commonquery
      .GetUserPlantGroup(this.queryParams.values.plantCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.groupOptions.push({
            label: d.scheduleGroupCode,
            value: d.scheduleGroupCode,
          });
        });
      });
  }
  // 加载资源产线
  private loadLine() {
    this.lineOptions.length = 0;
    if ((this.queryParams.values.plantCode || '') === '') return;
    this.commonquery
      .GetUserPlantGroupLine(
        this.queryParams.values.plantCode || '',
        this.queryParams.values.scheduleGroupCode || '',
      )
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.lineOptions.push({
            label: d.resourceCode,
            value: d.resourceCode,
          });
        });
      });
  }



  import() {
    this.modal
      .static(SopResourceCapacityImportComponent, {}, 'md')
      .subscribe(() => {
        this.query();
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'enableFlag', options: this.YesOrNo }
  ];


  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }
}
