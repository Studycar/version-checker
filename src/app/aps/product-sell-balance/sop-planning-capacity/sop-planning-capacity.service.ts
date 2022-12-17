import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';

@Injectable()
export class SopPlanningCapacityService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  commonUrl = '/api/sop/sopplanningcapacity';
  queryUrl = this.commonUrl + '/query';
  /** 保存 */
  public save(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.commonUrl + '/save', dto);
  }
  /** 获取产量均值数据 */
  public getAverageData(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.commonUrl + '/getAverageData', dto);
  }
  /** 删除 */
  public delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.commonUrl + '/delete', ids);
  }

  /** 导入excel数据 */
  public import(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.commonUrl + '/fileImport', dtos);
  }

  /** 获取产能分类 {regionCode: "CFDQSD", demandDivision: "产能分类", enableFlag: "",…}*/
  public getDemandDivisions(regionCode: string, enableFlag: string = 'Y', demandDivision: string = '产能分类'): Observable<ResponseDto> {
    const url = this.commonUrl + '/getDemandDivisions?businessUnitCode=' + regionCode + '&enableFlag=' + enableFlag + '&divisionName=' + demandDivision;
    return this.http.get<ResponseDto>(url);
  }
}
