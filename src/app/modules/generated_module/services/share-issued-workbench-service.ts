import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ShareIssuedDto } from 'app/modules/generated_module/dtos/share-issued-workbench-dto';
import { CommonQueryService, HttpAction } from './common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 共享件2.0下达平台 */
export class ShareIssuedWorkbenchService extends CommonQueryService {

  // constructor(private httpClient: HttpClient) { }
  constructor(
    public httpClient: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(httpClient, appApiService);
  }
  strUrl = '/api/ps/ppshareplanheader/';

  /** 保存共享件信息 */
  SaveShareData(dataList: any[]): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(
      this.strUrl + 'saveShareData', dataList
    );
  }
  
  /** 下达共享件信息 */
  ReserveShareData(plantCode: String, listItemId: any, dto: any, startDate: String, endDate: String): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.strUrl + 'reserveShareData',
      { plantCode: plantCode, itemIdList: listItemId, dtoSave: dto, startDate: startDate, endDate: endDate });
  }

    /** 单个下达共享件信息 */
  OneReserveShareData(plantCode: String, saveData: any): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.strUrl + 'oneReserveShareData',
      { plantCode: plantCode, saveData: saveData });
  }

    /** 数据刷新 */
  RefreshShareData(plantCode: String, listItemId: any, endDate: String): Observable<ResponseDto> {
    return this.httpClient.post<ResponseDto>(this.strUrl + 'refreshShareData',
      { plantCode: plantCode, itemIdList: listItemId, endDate: endDate });
  }

  /** 供需生成 */
  setReqOrder(plantCode: string): Observable<ResponseDto> {
    return this.http.get(this.strUrl + 'setReqOrder',
    {   plantCode : plantCode});
  }
}
