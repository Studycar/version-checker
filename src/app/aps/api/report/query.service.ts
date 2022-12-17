import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';

@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }

  /**获取API请求接收报表数据*/
  public GetReceiveRptData(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      // '/afs/serverapireport/receiverpt/GetRptData', 
      '/api/api/apireceive/listRptData', dto
    );
  }
  // 获取接口注册信息
  GetApiAllList(dto?: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      // '/afs/serverapiregister/ApiRegisterService/GetAllList', {dto}
      '/api/api/apireceive/listDetailDataAll', dto
    );
  }

  // queryDetailUrl = '/afs/serverapireport/receiverpt/GetDetailData';
  queryDetailUrl = '/api/api/apireceive/listDetailData';
  queryExportUrl = '/api/api/apireceive/listDetailDataAll';
  /**获取API请求接收明细数据*/
  public GetDetailData(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      // '/afs/serverapireport/receiverpt/GetDetailData', 
     '/api/api/apireceive/listDetailData', dto
    );
  }
}
