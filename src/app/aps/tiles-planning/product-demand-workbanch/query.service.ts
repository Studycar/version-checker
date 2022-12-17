import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';

@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }

  /** 搜索 */
  Search(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post('/afs/serverpporderreview/orderreviewappservice/Query', {dto: dto});
  }

    /** 搜索明细 */
  SearchDetail(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post('/afs/serverppshareissuedworkbench/ppshareissuedworkbench/QueryDetailData', {dto: dto});
  }

  // /**获取用户所有组织*/
  // public GetUserPlant(
  //   scheduleRegionCode = '',
  //   userId = '',
  //   plantType = '',
  // ): Observable<ActionResponseDto> {
  //   return this.http.get<ActionResponseDto>(
  //     '/afs/serverbaseworkbench/workbench/getUserPlant?scheduleRegionCode=' +
  //     scheduleRegionCode +
  //     '&userId=' +
  //     userId +
  //     '&plantType=' +
  //     plantType,
  //     {},
  //   );
  // }


  public GetItemSeries<GridSearchResponseDto>(
    plantcode: string,
    value: string,
    pageIndex: number,
    pageNo: number,
  ) {
    return this.http.get('/api/tp/tpCommon/getItemSeries', {
      plantCode: plantcode,
      itemSeries: value,
      pageIndex: pageIndex,
      pageSize: pageNo,
    });
  }


  public GetItemModel<GridSearchResponseDto>(
    plantcode: any,
    value: any,
    pageIndex: number,
    pageNo: number,
  ) {
    return this.http.get(
      '/afs/serverpsitemdefine/psitemdefine/GetItemModels',
      {
        plantcode: plantcode,
        ItemModel: value,
        PageIndex: pageIndex,
        PageSize: pageNo,
      },
    );
  }


  public GetItemCategorys<GridSearchResponseDto>(
    plantcode: any,
    value: any,
    pageIndex: number,
    pageNo: number,
  ) {
    return this.http.get(
      '/afs/serverpsitemdefine/psitemdefine/GetItemCategory',
      {
        plantcode: plantcode,
        ItemCategory: value,
        PageIndex: pageIndex,
        PageSize: pageNo,
      },
    );
  }

}

