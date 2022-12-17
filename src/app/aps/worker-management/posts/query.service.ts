import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { doesNotThrow } from 'assert';


@Injectable()
export class PostsService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  private baseUrl = '/api/ps/psposts/';
  public queryUrl = this.baseUrl + 'queryInfo';
  public exportUrl = this.baseUrl + 'exportInfo';
  public queryCertificateUrl = this.baseUrl + 'QueryCertificate';
  public exporCertificateUrl = this.baseUrl + 'ExportCertificate';
  public querySkillUrl=this.baseUrl + 'QuerySkill';
  public exporSkillUrl=this.baseUrl + 'ExportSkill';
  public queryCertificateListUrl= this.baseUrl + 'QueryCertificateList';
  public querySkillListUrl= this.baseUrl + 'QuerySkillList';
  public deleteCertificateUrl = this.baseUrl + 'DeleteCertificate';
  public deleteSkillUrl = this.baseUrl + 'DeleteSkill';

  DeleteCertificate(ids: string[]): Observable<ActionResponseDto> {
    return this.http
      .post(this.deleteCertificateUrl, {
        ids: ids
      });
  }

  DeleteSkill(ids: string[]): Observable<ActionResponseDto> {
    return this.http
      .post(this.deleteSkillUrl, {
        ids: ids
      });
  }

    Save(dto: any): Observable<ActionResponseDto> {
      return this.http
        .post(this.baseUrl + 'save', dto);
    }

    Edit(dto: any): Observable<ActionResponseDto> {
      let data = {
        id:dto.id,
        plantCode:dto.plantCode,
        postCode:dto.postCode,
        postName:dto.postName,
        postType:dto.postType,
        isKey:dto.isKey,
        isPublic:dto.isPublic,
        postGrade:dto.postGrade,
        category:dto.category,
        subCat:dto.subCat,
        isNeeded:dto.isNeeded,
        validYn:dto.validYn,
      };
      return this.http
        .post(this.baseUrl + 'update', data);
    }

    SaveCertificate(dto: any): Observable<ActionResponseDto> {
      return this.http
        .post(this.baseUrl + 'SaveCertificate', {
          inputDto: dto
        });
    }

    SaveSkill(dto: any): Observable<ActionResponseDto> {
      return this.http
        .post(this.baseUrl + 'SaveSkill', {
          inputDto: dto
        });
    }

    GetPosts():Observable<ActionResponseDto>{
      return this.http
        .post(this.exportUrl);
    }

    GetCertificateLists():Observable<ActionResponseDto>{
      return this.http
        .post(this.queryCertificateListUrl);
    }

    GetSkillLists():Observable<ActionResponseDto>{
      return this.http
        .post(this.querySkillListUrl);
    }
}


