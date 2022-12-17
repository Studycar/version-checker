import { Injectable } from '@angular/core';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()

export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }
  baseUrl = '/api/ps/psmarkupcharges';
  seachUrl = '/api/ps/psmarkupcharges/getList';
  public queryChangeDetailUrl = this.baseUrl + '/history/query';
  /** 编辑是否有效 --over*/
  edit(dto: any): Observable<ResponseDto> {
    return this.http.post('/api/ps/psmarkupcharges/saveData', dto);
  }

  get(id: string): Observable<ResponseDto> {
    return this.http.get<any>(
      `/api/ps/psmarkupcharges/queryById/${id}`
    );
  }



  /**批量删除 */
  removeBatch(ids: string[]): Observable<ResponseDto> {
    return this.http.post('/api/ps/psmarkupcharges/deleteList', ids);
  }

  getMakeOrderList(plantCode: string): Observable<ResponseDto> {
    return this.http.get<any>(
      '/api/ps/psmarkupcharges/queryMakeOrderList', { plantCode: plantCode }
    );
  }

}
