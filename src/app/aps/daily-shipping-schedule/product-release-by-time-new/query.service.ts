import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';

@Injectable()
export class QueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }
  public queryUrl = '/api/ps/release/calculation/query';

  /** 提交请求 */
  SubmitReq(day: any): Observable<ActionResponseDto> {
    return this.http.post('/api/ps/release/calculation/compute', { day: day });
  }
}

