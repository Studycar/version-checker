import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { SopDimmainresrevViewDto } from '../dtos/sopdimmainresrevview-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class SopMaterialDimensionRelationService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    url = '/api/sop/sopdemanddivisionitem/GetData';
    exportUrl = this.url;

    GetRegion(plantCode: string, user: string): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/admin/psprivilege/getUserScheduleRegionCode',
            {
                userId: user
            }
        );
    }

    GetById(Id: string): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.url,
            {
                id: Id
            }
        );
    }


    EditData(dto: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/sop/sopdemanddivisionitem/save',
            dto
        );
    }

    remove(dto: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/sop/sopdemanddivisionitem/delete',
            {
                idList: [dto.id]
            }
        );
    }

    RemoveBath(idList: string[]): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/sop/sopdemanddivisionitem/delete',
            {
                idList: idList
            }
        );
    }

    SaveForNew(dto: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/sop/sopdemanddivisionitem/save',
            dto
        );
    }

    GetGroup(value: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopMaterialDimensionRelation/ServerSopMaterialDimensionRelation/GetGroup?plantCode=' + value,
            {

            }, { method: 'GET' }
        );
    }

    GetDemand(value: any): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            '/api/sop/sopdemanddivisionitem/getDivisionName?region=' + value,
        );
    }

    getValue(regionCode: string, division: string): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/sop/sopdemanddivisionitem/getDivisionValue',
            {
                regionCode: regionCode,
                divisionName: division,
            }
        );
    }

    GetAllPlant(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/ServerSopMaterialDimensionRelation/ServerSopMaterialDimensionRelation/GetAllPlant',
            {

            }, { method: 'GET' }
        );
    }

    /**获取物料分页信息*/
    public GetUserPlantItemPageList(regionCode: string, ITEM_CODE: string, DESCRIPTIONS_CN: string, PageIndex: number = 1, PageSize: number = 10, ITEM_ID: string = ''): Observable<GridSearchResponseDto> {
        return this.http.get<GridSearchResponseDto>(
            '/afs/ServerSopMaterialDimensionRelation/ServerSopMaterialDimensionRelation/getUserPlantItemPageList',
            {
                regionCode: regionCode,
                ITEM_ID: ITEM_ID,
                ITEM_CODE: ITEM_CODE,
                DESCRIPTIONS_CN: DESCRIPTIONS_CN,
                PageIndex: PageIndex,
                PageSize: PageSize
            });
    }
}
