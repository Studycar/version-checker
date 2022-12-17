import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


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
    return this.http.get('/api/ps/psGaSchemeGrade/queryPlanProduction', dto);
  }
  /** 搜索版本号链接明细 */
  SearchVersionDtl(dto: any): Observable<ResponseDto> {
    return this.http.get('/api/ps/psGaSchemeGrade/queryVersionDtl', dto);
  }

  /** 搜索评分链接明细 */
  SearchScoreDtl(dto: any): Observable<ResponseDto> {
    return this.http.get('/api/ps/psGaSchemeGrade/queryScoreDtl', dto);
  }

  SetMarkOrderType(popuId: string): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/psGaSchemeGrade/setMarkOrderType', {
        popuId
      });
  }
}

