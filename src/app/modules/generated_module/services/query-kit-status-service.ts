import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';


@Injectable()
/** 快码管理服务 */
export class QueryKitStatusService {
  constructor(private appApiService: AppApiService) { }

 kitUrl = '/api/pc/pcEntityKitQuery/';

  queryUrl = this.kitUrl + '/queryMoKitStatus'; /* 非分页查询 */
  querymaterialUrl = this.kitUrl + 'queryKitStatusMaterial'; /* 非分页查询 */
  queryitemdetailUrl = this.kitUrl + 'queryKitStatusItemDetail'; 
  queryPurchaseKitStatus =  this.kitUrl + 'queryPurchaseKitStatus'; 
  
  getBuyers(): Observable<any> {
    return this.appApiService.call<any>(
      this.kitUrl + 'listBuyer',
      {
      }, { method: 'GET' });
  }

  /** 查询物料 */
  getItemDetail (plantCode: String, itemCode: String, pageIndex: number, pageSize: number): Observable<any> {
    return this.appApiService.call<any>('/api/ps/psItem/pageItem',
      {
        plantCode: plantCode,
        itemCode: itemCode,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
  }
}
