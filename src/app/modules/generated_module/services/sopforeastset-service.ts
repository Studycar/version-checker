import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class SopForeastSetService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {}

    url = '/afs/ServerSopForeastSet/ServerSopForeastSet/GetData';
    exportUrl = 'afs/ServerSopDimmainresreView/ServerSopForeastSet/exportData';

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopForeastSet/ServerSopForeastSet/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }


    EditData(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopForeastSet/ServerSopForeastSet/EditData',
            {
                dto
            }
        );
    }

    remove(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopForeastSet/ServerSopForeastSet/remove',
            {
                dto
            }
        );
    }

    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopForeastSet/ServerSopForeastSet/RemoveBath',
            {
                dtos
            }
        );
    }

    GetCurrentBuyer(userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetCurrentBuyer?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }

    SaveForNew(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopForeastSet/ServerSopForeastSet/SaveForNew',
            {
                dto
            }
        );
    }

    GetDivision(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDimmainresreView/ServerSopDimmainresreView//GetDivision',
            {

            }, { method: 'GET' }
        );
    }
}
