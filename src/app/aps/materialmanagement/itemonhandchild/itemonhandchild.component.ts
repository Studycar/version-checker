import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ItemonhandQueryService } from '../../../modules/generated_module/services/itemonhand-query-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-itemonhandchild',
  templateUrl: './itemonhandchild.component.html',
  providers: [QueryService]
})
export class MaterialmanagementListItemonhandchildComponent extends CustomBaseContext implements OnInit {
  p: any;
  plantoptions: any[] = [];
  public queryParams = {
    defines: [
      { field: 'PLANT_CODE', title: '工厂', ui: { type: UiType.select, options: this.plantoptions } },

    ],
    values: {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }
  };
  public columns =
    [
      { field: 'plantCode', width: 70, headerName: '工厂', menuTabs: ['filterMenuTab'] },
      { field: 'currentSubinventoryCode', width: 90, headerName: '当前子库存', menuTabs: ['filterMenuTab'] },
      { field: 'currentSubinventoryAllo', width: 100, headerName: '当前库位', menuTabs: ['filterMenuTab'] },
      { field: 'itemCode', width: 140, headerName: '物料编码', menuTabs: ['filterMenuTab'] },
      { field: 'lotNumber', width: 150, headerName: '批次号', menuTabs: ['filterMenuTab'] },
      { field: 'serialNumber', width: 150, headerName: '序列号', menuTabs: ['filterMenuTab'] },
      { field: 'reservedOrder', width: 150, headerName: '锁定订单', menuTabs: ['filterMenuTab'] },
      { field: 'currentStatus', width: 90, headerName: '当前状态', menuTabs: ['filterMenuTab'] },
      { field: 'initializationDate', width: 170, headerName: '生产日期', menuTabs: ['filterMenuTab'] },
      { field: 'revision', width: 100, headerName: '版本', menuTabs: ['filterMenuTab'] },
      { field: 'attribute1', width: 150, headerName: '车身号', menuTabs: ['filterMenuTab'] },
      { field: 'attribute3', width: 150, headerName: '发动机号', menuTabs: ['filterMenuTab'] },
      { field: 'descriptiveText', width: 150, headerName: '描述文本', menuTabs: ['filterMenuTab'] },
    ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private querydata: ItemonhandQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public pro: BrandService,
    private appConfigService: AppConfigService,
    private queryService: CommonQueryService,
    public commonQueryService: QueryService

  )
  // tslint:disable-next-line:one-line
  {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 265;
  }
  ngOnInit() {
    this.LoadData();
    this.query();
  }

  httpAction = {
    url: this.querydata.urlChild,
    method: 'GET'
  };
  public query() {
    super.query();
    this.queryCommon();
  }
  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.cloneParam(), this.context);
  }

  private cloneParam(): any {
    const dto = {
      plantCode: this.p.plantCode,
      subinventoryCode: this.p.currentSubinventoryCode,
      subinventoryAllocation: this.p.currentSubinventoryAllo,
      itemCode: this.p.itemCode
    };
    return dto;
  }

  LoadData() {
    this.commonQueryService.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  expColumns = this.columns;
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction({ url: this.querydata.urlChild, method: 'GET' }, this.cloneParam(), this.excelexport, this.context);
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


