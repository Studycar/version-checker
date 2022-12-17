import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
//import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends CommonQueryService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }
  //baseUrl = '/api/ps/psgaparameterplant/';
  baseUrl = '/api/ps/psgaparameterplant/';
  
  /** 搜索 */
  Search(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'getData', dto);
  }
  /** 搜索计划组 */
  SearchScheduleGroup(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'queryScheduleInfo', dto);
  }

  /** 搜索已经新增过的计划组 */
  SearchExistsScheduleGroup(selects: any[], selectDto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'queryExistsScheduleGroup', selects, selectDto);
  }

  /** 保存信息 */
  SaveData(dto: any, selects: any[], selectDto: any, flag: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'saveData', 
    { listSave: dto, selectScheduleGroups: selects, selectDto: selectDto, flag: flag });
  }
}

