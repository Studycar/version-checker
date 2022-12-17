import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class SopMouldCapacityService {
    constructor(
      private appApiService: AppApiService,
      private commonQueryService: CommonQueryService,
      private http: _HttpClient,
    ) { }
    seachUrl = '/api/sop/sopmouldcapacity/queryPage';
    saveUrl = '';

    /** 编辑是否有效 --over*/
    edit(dto: {[key: string]: any}): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopmouldcapacity/save',
            {
                ...dto
            });
    }

    /**批量删除 */
    removeBath(ids: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/sop/sopmouldcapacity/delete', ids
            );
    }

    importData(dtos: any[]): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/sop/sopmouldcapacity/fileImport',
        dtos
      );
    }
}
