/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-08-23 15:10:22
 * @LastEditors: Zwh
 * @LastEditTime: 2019-10-17 20:36:09
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class UserDataPermissionsService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    url = '/afs/serverppuserdatapermissionsServerPPUserDataPermissions/GetData';

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppuserdatapermissionsServerPPUserDataPermissions/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }

    EditData(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppuserdatapermissionsServerPPUserDataPermissions/EditData',
            {
                dto
            }
        );
    }

    SaveForNew(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppuserdatapermissionsServerPPUserDataPermissions/SaveForNew',
            {
                dto
            }
        );
    }

    remove(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppuserdatapermissionsServerPPUserDataPermissions/remove',
            {
                dto
            }
        );
    }

    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppuserdatapermissionsServerPPUserDataPermissions/RemoveBath',
            {
                dtos
            }
        );
    }

    getUserGroup(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppuserdatapermissionsServerPPUserDataPermissions/getUserGroup',
            {

            }, { method: 'GET' }
        );
    }

    getUserID(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppuserdatapermissionsServerPPUserDataPermissions/getUserID',
            {

            }, { method: 'GET' }
        );
    }

    getCustDivision(name: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppuserdatapermissionsServerPPUserDataPermissions/getCustDivision?name=' + name,
            {

            }, { method: 'GET' }
        );
    }

}
