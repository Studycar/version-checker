import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { OperationLeadTimeDto } from '../dtos/operation-leadtime-dto';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';

@Injectable()

export class OperationLeadTimeService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }
    url = '/afs/serverpsoperationleadtime/OperationLeadTime/GetData';
    url1 = '/api/ps/psOperationLeadTime/getData';


    SaveForNew(dto: OperationLeadTimeDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperationLeadTime/save',
                dto
        );
    }

    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperationLeadTime/delete',
                dtos
        );
    }


    GetPlant(userId: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsoperationleadtime/OperationLeadTime/GetPlant?userId=' + userId,
            {

            }, { method: 'GET' }
        );
    }

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsoperationleadtime/OperationLeadTime/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }

    remove(dto: OperationLeadTimeDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsoperationleadtime/OperationLeadTime/remove',
            {
                dto
            }
        );
    }

    // RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpsoperationleadtime/OperationLeadTime/RemoveBath',
    //         {
    //             dtos
    //         }
    //     );
    // }

    Edit(dto: OperationLeadTimeDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsoperationleadtime/OperationLeadTime/Edit',
            {
                dto
            }
        );
    }

    // SaveForNew(dto: OperationLeadTimeDto): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpsoperationleadtime/OperationLeadTime/SaveForNew',
    //         {
    //             dto
    //         }
    //     );
    // }




    GetCategory(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsoperationleadtime/OperationLeadTime/GetCategory',
            {
                
            }, { method: 'GET' }
        );
    }

    GetRelationType(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsoperationleadtime/OperationLeadTime/GetRelationType',
            {

            }, { method: 'GET' }
        );
    }

    
    // GetProcess(plantcode: string): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpsoperationleadtime/OperationLeadTime/GetProcess?plantcode=' + plantcode,
    //         {

    //         }, { method: 'GET' }
    //     );
    // }

    GetProcess(plantcode: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperationLeadTime/getProcess?plantCode=' + plantcode,
            {
            }, { method: 'GET' }
        );
    }

    getRandomNameList(url: String): Observable<string[]> {
        return this.http.get(`${url}`).pipe(map((res: any) => res.data)).pipe(map((list: any) => {
            return list.map(item => `${item.categoryValue}`);
        }));
    }

    /** 导入excel数据 */
    Import(dtos: any[]): Observable<ActionResponseDto> {
        return this.http
            .post('/afs/serverpsoperationleadtime/OperationLeadTime/ImportInfo', { dtos: dtos });
    }
}
