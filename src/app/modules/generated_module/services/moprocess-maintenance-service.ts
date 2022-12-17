import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ProcessMaintenanceDto } from './../dtos/porcess-maintenance-dto';

@Injectable()

export class MoProcessMaintenanceService {
    constructor(private appApiService: AppApiService) { }


    baseUrl = '/api/ps/processMoOrder/getData';
    //searchUrl = '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetData';
    baseUrl1 = '/api/ps/processMoOrder/getDetail'

   // searchUrl1 = '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetDetailData';
    exportUrl = '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/Export';


    public GetPlant(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetPlant',
            {

            }, { method: 'GET' }
        );
    }

    public GetGroup(plantcode: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetGroup?plantcode=' + plantcode,
            {
            }, { method: 'GET' }
        );
    }

    public GetResource(ITEM_ID: any, PROCESS_CODE: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetResource?ITEM_ID=' + ITEM_ID + '&PROCESS_CODE=' + PROCESS_CODE,
            {

            }, { method: 'GET' }
        );
    }

    /**
     * jianl新增（上面这个方法会出现重复的资源），同一个资源，同一个工序号，不同的工艺版本
     */
    public GetResourc2(ITEM_ID: any, PROCESS_CODE: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetResource2?ITEM_ID=' + ITEM_ID + '&PROCESS_CODE=' + PROCESS_CODE,
            {

            }, { method: 'GET' }
        );
    }

    public GetNum(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmomanager/psmomanager/GetNum',
            {

            }, { method: 'GET' }
        );
    }

    public GetProject(strMakeOrderNum: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmomanager/psmomanager/GetProject?strMakeOrderNum=' + strMakeOrderNum,
            {

            }, { method: 'GET' }
        );
    }

    public GetById(Id: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }


    public Edit(dto: ProcessMaintenanceDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/Edit',
            {
                dto
            }
        );
    }

    GetMoTyPe(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmomanager/psmomanager/GetMoType',
            {

            }, { method: 'GET' }
        );
    }


    GetRegion(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetRegion',
            {

            }, { method: 'GET' }
        );
    }


    GetPlant1(value: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetPlant1?region=' + value,
            {

            }, { method: 'GET' }
        );
    }


    GetMoNum(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetMoNum',
            {

            }, { method: 'GET' }
        );
    }

    GetStatus(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetStatus',
            {

            }, { method: 'GET' }
        );
    }

    GetResourceT(value: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/GetResourceT?group=' + value,
            {

            }, { method: 'GET' }
        );
    }

    // getPrivilege(userId: string): Observable<ActionResponseDto> {
        

    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/getPrivilege?userId=' + userId,
    //         {

    //         }, { method: 'GET' }
    //     );
    // }      

    ChangeSchedule(ids: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmoprocessmaintenance/ServerMoProcessMaintenance/ChangeSchedule',
            {
                ids
            }, { method: 'POST' }
        );
    }
}
