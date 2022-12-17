import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/Observable';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends CommonQueryService {
  constructor(public http: _HttpClient, public appApiService: AppApiService) {
    super(http, appApiService);
  }

  // 工单组件重读
  ReLoadMoRequirement(plantCode: string, listMoNums: any): Observable<any> {
    return this.http.post<any>(
      '/afs/serverpscomvindicate/pscomvindicate/ReLoadMoRequirement',
      { plantCode: plantCode, listMoNums: listMoNums },
    );
  }

  ExchangePlant(plantCode: string, Ids: any[]) {
    return this.http.post(
      '/afs/serverpscomvindicate/pscomvindicate/ExchangePlant',
      { PlantCode: plantCode, Ids: Ids },
    );
  }

  ExchangePlant_java(plantCode: string, Ids: string[]) {
    return this.http.post(
      '/api/tp/tpCommon/exchangePlant',
      {  ids: Ids,plantCode: plantCode },
    );
  }
  
  public GetItemModels(
    PLANT_CODE: any,
    ItemModel: any,
    PageIndex: number = 1,
    PageSize: number = 10,
  ): Observable<GridSearchResponseDto> {

    return this.http.post<GridSearchResponseDto>(
      '/afs/serverpsitemdefine/psitemdefine/QueryItemModel2',
      {
        PLANT_CODE: PLANT_CODE,
        ITEM_MODEL: ItemModel,
        QueryParams: { PageIndex: PageIndex, PageSize: PageSize },
      },
    );
  }


    /**根据物料获取工艺版本*/
    public GetThenVersionByItem(
      itemCode: string,
      resource = '',
    ): Observable<ResponseDto> {
      return this.http.get<ResponseDto>(
        '/api/tp/tpCommon/getThenVersionByItem',
        {
          itemCode: itemCode,
          resource: resource,
        },
      );
    }
}
