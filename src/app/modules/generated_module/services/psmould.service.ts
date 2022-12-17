import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class PsMouldManageService {
    constructor(
      private appApiService: AppApiService,
      private commonQueryService: CommonQueryService,
      private http: _HttpClient,
    ) { }
    seachUrl = '/api/sop/sopPsMould/queryPage';
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
            '/api/sop/sopPsMould/saveData',
            {
                ...dto
            });
    }

    Get(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            `/api/sop/sopPsMould/queryById/${id}`,
            {
            }, { method: 'GET' });
      }



    /**批量删除 */
    removeBatch(ids: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopPsMould/deleteList', ids
            );
    }

    importData(dtos: any[]): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/sop/sopPsMould/fileImport',
        dtos
      );
    }

    public getPageList(
      plantCode: string,
      pageIndex: number = 1,
      pageSize: number = 10,
    ): Observable<ResponseDto> {
      return this.http.get<ResponseDto>(
        this.seachUrl,
        {
          plantCode,
          pageIndex,
          pageSize,
        }
      );
    }
}
