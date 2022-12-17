import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
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
    return this.http.get('/api/ps/ppshareplanheader/queryMainData',  dto);
  }

    /** 搜索明细 */
  SearchDetail(dto: any): Observable<ResponseDto> {
    return this.http.get('/api/ps/ppshareplanheader/queryDetailData', dto);
  }

  queryListMrpSupply =  '/api/mrp/mrpsupply/listMrpSupply'; //计划单组件清单查询

}

