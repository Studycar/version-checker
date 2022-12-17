import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { SSL_OP_ALL } from 'constants';
import { Size } from '@progress/kendo-drawing/dist/npm/geometry';
import { ActionResponseDto } from '../../../../modules/generated_module/dtos/action-response-dto';
import { Observable } from 'rxjs';


@Injectable()
export class QueryService1 extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }
}
