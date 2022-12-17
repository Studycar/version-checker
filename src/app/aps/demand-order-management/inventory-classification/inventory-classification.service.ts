import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { _HttpClient } from '@delon/theme';
import { HttpAction } from 'app/modules/generated_module/services/common-query.service';

@Injectable()
export class InventoryClassificationService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  url = '/api/ps/invPlanCategories/pageQuery';
  action: HttpAction = {
    url: this.url,
    method: 'GET'
  };

  queryDataItemInfo(id: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/invPlanCategories/getById',
      id 
    );
  }

  saveDataItem(params: { [key: string]: any }): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/invPlanCategories/edit',
      { ...params }
    );
  }

  deleteDataItem(id: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/invPlanCategories/delete',
      id
    );
  }
}
