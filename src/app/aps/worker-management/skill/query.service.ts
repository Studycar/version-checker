import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';


@Injectable()
export class SkillService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  private baseUrl = '/api/ps/psskill/';
  public queryUrl = this.baseUrl + 'queryPage';
  public exportUrl = this.baseUrl + 'ExportInfo';

  /** 保存 */
  Save(dto: any): Observable<ActionResponseDto> {
    return this.http
      .post(this.baseUrl + 'save',
      dto,
    );
  }

  GetSkillList(dto: any):Observable<ActionResponseDto>{
    return this.http
      .get(this.baseUrl+ 'queryPage', dto,);
  }

}


