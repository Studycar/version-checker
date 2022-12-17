import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable()

export class ProductSellBalanceForecastService extends CommonQueryService {
    public baseUrl: string = this.appApiService.appConfigService.getApiUrlBase() + '/api/sop/sopuncstrforecast';

    constructor(public http: _HttpClient,
        public appApiService: AppApiService) {
        super(http, appApiService);
    }

    /**
     * 查询商品大类
     * @param  
     */
    public getSalescatgoryBig(dto: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(this.baseUrl + '/getSalesCatgory',
            { demandDate: dto.demandDate, businessUnitCode: dto.businessUnitCode, salesCatgoryType: 1 });
    }

    /**
    * 查询商品小类
    * @param  
    */
    public getSalescatgorySub(dto: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(this.baseUrl + '/getSalesCatgory',
            { demandDate: dto.demandDate, businessUnitCode: dto.businessUnitCode, salesCatgoryType: 2 });
    }

    /**
     * 查询周期
     * @param businessUnitCode 
     * @returns 
     */
    public getPeriodLevel(businessUnitCode = ''): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(this.baseUrl + '/getPeriodLevel/' + businessUnitCode,
            {});
    }

    /**
     * 获取服务器时间
     * @param data 
     */
    public getServerDatetime({ addMonth = 0, addDay = 0, addYear = 0, dateFormat = '' }): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(this.baseUrl + '/getServerDatetime', {
            dateFormat: dateFormat,
            addYear: addYear,
            addMonth: addMonth,
            addDay: addDay
        });
    }

    /**
     * 查询维度一、二、三、四数据
     * @param queryParams 
     */
    public queryDimension(businessUnitCode: string): Observable<ResponseDto> {
        return this.http.get('/api/sop/sopDemandDivision/getDemandDimension', {businessUnitCode});
    }


    /**
     * 查询用户新
     * @param  
     */
    public getUserDetailsNew({ id = '' }): Observable<ResponseDto> {
        const url = '/api/admin/user/info/' + id;
        return this.http.get<ResponseDto>(url, {});
    }

    /**
     * 查询用户区域
     * @param  
     */
     public getUserPrivilage({ UserID = '' }): Observable<ActionResponseDto> {
        const url = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsprivilege/psprivilege/getuserprivilage';
        return this.http.post<ActionResponseDto>(url, { UserID: UserID });
    }

    /**
     * 查询用户区域
     * @param  
     */
    public getUserDetails({ UserID = '' }): Observable<ResponseDto> {
        const url = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/user/info/' + UserID;
        return this.http.get<ResponseDto>(url, {});
    }


    /**
     * 保存PSI调整后的数据
     * @param data 
     */
    public saveSopuncstrForecastRecord(data: any) {
        return this.http.post<ActionResponseDto>(this.baseUrl + '/savesopuncstrforecastrecord', { dtos: data });
    }

    /**
     * 保存PSI调整后的数据
     * @param data 
     */
    public saveSopUncstrForecastPSI(data: any) {
        return this.http.post<ResponseDto>(this.baseUrl + '/saveSopUncstrForecastPSI', data);
    }


    /**
     * 保存版本
     * @param data 
     * @returns 
     */
    public saveSopUncstrForecastVersion(data: any) {
        return this.http.post<ResponseDto>(this.baseUrl + '/saveSopUncstrForecastVersion', data);
    }
}
