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
export class MidDWCategoriesService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  private baseUrl = '/api/ai/aimiddwcategories/';
  public queryUrl = this.baseUrl + 'getCategoriesPage';
  public exportUrl = this.baseUrl + 'exportCategories';
  public queryEditUrl = this.baseUrl + 'getDatasetsPage';
  public exportEditUrl = this.baseUrl + 'exportDatasets';
 

    Save(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'saveCategories', dto);
    }

    saveDatasets(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'saveDatasets', dto);
    }

    submit(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'submit', dto);
    }

}


