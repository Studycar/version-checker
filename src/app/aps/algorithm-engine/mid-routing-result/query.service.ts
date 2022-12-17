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
export class MidRoutingResultService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  private baseUrl = '/api/ai/aimidpreroutingresultdetailh/';
  public queryUrl = this.baseUrl + 'getRoutingResultPage';
  public exportUrl = this.baseUrl + 'getRoutingResult';

  public getModelNameUrl = this.baseUrl + 'getModelName';
  public getPlantCodeUrl = this.baseUrl + 'getPlantCode';
 
  getModelName():Observable<ResponseDto>{
    return this.http
    .get(this.getModelNameUrl);
   }

   getPlantCode(): Observable<ResponseDto> {
    return this.http
      .get(this.getPlantCodeUrl);      
  }

  reviewed(dto: any): Observable<ResponseDto> {
    return this.http
      .post(this.baseUrl + 'reviewed', dto);
  }

}


