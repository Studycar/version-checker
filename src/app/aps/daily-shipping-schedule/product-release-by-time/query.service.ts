import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';

@Injectable()
export class QueryService extends CommonQueryService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  /** 加载查询页面初始化数据 */
  QueryMainData(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post('/afs/ServerSPDailyShippingSchedule/productreleasebytime/QueryMainData', { dto: dto });
  }

  /** 提交请求 */
  SubmitReq(dto: any): Observable<ActionResponseDto> {
    return this.http.post('/afs/ServerSPDailyShippingSchedule/productreleasebytime/SubmitReq', { dto: dto });
  }
}

