import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class SopDemandImportImportService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {}

    url = '/afs/ServerSopDemandImport/ServerSopDemandImport/GetData';
    exportUrl = '/afs/ServerSopDemandImport/ServerSopDemandImport/ExportData';

    GetRegion(plantCode: string, user: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/GetPlantBusiness?userid=' + user + '&plantCode=' + plantCode,
            {

            }, { method: 'GET' }
        );
    }

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }


    EditData(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/EditData',
            {
                dto
            }
        );
    }

    remove(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandImport/ServerSopDemandImport/remove',
            {
                dto
            }
        );
    }

    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandImport/ServerSopDemandImport/RemoveBath',
            {
                dtos
            }
        );
    }

    SaveForNew(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/SaveForNew',
            {
                dto
            }
        );
    }

    GetGroup(value: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDimmainresreView/ServerSopDimmainresreView/GetGroup?plantCode=' + value,
            {

            }, { method: 'GET' }
        );
    }

    GetDivision(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDimmainresreView/ServerSopDimmainresreView//GetDivision',
            {

            }, { method: 'GET' }
        );
    }

    GetDemand(value: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/GetDemand?region=' + value,
            {

            }, { method: 'GET' }
        );
    }
}
