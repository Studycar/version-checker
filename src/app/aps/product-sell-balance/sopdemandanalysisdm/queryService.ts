import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()

export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }

  Import(dtos: any[]): Observable<ResponseDto> {
    return this.http.post('/api/sop/sopDemandDivision/fileImport', dtos);
  }
}
