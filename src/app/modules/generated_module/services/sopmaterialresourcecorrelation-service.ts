import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { SopMaterialResourceCorrelationDto } from '../dtos/sopmaterialresourcecorrelation-dto';
import { platform } from 'os';
import { ResponseDto } from '../dtos/response-dto';
import { AnonymousSubject } from 'rxjs/Rx';

@Injectable()

export class SopMaterialResourceCorrelationService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    url = '/afs/ServerSopMaterialResourceCorrelationServerSopMaterialResourceCorrelation/GetData';

    GetPlant(user: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopMaterialResourceCorrelationServerSopMaterialResourceCorrelation/GetPlant?userid=' + user,
            {

            }, { method: 'GET' }
        );
    }

    GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopMaterialResourceCorrelationServerSopMaterialResourceCorrelation/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }


    EditData(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopMaterialResourceCorrelationServerSopMaterialResourceCorrelation/EditData',
            {
                dto
            }
        );
    }

    remove(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopMaterialResourceCorrelationServerSopMaterialResourceCorrelation/remove',
            {
                dto
            }
        );
    }

    RemoveBath(ids: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/sop/sopresourcedivisionitem/removeBath', ids);
    }

    GetItemDetail(item: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcsupplier/Supplier/GetItemDesc?item=' + item,
            {

            }, { method: 'GET' }
        );
    }

    GetVendorSite(vendornumber: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcsupplier/Supplier/GetVendorSite?vendornumber=' + vendornumber,
            {

            }, { method: 'GET' }
        );
    }

    public GetVendorPageList(VENDOR_NUMBER: string, VENDOR_NAME: string, PageIndex: number = 1, PageSize: number = 10): Observable<GridSearchResponseDto> {
        return this.http.get<GridSearchResponseDto>(
            '/afs/serverpcsupplier/Supplier/GetVendorPageList',
            {
                VENDOR_NUMBER: VENDOR_NUMBER,
                VENDOR_NAME: VENDOR_NAME,
                PageIndex: PageIndex,
                PageSize: PageSize
            });
    }

    save(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/sop/sopresourcedivisionitem/save', dto);
    }

    GetGroup(value: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopMaterialResourceCorrelationServerSopMaterialResourceCorrelation/GetGroup?plantCode=' + value,
            {

            }, { method: 'GET' }
        );
    }

    GetDivision(scheduleGroupCode?: any, divisionType?: any): Observable<ResponseDto> {
        return this.http.get<ResponseDto>('/api/sop/sopresourcedivision/getDivisions', {
            scheduleGroupCode: scheduleGroupCode,
            divisionType: divisionType
        });
    }
}
