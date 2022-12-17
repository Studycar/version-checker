import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class SupplierService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {}

    url = '/api/pc/pcApprovedVendorList/queryApprovedVendorList';
    // exportUrl = '/afs/serverpcsupplier/Supplier/ExportData';


    /*GetPlant(user: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetPlantCode?user=' + user,
            {

            }, { method: 'GET' }
        );
    }*/

    /*GetVendor(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetVendor',
            {

            }, { method: 'GET' }
        );
    }*/

    /*GetStatus(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetStatus',
            {

            }, { method: 'GET' }
        );
    }*/

    GetById(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto> (
            '/api/pc/pcApprovedVendorList/queryApprovedVendorListById',
            {
              id
            }
        );
    }


    /*EditData(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/EditData',
            {
                dto
            }
        );
    }*/

    save(dto: {[key: string]: any}): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/pc/pcApprovedVendorList/saveApprovedVendorList',
        dto
      );
    }

    remove(ids: string[]): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/pc/pcApprovedVendorList/deleteApprovedVendorList',
        ids
      );

    }

    /*remove(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/remove',
            {
                dto
            }
        );
    }*/


    /*InsertData(dto: SupplierDro): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/InsertData',
            {
                dto
            }
        );
    }*/

    /*RemoveBath(dtos: SupplierDro[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/RemoveBath',
            {
                dtos
            }
        );
    }*/

    /*GetItemDetail(item: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetItemDesc?item=' + item,
            {

            }, { method: 'GET' }
        );
    }*/

    /**获取物料分页信息(采购员不为空)*/
    public GetUserPlantItemPageList(
      PLANT_CODE: string,
      ITEM_CODE: string,
      DESCRIPTIONS_CN: string,
      PageIndex: number = 1,
      PageSize: number = 10,
      ITEM_ID: string = '',
     ): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/afs/serverpcsupplier/Supplier/GetUserPlantItemPageList',
      {
        PLANT_CODE: PLANT_CODE,
        ITEM_ID: ITEM_ID,
        ITEM_CODE: ITEM_CODE,
        DESCRIPTIONS_CN: DESCRIPTIONS_CN,
        PageIndex: PageIndex,
        PageSize: PageSize,
      },
    );
  }

    GetVendorSite(vendorNumber: string, plantCode: string, pageIndex: number = 1, pageSize: number = 1000): Observable<ResponseDto> {
        return this.http.get<ResponseDto> (
            '/api/pc/pcvendorSites/getVendorSitePageList',
            {
              vendorNumber,
              plantCode,
              pageIndex,
              pageSize
            }
        );
    }

    /*GetRegion(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetRegion',
            {

            }, { method: 'GET' }
        );
    }*/


    /*GetBuyer(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetBuyer',
            {

            }, { method: 'GET' }
        );
    }*/

    /*GetCurrentBuyer(userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpcsupplier/Supplier/GetCurrentBuyer?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }*/

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

  public getVendorPageList(vendorName: string, vendorCodeOrName: string, pageIndex: number = 1, pageSize: number = 10): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/pc/pcvendors/getVendorPageList',
      {
        // vendorNumber,
        vendorName,
        vendorCodeOrName,
        pageIndex,
        pageSize
      });
  }

    public GetBuyerPageList(EMPLOYEE_NUMBER: string, FULL_NAME: string, PageIndex: number = 1, PageSize: number = 10): Observable<GridSearchResponseDto> {
        return this.http.get<GridSearchResponseDto>(
            '/afs/serverpcsupplier/Supplier/GetBuyer',
            {
                EMPLOYEE_NUMBER: EMPLOYEE_NUMBER,
                FULL_NAME: FULL_NAME,
                PageIndex: PageIndex,
                PageSize: PageSize
            });
    }

    getBuyerPageList(employee: string, pageIndex: number = 1, pageSize: number = 10): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/pc/pcUserBuyerRel/queryBuyers',
      {
        employee,
        pageIndex,
        pageSize
      });
  }

}
