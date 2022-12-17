import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
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
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }

  /** 搜索 */
  Search(dto: any): Observable<ResponseDto> {
    return this.http.get('/api/ps/ppMtsPegging/query', dto);
  }

    /** 搜索明细 */
    SearchDetail(dto: any): Observable<ResponseDto> {
      return this.http.post('/api/ps/ppMtsPegging/queryDetail', dto);
    }

    /** 生成净需求 */
    setReqOrder(plantCode: string): Observable<ResponseDto> {
      return this.http.get('/api/ps/ppMtsPegging/netDemandGeneration',
      {   plantCode : plantCode});
    }
}

