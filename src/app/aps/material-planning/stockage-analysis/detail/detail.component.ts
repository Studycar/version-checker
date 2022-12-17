import { Component, OnInit } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-stockage-analysis-detail',
  templateUrl: './detail.component.html'
})
export class StockageAnalysisDetailComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modalRef: NzModalRef,
    private commonQueryService: CommonQueryService) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  data: any;
  gridHeight = 350;
  orderTypeOption: any[] = [];
  columns = [
    { field: 'plantCode', headerName: '工厂', width: 80, menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', width: 180, menuTabs: ['filterMenuTab'] },
    { field: 'subinventoryCode', headerName: '仓库', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'batchCode', headerName: '批次号', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'deliveryDate', headerName: '收货日期', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'onhandQuantity', headerName: '现有量', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'termOfValidity', headerName: '有效期至', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'status', headerName: '状态', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'termOfValidityIn', headerName: '有效期内需求', width: 140, menuTabs: ['filterMenuTab'] },
    { field: 'termOfValidityOut', headerName: '有效期外需求', width: 140, menuTabs: ['filterMenuTab'] },
  ];

  ngOnInit() {
    this.gridData = this.data.listStockDetail;
  }
}
