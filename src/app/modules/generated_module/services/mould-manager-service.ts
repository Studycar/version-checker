/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-09-11 11:11:12
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-20 14:55:58
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { MaterialmaintenanceInputDto } from 'app/modules/generated_module/dtos/Materialmaintenance-input-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class MouldManagerService {
    constructor(private appApiService: AppApiService,
        public http: _HttpClient
    ) { }
    seachUrl = '/afs/serverppmouldmanager/ServerPPMouldManager/GetData';
    ExportUrl = '/afs/serverpsitemdefine/psitemdefine/ExportMatemaintenance';

    GetById(id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppmouldmanager/ServerPPMouldManager/GetById?id=' + id,
            {
            }, { method: 'GET' });
    }

    Edit(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppmouldmanager/ServerPPMouldManager/Edit',
            {
                dto
            });
    }

    Remove(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppmouldmanager/ServerPPMouldManager/remove',
            {
                dto
            });
    }

    SaveForNew(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppmouldmanager/ServerPPMouldManager/SaveForNew',
            {
                dto
            });
    }

    RemoveBatch(dto: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppmouldmanager/ServerPPMouldManager/RemoveBath',
            {
                dto
            });
    }

}
