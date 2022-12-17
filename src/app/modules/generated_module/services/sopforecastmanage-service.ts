import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class SopForeastManageService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {}

    url = '/api/sop/sopNetForecast/query';
    url2 = '/api/sop/sopNetForecast/detailQuery';
    // exportUrl = '/afs/ServerSopForecastManage/ServerSopForecastManage/exportData';

    /*GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopForecastManage/ServerSopForecastManage/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }*/

    /*GetRegion(plantCode: string, user: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopForecastManage/ServerSopForecastManage/GetPlantBusiness?userid=' + user + '&plantCode=' + plantCode,
            {

            }, { method: 'GET' }
        );
    }*/


    EditData(dto: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
          '/api/sop/sopNetForecast/save',
          dto
        );
    }

    /*remove(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopForeastSet/ServerSopForeastSet/remove',
            {
                dto
            }
        );
    }*/

    ModifyBatch(ids: string[]): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
          '/api/sop/sopNetForecast/batchRelease',
          ids
        );
    }

    /*GetCurrentBuyer(userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetCurrentBuyer?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }*/

    /*SaveForNew(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopForeastSet/ServerSopForeastSet/SaveForNew',
            {
                dto
            }
        );
    }*/

    getBig(businessUnitCode: string, salesType: string, plantCode: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/sop/sopNetForecast/getSalesCategoryBig',
          { businessUnitCode, salesType, plantCode }
        );
    }

    getSmall(businessUnitCode: string, salesType: string, plantCode: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/sop/sopNetForecast/getSalesCategorySub',
          { businessUnitCode, salesType, plantCode }
        );
    }

    getSaleRegion(businessUnitCode: string, salesType: string, plantCode: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/sop/sopNetForecast/getSalesRegion',
          { businessUnitCode, salesType, plantCode }
        );
    }

    getArea(businessUnitCode: string, salesType: string, plantCode: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/sop/sopNetForecast/getSalesArea',
          { businessUnitCode, salesType, plantCode }
        );
    }

    getCustomer(businessUnitCode: string, salesType: string, plantCode: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/sop/sopNetForecast/getCustomer',
          { businessUnitCode, salesType, plantCode }
        );
    }
}
