import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class SopSupplierCapacityMaintenanceService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    url = '/api/sop/sopsupplycapacity/getData';

    GetPlant(user: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopSupplierCapacityMaintenance/ServerSopSupplierCapacityMaintenance/GetPlant?userid=' + user,
            {

            }, { method: 'GET' }
        );
    }

    GetVendor(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcsupplier/Supplier/GetVendor',
            {

            }, { method: 'GET' }
        );
    }

    GetById(Id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplycapacity/getById?id=' + Id,
            {

            }, { method: 'GET' }
        );
    }

    EditData(dto: SupplierDro): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplycapacity/saveForNew',
            
                dto
            
        );
    }

    remove(dto: SupplierDro): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplycapacity/remove',
            
                dto
            
        );
    }

    RemoveBath(dtos: SupplierDro[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplycapacity/removeBath',
            
                dtos
            
        );
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

    GetRegion(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcsupplier/Supplier/GetRegion',
            {

            }, { method: 'GET' }
        );
    }


    GetBuyer(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcsupplier/Supplier/GetBuyer',
            {

            }, { method: 'GET' }
        );
    }

    GetCurrentBuyer(userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcsupplier/Supplier/GetCurrentBuyer?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }

    public GetVendorPageList(dimensionValues: string,vendorNumber: string, PageIndex: number = 1, PageSize: number = 10): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/pc/pcvendorcategoriespercent/queryVendor',
            {
                dimensionName: 'PLANT',
                dimensionValues: dimensionValues,
                vendorNumber: vendorNumber,
                pageIndex: PageIndex,
                pageSize: PageSize
            });
    }

    SaveForNew(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplycapacity/saveForNew',
            
                dto
            
        );
    }

    GetDivision(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopSupplierCapacityMaintenance/ServerSopSupplierCapacityMaintenance/GetType',
            {

            }, { method: 'GET' }
        );
    }

    getRandomNameList(url: String): Observable<string[]> {
        return this.http.get(`${url}`).pipe(map((res: any) => res.data)).pipe(map((list: any) => {
            return list.map(item => `${item.divisionValue}`);
        }));
    }

    public GetVendorSitePageList(PLANT_CODE: string, VENDOR_NUMBER: string, VENDOR_SITE_CODE: string, VENDOR_SITE_NAME: string, PageIndex: number = 1, PageSize: number = 10, ID2: string = ''): Observable<GridSearchResponseDto> {
        return this.http.get<GridSearchResponseDto>(
            '/afs/serverproductlinemanager/psproductlinemanager/GetVendorSitePageList',
            {
                ID: ID2,
                PLANT_CODE: PLANT_CODE,
                VENDOR_NUMBER: VENDOR_NUMBER,
                VENDOR_SITE_CODE: VENDOR_SITE_CODE,
                VENDOR_SITE_NAME: VENDOR_SITE_NAME,
                PageIndex: PageIndex,
                PageSize: PageSize
            });
    }
}
