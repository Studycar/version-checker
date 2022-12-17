import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { QueryService } from '../query.service';
import { ShippingNoticeHfService } from '../../../../modules/generated_module/services/shipping-notice-hf-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-shipping-notice-hf-po-lack-material',
  templateUrl: './po-lack-material.component.html',
  providers: [QueryService, ShippingNoticeHfService],
})
export class PreparationPlatformShippingNoticeHfPoLackMaterialComponent extends CustomBaseContext implements OnInit {
  public plantCode = '';
  public buyer = '';
  public gridData: any[] = [];
  public totalCount = 0;
  gridHeight = document.body.clientHeight - 300;
  displayCols = 0;
  queryParams: any = {};
  dtPlant: any[] = [];
  dtCategory: any[] = [];
  staticColumns: any[] = [
    { field: 'plantCode', headerName: '组织', title: '组织', width: 80, lockPinned: true, pinned: 'left' },
    { field: 'itemCode', headerName: '物料编码', title: '物料编码', width: 120, lockPinned: true, pinned: 'left' },
    { field: 'itemDesc', headerName: '物料描述', title: '物料描述', width: 120, tooltipField: 'itemDesc' },
    { field: 'lastName', headerName: '采购员', title: '采购员', width: 90, tooltipField: 'lastName' },
    { field: 'vendorShortName', headerName: '供应商', title: '供应商', tooltipField: 'vendorShortName' },
    // { field: 'vendorSiteName', headerName: '供应商地址', title: '组织', }
  ];
  extendColumns: any[] = [];
  totalColumns: any[] = [];
  expandForm = false;
  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private shippingNoticeHfService: ShippingNoticeHfService
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null }); }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  ngOnInit(): void {
    // 初始化数据
    this.queryParams.plantCode = this.plantCode;
    this.shippingNoticeHfService.loadQueryData().subscribe(res => {
      this.dtPlant = res.data.dtPlant;
      if (this.dtPlant.length > 0) {
        // this.queryParams.plantCode = this.dtPlant[0].plantCode;
        this.plantChange(this.queryParams.plantCode);
        this.query();
      }
    });
  }

  plantChange(strValue: String) {
    // 工厂联动采购品类
    this.queryParams.categoryType = null;
    this.shippingNoticeHfService.listPurCagetory(strValue, '').subscribe(res => {
      this.dtCategory = res.data;
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    this.queryCommon();
  }

  queryCommon() {
    this.queryParams.export = false;
    this.commonQueryService.listPoLackMaterial(this.queryParams.plantCode, this.queryParams.categoryType, this.buyer).subscribe(result => {
      // this.gridData.length = 0;
      this.gridData = result.data;
      this.createExtendColumns(result.extra);
    });
  }

  // 创建扩展列
  createExtendColumns(displayCols: number) {
    if (this.displayCols !== displayCols) {
      this.displayCols = displayCols;
      this.extendColumns = [];
      for (let i = 0; i < displayCols; i++) {
        const dt = new Date();
        dt.setDate(dt.getDate() + i);
        const title = this.getDateFormat(dt);
        const reg = new RegExp('-', 'g'); // 创建正则RegExp对象
        const field = 'COL' + title.replace(reg, '');
        const col = { field: field, headerName: title, title: title, width: 120, locked: false };
        this.extendColumns.push(col);
      }

      this.totalColumns = [];
      this.staticColumns.forEach(col => {
        this.totalColumns.push(col);
      });
      this.extendColumns.forEach(col => {
        this.totalColumns.push(col);
      });
    }
  }

  getDateFormat(dt: Date) {
    // return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
    return this.commonQueryService.formatDate(dt);
  }

  searchExpand() {
    this.expandForm = !this.expandForm;
    // const columnCount = 3; /* 一行列数 */
    const rows = 2; // Math.ceil((this.queryParams.defines.length + 1) / columnCount);
    const form_marginTop = 5; /* form和按钮工具栏的margin-top */
    const formHeight = rows * 39 + form_marginTop;
    /*if (this.expandForm) {
      this.setGridHeight({ topMargin: this.gridHeightArg.topMargin + formHeight, bottomMargin: this.gridHeightArg.bottomMargin });
    } else {
      this.setGridHeight({ topMargin: this.gridHeightArg.topMargin - formHeight, bottomMargin: this.gridHeightArg.bottomMargin });
    }*/
  }

  // 导出
  public export() {
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    /*this.expColumns = [];
    this.staticColumns.forEach(dr => {
      const str = { field: dr.field, title: dr.title, width: dr.width };
      this.expColumns.push(str);
    });
    this.extendColumns.forEach(dr => {
      const str = { field: dr.field, title: dr.title, width: dr.width };
      this.expColumns.push(str);
    });

    this.queryParams.IsExport = true;
    this.commonQueryService.QueryMainData(this.queryParams).subscribe(result => {
      // const _gridData = this.createDataSource(result);
      this.excelexport.export(result.Extra.DT_RESULT);
    });*/

    this.excelexport.export(this.gridData);
  }

  clear() {
    if (this.dtPlant.length > 0) {
      this.queryParams.plantCode = this.dtPlant[0].plantCode;
    }
    this.queryParams.categoryType = '';
  }
}
