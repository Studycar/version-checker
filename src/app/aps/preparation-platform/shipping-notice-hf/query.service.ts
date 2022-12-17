import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }
  /***************************************Java版********************************************/
  baseUrl = '/api/pc/pcShippingNoticeHf/';
  /** 查询送货通知 */
  pageMainData(inputDto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'pageMainData', inputDto);
  }
  /** 搜索明细 */
  pageDetailData(inputDto: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.baseUrl + 'pageDetailData', inputDto);
  }
  /** 查询送货计划 */
  pageDeliveryPlan(inputDto: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.baseUrl + 'pageDeliveryPlan', inputDto);
  }
  /** PO缺料查询 */
  listPoLackMaterial(plantCode: string, categoryType: string, buyer: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.baseUrl + 'listPoLackMaterial',
      { plantCode: plantCode, categoryType: categoryType, buyer: buyer });
  }
  /***************************************以下C#版********************************************/
  /** 加载查询页面初始化数据 */
  QueryMainData(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post('/afs/serverpcshippingnoticehf/pcshippingnoticehf/QueryMainData', { dto: dto });
  }

  /** 搜索明细 */
  SearchDetail(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post('/afs/serverpcshippingnoticehf/pcshippingnoticehf/QueryDetailData', { dto: dto });
  }

  /** PO缺料查询 */
  QueryPoLackMaterial(plantCode: string, categoryType: string, buyer: string): Observable<ActionResponseDto> {
    return this.http.post('/afs/serverpcshippingnoticehf/pcshippingnoticehf/QueryPoLackMaterial',
      { plantCode: plantCode, categoryType: categoryType, buyer: buyer });
  }

  /** 送货计划发布查询 */
  QueryDeliveryPlan(inputDto: any): Observable<GridSearchResponseDto> {
    return this.http.post('/afs/serverpcshippingnoticehf/pcshippingnoticehf/QueryDeliveryPlan',
      { inputDto: inputDto });
  }

  /** 数据检查查询 */
  QueryDataCheck(inputDto: any): Observable<GridSearchResponseDto> {
    return this.http.post('/afs/serverpcshippingnoticehf/pcshippingnoticehf/QueryDataCheck',
      { inputDto: inputDto });
  }
}

