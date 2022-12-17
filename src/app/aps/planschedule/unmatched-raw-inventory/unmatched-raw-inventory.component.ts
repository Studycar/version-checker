import { Component, OnInit, ViewChild, } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';

@Component({
  selector: 'unmatched-raw-inventory',
  templateUrl: './unmatched-raw-inventory.component.html',
  providers: [QueryService],
})
export class UnmatchedRawInventoryComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public appTranslationService: AppTranslationService,
    public appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public modal: ModalHelper,
    public queryService: QueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.queryUrl,
    method: 'GET',
  };

  // 表格列配置
  columns = [
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'version',
      width: 120,
      headerName: '版本号',
    },
    {
      field: 'itemId',
      width: 120,
      headerName: '产品编码',
    },
    {
      field: 'skuName',
      width: 120,
      headerName: '产品名称',
    },
    // {
    //   field: 'stockDesc',
    //   width: 120,
    //   headerName: '产品描述',
    // },
    {
      field: 'steelGrade',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'spec',
      width: 120,
      headerName: '规格尺寸',
      filter: 'standardsTypeFilter'
    },
    {
      field: 'onhandQuantity',
      width: 120,
      headerName: '现存量',
    },
    {
      field: 'avaQuantity',
      width: 120,
      headerName: '可用量',
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'actHeight',
      width: 120,
      headerName: '实厚',
    },
    {
      field: 'actWidth',
      width: 120,
      headerName: '实宽',
    },
    {
      field: 'quality',
      width: 120,
      headerName: '品质信息',
    },
    {
      field: 'whName',
      width: 120,
      headerName: '存货仓库',
    },
    {
      field: 'entryTime',
      width: 120,
      headerName: '入库时间',
    },
    {
      field: 'batchCode',
      width: 120,
      headerName: '批号',
    },
  ];
  plantOptions: any[] = [];
  versionOptions: any[] = [];
  steelTypeOptions: any[] = [];
  surfaceOptions: any[] = [];
  gradeOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.steelTypeOptions;
        break;
      case 2:
        options = this.surfaceOptions;
        break;
      case 6:
        options = this.gradeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  // 查询条件配置
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions, ngModelChange: this.getVersionList } },
      { field: 'version', title: '版本号', required: true, ui: { type: UiType.select, options: this.versionOptions } },
      { field: 'stockName', title: '产品名称', ui: { type: UiType.text, } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'surface', title: '表面', ui: { type: UiType.select, options: this.surfaceOptions } },
      { field: 'spec', title: '规格尺寸', ui: { type: UiType.text, } },
    ],
    values: {
      plantCode: this.appConfigService.getActivePlantCode(),
      version: null,
      stockName: '',
      steelType: '',
      surface: '',
      spec: '',
    }
  };

  // 获取查询条件
  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      params.isExport = true;
    } else {
      params.isExport = false;
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  // 初始化生命周期
  ngOnInit(): void {
    this.refreshVersion();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    }); 
  }

  refreshVersion() {
    this.getVersionList().then((value) => {
      if (value) {
        this.query();
      }
    });
  }

  // 查询搜索条件
  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_GRADE': this.gradeOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  async getVersionList() {
    this.versionOptions.length = 0;
    this.queryParams.values.version = null;
    return new Promise(async resolve => {
      const res = await this.queryService.getVersionList(this.queryParams.values.plantCode, 'N').toPromise();
      if(res.code === 200) {
        res.data.forEach(d => {
          this.versionOptions.push({
            label: d,
            value: d
          })
        })
        if(res.data.length > 0) { this.queryParams.values.version = res.data[0]; resolve(true); }
        else { resolve(false); }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        resolve(false);
      }
    })
  }

  query() {
    super.query();
    this.queryCommon();
  }

  // 查询方法
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParams(),
      this.context,
    );
  }

  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
        } 
      }
      this.setTotalBottomRow(data);
    });
  }

  // 过滤后重新统计
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }

  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'plantCode';
    // 需要统计的列数组
    const fields = ['onhandQuantity', 'avaQuantity'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getActivePlantCode(),
      version: null,
      stockName: '',
      steelType: '',
      surface: '',
      spec: '',
    };
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

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'grade', options: this.gradeOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.exportAction(
      this.httpAction,
      params,
      this.excelexport,
      this.context
    );
  }
}