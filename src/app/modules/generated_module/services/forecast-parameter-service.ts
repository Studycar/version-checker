/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-08-22 14:49:28
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-03 09:12:07
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class ForeastParameterService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    url = '/afs/serverppforecastparameter/ServerPPForecastParameter/GetData';
    saveDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaselookupcode/lookupcode/savelookupvalue';
    UpdateDetailUrl = '';
    DeleteDetailUrl = '';

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppforecastparameter/ServerPPForecastParameter/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }

    EditData(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppforecastparameter/ServerPPForecastParameter/EditData',
            {
                dto
            }
        );
    }

    remove(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppforecastparameter/ServerPPForecastParameter/remove',
            {
                dto
            }
        );
    }

    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppforecastparameter/ServerPPForecastParameter/RemoveBath',
            {
                dtos
            }
        );
    }

    GetCurrentBuyer(userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcsupplier/Supplier/GetCurrentBuyer?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }

    SaveForNew(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppforecastparameter/ServerPPForecastParameter/SaveForNew',
            {
                dto
            }
        );
    }

    getVersion(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppforecastparameter/ServerPPForecastParameter/GetVersion',
            {

            }, { method: 'GET' }
        );
    }

    GetDetail(code: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaselookupcode/lookupcode/querylookupvalue?strLookUpTypeCode=' + code,
            {
            }, { method: 'GET' });
    }

    GetAppliaction(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaselookupcode/lookupcode/Getappliaction',
            {
            });
    }

    RemoveLookupCodeVaule(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.DeleteDetailUrl,
            {
                dto: dto
            });
    }

}
