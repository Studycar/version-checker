import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';


@Injectable()
/** 快码管理服务 */
export class QueryPurchaseKitStatusService {
  constructor(private appApiService: AppApiService) { }
  queryUrl = '/afs/serverpcquerypurchasekitstatus/PCQueryPurchaseKitStatus/querypurchasekitstatus'; /* 非分页查询 */
  querymaterialUrl = '/afs/serverpcquerypurchasekitstatus/PCQueryPurchaseKitStatus/querykitstatusmaterial'; /* 非分页查询 */
  queryitemdetailUrl = '/afs/serverpcquerypurchasekitstatus/PCQueryPurchaseKitStatus/querykitstatusItemDetailed'; 

  getBuyers(): Observable<any> {
    return this.appApiService.call<any>(
      '/afs/serverpcquerypurchasekitstatus/PCQueryPurchaseKitStatus/QueryBuyers',
      {
      }, { method: 'GET' });
  }

  getPlaners(): Observable<any> {
    return this.appApiService.call<any>(
      '/afs/serverpcquerypurchasekitstatus/PCQueryPurchaseKitStatus/QueryPlaners',
      {
      }, { method: 'GET' });
  }

  public GetUserplanners(plantCode: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getUserplanners?plantCode=' + plantCode,
      {
      }, { method: 'GET' });
  }

  getMaterial(plantcode: string, monum: string, type: number): Observable<GridSearchResponseDto> {
    return this.appApiService.call<GridSearchResponseDto>(
      '/afs/serverpcquerypurchasekitstatus/PCQueryPurchaseKitStatus/querykitstatusmaterial?plantcode=' + 
        plantcode + '&monum=' + monum + '&type=' + type,
      {
      }, { method: 'GET' });
  }

  getItemDetail(plantcode: string, itemcode: string): Observable<GridSearchResponseDto> {
    return this.appApiService.call<GridSearchResponseDto>(
      '/afs/serverpcquerypurchasekitstatus/PCQueryPurchaseKitStatus/querykitstatusItemDetailed?plantcode=' + 
        plantcode + '&itemcode=' + itemcode,
      {
      }, { method: 'GET' });
  }

  public getCatPageList(value: string, PageIndex: number = 1, PageSize: number = 10): Observable<GridSearchResponseDto> {
    return this.appApiService.call<GridSearchResponseDto>(
      '/afs/serverpcquerypurchasekitstatus/PCQueryPurchaseKitStatus/QueryCatPageList?value=' + value + '&PageIndex=' + PageIndex + '&PageSize=' + PageSize,
      {
        value: value,
        PageIndex: PageIndex,
        PageSize: PageSize
      }, { method: 'GET' });
  }
}
