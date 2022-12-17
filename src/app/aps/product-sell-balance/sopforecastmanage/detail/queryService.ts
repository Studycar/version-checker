import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';


@Injectable()

export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }
}
