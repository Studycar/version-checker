/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-08-31 15:55:48
 * @LastEditors: Zwh
 * @LastEditTime: 2019-11-04 22:47:01
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { DemandOrderSplitMergeDto } from 'app/modules/generated_module/dtos/demand-order-split-merge-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 权限管理服务 */
export class CustomerDivisionService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    baseUrl='/api/ps/dpCustDivision';

    seachUrl = this.baseUrl+'/getData';


    /** 获取类型 */
    // GetDiv(divType: any): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverppcustomerdivision/ServerPPCustomerDivision/GetDiv?divType=' + divType,
    //         {
    //         }, { method: 'GET' });
    // }
    /** 获取类型分页信息 */
    GetDivPage(divType: string, divName: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        return this.http.get(
            this.baseUrl+'/getDivPage',
            { divType, divName, pageIndex, pageSize }
          );
    }

    GetById(id: string): Observable<ResponseDto> {
        return this.http.get(
            this.baseUrl+'/getByID',
            { id }
          );
    }

    Edit(dto: DemandOrderSplitMergeDto): Observable<ResponseDto> {
        return this.http.post(
            this.baseUrl+'/edit',
            dto
          );
    }

    // Insert(dto: DemandOrderSplitMergeDto): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverppcustomerdivision/ServerPPCustomerDivision/SaveForNew',
    //         {
    //             dto
    //         }
    //     );
    // }

    /** 删除类别 */
    Remove(dto: DemandOrderSplitMergeDto): Observable<ResponseDto> {
        return this.http.post(
            this.baseUrl+'/remove',
            dto
          );
    }

    RemoveBath(dtos: string[]): Observable<ResponseDto> {
        return this.http.post(
            this.baseUrl+'/removeBath',
            dtos
          );
    }

}
