import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class MoMultiMouldManageService {
    constructor(
      private appApiService: AppApiService,
      private commonQueryService: CommonQueryService,
      private http: _HttpClient,
    ) { }
    seachUrl = '/api/ps/psmomultimould/queryPage';
    saveUrl = '';

    public loadMaterials(e: any, plantCode: string): Observable<any> {
      const pageIndex = Number((e.Skip || 0) / (e.PageSize || 1) + 1);
      const pageSize = Number(e.PageSize);
      const itemCode = e.SearchValue || '';
      return this.commonQueryService
        .getUserPlantItemPageList(plantCode, itemCode, '', pageIndex, pageSize)
        .map(it => {
          return { data: it.data.content, total: it.data.totalElements };
        });
  
    }
    /** 配套计算 --over*/
    MoMatchCalc(dto: {[key: string]: any}): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psmomultimould/moMatchCalc',
            {
                ...dto
            });
    }





    /**配套取消 */
    CancelMoMatch(ids: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psmomultimould/cancelMoMatch', ids
            );
    }

}
