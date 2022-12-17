import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 管理并发管理器服务 */
export class ConcurrentManagerService {
    constructor(private appApiService: AppApiService) { }
    URL_Prefix = '/api/admin/baseConcurrentManagersTl/';
    searchUrl = this.appApiService.appConfigService.getApiUrlBase() + this.URL_Prefix + 'query';
    searchRequestUrl = this.appApiService.appConfigService.getApiUrlBase() + this.URL_Prefix + 'queryrequestbyid';

    Query(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'queryconcurrentmanager',
            {
            }, { method: 'GET' });
    }

    QueryRequest(controllingManager: string, nodeName1: string, page: number, pageSize: number): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            this.URL_Prefix + 'queryrequestbyid?controllingManager=' + controllingManager + '&nodeName1=' + nodeName1 + '&page=' + page + '&pageSize=' + pageSize,
            {
            }, { method: 'GET' });
    }

    /** 获取控制命令 */
    GetControlById(concurrentManagerId: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'getcontrolcodebyid?concurrentManagerId=' + concurrentManagerId,
            {
            }, { method: 'GET' });
    }

    /** 修改控制命令 */
    UpdateControlCodeByID(concurrentManagerId: string, controlCode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'updateControlCodeByID',
            {
                id: concurrentManagerId,
                controlCode: controlCode
            }
        );
    }
}
