import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable, of } from 'rxjs';

@Injectable()
export class EditJobInfoService {

  constructor(
    public http: _HttpClient,
  ) {
  }

  getJobHandler(): Observable<any> {
    return of([
      {
        label: 'MRP',
        value: 0,
      },
      {
        label: 'pc齐套',
        value: 1,
      },
      {
        label: 'pc备料',
        value: 2,
      },
    ]);
    // return this.commonQueryService.GetLookupByType(type).pipe();
  }

  getExecutorRouteStrategies(): Observable<any[] | null> {
    return of([
      { label: '第一个', value: 'FIRST' },
      { label: '最后一个', value: 'LAST' },
      { label: '轮询', value: 'ROUND' },
      { label: '随机', value: 'RANDOM' },
      { label: '一致性HASH', value: 'CONSISTENT_HASH' },
      { label: '最不经常使用', value: 'LEAST_FREQUENTLY_USED' },
      { label: '最近最久未使用', value: 'LEAST_RECENTLY_USED' },
      { label: '故障转移', value: 'FAILOVER' },
      { label: '忙碌转移', value: 'BUSYOVER' },
      { label: '分片广播', value: 'SHARDING_BROADCAST' },
    ]);
  }

  getJobInfo(): Observable<any> {
    return of('');
  }

  /**
   * 保存jobInfo
   * @return {Observable<any>}
   */
  saveJobInfo(): Observable<any> {
    return of();
  }
}
