import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';


@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }

  /** 获取LastQuery */
  Search(): Observable<GridSearchResponseDto> {
    return this.http
      .get('/afs/serverbaseworkbench/workbench/getLastQuery', {
      });
  }

  /** 删除LastQuery */
  Remove(): Observable<any> {
    return this.http
      .get('/afs/serverbaseworkbench/workbench/removeLastQuery', {
      });
  }
}


