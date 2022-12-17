
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { QueryService } from './query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-order-raw-list',
  templateUrl: './demand-order-raw-list.component.html',
  providers: [QueryService]
})
export class DemandOrderManagementDemandOrderRawListComponent extends CustomBaseContext implements OnInit {

  plantOptions: any[] = [];
  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: QueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  columns = [
    { field: 'plantCode', headerName: '工厂', width: '120' },
    { field: 'projectNumber', headerName: '项目号', width: '150' },
    { field: 'reqNumber', headerName: '需求订单号', width: '150' },
    { field: 'reqLineNumber', headerName: '需求订单行号', width: '80' },
    { field: 'rawUniqueCode', headerName: '原料信息', width: '200' },
    { field: 'rawWhCode', headerName: '仓库编码', width: '120' },
    { field: 'rawWhName', headerName: '存货仓库', width: '120' },
    { field: 'rawSkuCode', headerName: '产品编码', width: '120' },
    { field: 'rawSkuName', headerName: '产品名称', width: '120' },
    { field: 'rawSpec', headerName: '规格尺寸', width: '120' },
    { field: 'rawActHeight', headerName: '实厚', width: '100' },
    { field: 'rawSteelGrade', headerName: '钢种', width: '100' },
    { field: 'rawSurface', headerName: '表面', width: '100' },
    { field: 'rawGrade', headerName: '等级', width: '100' },
    { field: 'rawBatchCode', headerName: '批号', width: '120' },
    { field: 'rawQuantity', headerName: '现存量', width: '100' },
    { field: 'rawWhPosCode', headerName: '库位编码', width: '120' },
    { field: 'rawWhPosName', headerName: '库位名称', width: '120' },
    { field: 'rawInnerGrade', headerName: '内控等级', width: '100' },
    { field: 'rawCr', headerName: '化学成分Cr', width: '100' },
    { field: 'rawProducer', headerName: '产地', width: '120' },
    { field: 'rawCreatedTime', headerName: '入库时间', width: '120' },
    { field: 'quality', headerName: '品质信息', width: '120' },
    { field: 'creationDate', width: 120, headerName: '创建时间' },
    { field: 'createdBy', width: 120, headerName: '创建人' },
    { field: 'lastUpdateDate', width: 120, headerName: '最近更新时间' },
    { field: 'lastUpdatedBy', width: 120, headerName: '最近更新人' },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        break;
    }
    const option = options.find(x => x.value === value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions }, required: true },
      { field: 'projectNumber', title: '项目号', ui: { type: UiType.text } },
      { field: 'rawBatchCode', title: '原料批号', ui: { type: UiType.text } },
      { field: 'rawSkuCode', title: '原料产品编号', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      projectNumber: '',
      rawBatchCode: '',
      rawSkuCode: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      projectNumber: '',
      rawBatchCode: '',
      rawSkuCode: '',
    }
  }

  ngOnInit() {
    this.loadOptions();
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    const queryValues = this.getQueryParamsValue();
    const httpAction = { url: this.httpAction.url + `?pageIndex=${queryValues.pageIndex}&pageSize=${queryValues.pageSize}`, 
      method: this.httpAction.method };
    this.queryService.loadGridViewNew(
      httpAction,
      queryValues,
      this.context
    )
  }

  getQueryParamsValue(isExport = false) {
    const params: any = { ...this.queryParams.values };
    params.export = isExport;
    if(!isExport) {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  async loadOptions() {
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  expColumnsOptions: any[] = [
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.exportFile();
  }

  exportFile() {
    this.queryService.exportAction(
      this.httpAction,
      this.getQueryParamsValue(true),
      this.excelexport,
      this.context
    );
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
