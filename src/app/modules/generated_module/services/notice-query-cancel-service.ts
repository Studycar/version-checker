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
/** 送货通知查询取消 */
export class NoticeQueryCancelService extends CommonQueryService {

  // constructor(private httpClient: HttpClient) { }
  constructor(
    public httpClient: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(httpClient, appApiService);
  }
  // -------------------------------------Java版服务----------------------------------------
  baseUrl = '/api/pc/noticeQueryCancel/';
  psBaseUrl = '/api/ps/psItem/';
  /** 加载查询页面初始化数据 */
  loadQueryData(): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.baseUrl + 'loadQueryData');
  }

  /** 查询送货区域 */
  listDeliveryRegion(plantCode: String): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.baseUrl + 'listDeliveryRegion?plantCode=' + plantCode);
  }

  /** 查询物料 */
  pagePurchaseItem(plantCode: String, itemCode: String, pageIndex: number, pageSize: number): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.psBaseUrl + 'pageItem',
      {
        plantCode: plantCode,
        itemCodeOrDesCn: itemCode,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
  }

  /** 查询供应商 */
  pageVendor(vendorCode: String, pageIndex: number, pageSize: number): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.baseUrl + 'pageVendor',
      {
        vendorCode: vendorCode,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
  }

  /** 查询送货通知 */
  pageNoticeData(inputDto: any): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.baseUrl + 'pageNoticeData', inputDto);
  }


  /** 送货通知取消 */
  cancelNotice(plantCode: string, listNumber: any): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'cancelNotice', { plantCode: plantCode, notifyNumberList: listNumber });
  }

  /** 送货通知释放 */
  releaseNotice(plantCode: string, listNumber: any): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'releaseNotice', { plantCode: plantCode, notifyNumberList: listNumber });
  }

  /** 送货通知保存 */
  saveNotice(listSave: any): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'saveNotice', listSave);
  }

  /** 送货通知发布 */
  publishNotice(plantCode: string, listSave: any): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.baseUrl + 'publishNotice', listSave);
  }

  /** 获取送货单 */
  listDeliveryTicket(plantCode: string, notifyNumber: any): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.baseUrl + 'listDeliveryTicket', { plantCode: plantCode, notifyNumber: notifyNumber });
  }

  /** 获取送货地址 */
  listDeliveryAddress(plantCode: string, regionCode: string): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>(this.baseUrl + 'listDeliveryAddress', { plantCode: plantCode, regionCode: regionCode });
  }

  // -------------------------------------C#版服务----------------------------------------
  strUrl = '/afs/ServerPCNoticeQueryCancel/PCNoticeQueryCancel/';

  /** 加载查询页面初始化数据 */
  LoadQueryData(): Observable<ActionResponseDto> {
    return this.httpClient.get<ActionResponseDto>(this.strUrl + 'LoadQueryData');
  }

  /** 查询送货区域 */
  QueryDeliveryRegion(plantCode: String): Observable<ActionResponseDto> {
    return this.httpClient.get<ActionResponseDto>(this.strUrl + 'QueryDeliveryRegion?plantCode=' + plantCode);
  }

  /** 查询物料 */
  QueryPurchaseItem(plantCode: String, itemCode: String, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
    return this.httpClient.get<GridSearchResponseDto>(this.strUrl + 'QueryPurchaseItem?plantCode=' + plantCode + '&itemCode=' + itemCode + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize);
  }

  /** 查询供应商 */
  QueryVendor(vendorCode: String, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
    return this.httpClient.get<GridSearchResponseDto>(this.strUrl + 'QueryVendor?vendorCode=' + vendorCode + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize);
  }

  /** 查询送货通知 */
  QueryNoticeData(inputDto: any): Observable<GridSearchResponseDto> {
    return this.httpClient.post<GridSearchResponseDto>(this.strUrl + 'QueryNoticeData', { inputDto: inputDto });
  }


  /** 送货通知取消 */
  NoticeCancel(plantCode: string, listNumber: any): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(this.strUrl + 'NoticeCancel', { plantCode: plantCode, listNumber: listNumber });
  }

  /** 送货通知释放 */
  NoticeRelease(plantCode: string, listNumber: any): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(this.strUrl + 'NoticeRelease', { plantCode: plantCode, listNumber: listNumber });
  }

  /** 送货通知保存 */
  SaveNotice(listSave: any): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(this.strUrl + 'SaveNotice', { listSave: listSave });
  }

  /** 送货通知发布 */
  NoticePublish(plantCode: string, listSave: any): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(this.strUrl + 'NoticePublish', { plantCode: plantCode, listSave: listSave });
  }

  /** 送货通知发布 */
  QueryDeliveryTicket(plantCode: string, notifyNumber: any): Observable<ActionResponseDto> {
    return this.httpClient.get<ActionResponseDto>(this.strUrl + 'QueryDeliveryTicket', { plantCode: plantCode, notifyNumber: notifyNumber });
  }

  /** 送货地址 */
  QueryDeliveryAddress(plantCode: string, regionCode: string): Observable<ActionResponseDto> {
    return this.httpClient.post<ActionResponseDto>(this.strUrl + 'QueryDeliveryAddress', { plantCode: plantCode, regionCode: regionCode });
  }
}
