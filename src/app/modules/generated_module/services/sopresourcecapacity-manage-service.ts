import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class SopResourceCapacityManageService {
    constructor(
      private appApiService: AppApiService,
      private commonQueryService: CommonQueryService,
      private http: _HttpClient,
    ) { }
    seachUrl = '/api/sop/sopResourceCapacity/queryPage';
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
    /** 编辑是否有效 --over*/
    Edit(dto: {[key: string]: any}): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopResourceCapacity/saveData',
            {
                ...dto
            });
    }

    Get(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            `/api/sop/sopResourceCapacity/queryById/${id}`,
            {
            }, { method: 'GET' });
      }



    /**批量删除 */
    RemoveBath(ids: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopResourceCapacity/deleteList', ids
            );
    }

    importData(dtos: any[]): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/sop/sopResourceCapacity/fileImport',
        dtos
      );
    }
}
