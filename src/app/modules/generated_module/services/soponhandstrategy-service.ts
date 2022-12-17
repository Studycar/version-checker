import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
//import { ActionResponseDto } from '../dtos/action-response-dto';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { SopDimmainresrevViewDto } from '../dtos/sopdimmainresrevview-dto';

@Injectable()

export class SopOnhandStrategyService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    CommonUrl = '/api/sop/soponhandstrategy/';
    url = this.CommonUrl + 'query';

    GetById(Id: string): Observable<ResponseDto> {
        const dto = {
            id: Id,
            plantCode: '',
            regionCode: '',
            onhandLevel: '',
            levelValue: '',
            isExport: false,
            pageIndex: 1,
            pageSize: 1
        };
        return this.appApiService.call<ResponseDto>(
            this.url + `/${dto}`, {});
    }

    // public Get(dto: any): Observable<ResponseDto> {
    //     return this.appApiService.call<ResponseDto>(
    //       this.QueryUrl + `/${dto}`, {
    //     });
    //   }

    //   /** 编辑 */
    //   public Save(dto: any): Observable<ResponseDto> {
    //     return this.appApiService.call<ResponseDto>(
    //       this.CommonUrl + 'save', {
    //       ...dto
    //     });
    //   }



    /** 编辑 */
    public EditData(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.CommonUrl + 'save', {
            ...dto
        });
    }

    /** 删除 */
    public Delete(Ids: string[]): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(this.CommonUrl + 'delete', Ids);
    }



    // SaveForNew(dto: any): Observable<ResponseDto> {
    //     return this.appApiService.call<ResponseDto>(
    //         '/afs/ServerSopOnhandStrategy/ServerSopOnhandStrategy/SaveForNew',
    //         {
    //             dto
    //         }
    //     );
    // }



    // GetRegionByBusiness(value: any): Observable<ResponseDto> {
    //     return this.appApiService.call<ResponseDto>(
    //         '/afs/ServerSopRegionPlant/ServerSopRegionPlant/GetRegionByBusiness?business=' + value,
    //         {

    //         }, { method: 'GET' }
    //     );
    // }

    // GetAllPlant(): Observable<ResponseDto> {
    //     return this.appApiService.call<ResponseDto>(
    //         '/afs/ServerSopMaterialDimensionRelation/ServerSopMaterialDimensionRelation/GetAllPlant',
    //         {

    //         }, { method: 'GET' }
    //     );
    // }

}
