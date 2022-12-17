import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { PurchaseRegionDto } from '../dtos/Purchase-Region-dto';
import { PurchaseRegionSubDto } from '../dtos/purchase-region-sub-dto';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class PurchaseRegionService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {}

    url = '/api/pc/pcDeliveryRegion/queryDeliveryRegion';

    /*public GetPlantCode(userid): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/GetPlantCode?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }*/

    GetById(id: String): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/pc/pcDeliveryRegion/queryDeliveryRegionById',
          { id }
        );
    }

    saveData(dto: {[key: string]: any}): Observable<ResponseDto> {
      return this.http.post(
        '/api/pc/pcDeliveryRegion/saveDeliveryRegion',
        { ...dto }
      );
    }

    subDelete(ids: string[]): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/pc/pcDeliveryRegion/deleteDeliveryRegionSub',
        ids
      );
    }

    /*EditData(dto: PurchaseRegionDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/EditData',
            {
                dto
            }
        );
    }*/

    /*GetSubInv(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/GetSubInv',
            {

            }, { method: 'GET' }
        );
    }*/


    /*GetType(code: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/GetType?code=' + code,
            {

            }, { method: 'GET' }
        );
    }*/

    /*GetPurType(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/GetPurType',
            {

            }, { method: 'GET' }
        );
    }*/

    /*remove(dto: PurchaseRegionDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/remove',
            {
                dto
            }
        );
    }*/

    /*InsertData(dto: PurchaseRegionDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/InsertData',
            {
                dto
            }
        );
    }*/

    /*RemoveBath(dtos: PurchaseRegionDto[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/RemoveBath',
            {
                dtos
            }
        );
    }*/

    /*SubDel(dto: PurchaseRegionSubDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/SubDel',
            {
                dto
            }
        );
    }*/

    GetSubById(id: string): Observable<ResponseDto> {
        return this.http.get(
          '/api/pc/pcDeliveryRegion/queryDeliveryRegionSubById',
          { id }
        );
    }

    saveSubData(dto: {[key: string]: any}): Observable<ResponseDto> {
      return this.http.post(
        '/api/pc/pcDeliveryRegion/saveDeliveryRegionSub',
        { ...dto }
      );
    }

    /*EditSubData(dto: PurchaseRegionSubDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/EditSubData',
            {
                dto
            }
        );
    }*/


    /*InsertSubData(dto: PurchaseRegionSubDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/InsertSubData',
            {
                dto
            }
        );
    }*/

    /*RemoveBatch1(dtos: PurchaseRegionSubDto[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcpurchaseregion/PurchaseRegion/RemoveBatch1',
            {
                dtos
            }
        );
    }*/


    GetWareHouse(plantCode: string, subinventoryCode:string, pageIndex: number = 1, pageSize: number = 10): Observable<ResponseDto> {
        return this.http.get<ResponseDto> (
            '/api/ps/psSubinventories/queryPage',
            {
                plantCode,
                subinventoryCode,
                pageIndex,
                pageSize
            });
    }
    GetRegion(plantCode: string, pageIndex: number = 1, pageSize: number = 1000, isExport: boolean = true): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/pc/pcDeliveryRegion/queryDeliveryRegion',
          { plantCode, pageIndex, pageSize, isExport }
        );
    }


}
