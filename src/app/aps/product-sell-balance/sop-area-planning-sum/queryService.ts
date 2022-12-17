import { Injectable } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ActionResultDto } from 'app/modules/generated_module/dtos/action-result-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()

export class AreaPlanningSumService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }
  baseUrl = '/api/sop/sopareaplanningsum';
  queryUrl = this.baseUrl + '/query';

  /** 查询 */
  Query(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      this.queryUrl,
      {
        dto,
      },
    );
  }

  /** 获取产能分类 */
  getClasses(BUSINESS_UNIT_CODE: string): Observable<ActionResultDto> {
    return this.http.get<ActionResultDto>(
      this.baseUrl + '/getClasses',
      {
        businessUnitCode: BUSINESS_UNIT_CODE
      },
    );
  }

  /**获取物料分页信息*/
  public getUserPlantItemPage(
    plantCode: string,
    itemCode: string,
    descriptionsCn: string,
    pageIndex: number = 1,
    pageSize: number = 10,
    itemId: string = '',
    itemType: string = '',
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psItem/pageItem',
      {
        plantCode: plantCode,
        itemId: itemId,
        // itemCode: itemCode,
        itemCodeOrDesCn: itemCode,
        itemType: itemType,
        descriptionsCn: descriptionsCn,
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
    );
  }
}
