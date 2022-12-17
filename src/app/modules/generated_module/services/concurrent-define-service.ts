import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ConcurrentDefineDto, ConcurrentRuleDto } from '../dtos/concurrent-define-dto';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
/** 管理并发管理器服务 */
export class ConcurrentDefineService {
    constructor(
      private appApiService: AppApiService,
      private http: _HttpClient,
    ) { }
    URL_Prefix = '/afs/serverbaseconcurrentdefine/currentdefine/';
    URL_Prefix_Ex = '/afs/serverbaseconcurrentdefine/addrule/';
    searchRuleUrl = this.appApiService.appConfigService.getApiUrlBase() + this.URL_Prefix_Ex + 'queryconcurrentmanagerrule';

    Query(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/admin/baseConcurrentManagers/query'
        );
    }

    Edit(dto: {[key: string]: any}): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
          '/api/admin/baseConcurrentManagers/save',
          dto
        );
    }

    Remove(ids: string[]): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
          '/api/admin/baseConcurrentManagers/delete',
          ids
        );
    }

    GetAppliaction(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/admin/baseexecutables/queryApplicationModule',
          {}
        );
    }

    GetNodes(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/admin/basenodes/querynodes'
        );
    }

    GetTypeDetail(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/admin/baseConcurrentManagers/programQuery',
          {}
        );
    }

    QueryRule(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/admin/baseConcurrentManagers/detailQuery',
          { id }
        );
    }

    RemoveRule(ids: string[]): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
          '/api/admin/baseConcurrentManagers/detailDelete',
          ids
        );
    }

    AddRule(dto: {[key: string]: any}): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
          '/api/admin/baseConcurrentManagers/detailSave',
          dto
        );
    }
}
