/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:13
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 08:41:43
 * @Note: ...
 * 班次
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { QueryService } from './queryService';
import { DlyCalendarService } from '../../../modules//generated_module/services/dly-calendar-service';
import { PreparationPlatformDlycalendarEditComponent } from '../dlycalendar/edit/edit.component';
import { PreparationPlatformDlycalendarViewComponent } from './view/view.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-dlycalendar',
  templateUrl: './dlycalendar.component.html',
  providers: [QueryService]
})
export class PreparationPlatformDlycalendarComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  selectKeys = 'id';
  httpAction = {
    url: this.querydata.seachUrl,
    method: 'GET',
    data: false
  };
  calendaroptions: any[] = [];
  YesOrNo: any[] = [];
  plantOptions: any[] = [];
  context = this;

  /**查询参数 */
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions }, required: true },
      { field: 'deliveryCalendarCode', title: '多班次送货模型', ui: { type: UiType.select, options: this.calendaroptions } },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.YesOrNo } }
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      deliveryCalendarCode: '',
      enableFlag: ''
    }
  };
  /**表格列 */
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
    {
      field: 'deliveryCalendarCode', headerName: '多班次送货模型', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'enableFlag', headerName: '是否有效', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label',
    }
  ];
  // /**导出列 */
  // expColumns = [
  //   { field: 'plantCode', title: '工厂', width: 200, locked: true },
  //   { field: 'deliveryCalendarCode', title: '多班次送货模型', width: 200, locked: true },
  //   { field: 'enableFlag', title: '是否有效', width: 200, locked: true }
  // ];

  /**构造函数 */
  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private magSrv: NzMessageService,
    private queryService: QueryService,
    private querydata: DlyCalendarService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private modalService: NzModalService,
    private appTranslationService: AppTranslationService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: magSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  /**页面初始化 */
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.LoadData();
  }
  /**加载方法 */
  LoadData() {
    // this.querydata.GetCalendar().subscribe(res => {
    //   res.Extra.forEach(element => {
    //     this.calendaroptions.push({
    //       label: element.meaning,
    //       value: element.lookupCode
    //     });
    //   });
    // });

    this.commonquery.GetLookupByTypeLang('PC_DLY_CALENDAR_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.calendaroptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.YesOrNo;
        break;
      case 2:
        options = this.calendaroptions;
        break;

    }
    return options.find(x => x.value === value) || { label: value };
  }

  /**查询 */
  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }

  /**重置 */
  clear() {
    this.queryParams.values = {
      plantCode: null,
      deliveryCalendarCode: null,
      enableFlag: null
    };
  }
  /**新增、编辑 */
  add(item?: any) {
    this.modal
      .static(
        PreparationPlatformDlycalendarEditComponent,
        {
          i: { id: (item !== undefined ? item.id : null) }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }
  /**明细 */
  detail(item: any) {
    this.modal
      .static(
        PreparationPlatformDlycalendarViewComponent,
        {
          i: {
            id: (item !== undefined ? item.id : null), plantCode: item.plantCode, deliveryCalendarCode: item.deliveryCalendarCode
            , calendaroptions: this.calendaroptions
          }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }
  /**删除 */
  remove(value: any) {
    this.querydata.RemoveBath([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.magSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.magSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }
  /**批量删除 */
  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.magSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.RemoveBath(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.magSrv.success(this.appTranslationService.translate('删除成功'));
            this.query();
          } else {
            this.magSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }
  // /**导出 */  
  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'enableFlag', options: this.YesOrNo },
    { field: 'deliveryCalendarCode', options: this.calendaroptions }
  ];


  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }

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
