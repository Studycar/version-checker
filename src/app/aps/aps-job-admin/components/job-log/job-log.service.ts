import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JobAdminApiData, JobGroupListParam, JobLogListParam } from '../../aps-job-admin.type';
import { translateToGetParams } from '../../services/aps-job-admin.service';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class JobLogService {

  constructor(
    private http: _HttpClient,
  ) {
  }

  search(params: JobLogListParam): Observable<JobAdminApiData> {
    const paramStr = translateToGetParams(params);
    return this.http.post<JobAdminApiData>('/aps-job-admin/joblog/pageList', paramStr);
  }

  getJobGroup(): Observable<any[]> {
    const jobGroup = [
      { label: '全部', value: 0 },
      { label: 'aps接口平台执行器', value: 5 },
      { label: 'APS-MRP执行器', value: 3 },
      { label: 'aps-备料执行器', value: 4 },
      { label: 'PC-备料计算-齐套计算', value: 6 },
      { label: 'APS执行器', value: 2 },
      { label: '示例执行器', value: 1 },
    ];
    return of(jobGroup);
  }

  getJobId(): Observable<any[]> {
    const jobGroup = [
      { label: '全部', value: 0 },
    ];
    return of(jobGroup);
  }

  getLogStatus(): Observable<any[]> {
    const jobGroup = [
      { label: '全部', value: -1 },
      { label: '成功', value: 1 },
      { label: '失败', value: 2 },
      { label: '进行中', value: 3 },
    ];
    return of(jobGroup);
  }
}
