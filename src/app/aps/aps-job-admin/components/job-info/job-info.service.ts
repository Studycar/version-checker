import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { translateToGetParams } from '../../services/aps-job-admin.service';
import {
  JobAdminApiData,
  JobAdminMessageApiData,
  JobInfoListParam,
  JobInfoNextExecuteTimeParam,
  JobInfoStartParam,
} from '../../aps-job-admin.type';

@Injectable()
export class JobInfoService {

  constructor(
    private http: HttpClient,
    // private http: _HttpClient,
  ) {
  }

  search(params: JobInfoListParam): Observable<JobAdminApiData> {
      const paramStr = translateToGetParams(params);
      return this.http.post<JobAdminApiData>('/aps-job-admin/jobinfo/pageList', paramStr);
  }

  addTarget() {
  }

  start(id: JobInfoStartParam, status = 0): Observable<JobAdminMessageApiData> {
    const requestStatus = { 1: 'stop', 0: 'start' };
    const paramStr = translateToGetParams(id);
    return this.http.post<JobAdminMessageApiData>(`/aps-job-admin/jobinfo/${requestStatus[status]}`, paramStr);
  }

  getLog() {
  }

  nextExecuteTime(cron: JobInfoNextExecuteTimeParam): Observable<any[] | null> {
    const paramStr = translateToGetParams(cron);
    return this.http.post<JobAdminMessageApiData>('/aps-job-admin/jobinfo/nextTriggerTime', paramStr).pipe(map(res => {
      if (res.code === 200) {
        return res.content;
      } else {
        console.error(`请求失败:${res.msg}`);
      }
    }));
  }

  /**
   * 获取执行器
   * @return {Observable<any[]>}
   */
  getJobGroup(): Observable<any[]> {
    const jobGroup = [
      { label: 'aps接口平台执行器', value: 5 },
      { label: 'APS-MRP执行器', value: 3 },
      { label: 'aps-备料执行器', value: 4 },
      { label: 'PC-备料计算-齐套计算', value: 6 },
      { label: 'APS执行器', value: 2 },
      { label: '示例执行器', value: 1 },
    ];
    return of(jobGroup);
  }

  /**
   * 获取状态
   * @return {Observable<any[]>}
   */
  getTriggerStatus(): Observable<any[]> {
    const triggerStatus = [
      { label: '全部', value: -1 },
      { label: '停止', value: 0 },
      { label: '启动', value: 1 },
    ];
    return of(triggerStatus);
  }

  getRequestTypes(): Observable<any[]> {
    /**
     * 0：MRP
     * 1: 齐套
     * 2：备料
     */
    const requestTypes = [
      { type: ['MrpCalculate', 'MrpDataCollect'], value: 0 },
      { type: ['ApsPcEntityKitWorkTaskHandler'], value: 1 },
      { type: ['PcTaskHandler'], value: 2 },
    ];

    return of(requestTypes);
  }
}



