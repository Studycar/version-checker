import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class ShipmentNoteService extends CommonQueryService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  baseUrl = '/api/admin/spshipmentnote/';

  querysSummaryUrl = this.baseUrl + 'QuerysSummary';
  querysDetailUrl = this.baseUrl + 'QuerysDetail';

  /** 查询概述 */
  QuerysSummary(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post(this.querysSummaryUrl, dto);
  }

  /** 查询明细 */
  QuerysDetail(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post(this.querysDetailUrl, dto);
  }

  /** 更新DN */
  UpdateDN(dtos: any): Observable<ResponseDto> {
    return this.http.post(this.baseUrl + 'UpdateDN', dtos);
  }
}

