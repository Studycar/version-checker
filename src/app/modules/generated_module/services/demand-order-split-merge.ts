import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { DemandOrderSplitMergeDto } from 'app/modules/generated_module/dtos/demand-order-split-merge-dto';
import { Action } from '@progress/kendo-angular-dateinputs/dist/es2015/calendar/models/navigation-action.enum';
import { ActionResultDto } from '../dtos/action-result-dto';
import { map } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 权限管理服务 */
export class DemandOrderSplitMergeService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
        ) { }

    // seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverppdemandordersplitmerge/ppdemandordersplitmerge/GetAllData';
    searchUrl = '/api/ps/ppReqSplitMerge/query';

    getCategories(plantCode: string, categoryCode: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
      return this.http.get(
        '/api/ps/ppReqSplitMerge/getCategories',
        { plantCode, categoryCode, pageIndex, pageSize }
      );
    }

    delete(ids: string[]): Observable<ResponseDto> {
      return this.http.post(
        '/api/ps/ppReqSplitMerge/delete',
        ids
      );
    }

    save(dto: {[key: string]: any}): Observable<ResponseDto> {
      return this.http.post(
        '/api/ps/ppReqSplitMerge/save',
        dto
      );
    }

}
