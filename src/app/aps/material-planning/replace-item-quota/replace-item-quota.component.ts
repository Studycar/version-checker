import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { ReplaceItemQuotaService } from './replace-item-quota.service';
import { ReplaceItemQuotaEditComponent } from './edit/edit.component';
import { ReplaceItemQuotaImportComponent } from './import/import.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'replace-item-quota',
  templateUrl: './replace-item-quota.component.html',
  providers: [ReplaceItemQuotaService]
})
export class ReplaceItemQuotaComponent extends CustomBaseContext implements OnInit {

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private modal: ModalHelper,
    private queryService: ReplaceItemQuotaService
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  plantOptions: any[] = [];
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 },
      },
      {
        field: 'projectNumber',
        title: '项目号',
        ui: { type: UiType.text }
      },
      {
        field: 'replacementGroup',
        title: '替代组',
        ui: { type: UiType.text }
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      projectNumber: '',
      replacementGroup: '',
    }
  };
  columns = [
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 100,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'projectNumber',
      headerName: '项目号',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'replacementGroup',
      headerName: '替代组',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'combinationGroup',
      headerName: '绑定组合',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemCode',
      headerName: '物料编码',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemDecs',
      headerName: '物料描述',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'consumePriority',
      headerName: '消耗优先级',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'allocationPercent',
      headerName: '配额',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'effectivityDate',
      headerName: '配额生效时间',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'disableDate',
      headerName: '配额失效时间',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
  ];

  ngOnInit() {
    this.LoadData();
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  LoadData() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      projectNumber: '',
      replacementGroup: '',
    };
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.setLoading(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const total = res.data && res.data.totalElements ? res.data.totalElements : 0;
      this.gridData = data;
      this.view = {
        data: this.gridData,
        total: total,
      };
      this.initGridWidth();
      setTimeout(() => {
        this.setLoading(false);
      });
    });
  }

  getQueryParams(isExport: boolean = false) {
    const params: any = { ...this.queryParams.values, isExport };
    if (isExport) {
      params.pageIndex = 1;
      params.pageSize = 100000;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  add(data?: any) {
    this.modal.static(
      ReplaceItemQuotaEditComponent,
      { params: data ? data : {plantCode: this.appConfigService.getPlantCode()} },
      'lg'
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const exportData = data;
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }

  remove(data: any) {
    //const listIds = [data.Id];
    this.queryService.remove(data).subscribe(res => {
      if (res.code = 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功！'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }

  // 导入
  imports() {
    this.modal.static(ReplaceItemQuotaImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }
}
