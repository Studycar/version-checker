import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { filter } from 'rxjs/operators';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'share-plan-share-merge-rule',
  templateUrl: './share-merge-rule.component.html',
})
export class SharePlanShareMergeRuleComponent implements OnInit {
  organizationids: any[] = [];
  queryParams: any = {};
  url = '/user';
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st', {static: true}) st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '调用次数', type: 'number', index: 'callNo' },
    { title: '头像', type: 'img', width: '50px', index: 'avatar' },
    { title: '时间', type: 'date', index: 'updatedAt' }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private commonqueryService: CommonQueryService
  ) { }
  public clear() {
    this.queryParams = { strPlantCode: ''};
  }

  // ngOnInit() { }
  public ngOnInit(): void {
    /** 初始化 主组织  下拉框*/
    this.commonqueryService.GetUserPlant().subscribe(result => {
      this.organizationids = result.Extra;
      console.log(this.organizationids);
    });

    this.clear();
  }
  public add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

}
