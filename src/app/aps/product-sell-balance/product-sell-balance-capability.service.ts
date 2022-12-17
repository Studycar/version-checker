import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class ProductSellBalanceCapabilityService extends CommonQueryService {
    constructor(public http: _HttpClient,
        public appApiService: AppApiService) {
        super(http, appApiService);
    }

    /**
    * 获取配套员
    * @param data 
    */
    public getMatchManager(data: any) {
        return this.http.get<ResponseDto>('/api/sop/sopcapabilityreviewdemand/getMatchManager', data);
    }

    /**
    * 获取类别的粒度维度值
    * @param data 
    */
    public getSopresourceDivision(data: any): Observable<ResponseDto> {
        return this.http.get<ResponseDto>('/api/sop/sopsupplycapacity/getSopresourceDivision', data);
    }

    /**
    * 获取类别的粒度维度值
    * @param data 
    */
    public queryItemCategories(data: any): Observable<ResponseDto> {
        return this.http.get<ResponseDto>('/api/ps/pscategories/QueryPage', data);
    }
}
