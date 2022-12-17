import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ExecutablesInputDto } from 'app/modules/generated_module/dtos/executables-input-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
/** 快码管理服务 */
export class ExecutablesManageService {
  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient,
  ) { }

  Insert(dto: {[key: string]: any}): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/baseexecutables/insert',
      {
        ...dto
      });
  }

  Update(dto: {[key: string]: any}): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/baseexecutables/update',
      {
        ...dto
      });
  }

  Delete(id: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/baseexecutables/delete',
      id);
  }

  GetBaseApplication(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/baseexecutables/queryApplicationModule',
      {});
  }

  /* QueryOne(executable_id: string): Observable<ActionResponseDto> {
       return this.appApiService.call<ActionResponseDto>(
           '/afs/serverbaseexecutables/ExecutablesService/queryone?executable_id=' + executable_id,
           {
           }, { method: 'GET' });
   }*/

  QueryByPage(params: {[key: string]: any}): Observable<ResponseDto> {
    return this.http.get<ResponseDto> (
      '/api/admin/baseexecutables/querybypage',
      { ...params }
    );
  }

  Query(params: {[key: string]: any}): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/baseexecutables/querybypage',
      {
        ...params
      });
  }
}
