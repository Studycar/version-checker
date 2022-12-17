import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends CommonQueryService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  /** 加载查询页面初始化数据 */
  QueryMainData(dto: any): Observable<ResponseDto> {
    return this.http.get('/api/ps/psbalancecheckdemand/querySupplyDemandCheck', dto);
  }

  /** 搜索明细 */
  QueryDemandDetail(dto: any): Observable<ResponseDto> {
    return this.http.get('/api/ps/psbalancecheckdemand/queryDemandDetail', dto);
  }

  /** 查询供应 */
  QuerySupplyDetail(dto: any): Observable<ResponseDto> {
    return this.http.get('/api/ps/psbalancecheckdemand/querySupplyDetail', dto);
  }

  /** 查询供应 */
  SubmitReq(plantCode: any): Observable<ResponseDto> {
    return this.http.get('/api/ps/psbalancecheckdemand/submitReq', {
      'plantCode' : plantCode
    });
  }
}

