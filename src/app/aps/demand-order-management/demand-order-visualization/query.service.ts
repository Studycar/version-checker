import { Injectable } from '@angular/core';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/Observable';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';
import { map } from 'rxjs/operators';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }

  seachhistoryUrl = '/api/ps/ppReqOrders/getChangeHistoryReq';

  private fetchhistory(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    return this.http
      .get<ResponseDto>(this.seachhistoryUrl, queryParams)
      .pipe(map(res => res.data));
  }
  /**
   * create by jianl
   * 上面的旧方法貌似有问题，第一次没有return，重新实现一个新的方法
   * @param queryParams 查询参数
   */
   public readhistory(queryParams?: any): Observable<GridSearchResponseDto> {
    return this.http
    .get<ResponseDto>('/api/ps/ppReqOrders/getChangeHistoryPs', queryParams)
    .pipe(map(res => res.data));
  }

  public getChangeHistoryReq(queryParams?: any): Observable<any[]> {
    return this.fetchhistory(queryParams);
  }

  /**获取API请求接收报表数据*/
  public GetReceiveRptData(dto: any): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/api/ps/psMakeOrder/queryByProjectNumber', dto
    );
  }

  //获取明细展示 
  public getDetail(queryParams?: any, action: string = '', data?: any): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/api/pc/noticeQueryCancel/queryNoticeDataIsByCurUser', queryParams
    );
  }

  //获取工单齐套情况
  public queryMoKitStatus(queryParams?: any, action: string = '', data?: any): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/api/pc/pcEntityKitQuery/queryMoKitStatus', queryParams
    );
  }

  // 获取工单齐套状态
  public queryPurchaseKitStatus(queryParams?: any, action: string = '', data?: any): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/api/pc/pcEntityKitQuery/queryPurchaseKitStatus', queryParams
    );
  }
  // 工单完成率
  public queryCalcMakeOrderCompletionRate(queryParams?: any, action: string = '', data?: any): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/api/ps/psMakeOrder/queryCalcMakeOrderCompletionRate', queryParams
    );
  }

  // 齐套情况
  public queryMakeOrderKitRate(queryParams?: any, action: string = '', data?: any): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/api/ps/psMakeOrder/queryMakeOrderKitRate', queryParams
    );
  }

  // 饼图数据展示?moNumber=
  public getPieData(queryParams: any, actions: string = '', data?: any): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/api/pc/noticeQueryCancel/queryNoticeDataChart', queryParams
    );
  }
}