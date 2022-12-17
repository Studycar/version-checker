import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class MoExceptionService {
    constructor(
        private appApiService: AppApiService,
        public http: _HttpClient
    ) { }

    url = '/afs/serverpsmoexception/psmoexception/GetData';
    exportUrl = '/afs/serverpsmoexception/psmoexception/Export';

    GetMoStatus(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpsmoexception/psmoexception/GetMoStatus',
            {

            }, { method: 'GET'}
        );
    }

    GetGroup(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpsmoexception/psmoexception/GetGroup',
            {

            }, { method: 'GET' }
        );
    }

    GetResource(groupCode: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpsmoexception/psmoexception/GetResource?groupCode=' + groupCode,
            {

            }, { method: 'GET'}
        );
    }

    checkPlanning(userId: string, productLineGroupId: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '',
            {
                userId: userId,
                productLineGroupId: productLineGroupId
            }
        );
    }

    getItemId(value: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpsmoexception/psmoexception/GetItemId?itemCode=' + value,
            {

            }, { method: 'GET'}
        );
    }
}
