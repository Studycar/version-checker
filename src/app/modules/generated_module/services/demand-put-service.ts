import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { DemandOrderSplitMergeDto } from 'app/modules/generated_module/dtos/demand-order-split-merge-dto';
import { Action } from '@progress/kendo-angular-dateinputs/dist/es2015/calendar/models/navigation-action.enum';
import { ActionResultDto } from '../dtos/action-result-dto';
import { DemandPutDto } from '../dtos/demand-put-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class DemandPutService {
    constructor(
        private appApiService: AppApiService,
        public http: _HttpClient,
    ) {
    }

    url = '/api/pc/pcManualDeand/queryManualDemand';//'/afs/serverpcdemandput/DemandPut/GetData';
    exportUrl = '/afs/serverpcdemandput/DemandPut/exportData';

    GetPlant(userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcdemandput/DemandPut/GetPlant?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }

    GetItem(plantcode: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcdemandput/DemandPut/GetItem?plantcode=' + plantcode,
            {

            }, { method: 'GET' }
        );
    }

    GetById(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/pc/pcManualDeand/getById?id=' + id,
            {
            }, { method: 'GET' }
        );
    }

    GetDesc(itemcode: string): Observable<ResponseDto> {
        const PsItemQO = {
            itemCode: itemcode
        };
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psItem/listItem',
            //'/afs/serverpcdemandput/DemandPut/GetDesc?itemcode=' + itemcode,
            PsItemQO, { method: 'POST' }
        );
    }

    SaveForNew(dto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            // '/afs/serverpcdemandput/DemandPut/SaveForNew',
            '/api/pc/pcManualDeand/saveManualDemand', dto
            // {dto}
        );
    }

    EditData(dto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            //'/afs/serverpcdemandput/DemandPut/EditData',
            '/api/pc/pcManualDeand/saveManualDemand', dto
            //{ dto}
        );
    }

    remove(dto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/pc/pcManualDeand/remove', dto
        );
    }

    RemoveBath(ids: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/pc/pcManualDeand/deleteManualDemand', ids
        );
    }

    GetRegion(itemCode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/pc/pcManualDeand/getRegion?itemCode=' + itemCode,
            {

            }, { method: 'GET' }
        );
    }


        /**送货区域 */
        GetRegion1(plantcode: string): Observable<ResponseDto> {
            return this.appApiService.call<ResponseDto>(
                '/api/pc/pcitemcategoryhead/getRegion?plantCode=' + plantcode,
                {
    
                }, { method: 'GET' }
            );
        }

    public GetUserPlantItemPageList(plantCode: string, itemCode: string, itemDesc: string, PageIndex: number = 1, PageSize: number = 10, itemId: string = ''): Observable<GridSearchResponseDto> {
        return this.http.get<GridSearchResponseDto>(
            '/afs/serverpcdemandput/DemandPut/getUserPlantItemPageList',
            {
                PLANT_CODE: plantCode,
                ITEM_ID: itemId,
                ITEM_CODE: itemCode,
                DESCRIPTIONS_CN: itemDesc,
                PageIndex: PageIndex,
                PageSize: PageSize
            });
    }
}
