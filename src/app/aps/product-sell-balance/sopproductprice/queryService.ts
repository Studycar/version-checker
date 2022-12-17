import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()

export class PriceQueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }
  baseUrl = '/api/sop/sopProductPrice/';
  queryUrl = this.baseUrl + 'query';
  /** 新增/编辑 */
  Save(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'save',
        dto,
    );
  }
  /** 批量删除 */
  RemoveBatch(ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'delete',
        ids,
    );
  }
}
