/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-09-20 10:04:21
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-20 17:51:41
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { QueryService } from './queryService';
import { SopPsMouldManagerEditComponent } from './edit/edit.component';
import { SopPsMouldImportComponent } from './import/import.component';
import { PsMouldManageService } from 'app/modules/generated_module/services/psmould.service';
/**
 * 模具信息维护
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-psmould-manager',
  templateUrl: './psmould.component.html',
  providers: [QueryService],
})
export class SopPsMouldManagerComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  httpAction = {
    url: this.psMouldManageService.seachUrl,
    method: 'GET',
    data: false,
  };
  versionOptions: any[] = [];
  context = this;
  resourceOptions: any[] = [];
  sourceOptions: any[] = [];
  plantOptions: any[] = [];
  statusOptions: any[] = [];
  nameOptions: any[] = [];
  yesOrNo: any[] = [];
  public queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions },
        required: true,
      },
     
      { field: 'mouldCode', title: '模具编码', ui: { type: UiType.text } },
      {
        field: 'mouldStatus',
        title: '模具状态',
        ui: { type: UiType.select, options: this.statusOptions },
      },
      {
        field: 'enableFlag',
        title: '是否有效',
        ui: { type: UiType.select, options: this.yesOrNo },
      },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      mouldCode: '',
      mouldStatus: '',
      enableFlag: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
    },
  };
  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 70,
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
      field: 'plantCode',
      headerName: '工厂',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },

    {
      field: 'mouldCode',
      headerName: '模具编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'descriptions',
      headerName: '模具描述',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'mouldStatus',
      headerName: '状态',
      width: 110,
      valueFormatter: 'ctx.optionsFind(value,2).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      headerName: '是否有效',
      valueFormatter:'ctx.optionsFind(value,1).label',
       menuTabs: ['filterMenuTab']
    },
    {
      field: 'createdBy',
      headerName: '创建人',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'creationDate',
      headerName: '创建时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'lastUpdatedBy',
      headerName: '最近更新人',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'lastUpdateDate',
      headerName: '最近更新时间',
      menuTabs: ['filterMenuTab'],
    },
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'mouldCode', title: '模具编码', width: 200, locked: false },
    { field: 'descriptions', title: '模具描述', width: 200, locked: false },
    { field: 'mouldStatus', title: '状态', width: 200, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: false },
  ];
  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private psMouldManageService: PsMouldManageService,
    private translateservice: AppTranslationService,
    private modalService: NzModalService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: translateservice,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.LoadData();
  }

  LoadData() {

    this.commonquery.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });

      });
    });

    this.commonquery.GetLookupByTypeLang('PS_MOULD_STATUS', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.statusOptions.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.yesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    



  

  }

  query() {
    super.query();
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.GetQueryParams(),
      this.context,
    );
  }
  

  GetQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      mouldCode: this.queryParams.values.mouldCode,
      mouldStatus: this.queryParams.values.mouldStatus,
      enableFlag: this.queryParams.values.enableFlag,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      mouldCode: '',
      mouldStatus: null,
      enableFlag: null,
      pageIndex: 1,
      pageSize: this.gridState.take,
    };
  }

  add(item?: any) {
    this.modal
      .static(
        SopPsMouldManagerEditComponent,
        {
          i: { id: item !== undefined ? item.id : null },
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }


  
  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }

    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.psMouldManageService.removeBatch(this.selectionKeys).subscribe(res => {
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
    this.psMouldManageService.removeBatch([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.translateservice.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg));
      }
    });
  }


  expData: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'enableFlag', options: this.yesOrNo },
    { field: 'mouldStatus', options: this.statusOptions }
  ];
 
    
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {    
      this.excelexport.export(this.gridData);
    });
  }

  import() {
    this.modal
      .static(SopPsMouldImportComponent, {}, 'md')
      .subscribe(() => {
        this.query();
      });
  }

  selectKeys = 'Id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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
      this.queryService.loadGridView(
        this.httpAction,
        this.GetQueryParams(),
        this.context,
      );
    } else {
      this.setLoading(false);
    }
  }
  
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNo;
        break;
      case 2:
        options = this.statusOptions;
        break;

    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
}
