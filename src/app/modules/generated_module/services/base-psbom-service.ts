import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { Action } from 'rxjs/internal/scheduler/Action';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable(
)
export class BasePsBomService {

    constructor(
        private appApiService: AppApiService,
        public http: _HttpClient
    ) { }
    searchurl = '/api/ps/psBom/getMainData';
    exportUrl = '/api/ps/psBom/getMainData';

    public GetScheduleRegion(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psBom/getScheduleRegion',
            {

            }, { method: 'GET' }
        );
    }

    getCategory(plantCode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psBom/getCategory?plantCode=' + plantCode,
            {

            }, { method: 'GET' }
        );
    }

    public GetPlant(strScheduleRegion: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psBom/getPlant?scheduleRegionCode=' + strScheduleRegion,
            {

            }, { method: 'GET' }
        );
    }

    public GetScheduleRegion1(plantcode: String): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psBom/getScheduleRegion/' + plantcode,
            {

            }, { method: 'GET' }
        );
    }

    // public GetTree(ALTERNATE_BOM_DESIGNATOR: string, PLANT_CODE: string, ASSEMBLY_ITEM_ID: string): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpsbom/psbom/GetTree?ALTERNATE_BOM_DESIGNATOR=' + ALTERNATE_BOM_DESIGNATOR + '&PLANT_CODE=' + PLANT_CODE + '&ASSEMBLY_ITEM_ID=' + ASSEMBLY_ITEM_ID,
    //         {

    //         }, { method: 'GET' }
    //     );
    // }

    public GetItemCode(ASSEMBLY_ITEM_ID: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psBom/getItemCode?ItemId=' + ASSEMBLY_ITEM_ID,
            {

            }, { method: 'GET' }
        );
    }

    public GetAlter(ASSEMBLY_ITEM_ID: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psBom/getAlter?assemblyItemId=' + ASSEMBLY_ITEM_ID,
            {

            }, { method: 'GET' }
        );
    }

    public GetDate(ASSEMBLY_ITEM_ID: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psBom/getData?assemblyItemId=' + ASSEMBLY_ITEM_ID,
            {

            }, { method: 'GET' }
        );
    }

    public GetTree(ALTERNATE_BOM_DESIGNATOR: string, PLANT_CODE: string, ASSEMBLY_ITEM_ID: string, timerange: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psBom/getTree',
            {
                alternateBomDesignator: ALTERNATE_BOM_DESIGNATOR,
                plantCode: PLANT_CODE,
                assemblyItemId: ASSEMBLY_ITEM_ID,
                timeRange: timerange
            }
        );
    }

    getItemId(value: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psBom/getItemId?itemCode=' + value,
            {

            }, { method: 'GET' }
        );
    }

}
