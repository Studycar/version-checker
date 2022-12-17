import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { LoadCapacityRuleService } from './load-capacity-rule.service';
import { LoadCapacityRuleImportComponent } from './import/import.component';
import { LoadCapacityRuleEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'load-capacity-rule',
  templateUrl: './load-capacity-rule.component.html',
  providers: [LoadCapacityRuleService],
})
export class LoadCapacityRuleComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  // 工厂
  public plantCodes: any[] = [];
  // 装运点
  public loadLocations: any[] = [];
  // 查询参数
  queryParams = {
    defines: [
      { field: 'strPlantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantCodes, eventNo: 1 } },
      { field: 'strLoadLocation', title: '装运点', required: false, ui: { type: UiType.select, options: this.loadLocations } }
    ],
    values: {
      strPlantCode: this.appConfigService.getPlantCode(),
      strLoadLocation: ''
    }
  };
  // 网格列定义
  columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: { template: this.headerTemplate },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters     
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: { template: this.headerTemplate }
    },
    { field: 'plantCode', headerName: '工厂', title: '工厂', tooltipField: 'plantCode', menuTabs: ['filterMenuTab'] },
    { field: 'loadLocation', headerName: '装运点', title: '装运点', tooltipField: 'loadLocation', menuTabs: ['filterMenuTab'] },
    { field: 'startTime', headerName: '班次开始时间', title: '班次开始时间', tooltipField: 'attribute1', menuTabs: ['filterMenuTab'] },
    { field: 'tonnageForA', headerName: 'A类能力吨位', title: 'A类能力吨位', tooltipField: 'tonnageForA', menuTabs: ['filterMenuTab'] },
    { field: 'tonnageForB', headerName: 'B类能力吨位', title: 'B类能力吨位', tooltipField: 'tonnageForB', menuTabs: ['filterMenuTab'] },
    { field: 'tonnageForC', headerName: 'C类能力吨位', title: 'C类能力吨位', tooltipField: 'tonnageForC', menuTabs: ['filterMenuTab'] },
    { field: 'enableDate', headerName: '生效时间', title: '生效时间', tooltipField: 'enableDate', menuTabs: ['filterMenuTab'] },
    { field: 'disableDate', headerName: '失效时间', title: '失效时间', tooltipField: 'disableDate', menuTabs: ['filterMenuTab'] },
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public loadCapacityRuleService: LoadCapacityRuleService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.clear();
    this.initPlantCodes();
    this.query();
    this.gridData = [];
  }

  clear() {
    this.queryParams.values = {
      strPlantCode: this.appConfigService.getPlantCode(),
      strLoadLocation: ''
    };
  }

  /** 初始化 组织  下拉框*/
  initPlantCodes() {
    // 当前用户对应工厂
    this.queryParams.values.strPlantCode = this.appConfigService.getPlantCode();
    this.loadCapacityRuleService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodes.push({ value: d.plantCode, label: d.plantCode });
      });

      if (this.plantCodes.length > 0) {
        this.plantCodeChanged(this.queryParams.values.strPlantCode);
      }
    });
  }

  plantCodeChanged(event: any) {
    this.queryParams.values.strLoadLocation = null;
    this.loadLocations.length = 0;
    this.loadCapacityRuleService.QueryLocation(event).subscribe(result => {
      result.data.forEach(d => {
        this.loadLocations.push({ value: d, label: d });
      });
      if (this.loadLocations.length > 0) {
        this.queryParams.values.strLoadLocation = this.loadLocations[0].value;
      }
    });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const httpAction = { url: this.loadCapacityRuleService.seachUrl, method: 'POST' };
    const dto = {
      plantCode: this.queryParams.values.strPlantCode,
      loadLocation: this.queryParams.values.strLoadLocation,
      isExport: false,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
    this.commonQueryService.loadGridViewNew(httpAction, dto, this.context);
  }

  public add(item: any) {
    this.modal.static(LoadCapacityRuleEditComponent,
      {
        originDto: item !== undefined ? item : null
      }, 'xl',//lg
    ).subscribe((value) => {
      if (value) {
        this.query();
      }
    });
  }

  public remove(item: any) {
    this.loadCapacityRuleService.Delete([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success(this.appTranslationService.translate('请选择要删除的数据。'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.loadCapacityRuleService.Delete(this.selectionKeys).subscribe(res => {
          this.msgSrv.success(this.appTranslationService.translate('删除成功'));
          this.query();
        });
      },
    });
  }

  // 导入
  public import() {
    this.modal.static(LoadCapacityRuleImportComponent, {}, 'md')
      .subscribe((value) => {
        this.query();
      });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = {
      plantCode: this.queryParams.values.strPlantCode,
      loadLocation: this.queryParams.values.strLoadLocation,
      isExport: true,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
    this.commonQueryService.export({ url: this.loadCapacityRuleService.seachUrl, method: 'POST' }, dto, this.excelexport, this.context);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
