import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class InventoryCalculationService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  queryUrlsOptions: Array<{ url: string, method: string }> = [
    { url: '/afs/ServerInvPlanDemand/InvPlanDemandService/QueryDemandData1', method: 'POST' },
    { url: '/afs/ServerInvPlanDemand/InvPlanDemandService/QueryDemandData2', method: 'POST' },
    { url: '/afs/ServerInvPlanDemand/InvPlanDemandService/QueryDemandData3', method: 'POST' },
  ];

  getCategorySet(categorySetCode: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getCategorySet',
      { categorySetCode }
    );
  }

  getCategoryData(
    categorySetCode: string,
    categoryCode: string,
    PageIndex: number = 1,
    PageSize: number = 10
  ): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/afs/serverbaseworkbench/workbench/GetCategoryPageList',
      { categorySetCode, categoryCode, PageIndex, PageSize }
    );
  }


  /** 汇总时段Tab数据项新增、编辑 */
  editSummaryPeriodItem(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/ServerInvPlanDemand/InvPlanDemandService/Edit', dto);
  }


  /** 汇总时段Tab数据项信息获取 */
  getSummaryPeriodItemInfo(id: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/ServerInvPlanDemand/InvPlanDemandService/GetByID',
      { id }
    );
  }

  /** 汇总时段Tab数据项删除 */
  deleteSummaryPeriodItem(id: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/ServerInvPlanDemand/InvPlanDemandService/Delete',
      { id }
    );
  }

  /** 计划参数Tab数据项新增、修改 */
  editPlanParameterItem(dto: { [key: string]: any }): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/ServerInvPlanDemand/InvPlanDemandService/EditParameter',
      { ...dto }
    );
  }

  /** 计划参数Tab数据项信息获取 */
  getPlanParameterItemInfo(id: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/ServerInvPlanDemand/InvPlanDemandService/GetByParameterRID',
      { id }
    );
  }

  /** 计划参数Tab数据项删除 */
  deletePlanParameterItem(id: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/ServerInvPlanDemand/InvPlanDemandService/DeleteParameter',
      { id }
    );
  }

  /** 计划参数Tab数据导入 */
  planParameterImport(dtos: any[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/ServerInvPlanDemand/InvPlanDemandService/ImportInfo',
      { dtos }
    );
  }

  /** 引入安全库存 */
  SaveStock(ids: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/ServerInvPlanDemand/InvPlanDemandService/SaveStock',
      {
        data: ids,
      },
    );
  }

  inventoryCheck(params: {[key: string]: any}): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/ServerInvPlanDemand/InvPlanDemandService/InventoryCheck',
      { ...params }
    );
  }

}
