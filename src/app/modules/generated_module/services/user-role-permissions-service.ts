/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-08-23 15:10:22
 * @LastEditors: Zwh
 * @LastEditTime: 2019-08-26 16:03:57
 * @Note: ...
 */
import { Injectable, Inject } from '@angular/core';
import { Observable,  } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ReturnStatement } from '@angular/compiler';
import { timingSafeEqual } from 'crypto';
import { UserItemCategoryDto } from '../dtos/user-item-category-dto';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class UserRolePermissionsService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    url = '/afs/serverppuserrolepermissions/ServerPPUserRolePermissions/GetData';

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverppuserrolepermissions/ServerPPUserRolePermissions/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }

    EditData(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverppuserrolepermissions/ServerPPUserRolePermissions/EditData',
            {
                dto
            }
        );
    }

    SaveForNew(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverppuserrolepermissions/ServerPPUserRolePermissions/SaveForNew',
            {
                dto
            }
        );
    }


    remove(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverppuserrolepermissions/ServerPPUserRolePermissions/remove',
            {
                dto
            }
        );
    }


    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverppuserrolepermissions/ServerPPUserRolePermissions/RemoveBath',
            {
                dtos
            }
        );
    }
}
