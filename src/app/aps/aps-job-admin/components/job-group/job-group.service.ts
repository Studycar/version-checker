import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { translateToGetParams } from '../../services/aps-job-admin.service';
import {
  JobAdminApiData,
  JobAdminMessageApiData,
  JobGroupListParam, JobGroupRemoveParam,
  JobGroupUpdateParam,
} from '../../aps-job-admin.type';

@Injectable()
export class JobGroupService {

  constructor(
    private http: _HttpClient,
  ) {
  }

  search(params: JobGroupListParam): Observable<JobAdminApiData> {
    const paramStr = translateToGetParams(params);
    return this.http.post<JobAdminApiData>('/aps-job-admin/jobgroup/pageList', paramStr);
  }

  update(params: JobGroupUpdateParam): Observable<JobAdminMessageApiData> {
    const paramStr = translateToGetParams(params);
    return this.http.post<JobAdminMessageApiData>('/aps-job-admin/jobgroup/update', paramStr);
  }

  save(params: JobGroupUpdateParam): Observable<JobAdminMessageApiData> {
    const paramStr = translateToGetParams(params);
    return this.http.post<JobAdminMessageApiData>('/aps-job-admin/jobgroup/save', paramStr);
  }

  remove(params: JobGroupRemoveParam): Observable<JobAdminMessageApiData> {
    const paramStr = translateToGetParams(params);
    return this.http.post<JobAdminMessageApiData>('/aps-job-admin/jobgroup/remove', paramStr);

  }
}
