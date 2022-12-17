import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';

@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  queryUrl = '/api/api/apidisplayconfig/pagePiData';
  exportUrl = '/api/api/apidisplayconfig/pagePiData';

  // 获取接口展示配置表(加载接口编码)
  public GetDisplayConfig(API_CODE: string = ''): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/api/api/apidisplayconfig/pagePiData', { apiCode: API_CODE }
    );
  }
  // 获取接口展示列
  public GetDisplayColumns(API_CODE: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapidisplay/ApiDisplayService/GetDisplayColumns', { API_CODE: API_CODE }
    );
  }
}
