import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';

@Injectable()

export class SopProdWorkdayService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    url = '/afs/ServerSopProdWorkday/ServerSopProdWorkday/GetData';
    exportUrl = '/afs/ServerSopProdWorkday/ServerSopProdWorkday/ExportData';

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopProdWorkday/ServerSopProdWorkday/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }

    EditData(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopProdWorkday/ServerSopProdWorkday/EditData',
            {
                dto
            }
        );
    }

    remove(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopProdWorkday/ServerSopProdWorkday/remove',
            {
                dto
            }
        );
    }

    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopProdWorkday/ServerSopProdWorkday/RemoveBath',
            {
                dtos
            }
        );
    }

    SaveForNew(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopProdWorkday/ServerSopProdWorkday/SaveForNew',
            {
                dto
            }
        );
    }

    GetSchedule(value: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopProdWorkday/ServerSopProdWorkday/GetSchedule?plantCode=' + value,
            {

            }, { method: 'GET' }
        );
    }

    GetResource(plantCode?: string, scheduleGroup?: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopProdWorkday/ServerSopProdWorkday/GetResource',
            {
                plantCode: plantCode,
                scheduleGroup: scheduleGroup
            }
        );
    }
}
