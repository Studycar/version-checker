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

export class SopSupplyRestrainCapService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    url = '/api/sop/sopsupplyrestraincap/queryData';

    GetPlant(user: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopSupplierCapacityMaintenance/ServerSopSupplierCapacityMaintenance/GetPlant?userid=' + user,
            {

            }, { method: 'GET' }
        );
    }

    getVendors(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/pc/pcvendors/queryPcVendors',
            {

            }, { method: 'GET' }
        );
    }

    GetById(Id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplyrestraincap/getById/' + Id,
            {

            }, { method: 'GET' }
        );
    }

    save(dto: SupplierDro): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplyrestraincap/add', dto
        );
    }

    remove(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplyrestraincap/delete/' + id,
            {

            }, { method: 'GET' }
        );
    }

    deleteView(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplyrestraincap/deleteView/' + id,
            {

            }, { method: 'GET' }
        );
    }

    public GetVendorPageList(dimensionValues: string, vendorNumber: string, PageIndex: number = 1, PageSize: number = 10): Observable<ResponseDto> {
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

    add(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplyrestraincap/add',
            dto
        );
    }

    addView(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopsupplyrestraincap/addView',
            dto
        );
    }

    getRandomNameList(url: String): Observable<string[]> {
        return this.http.get(`${url}`).pipe(map((res: any) => res.data)).pipe(map((list: any) => {
            return list.map(item => `${item.divisionValue}`);
        }));
    }

    public getVendorPageList(vendorNumber: string, vendorName: string, pageIndex: number = 1, pageSize: number = 10): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/pc/pcvendors/getVendorPageList',
            {
                vendorNumber,
                vendorName,
                pageIndex,
                pageSize
            });
    }

    public getPlantVendorItemPageList(
        plantCode: string,
        vendorNumber: string,
        searchValue: string,
        pageIndex: number = 1,
        pageSize: number = 10
    ): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            '/api/pc/pcApprovedVendorList/getPlantVendorItemPageList',
            {
                plantCode,
                vendorNumber,
                searchValue,
                pageIndex,
                pageSize
            }
        );
    }
}
