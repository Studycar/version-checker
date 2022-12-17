import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { VendorCategoriesPercentDto } from '../dtos/vendor-categories-percent-dto';
import { ResponseDto } from '../dtos/response-dto';
@Injectable()
export class VendorCategoriesPercentService {
    constructor(private appApiService: AppApiService) { }
    URL_Prefix = '/api/pc/pcvendorcategoriespercent/';
    URL_PrefixPS ='/api/ps/pscategories/';
    Save(dto: VendorCategoriesPercentDto, isUpdate: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'save', dto
            );
    }

    Delete(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'delete', id
           );
    }

    QueryStockCategory(dimensionName: string, dimensionValues: string, categoriesCode: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_PrefixPS + 'queryStockCategory',
            {
                dimensionName: dimensionName,
                dimensionValues: dimensionValues,
                categoriesCode: categoriesCode,
                pageIndex: pageIndex,
                pageSize: pageSize
            }, { method: 'POST' });
    }

    QueryVendor(dimensionName: string, dimensionValues: string, vendorNumber: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.URL_Prefix + 'queryVendor',
            {
                dimensionName: dimensionName,
                dimensionValues: dimensionValues,
                vendorNumber: vendorNumber,
                pageIndex: pageIndex,
                pageSize: pageSize
            }, { method: 'POST' } );
    }
}
