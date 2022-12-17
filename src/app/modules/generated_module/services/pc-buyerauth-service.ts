import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { PcBuyerAuthDto } from '../dtos/pc-buyerauth-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';

@Injectable()

export class PcBuyerAuthService {

    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {
    }

    url = '/api/pc/pcbuyerauth/getData';

    GetUser(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/pc/pcbuyerauth/getUser',
            {

            }, { method: 'GET' }
        );
    }

    GetEmploye(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/pc/pcbuyerauth/getEmploye',
            {

            }, { method: 'GET' }
        );
    }


    EditData(dto: PcBuyerAuthDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/pc/pcbuyerauth/editData',
            {
                dto
            }
        );
    }


    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/pc/pcbuyerauth/getById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }


    SaveForNew(dto: PcBuyerAuthDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/pc/pcbuyerauth/saveForNew',
            {
                dto
            }
        );
    }

    remove(dto: PcBuyerAuthDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/pc/pcbuyerauth/remove',
            {
                dto
            }
        );
    }

    RemoveBath(dtos: string[]) {
        return this.appApiService.call<ActionResponseDto>(
            '/api/pc/pcbuyerauth/removeBath',
            {
                dtos
            }
        );
    }

    GetBuyer(EMPLOYEE_NUMBER: string, FULL_NAME: string, PageIndex: number = 1, PageSize: number = 10): Observable<GridSearchResponseDto> {
        return this.http.get<GridSearchResponseDto>(
            '/api/pc/pcbuyerauth/getUserPlantItemPageList',
            {
                employeeNumber: EMPLOYEE_NUMBER,
                fullName: FULL_NAME,
                pageIndex: PageIndex,
                pageSize: PageSize
            });
    }

    GetBuyerByUserName(user_name:string,EMPLOYEE_NUMBER: string, FULL_NAME: string, PageIndex: number = 1, PageSize: number = 10): Observable<GridSearchResponseDto> {
        return this.http.get<GridSearchResponseDto>(
            '/api/pc/pcbuyerauth/getUserBuyersPageList',
            {
                userName:user_name,
                employeeNumber: EMPLOYEE_NUMBER,
                fullName: FULL_NAME,
                pageIndex: PageIndex,
                pageSize: PageSize
            });
    }
    /**
     * 获取指定用户对应的业务员或业务授权人
     * user_name 需要查询的用户的用户名，为空时指定为当前用户
     * query_type  "0"(默认):查询用户对应的业务员和业务员的授权人信息  "1" 查询用户对应的业务员 "2" 查询当前业务员对应的授权人
      */
    GetAuthUserByUserName(user_name:string,query_type:string = "0"): Observable<GridSearchResponseDto> {
        return this.http.get<GridSearchResponseDto>(
            '/api/pc/pcbuyerauth/getAuthUsersByUserName',
            {
                userName:user_name,
                queryType:query_type
            });
    }
}
