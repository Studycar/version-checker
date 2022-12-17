import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
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

  CommonUrl = '/api/admin/basefunctionsb/';
  /** 获取操作信息 */
  public GetOperations(): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(this.CommonUrl + 'GetOperations');
  }
  /** 获取单功能操作配置信息 */
  public GetFunctionOperations(functionId: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(this.CommonUrl + 'GetFunctionOperations', { functionId: functionId });
  }
  /** 保存单功能操作配置信息 */
  public SaveFunctionOperations(dtos: any[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(this.CommonUrl + 'SaveFunctionOperations', { dtos: dtos });
  }
}

