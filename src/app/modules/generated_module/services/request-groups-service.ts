import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { RequestGroupsInputDto } from '../dtos/request-groups-input-dto';
import { RequestGroupsUnitInputDto } from '../dtos/request-groups-unit-input-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 服务节点定义服务 */
export class RequestGroupsService {
    constructor(private appApiService: AppApiService) { }
    URL_Prefix = '/api/admin/baserequestgroup/';

    queryBaseRequestGroups(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'queryBaseRequestGroups',
            {
            }, { method: 'GET' });
    }

    insertBaseRequestGroups(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'insertBaseRequestGroups', dto);
    }

    updateBaseRequestGroups(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'updateBaseRequestGroups', dto);
    }

    deleteBaseRequestGroups(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'deleteBaseRequestGroups', id);
    }

    insertBaseRequestGroupUnits(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'insertBaseRequestGroupUnits', dto);
    }

    deleteBaseRequestGroupUnits(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'deleteBaseRequestGroupUnits', id);
    }

    /** 获取所有应用程序 */
    GetAppliaction(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/application/list',
            {
            }, { method: 'GET' });
    }

    queryLookUpDataDetail(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'queryLookUpDataDetail', {}, { method: 'GET' });
    }
}
