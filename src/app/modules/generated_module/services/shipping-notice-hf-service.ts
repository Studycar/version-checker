import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { CommonQueryService, HttpAction } from './common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 备料平台 */
export class ShippingNoticeHfService extends CommonQueryService {

  // constructor(private httpClient: HttpClient) { }
  constructor(
    public httpClient: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(httpClient, appApiService);
  }
  /***************************************************Java版********************************************* */
  baseUrl = '/api/pc/pcShippingNoticeHf/';
  /** 加载查询页面初始化数据 */
  loadQueryData(): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.baseUrl + 'loadQueryData');
  }
  /** 查询计划班次类型 */
  listCalendarType(plantCode: String): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.baseUrl + 'listCalendarType', { plantCode: plantCode });
  }
  /** 查询采购品类 */
  listPurCagetory(plantCode: String, calendarType: String): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.baseUrl + 'listPurCagetory', { plantCode: plantCode, calendarType: calendarType });
  }
  /*送货计划发布*/
  releaseDeliveryPlan(plantCode: string, listDpId: any): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'releaseDeliveryPlan', { plantCode: plantCode, deliveryPlanIdList: listDpId });
  }

  /*数据刷新*/
  refreshData(plantCode: string, buyer: string, listItem: any): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'refreshData',
      { plantCode: plantCode, buyer: buyer, listItem: listItem });
  }
  /*自动计算*/
  autoCalculate(plantCode: string, buyer: string, listItem: any, calendarCode: string, fdStatus: string,autoCalculateType:string): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'autoCalculate',
      { plantCode: plantCode, buyer: buyer, listItem: listItem, calendarCode: calendarCode, fdStatus: fdStatus,autoCalculateType:autoCalculateType });
  }
  /** 保存送货计划 */
  saveDeliveryPlanData(dto: any, buyer: string): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'saveDeliveryPlanData',
      { listSave: dto, buyer: buyer });
  }
  /*清除送货计划*/
  clearDeliveryPlan(listPlan: any, buyer: string): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'clearDeliveryPlan',
      { listSave: listPlan, buyer: buyer }
    );
  }
  /*下达*/
  noticeRelease(plantCode: string, buyer: string, listItem: any, calendarCode: string, dtSave: any, fdStatus: string): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'dnRelease',
      { plantCode: plantCode, buyer: buyer, listItem: listItem, calendarCode: calendarCode, listSave: dtSave, fdStatus: fdStatus });
  }
  /*单个下达*/
  oneNoticeRelease(plantCode: string, buyer: string, calendarCode: string, saveData: any, fdStatus: string): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'oneDnRelease',
      { plantCode: plantCode, buyer: buyer, calendarCode: calendarCode, saveData: saveData, fdStatus: fdStatus });
  }
  /***************************************************C#版********************************************* */
  /** 加载查询页面初始化数据 */
  LoadQueryData(): Observable<ActionResponseDto> {
    return this.httpClient.get<ActionResponseDto>('/afs/serverpcshippingnoticehf/pcshippingnoticehf/LoadQueryData');
  }

  /** 查询计划班次类型 */
  GetCalendarType(plantCode: String): Observable<ActionResponseDto> {
    return this.httpClient.get<ActionResponseDto>('/afs/serverpcshippingnoticehf/pcshippingnoticehf/GetCalendarType?plantCode=' + plantCode);
  }

  /** 查询采购品类 */
  GetPurCagetory(plantCode: String, calendarType: String): Observable<ActionResponseDto> {
    return this.httpClient.get<ActionResponseDto>('/afs/serverpcshippingnoticehf/pcshippingnoticehf/GetPurCagetory?plantCode=' + plantCode + '&calendarType=' + calendarType);
  }


  /** 保存送货计划 */
  SaveDeliveryPlanData(dto: any, buyer: string): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(
      '/afs/serverpcshippingnoticehf/pcshippingnoticehf/SaveDeliveryPlanData',
      { listSave: dto, buyer: buyer });
  }

  /*数据刷新*/
  RefreshData(plantCode: string, buyer: string, listItem: any): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(
      '/afs/serverpcshippingnoticehf/pcshippingnoticehf/RefreshData',
      { plantCode: plantCode, buyer: buyer, listItem: listItem });
  }

  /*清除送货计划*/
  ClearDeliveryPlan(listPlan: any, buyer: string): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(
      '/afs/serverpcshippingnoticehf/pcshippingnoticehf/ClearDeliveryPlan',
      { listPlan: listPlan, buyer: buyer }
    );
  }

  /*自动计算*/
  AutoCalculate(plantCode: string, buyer: string, listItem: any, calendarCode: string, fdStatus: string): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(
      '/afs/serverpcshippingnoticehf/pcshippingnoticehf/AutoCalculate',
      { plantCode: plantCode, buyer: buyer, listItem: listItem, calendarCode: calendarCode, fdStatus: fdStatus });
  }

  /*下达*/
  NoticeRelease(plantCode: string, buyer: string, listItem: any, calendarCode: string, dtSave: any, fdStatus: string): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(
      '/afs/serverpcshippingnoticehf/pcshippingnoticehf/NoticeRelease',
      { plantCode: plantCode, buyer: buyer, listItem: listItem, calendarCode: calendarCode, listSave: dtSave, fdStatus: fdStatus });
  }

  /*单个下达*/
  OneNoticeRelease(plantCode: string, buyer: string, calendarCode: string, saveData: any, fdStatus: string): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(
      '/afs/serverpcshippingnoticehf/pcshippingnoticehf/OneNoticeRelease',
      { plantCode: plantCode, buyer: buyer, calendarCode: calendarCode, saveData: saveData, fdStatus: fdStatus });
  }

  /*送货计划发布*/
  DeliveryPlanRelease(plantCode: string, listDpId: any): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(
      '/afs/serverpcshippingnoticehf/pcshippingnoticehf/DeliveryPlanRelease', { plantCode: plantCode, listDpId: listDpId });
  }

  /*原辅料需求刷新*/
  RefreshMaterialDemand(plantCode: string, listItem: any): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(
      '/afs/serverpcshippingnoticehf/pcshippingnoticehf/RefreshMaterialDemand',
      { plantCode: plantCode, listItem: listItem });
  }
}
