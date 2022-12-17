import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
import { BrandService } from 'app/layout/pro/pro.service';
import { ActivatedRoute } from '@angular/router';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-material-sap-process-grid',
  templateUrl: './material-sap-process-grid.component.html',
  providers: [QueryService],
})
export class MaterialmanagementSapProcessGridComponent extends CustomBaseContext implements OnInit {
  public ITEM_ID = null;
  public PLANT_CODE = null;
  gridHeight = 350;

  columns = [
    { field: 'PLANT_CODE', headerName: '工厂', width: 80 },
    { field: 'ITEM_CODE', headerName: '物料号', width: 100 },
    { field: 'ITEM_DESC', headerName: '物料描述', tooltipField: 'ITEM_DESC', width: 120 },
    { field: 'PROCESS_LINE_NO', headerName: '工序行号', width: 120 },
    { field: 'WORK_CENTER', headerName: '工作中心', width: 120 },
    { field: 'CONTROL_CODE', headerName: '控制码', width: 100 },
    { field: 'PROCESS_DESC', headerName: '工序短文本', width: 120 },
    { field: 'PROCESS_QTY', headerName: '数量', width: 80 },
    { field: 'PROCESS_QTY_UNIT', headerName: '单位', width: 80 }
  ];

  iconStyle = {
    width: '25px',
    height: '25px',
  };

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    public translateservice: AppTranslationService,
    public modalService: NzModalService,
    public appService: AppConfigService,
    private commonquery: CommonQueryService,
    public route: ActivatedRoute,
    private queryService: QueryService
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.query();
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  public queryCommon() {
    const queryValues = {
      plantCode: this.PLANT_CODE,
      itemId: this.ITEM_ID
    };

    const httpAction = {
      url: '/afs/serverpsmaterialprocess/psmaterialprocess/querySapProcess',
      method: 'GET'
    };

    this.commonquery.loadGridView(httpAction, queryValues, this);
  }

  reload() {
    this.queryService.SyncSapProcess().subscribe(result => {
      if (result.Success) {
        this.msgSrv.success(this.translateservice.translate('请求提交成功'));
      } else {
        this.msgSrv.error(this.translateservice.translate(result.Message));
      }
    });
  }
}
