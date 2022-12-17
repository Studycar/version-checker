/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:49
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-11 11:37:57
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 快码管理服务 */
export class ComVindicateService {
  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient,
  ) { }

  seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaselookupcode/lookuptype/querylookuptype';

  /** 根据工单号获取工单信息 */
  public queryMoInfo(makeOrderNum: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psMakeOrder/getMoInfo',
      {
        makeOrderNum: makeOrderNum
      });
  }

  // // 根据工单号和工厂查询工单信息
  // queryMoInfo(plantcodes: string, key: string): Observable<any> {
  //     return this.appApiService.call<any>(
  //         '/afs/serverpscomvindicate/pscomvindicate/getmoinfo?plantcode=' + plantcodes
  //         + '&key=' + key,
  //         {
  //         }, { method: 'GET' });
  // }

  // 查询Mo编码
  query(mo_num: string, desc: string, plantcode: string): Observable<any> {
    return this.appApiService.call<any>(
      '/afs/serverpscomvindicate/pscomvindicate/query?moNo=' + mo_num
      + '&desc=' + desc + '&plantcode=' + plantcode,
      {
      }, { method: 'GET' });
  }

  /**获取物料分页信息*/
  public getMoNumPageList(PLANT_CODE: string, MAKE_ORDER_NUM: string, DESCRIPTIONS_CN: string, PageIndex: number = 1, PageSize: number = 10, ITEM_ID: string = ''): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/pscomvindicate/getMoNumPageList',
      {
        plantCode: PLANT_CODE,
        makeOrderNum: MAKE_ORDER_NUM,
        descriptionsCn: DESCRIPTIONS_CN,
        pageIndex: PageIndex,
        pageSize: PageSize
      });
  }
}
