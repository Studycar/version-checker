import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

import { PsBurdeningStandardExEditComponent } from './edit/edit.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsBurdeningStandardService } from '../queryService';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { TilesShowDetailComponent } from 'app/aps/tiles-planning/product-demand-workbanch/show-detail/show-detail.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-burdening-standardex-list',
  templateUrl: './list.component.html',
  providers: [PsBurdeningStandardService],
})
export class PsBurdeningStandardExListComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public selectBy = 'id';
  i: any;
  isLoading = false;

  public rawSurfaceOptions: any[] = [];
  public gradeLevelOptions: any[] = [];
  public yesOrNoOptions: any[] = [];
  steelTypeOption: any[] = [];
  standardsSortOptions: any[] = [
    { label: '由薄至厚', value: 2 },
    { label: '由厚至薄', value: 1 }

  ];


  public columns = [
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
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },

    {
      field: 'rawStockCode',
      width: 90,
      headerName: '原料编码',
      tooltipField: 'rawStockCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rawStockName',
      width: 90,
      headerName: '原料名称',
      tooltipField: 'rawStockName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rawStandardsInterval',
      width: 90,
      headerName: '原料规格区间',
      tooltipField: 'rawStandardsInterval',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'width',
      width: 90,
      headerName: '原料宽',
      tooltipField: 'width',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'length',
      width: 90,
      headerName: '原料长',
      tooltipField: 'length',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rawSurface',
      width: 90,
      headerName: '原料表面',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'rawPriority',
      width: 90,
      headerName: '原料优先级',
      tooltipField: 'rawPriority',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'standardsSort',
      width: 90,
      headerName: '规格优先级',
      tooltipField: 'standardsSort',
      valueFormatter: 'ctx.optionsFind(value,3).label',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'standardsPriority',
    //   width: 90,
    //   headerName: '规格优先顺序',
    //   tooltipField: 'standardsPriority',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'surfaceGrade',
      width: 90,
      headerName: '表面等级',
      valueFormatter: 'ctx.optionsFind(value,4).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'surfaceGradePriority',
      width: 90,
      headerName: '表面等级优先级',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'productionPlace',
      width: 90,
      headerName: '产地',
      tooltipField: 'productionPlace',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      width: 90,
      headerName: '启用状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },

  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {

      case 1:
        options = this.yesOrNoOptions;
        break;

      case 2:
        options = this.rawSurfaceOptions;
        break;

      case 3:
        options = this.standardsSortOptions;
        break;

      case 4:
        options = this.gradeLevelOptions;
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
    public queryService: PsBurdeningStandardService,
    private appTranslationService: AppTranslationService,
    private modalService: NzModalService,
    private appConfigService: AppConfigService,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  private getQueryParamsValue(): any {
    return {
      plantCode: this.i.plantCode,
      burdeningId: this.i.burdeningId,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadRawFace();
    this.loadGradeLevel();
    this.loadYesOrNo();
    this.query();
  }


  /**
  * 加载快码 原料表面
  */
  public loadRawFace(): void {
    this.queryService.GetLookupByType('PS_CONTRACT_SURFACE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.rawSurfaceOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }
  /**
  * 加载快码 表面等级
  */
  public loadGradeLevel(): void {
    this.queryService.GetLookupByType('PS_GRADE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.gradeLevelOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  /**
   * 加载快码 启用禁用
   */
  public loadYesOrNo(): void {
    this.queryService.GetLookupByType('FND_YES_NO')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.yesOrNoOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }


  httpAction = { url: this.queryService.seachExUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }

  public add(item: any) {
    this.modal
      .static(
        PsBurdeningStandardExEditComponent,
        {
          i: {
            id: item !== undefined ? item.id : null,
            burdeningId: this.i.burdeningId,
            burdeningType: this.i.burdeningType,
            plantCode: this.i.plantCode,
          },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }



  turnOnOffBatch(type: string) {
    const operTypeName = type === '0' ? '禁用' : '启用';
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要' + operTypeName + '的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('确定要' + operTypeName + '吗？'),
      nzOnOk: () => {
        this.queryService.turnOnOffEx({ ids: this.selectionKeys, operType: type }).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(operTypeName + '成功'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  turnOnOff(value: any, operType: string) {
    this.queryService.turnOnOffEx({ ids: [value.id], operType: operType }).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }


  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [
    { field: 'rawSurface', options: this.rawSurfaceOptions },
    { field: 'surfaceGrade', options: this.gradeLevelOptions },
    { field: 'standardsSort', options: this.standardsSortOptions },
    { field: 'enableFlag', options: this.yesOrNoOptions },

  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.queryService.export({ url: this.queryService.seachUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);

  }

  public clear() {
    this.queryParams.values = {
      plantCode: null,
      processCode: null,
      stockCodeData: { value: '', text: '' },
      // ITEM_CODE_E: { value: '', text: '' }
    };

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
