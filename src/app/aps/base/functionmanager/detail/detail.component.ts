import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from '../query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { BaseFunctionmanagerDetailConfigComponent } from './config/config.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-functionmanager-detail',
  templateUrl: './detail.component.html',
  providers: [QueryService]
})
export class BaseFunctionmanagerDetailComponent extends CustomBaseContext implements OnInit {
  @Input()
  id = '';
  public gridHeight = 300;
  constructor(
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private queryService: QueryService
  ) {
    super({ pro: null, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.loadData();
  }

  public columns = [
    { field: 'operationCode', headerName: '操作编码', menuTabs: ['filterMenuTab'] },
    { field: 'operationDesc', headerName: '操作描述', menuTabs: ['filterMenuTab'] },
    { field: 'methodName', headerName: '操作方法', menuTabs: ['filterMenuTab'] },
  ];

  // 加载数据
  loadData() {
    this.queryService.GetFunctionOperations(this.id).subscribe(res => {
      if (res.Success) {
        this.gridData = res.Extra;
      }
    });
  }
  // 操作配置
  setting() {
    console.log('setting');
    this.modal
      .static(
        BaseFunctionmanagerDetailConfigComponent,
        { id: this.id },
        'lg',
      )
      .subscribe((value) => {
        // if (value) {
        this.loadData();
        // }
      });
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  // 导出
  export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }
}
