import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { doesNotThrow } from 'assert';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()
export class MidProjectsService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  private baseUrl = '/api/ai/aimidprojects/';
  public queryUrl = this.baseUrl + 'getAiMidProjects';
  public exportUrl = this.baseUrl + 'exportProjects';
  public queryProjectOrgsUrl = this.baseUrl + 'getAiMidProjectsOrgs';
  public exportProjectOrgsUrl = this.baseUrl + 'exportProjectOrgs';
  public batchRemoveOrgUrl = this.baseUrl + 'batchRemoveOrg';
 

  Delete(ids: string[]): Observable<ResponseDto> {
    return this.http
      .post(this.batchRemoveOrgUrl,ids);      
  }

    Save(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'saveAiMidProjects', dto);
    }

    SaveOrg(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'saveAiMidProjectsOrgs', dto);
    }

}


