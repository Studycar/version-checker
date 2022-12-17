import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/Observable';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()

export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }

  commonUrl = '/api/ps/pstechnicalmodify/';

  queryUrl = this.commonUrl + 'queryTechnicalModifyPage';
  queryHttpAction = { url: this.queryUrl, method: 'GET' };

  queryAddUrl = this.commonUrl + 'queryTechnicalModify';
  queryAddHttpAction = { url: this.queryAddUrl, method: 'GET' };

  queryAddDetailUrl = this.commonUrl + 'queryTechnicalModifyDetail';
  queryAddDetailHttpAction = { url: this.queryAddDetailUrl, method: 'GET' };

  /** 技改保存 */
  public saveTechnicalModify(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.commonUrl + 'saveTechnicalModify', dto);
  }
}
