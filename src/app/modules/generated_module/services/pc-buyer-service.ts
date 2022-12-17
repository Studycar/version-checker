import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { PcBuyerDto } from '../dtos/pc-buyer-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class PcBuyerService {

    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {
    }

    url = '/api/pc/pcUserBuyerRel/queryUserBuyerRel';

    GetUser(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            '/api/admin/baseusers/userList',
          {}
        );
    }

    /*GetEmploye(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerPCBuyer/PCBuyer/GetEmploye',
            {

            }, { method: 'GET' }
        );
    }*/


    /*EditData(dto: PcBuyerDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerPCBuyer/PCBuyer/EditData',
            {
                dto
            }
        );
    }*/


    GetById(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            '/api/pc/pcUserBuyerRel/queryUserBuyerById',
            {
              id
            }
        );
    }


    saveData(dto: {[key: string]: any}): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/pc/pcUserBuyerRel/saveUserBuyerRel',
            {
                ...dto
            }
        );
    }

    /*remove(dto: PcBuyerDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerPCBuyer/PCBuyer/remove',
            {
                dto
            }
        );
    }*/

    RemoveBath(ids: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/pc/pcUserBuyerRel/deleteUserBuyerRel',
            ids
        );
    }

    GetBuyer(employee: string, pageIndex: number = 1, pageSize: number = 10): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            '/api/pc/pcUserBuyerRel/queryBuyers',
            {
                employee,
                pageIndex,
                pageSize,
            });
    }
}
