
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnotice-choose-raw',
  templateUrl: './choose-raw.component.html',
  providers: [QueryService]
})
export class DemandOrderManagementDemandclearupnoticeChooseRawComponent extends CustomBaseContext implements OnInit {

  demandOrder: any = {}; // 需求订单信息
  gradeR: 'N';
  constructor(
    public pro: BrandService,
    public modalHelper: ModalHelper,
    public http: _HttpClient,
    private modal: NzModalRef,
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
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    // { field: 'uniqueCode', headerName: '原料信息', width: '200' },
    // { field: 'whCode', headerName: '仓库编码', width: '120' },
    { field: 'whName', headerName: '存货仓库', width: '120' },
    { field: 'skuCode', headerName: '产品编码', width: '120' },
    { field: 'skuName', headerName: '产品名称', width: '120' },
    { field: 'spec', headerName: '规格尺寸', width: '120', filter: 'standardsTypeFilter' },
    { field: 'actHeight', headerName: '实厚', width: '100' },
    { field: 'steelGrade', headerName: '钢种', width: '100' },
    { field: 'surface', headerName: '表面', width: '100' },
    { field: 'grade', headerName: '等级', width: '100' },
    { field: 'batchCode', headerName: '批号', width: '120' },
    { field: 'quantity', headerName: '现存量', width: '100' },
    { field: 'whPosCode', headerName: '库位编码', width: '120' },
    // { field: 'whPosName', headerName: '库位名称', width: '120' },
    { field: 'innerGrade', headerName: '内控等级', width: '100' },
    { field: 'cr', headerName: '化学成分Cr', width: '100' },
    { field: 'producer', headerName: '产地', width: '120' },
    { field: 'createdTime', headerName: '入库时间', width: '120' },
    { field: 'quality', headerName: '品质信息', width: '120' },
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
    defines: [],
    values: {}
  };

  clear() {
  }

  ngOnInit() {
    this.gridOptions.isRowSelectable = rowNode => rowNode.data.checkFlag === 'Y';
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.getRowUrl, method: 'POST' };
  queryCommon(gradeR = 'N') {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(false, gradeR),
      this.context
    )
  }

  getQueryParamsValue(isExport = false, gradeR = 'N') {
    const params = {
      plantCode: this.demandOrder.plantCode,
      skuCode: this.demandOrder.stockCode,
      routeId: this.demandOrder.routeId,
      steelType: this.demandOrder.steelType,
      surface: this.demandOrder.surface,
      standards: this.demandOrder.standards,
      width: this.demandOrder.width,
      length: this.demandOrder.length,
      needSideCut: this.demandOrder.needSideCut,
      gradeR: gradeR,
      pageIndex: 1,
      pageSize: 1000,
    }
    return params;
  }

  checkValid() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      return selectedRows && selectedRows.length > 0;
    }
    return false;
  }

  save() {
    const selectedRows = this.gridApi.getSelectedRows().map(d => {
      const result: any = {};
      for (let key in d) {
        result[this.formatKey(key)] = d[key];
      }
      result['plantCode'] = this.demandOrder.plantCode;
      result['projectNumber'] = this.demandOrder.projectNumber;
      result['reqLineNumber'] = this.demandOrder.reqLineNum;
      result['reqNumber'] = this.demandOrder.reqNumber;
      return result;
    });
    if (selectedRows.length > 0) {
      this.queryService.save(selectedRows).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    }
  }

  formatKey(key) {
    return 'raw' + key[0].toUpperCase() + key.slice(1);
  }

  close() {
    this.modal.destroy();
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }
  search(gradeR) {
    const val = gradeR ? 'Y' : 'N';
    this.queryCommon(val);
  }

}
