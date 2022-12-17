import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  queryUrl = '/api/admin/baseusers/userRespPage';
  exportUrl = '/api/admin/baseusers/userRespList';
  /** 用户职责搜索 */
  SearchUserResp(userId: any, page: number, pageSize: number): Observable<ResponseDto> {
    return this.http
      .get('/api/admin/baseusers/userRespPage', {
        userId: userId,
        page: page,
        pageSize: pageSize
      });
  }
  /** 获取用户职责导出数据 */
  ExportUserResp(userId: any): Observable<ResponseDto> {
    return this.http
      .get('/api/admin/baseusers/userRespList', {
        userId: userId
      });
  }

  /** 导入excel数据 */
  public importUserResp(dtos: any[]): Observable<ResponseDto> {
    return this.http.post('/api/admin/baseusers/importUserResp',  dtos );
  }
}


