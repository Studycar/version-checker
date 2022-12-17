import { Component, Input, OnInit } from '@angular/core';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { BrandService } from '../../../../layout/pro/pro.service';
import { PriorityCalculationResultsService } from '../priority-calculation-results.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  selector: 'pcr-detail',
  templateUrl: './pcr-detail.component.html',
  styleUrls: ['./pcr-detail.component.css'],
})
export class PcrDetailComponent extends CustomBaseContext implements OnInit {
  title = '订单优先级明细';
  @Input() public item?;
  priorityList: any[] = [];
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private pcrService: PriorityCalculationResultsService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
  }

  ngOnInit() {
    this.columns = [
      // { field: 'ID', headerName: '行ID' },
      { field: 'divisionName', headerName: '优先级维度', valueFormatter: 'ctx.optionsFind(value,1).label', },
      { field: 'factValue', headerName: '值' },
      { field: 'grade', headerName: '区间得分' },
      { field: 'ratio', headerName: '维度权重' },
    ];
    this.commonQueryService.GetLookupByTypeRef('PP_ORDER_PRIORITY_DIVISION', this.priorityList);
    this.query();
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.priorityList;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  query() {
    this.pcrService.queryDetail({ id: this.item.id }, this);
  }

  close() {
    this.modal.destroy();
  }

}
