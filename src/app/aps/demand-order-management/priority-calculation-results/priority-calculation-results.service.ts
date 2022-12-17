import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

const URL = '/api/ps/ppOrderPriority';

@Injectable({
  providedIn: 'root',
})
export class PriorityCalculationResultsService {

  constructor(
    private http: _HttpClient,
    private commonQueryService: CommonQueryService,
  ) {
  }

  query(dto, context): void {
    this.commonQueryService.loadGridView({ url: `${URL}/query`, method: 'GET' }, dto, context);
  }

  edit(dto): Observable<ActionResponseDto> {
    return this.http.post(`${URL}/save`,dto);
  }

  queryDetail(dto, context) {
    this.commonQueryService.loadGridView({ url: `${URL}/queryGrade`, method: 'GET' },dto, context);
  }

  getBatchNoList(): Observable<ActionResponseDto> {
    return this.http.get(`${URL}/getBatchNoList`);
  }

  getRuleList(): Observable<GridSearchResponseDto> {
    return this.http.post(`/api/ps/pprulepriorityheader/getData`, { isExport: true });

  }
}
