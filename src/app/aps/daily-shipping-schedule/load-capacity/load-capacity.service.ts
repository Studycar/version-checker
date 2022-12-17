import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';

@Injectable()
export class LoadCapacityService extends CommonQueryService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  seachUrl = '/api/admin/sploadcapacity/getData';

  /** 查询 */
  // Query(dto: any): Observable<GridSearchResponseDto> {
  //   return this.http.post('/afs/ServerSPDailyShippingSchedule/loadcapacity/Query', { dto: dto });
  // }
}

