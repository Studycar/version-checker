/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:09:04
 * @LastEditors: Zwh
 * @LastEditTime: 2020-09-30 10:07:15
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { SopDimmainresrevViewDto } from '../dtos/sopdimmainresrevview-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class SopDimmainresrevVewService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {}

    url = '/api/sop/sopresourcedivision/query';
    exportUrl = '/api/sop/sopresourcedivision/export';

    GetById(Id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/sop/sopresourcedivision/getById/' + Id,
            {

            }, { method: 'GET' }
        );
    }

    EditData(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/sop/sopresourcedivision/save', dto
        );
    }

    remove(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/api/sop/sopresourcedivision/deleteMainData',
            {
                dto
            }
        );
    }

    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/api/sop/sopresourcedivision/deleteBatch',
            {
                dtos
            }
        );
    }

    GetItemDetail(item: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetItemDesc?item=' + item,
            {

            }, { method: 'GET' }
        );
    }

    SaveForNew(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/sop/sopresourcedivision/save', dto
        );
    }

    GetGroup(value: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/sop/sopresourcedivision/getScheduleGroup?plantCode=' + value,
            {

            }, { method: 'GET' }
        );
    }

    GetDivision(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/sop/sopresourcedivision/getDivision',
            {

            }, { method: 'GET' }
        );
    }
}
