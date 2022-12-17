import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { PpDemandDataInterfaceChildEditService } from './edit.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-pp-demand-data-interface-child-ag',
  templateUrl: './pp-demand-data-interface-child-ag.component.html',
  providers: [PpDemandDataInterfaceChildEditService],
})
export class DemandOrderManagementPpDemandDataInterfaceChildAgComponent extends CustomBaseContext implements OnInit {

  public selectBy = 'id';
  i: any = {};
  isLoading = false;

  public queryParams = {
    defines: [
      { field: 'reqNumber', title: '订单编号', ui: { type: UiType.string }, readonly: true },
      { field: 'reqLineNum', title: '需求订单行号', ui: { type: UiType.string }, readonly: true },
      { field: 'reqQty', title: '订单数量', ui: { type: UiType.string }, readonly: true },
      { field: 'reqDate', title: '需求日期', ui: { type: UiType.string }, readonly: true },
    ],
    values: {
      plantCode: '',
      reqNumber: '',
      reqLineNum: '',
      reqQty: '',
      reqDate: ''

    }
  };

  public columns = [


    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    {
      field: 'reqNumber', headerName: '订单编号', menuTabs: ['filterMenuTab']
    },
    {
      field: 'reqLineNum', headerName: '需求订单行号', menuTabs: ['filterMenuTab']
    },
    {
      field: 'componentLineNum', headerName: '组件需求行号', menuTabs: ['filterMenuTab']
    },
    {
      field: 'itemCode', headerName: '组件编码', menuTabs: ['filterMenuTab']
    },
    {
      field: 'unitOfMeasure', headerName: '单位', menuTabs: ['filterMenuTab']
    },
    {
      field: 'supplyType', headerName: '供应类型', menuTabs: ['filterMenuTab']
    },
    {
      field: 'supplySubinventory', headerName: '供应子库', menuTabs: ['filterMenuTab']
    },
    {
      field: 'quantity', headerName: '数量', menuTabs: ['filterMenuTab']

    },
    {
      field: 'mrpNetFlag', headerName: 'MRP净值标识', valueFormatter: 'ctx.standard(value)', menuTabs: ['filterMenuTab']
    }
  ];
  public standard(value: string): any {
    if (value === 'Y') {
      return '是';
    } else { return '否'; }
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,

    public editService: PpDemandDataInterfaceChildEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);

  }

  ngOnInit() {
    this.queryParams.values.plantCode = this.i.plantCode;
    this.queryParams.values.reqNumber = this.i.reqNumber;
    this.queryParams.values.reqLineNum = this.i.reqLineNum;
    this.queryParams.values.reqQty = this.i.reqQty;
    this.queryParams.values.reqDate = this.i.reqDate;
    this.queryCommon();
  }



  httpAction = { url: this.editService.seachUrl, method: 'GET' };

  public query() {
    super.query();

    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }


  expData: any[] = [];
  expColumns = this.columns;
  // expColumnsOptions: any[] = [{ field: 'RECEIVE_MSG_TYPE', options: this.applicationsMSG }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {

    super.export();
    this.commonQueryService.exportAction({ url: this.editService.seachUrl, method: 'GET' }, this.queryParams.values, this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }



  public clear() {
    this.queryParams.values = {
      plantCode: '',
      reqNumber: '',
      reqLineNum: '',
      reqQty: '',
      reqDate: ''
    };
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
