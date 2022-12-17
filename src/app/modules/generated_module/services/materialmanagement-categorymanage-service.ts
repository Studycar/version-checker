import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { CategorymanageinputDto } from '../dtos/categorymanage-input-dto';
import { CategoryManageOutputDto } from '../dtos/categorymange-output-dto';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class MaterialmanagementCategorymanageService {
    constructor(
      private appApiService: AppApiService,
      private http: _HttpClient,
    ) { }
    seachUrl = '/api/ps/pscategories/QueryPage';
    saveUrl = '';

    /** 编辑是否有效 --over*/
    Edit(dto: {[key: string]: any}): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/pscategories/SaveData',
            {
                ...dto
            });
    }

    Get(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            `/api/ps/pscategories/QueryById/${id}`,
            {
            }, { method: 'GET' });
      }

    /** 获取类别集 */
    GetCategorySet(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/pscategories/GetCategorySets',
            {
            }, { method: 'GET' });
    }

    /**批量删除 */
    RemoveBath(ids: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/pscategories/DeleteList', ids
            );
    }

    importData(dtos: any[]): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/ps/pscategories/FileImport',
        dtos
      );
    }
}
