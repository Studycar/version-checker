import { Injectable } from '@angular/core';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

@Injectable()
export class PsItemRateService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }
  seachUrl = '/api/ps/psitemrate/getList';


  /** 删除 */
  public removeBatch(ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psitemrate/deleteList',
      ids
    );
  }

  get(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      `/api/ps/psitemrate/queryById/${id}`,
      {
      }, { method: 'GET' });
  }
  /** 编辑是否有效 --over*/
  edit(dto: { [key: string]: any }): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psitemrate/saveData',
      {
        ...dto
      });
  }

  importData(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psitemrate/importData',
      dtos
    );
  }

  public GetResouceCode(plantCode: string, code: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemroutings/getResouceCode',
      {
        plantCode: plantCode,
        code: code
      },
    );
  }
}
