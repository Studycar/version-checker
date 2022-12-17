import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { PsAssemblyRelationService } from '../../../../modules/generated_module/services/ps-assembly-relation-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-psassemblyrelation-edit',
  templateUrl: './edit.component.html',
})
export class PlanschedulePsassemblyrelationEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;

  readOnly: Boolean = false;
  /**计划区域 */
  regionoptions: any[] = [];
  /**工厂 */
  plantoptions: any[] = [];
  /**上游资源值 */
  upresourcevalue: any[] = [];
  /**下游资源值 */
  downresourcevalue: any[] = [];
  /**上游资源值 是否可用 */
  upzyok: Boolean = true;
  /**下游资源值 是否可用 */
  downzyok: Boolean = true;
  /**类别值 */
  categoryvalue: any[] = [];
  title: String = '新增';
  /**工厂 是否可用 */
  plantok: Boolean = true;
  /**总部装关系 URL */
  randomUserUrl: string;
  /**是否 快码 */
  yesnoOptions: any[] = [];
  isLoading: Boolean;
  pageIndex: number;
  pageSize: number;
  k: string;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    public queryservice: PsAssemblyRelationService,
    private appConfig: AppConfigService,
    private commonQuery: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.k = '';
    if (this.i.Id !== null) {
      this.title = '编辑';
      this.queryservice.GetById(this.i.Id).subscribe(res => {
        this.i.resourceDimension = res.data.resourceDimension;
        this.regionChange(res.data.scheduleRegionCode);
        this.upplantChange(res.data.upstreamPlantCode);
        this.downplantChange(res.data.downstreamPlantCode);
        this.categoryvalue.push(res.data.categoryValues);
        this.i = res.data;
      });
      this.readOnly = true;
    } else {
      this.queryservice.GetRegion(this.appConfig.getPlantCode()).subscribe(res => {
        this.i.scheduleRegionCode = res.data.scheduleRegionCode;
        this.regionChange(this.i.scheduleRegionCode);
        this.i.upstreamPlantCode = this.appConfig.getPlantCode();
        this.upplantChange(this.i.upstreamPlantCode);
        this.i.downstreamPlantCode = this.appConfig.getPlantCode();
        this.downplantChange(this.i.downstreamPlantCode);
      });
      this.i.resourceDimension = '1';
      this.i.enableFlag = 'Y';
    }
    this.LoadData();
    this.iClone = Object.assign({}, this.i);
  }
  private LoadData() {
    // 计划区域
    this.commonQuery.GetScheduleRegions().subscribe(res => {
      res.data.forEach(element => {
        this.regionoptions.push({
          label: element.scheduleRegionCode,
          value: element.scheduleRegionCode
        });
      });
    });

    this.commonQuery.GetLookupByTypeLang('FND_YES_NO', this.appConfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.yesnoOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }

  /**重置 */
  clear() {
    if (this.i.Id !== null) {
      this.queryservice.GetById(this.i.Id).subscribe(res => {
        this.regionChange(res.data.scheduleRegionCode);
        this.upplantChange(res.data.upstreamPlantCode);
        this.downplantChange(res.data.downstreamPlantCode);
        this.categoryvalue.push(res.data.categoryValues);
        this.i = res.data;
      });
    } else {
      this.i = {};
    }
  }
  /**保存 */
  save() {
    if (this.i.Id !== null) {
      this.queryservice.Edit(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.queryservice.SaveForNew(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }
  /**关闭 */ 
  close() {
    this.modal.destroy();
  }

  /**切换值类别 */
  categorychange(value: any) {
    this.categoryvalue.length = 0;
    this.i.categoryValues = null;
    this.pageIndex = 1;
    this.loadMore();
  }
  /**切换计划区域 */
  regionChange(value: any) {
    this.i.upstreamPlantCode = null;
    this.i.downstreamPlantCode = null;
    this.plantok = false;
    this.plantoptions.length = 0;

    this.commonQuery.GetUserPlant(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  /**切换上游工厂 */
  upplantChange(value: any) {
    this.upzyok = false;
    this.upresourcevalue.length = 0;   
    this.i.upstreamValues = null;
    if (this.i.resourceDimension === '1') {
      this.queryservice.GetResource(value).subscribe(res => {
        res.data.forEach(element => {
          this.upresourcevalue.push({
            label: element.resourceCode,
            value: element.resourceCode
          });
        });
      });
    } else {
      this.commonQuery.GetUserPlantGroup(value).subscribe(res => {
        res.Extra.forEach(element => {
          this.upresourcevalue.push({
            label: element.scheduleGroupCode,
            value: element.scheduleGroupCode
          });
        });
      });
    }
  }
  /**切换下游工厂 */
  downplantChange(value: any) {
    this.downzyok = false;
    this.downresourcevalue.length = 0;  
    this.i.downstreamValues = null;
    if (this.i.resourceDimension === '1') {
      this.queryservice.GetResource(value).subscribe(res => {
        res.data.forEach(element => {
          this.downresourcevalue.push({
            label: element.resourceCode,
            value: element.resourceCode
          });
        });
      });

    } else {
      this.commonQuery.GetUserPlantGroup(value).subscribe(res => {
        res.Extra.forEach(element => {
          this.downresourcevalue.push({
            label: element.scheduleGroupCode,
            value: element.scheduleGroupCode
          });
        });
      });
    }
  }

  loadMore(): void {
    this.randomUserUrl = '/api/ps/psresourcelinkage/getValues?category=' + this.i.category + '&pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize + '&k=' + this.k + '&upstreamPlantCode='+this.i.upstreamPlantCode;
    this.isLoading = true;
    this.queryservice.getRandomNameList(this.randomUserUrl).subscribe(data => {
      this.isLoading = false;
      this.categoryvalue = [...this.categoryvalue, ...data];
    });

    this.pageIndex++;
  }

  // 搜索
  onSearch(value: string): void {
    this.pageIndex = 1;
    this.categoryvalue = [];
    this.isLoading = true;
    this.k = value;
    this.loadMore();
  }
  /**切换资源维度 */
  dimenChange(value: any) {
    this.i.upstreamValues = null;
    this.i.downstreamValues = null;
    this.downresourcevalue.length = 0;
    this.upresourcevalue.length = 0;
    if (value === '1') {
      if (this.i.upstreamPlantCode !== undefined) {
        this.queryservice.GetResource(this.i.upstreamPlantCode).subscribe(res => {
          res.data.forEach(element => {
            this.upresourcevalue.push({
              label: element.resourceCode,
              value: element.resourceCode
            });
          });
        });
      }
      if (this.i.downstreamPlantCode !== undefined) {
        this.queryservice.GetResource(this.i.downstreamPlantCode).subscribe(res => {
          res.data.forEach(element => {
            this.downresourcevalue.push({
              label: element.resourceCode,
              value: element.resourceCode
            });
          });
        });
      }
    } else {
      if (this.i.upstreamPlantCode !== undefined) {
        this.queryservice.GetGroup(this.i.upstreamPlantCode).subscribe(res => {
          res.data.forEach(element => {
            this.upresourcevalue.push({
              label: element.scheduleGroupCode,
              value: element.scheduleGroupCode
            });
          });
        });
      }
      if (this.i.downstreamPlantCode !== undefined) {
        this.queryservice.GetGroup(this.i.downstreamPlantCode).subscribe(res => {
          res.data.forEach(element => {
            this.downresourcevalue.push({
              label: element.scheduleGroupCode,
              value: element.scheduleGroupCode
            });
          });
        });
      }
    }
  }

}
