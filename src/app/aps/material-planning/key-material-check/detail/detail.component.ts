import { Component, OnInit } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-key-material-detail',
  templateUrl: './detail.component.html'
})
export class KeyMaterialDetailComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modalRef: NzModalRef,
    private commonQueryService: CommonQueryService,
  ) {
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
    { field: 'componentItemCode', headerName: '物料编码', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'componentItemDesc', headerName: '物料描述', width: 180, menuTabs: ['filterMenuTab'] },
    { field: 'demandDate', headerName: '需求日期', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'netReqQty', headerName: '需求数量', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'stockQty', headerName: '库存可用', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'deliveryQty', headerName: '送货计划', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'arrivalDate', headerName: '到货日期', width: 130, menuTabs: ['filterMenuTab'] },
  ];

  ngOnInit() {
    this.gridData = this.data.keyMaterialDetailList;
  }
}
