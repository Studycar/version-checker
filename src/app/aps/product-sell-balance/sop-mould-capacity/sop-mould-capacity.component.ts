import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State } from '@progress/kendo-data-query';
import { FormBuilder } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SopMouldCapacityEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { SopMouldCapacityService } from '../../../modules/generated_module/services/sopmouldcapacity-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { SopMouldCapacityImportComponent } from './import/import.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { formatDate } from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-mould-capacity',
  templateUrl: './sop-mould-capacity.component.html',
  providers: [SopMouldCapacityService]
})
export class SopMouldCapacityComponent extends CustomBaseContext implements OnInit {
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

  public queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 },
        // required: true,
      },
      { field: 'mouldCode', title: '模具编码', ui: { type: UiType.text } },
      { field: 'currentMonth', title: '月份', ui: { type: UiType.monthPicker } },
    ],
    values: {
      plantCode: '',
      mouldCode: null,
      currentMonth: '',
    },
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'mouldCode', headerName: '模具', menuTabs: ['filterMenuTab'] },
    { field: 'currentMonth', headerName: '月份', menuTabs: ['filterMenuTab'] },
    { field: 'workDay', headerName: '开工天数', menuTabs: ['filterMenuTab'] },
    { field: 'workHour', headerName: '开工时长', menuTabs: ['filterMenuTab'] },
  ];

  public clear() {
    this.queryParams.values = {
      plantCode: this.appService.getPlantCode(),
      mouldCode: null,
      currentMonth: '',
    };
  }

  httpAction = {
    url: this.sopMouldCapacityService.seachUrl,
    method: 'GET',
    data: false,
  };

  getQueryParams(): { [key: string]: any } {
    return {
      plantCode: this.queryParams.values.plantCode,
      mouldCode: this.queryParams.values.mouldCode,
      currentMonth: this.queryParams.values.currentMonth ? formatDate(this.queryParams.values.currentMonth, 'yyyy-MM', 'zh-cn') : '',
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }


  public query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonquery.loadGridViewNew(this.httpAction, this.getQueryParams(), this.context);
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,  // 模态对话框
    private formBuilder: FormBuilder,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    private translateservice: AppTranslationService,
    private sopMouldCapacityService: SopMouldCapacityService,
    private commonquery: CommonQueryService,
    private appService: AppConfigService,
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  public add(item?: any) {
    this.modal
      .static(
        SopMouldCapacityEditComponent,
        { i: item ? this.clone(item) : {id: null} },
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
        this.sopMouldCapacityService.removeBath(this.selectionKeys).subscribe(res => {
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
    this.sopMouldCapacityService.removeBath([value.id]).subscribe(res => {
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
    this.commonquery.read(this.httpAction, this.queryParams);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode,
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
      });
    });
  }

  import() {
    this.modal
      .static(SopMouldCapacityImportComponent, {}, 'md')
      .subscribe(() => {
        this.query();
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'enableFlag', options: this.YesOrNo },
  ];


  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }
}
