import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { Observable } from 'rxjs';


@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }
  
  /**同步SAP工序*/
  public SyncSapProcess(): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>('/afs/serverbaseapiserver/apiserver/SyncSapProcess?');
  }
}

