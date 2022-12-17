import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { QueryService } from "../query.service";

@Component({
  selector: 'delivery-order-detail',
  templateUrl: './detail.component.html',
  providers: [QueryService]
})
export class OrderBaseDetailComponent extends CustomBaseContext implements OnInit {

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

  makeOrderNum: string = '';
  plantCode: string = '';
  makeOrderStatusOptions = [];

  public optionsFind(value: string): any {
    const found = this.makeOrderStatusOptions.find(x => x.value == value);
    return found || { label: value }
  }

  columns = [
    { field: 'plantDesc', headerName: '工厂', },
    { field: 'scheduleGroupDesc', headerName: '计划组' },
    { field: 'resourceDesc', headerName: '资源' },
    { field: 'manufLineName', headerName: '产线' },
    { field: 'makeOrderNum', headerName: '工单号' },
    { field: 'topMoNum', headerName: '顶层工单号' },
    { field: 'parentMoNum', headerName: '父工单号' },
    //{ field: 'itemId', headerName: '物料编码' },
    { field: 'stockCode', headerName: '产品编码' },
    { field: 'stockName', headerName: '产品描述' },
    { field: 'steelType', headerName: '钢种' },
    //{ field: 'standards', headerName: '规格' },
    { field: 'surface', headerName: '表面' },
    //{ field: 'processCode', headerName: '工序' },
    //{ field: 'length', headerName: '长度' },
    //{ field: 'width', headerName: '宽度' },
    { field: 'specSize', headerName: '规格尺寸', valueFormatter: 'ctx.formatSpec(value)' },
    { field: 'projectNumber', headerName: '项目号' },
    { field: 'makeOrderStatus', headerName: '工单状态', valueFormatter: 'ctx.optionsFind(value).label' },
    { field: 'moQty', headerName: '工单数量' },
    { field: 'fpcTime', headerName: '开工时间' },
    { field: 'lpcTime', headerName: '完工时间' },
    { field: 'levelNum', headerName: '层级' },
  ];
  
  formatSpec(value) {
    const specs = value.split('*');
    if(specs.length > 1 && Number(specs[1]) === Math.floor(specs[1])) {
      specs[1] = Math.floor(specs[1]).toString();
    }
    if(specs.length > 2 && Number(specs[2]) === Math.floor(specs[2])) {
      specs[2] = Math.floor(specs[2]).toString();
    }
    return specs.join('*');
  }

  expColumnsOptions: any[] = [];
  ngOnInit() {
    this.query();
    this.expColumnsOptions = [
      { field: 'makeOrderStatus', options: this.makeOrderStatusOptions },
    ];
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: '/api/ps/ppMixedResourceIssued/queryAssMixedResourceIssuedHW', method: 'POST' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }
  getQueryParamsValue(isExport=false) {
    return {
      makeOrderNum: this.makeOrderNum,
      plantCode: this.plantCode,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.expColumns = this.excelexport.setExportColumn(this.columns);
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
}
