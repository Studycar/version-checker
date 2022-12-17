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
  queryUrl = '/afs/serverapidisplay/ApiDisplayService/QueryInfo';
  exportUrl = '/afs/serverapidisplay/ApiDisplayService/ExportInfo';
  // 获取接口注册信息
  GetApiAllList(): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/api/api/apidisplayconfig/listDisplayConfig'
    );
  }

  // 获取接口展示配置表(加载接口编码)
  public GetDisplayConfig(API_CODE: string = ''): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapidisplay/ApiDisplayService/GetDisplayConfig', { API_CODE: API_CODE }
    );
  }
  // 获取接口表待选择字段
  public GetDisplayFields(TABLE_NAME: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/api/api/apidisplayconfig/listDisplayFields', { apiCode: '', tableName: TABLE_NAME }
    );
  }
  // 获取已配置展示列
  public GetDisplayColumns(API_CODE: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/api/api/apidisplayconfig/listDisplayColumns', { apiCode: API_CODE }
    );
  }
  // 保存接口配置展示列信息
  public Save(dtos: any[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/api/api/apidisplayconfig/saveDisplayConfig', dtos
    );
  }
}
