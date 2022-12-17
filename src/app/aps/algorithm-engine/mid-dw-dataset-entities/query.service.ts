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
export class MidDWDatasetEntitiesService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  private baseUrl = '/api/ai/aimiddwdatasetentities/';
  public getProjectsUrl = this.baseUrl + 'getProjects';
  public getProjectOrgsUrl = this.baseUrl + 'getProjectOrgs';
  public getEntitieOrgsUrl = this.baseUrl + 'getEntitieOrgs';
  public getDatasetsUrl = this.baseUrl + 'getDatasets';
  public getDatasetsPageUrl = this.baseUrl + 'getDatasetsPage';
  public getEntitiesUrl = this.baseUrl + 'getEntities';
  public getEntitiesPageUrl = this.baseUrl + 'getEntitiesPage';

 
   getProjects():Observable<ResponseDto>{
    return this.http
    .get(this.getProjectsUrl,{
      proejctTopicType: '',
      projectName: '',
      activeFlag: 'Y'
    });
   }

   getEntitieOrgs(dto: any):Observable<ResponseDto>{
    return this.http
    .get(this.getEntitieOrgsUrl,dto);
   }
   
   saveEntities(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'saveEntities', dto);
    }

    saveEntitieOrgs(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'saveEntitieOrgs', dto);
    }

    release(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'release', dto);
    }

    cancleRelease(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'cancleRelease', dto);
    }

    extract(dto: any): Observable<ResponseDto> {
      return this.http
        .post(this.baseUrl + 'extractForUI', dto);
    }

}


