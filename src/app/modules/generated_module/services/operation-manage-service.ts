import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { OperationManageDto } from '../../generated_module/dtos/operation-manage-dto';

@Injectable()

export class OperationManageService {

    constructor(
        private appApiService: AppApiService
    ) { }

    //url = '/afs/ServerPsOperationManage/ServerPsOperationManage/GetData';
    url1 = '/api/ps/psOperation/getData'


    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperation/removeBath',
                dtos
        );
    }

    // GetPlant(): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/ServerPsOperationManage/ServerPsOperationManage/GetPlant',
    //         {

    //         }, { method: 'GET' }
    //     );
    // }

    GetPlant(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperation/getPlant',
            {

            }, { method: 'GET' }
        );
    }

    // GetById(Id: string): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/ServerPsOperationManage/ServerPsOperationManage/GetById?Id=' + Id,
    //         {

    //         }, { method: 'GET' }
    //     );
    // }

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperation/getById?id=' + Id,
            {

            }, { method: 'GET' }
        );
    }

    // remove(dto: OperationManageDto): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/ServerPsOperationManage/ServerPsOperationManage/remove',
    //         {
    //             dto
    //         }
    //     );
    // }

    remove(dto: OperationManageDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperation/delete',
                dto
        );
    }

    // RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/ServerPsOperationManage/ServerPsOperationManage/RemoveBath',
    //         {
    //             dtos
    //         }
    //     );
    // }

    // Edit(dto: OperationManageDto): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/ServerPsOperationManage/ServerPsOperationManage/Edit',
    //         {
    //             dto
    //         }
    //     );
    // }

    Edit(dto: OperationManageDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperation/update',
                dto
        );
    }



    // SaveForNew(dto: OperationManageDto): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/ServerPsOperationManage/ServerPsOperationManage/SaveForNew',
    //         {
    //             dto
    //         }
    //     );
    // }

    SaveForNew(dto: OperationManageDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperation/save',
                dto
        );
    }

    // SetLimitById(Id: string): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/ServerPsOperationManage/ServerPsOperationManage/SetLimitById?Id=' + Id,
    //         {}, { method: 'GET' }
    //     );
    // }

    SetLimitById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psOperation/setLimitById?id=' + Id,
            {}, { method: 'GET' }
        );
    }
}

