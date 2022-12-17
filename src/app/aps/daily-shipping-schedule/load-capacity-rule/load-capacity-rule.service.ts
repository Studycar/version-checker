import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
//import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
//import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class LoadCapacityRuleService extends CommonQueryService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  //seachUrl = '/afs/ServerSPDailyShippingSchedule/loadcapacityrule/Query';
  baseUrl = '/api/admin/sploadcapacityrule/';
  seachUrl = this.baseUrl + 'query';

  /** 查询对于工厂的装运点 */
  QueryLocation(plantCode: any): Observable<ResponseDto> {
    return this.http.post(this.baseUrl + 'queryLocation', {
      'plantCode': plantCode
    });
  }

  /** 查询时间段 */
  QueryInternals(plantCode: any): Observable<ResponseDto> {
    return this.http.get(this.baseUrl + 'queryInternals', {
      'plantCode': plantCode
    });
  }

  /** 保存 */
  Save(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'save', dto);
  }

  /** 删除 */
  Delete(Ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'delete', Ids);
  }

  /** 导入 */
  // Import(dtos: any[]): Observable<ResponseDto> {
  //   return this.http.post<ResponseDto>(this.baseUrl + 'importData', { dtos: dtos });
  // }

  Import(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      this.baseUrl + 'importData', dto, { method: 'POST' }
    );
  }
}

