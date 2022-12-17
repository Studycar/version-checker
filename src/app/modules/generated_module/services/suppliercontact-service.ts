import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';


@Injectable()

export class SupplierCalendarService {
    constructor(
        private appApiService: AppApiService
    ) {}

    url = '/afs/serverpcsupplier/Supplier/GetData';

    GetPlant(user: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetPlantCode?user=' + user,
            {

            }, { method: 'GET' }
        );
    }

    GetItem(plantcode: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetItem?plantcode=' + plantcode,
            {

            }, { method: 'GET' }
        );
    }

    GetVendor(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetVendor',
            {

            }, { method: 'GET' }
        );
    }

    GetStatus(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetStatus',
            {

            }, { method: 'GET' }
        );
    }

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }


    EditData(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/EditData',
            {
                dto
            }
        );
    }

    remove(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/remove',
            {
                dto
            }
        );
    }


    InsertData(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/InsertData',
            {
                dto
            }
        );
    }

    RemoveBath(dtos: SupplierDro[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/RemoveBath',
            {
                dtos
            }
        );
    }

    GetItemDetail(item: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetItemDesc?item=' + item,
            {

            }, { method: 'GET' }
        );
    }

    GetVendorSite(vendornumber: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetVendorSite?vendornumber=' + vendornumber,
            {

            }, { method: 'GET' }
        );
    }

    GetRegion(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetRegion',
            {

            }, { method: 'GET' }
        );
    }


    GetBuyer(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetBuyer',
            {

            }, { method: 'GET' }
        );
    }

    GetCurrentBuyer(userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetCurrentBuyer?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }

}
