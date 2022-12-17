import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()

export class VersionQueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }
  baseUrl = '/api/sop/sopuncstrforecastversion/';
  queryUrl = this.baseUrl + 'query';

  /** 查询 */
  Query(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.queryUrl, dto);
  }

  /** 审核 */
  Approval(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'approval', dtos);
  }

  /** 获取版本工厂【已审批】 */
  GetVersionPlant(versionCode: string, businessUnitCode: string, approveStatus: string = '已审批'): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.baseUrl + 'getVersionPlant',
      {
        versionCode: versionCode,
        businessUnitCode: businessUnitCode,
        approveStatus: approveStatus
      },
    );
  }

  /** 下达 */
  Send(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'send', dtos);
  }

  /** 查询明细 */
  QueryDetail(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'queryDetail', dto);
  }

  /** 获取版本物料 */
  GetVersionItem(versionCode: string, businessUnitCode: string, plantCode: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.baseUrl + 'getVersionItem',
      {
        versionCode: versionCode,
        businessUnitCode: businessUnitCode,
        plantCode: plantCode
      },
    );
  }

  /** 明细下达 */
  SendDetail(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'sendDetail', dtos);
  }
}
