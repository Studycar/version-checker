/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:15
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 11:17:37
 */
import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { OperationLeadTimeService } from '../../../../modules/generated_module/services/operation-leadtime-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'process-schedule-operation-lead-time-edit',
  templateUrl: './edit.component.html',
})
export class ProcessScheduleOperationLeadTimeEditComponent implements OnInit {
  record: any = {};
  i: any;
  plantoptions: any[] = [];
  categoryoptions: any[] = [];
  relationoptions: any[] = [];
  title: String = '新增';
  processoptions: any[] = [];
  valueoptions: any[] = [];
  randomUserUrl: any;
  isLoading: any;

  readOnly: boolean;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private querydata: OperationLeadTimeService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.readOnly = false;
    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.plantChange('');
      this.querydata.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
        this.valueoptions.push(res.data.categoryValue);
      });
    }
    this.LoadData();
  }

  save() {
    if (this.i.id !== null) {
      this.querydata.Edit(this.i).subscribe(res => {
        if (res.code===200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    } else {
      this.querydata.SaveForNew(this.i).subscribe(res => {
        if (res.code===200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('PS_DIMENSION').subscribe(res => {
      res.data.forEach(element => {
        this.categoryoptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('PS_OP_RELATION_TYPE').subscribe(res => {
      res.data.forEach(element => {
        this.relationoptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }

  plantChange(value: any) {
    this.i.upstreamProcessCode = null;
    this.i.downstreamProcessCode = null;
    while (this.processoptions.length !== 0) {
      this.processoptions.pop();
    }

    this.querydata.GetProcess(value).subscribe(res => {
      res.data.forEach(element => {
        this.processoptions.push({
          label: element.processCode,
          value: element.processCode
        });
      });
    });

    this.onSearch(value);
  }

  upChange(value: any) {
    if (this.i.downstreamProcessCode === value) {
      alert('上游工序和下游工序不能相同');
      this.i.upstreamProcessCode = '';
    }
  }

  downChange(value: any) {
    if (this.i.upstreamProcessCode === value) {
      alert('上游工序和下游工序不能相同');
      this.i.downstreamProcessCode = '';
    }
  }

  categoryChange(value: any) {
    this.i.valueoptions = [];
    this.onSearch('');
  }

  // // * 每次下拉，获取nextPage
  // loadMore(): void {
  //   console.log("this.i   :",this.i);
  //   this.randomUserUrl = '/afs/serverpsoperationleadtime/OperationLeadTime/GetCategoryValue?plantCode=' + this.i.plantCode  + '&category=' + this.i.category + '&pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize + '&codes=' + this.k;
  //   this.isLoading = true;
  //   this.querydata.getRandomNameList(this.randomUserUrl).subscribe(data => {
  //     this.isLoading = false;
  //     this.valueoptions = [...this.valueoptions, ...data];
  //   });

  //   this.pageIndex++;
  // }


  // * 每次下拉，获取nextPage
  loadMore(): void {
    this.randomUserUrl = '/api/ps/psOperationLeadTime/getCategoryValue?plantCode=' + this.i.plantCode  + '&category=' + this.i.category + '&pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize + '&codes=' + this.k;
    this.isLoading = true;
    this.querydata.getRandomNameList(this.randomUserUrl).subscribe(data => {
      this.isLoading = false;
      this.valueoptions = [...this.valueoptions, ...data];
    });

    this.pageIndex++;
  }



  // * 搜索
  pageIndex: any = 1;
  pageSize: any = 10;
  k: any;
  onSearch(value: string): void {
    this.pageIndex = 1;
    this.valueoptions = [];
    this.isLoading = true;
    this.k = value;
    this.loadMore();
  }
}
