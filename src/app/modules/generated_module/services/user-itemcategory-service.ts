import { Injectable, Inject } from '@angular/core';
import { Observable,  } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { UserItemCategoryDto } from '../dtos/user-item-category-dto';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class UserItemCategoryService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }


    url = '/api/pc/pcUserItemCategory/queryUserItemCategory';

    GetById(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto> (
            '/api/pc/pcUserItemCategory/queryUserItemCategoryById',
            {
              id
            }
        );
    }


    /*GetPlant(userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerPCUserItemCategory/PCUserItemCategory/GetPlant?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }*/

    GetCate(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerPCUserItemCategory/PCUserItemCategory/GetCate',
            {

            }, { method: 'GET' }
        );
    }


    GetEmploy(): Observable<ResponseDto> {
        return this.http.get<ResponseDto> (
            '/api/admin/baseusers/userList',
          {}
        );
    }


    GetFullName(employname: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerPCUserItemCategory/PCUserItemCategory/GetFullName?employname=' + employname,
            {

            }, { method: 'GET' }
        );
    }

    GetCategoryName(categorycode: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerPCUserItemCategory/PCUserItemCategory/GerCategoryName?categroycode=' + categorycode,
            {

            }, { method: 'GET' }
        );
    }

    save(dto: {[key: string]: any}): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/pc/pcUserItemCategory/saveUserItemCategory',
        { ...dto }
      );
    }

    /*EditData(dto: UserItemCategoryDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerPCUserItemCategory/PCUserItemCategory/EditData',
            {
                dto
            }
        );
    }*/
/*
    SaveForNew(dto: UserItemCategoryDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerPCUserItemCategory/PCUserItemCategory/SaveForNew',
            {
                dto
            }
        );
    }*/


    /*remove(dto: UserItemCategoryDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerPCUserItemCategory/PCUserItemCategory/Remove',
            {
                dto
            }
        );
    }*/


    /*RemoveBath(dtos: UserItemCategoryDto[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerPCUserItemCategory/PCUserItemCategory/RemoveBath',
            {
                dtos
            }
        );
    }*/

    delete(ids: String[]): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/pc/pcUserItemCategory/deleteUserItemCategory',
        ids
      );
    }

    public GetUserPlantCategoryPageList(plantCode: string, categoryCode: string, pageIndex: number = 1, pageSize: number = 10): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            '/api/ps/pscategories/QueryPage',
            {
                categorySetCode: '采购分类',
                // categoryCode: categoryCode,
                itemCodeOrDesCn: categoryCode,
                //categoryCodeMatch: categoryCodeMatch,
                pageIndex: pageIndex,
                pageSize: pageSize
            });
    }
}

