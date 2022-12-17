import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }

  planWorkbenchBaseUrl = '/api/mrp/mrpPlanWorkbenchController/'; // '/afs/ServerMrpPlanWorkbench/MrpPlanWorkbenchService/';
  public planWorkbenchQueryUrl = this.planWorkbenchBaseUrl + 'queryPlanWorkbench';
  public planWorkbenchQuery = { url: this.planWorkbenchQueryUrl, method: 'POST' };

  public planExceptionQuery = { url: this.planWorkbenchBaseUrl + 'queryPlanException', method: 'POST' };
  public planOnhandQuery = { url: this.planWorkbenchBaseUrl + 'queryPlanOnhand', method: 'POST' };
  public planPeggingQuery = { url: this.planWorkbenchBaseUrl + 'queryPlanPegging', method: 'POST' };

  // 获取计划名称
  QueryPlans(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.planWorkbenchBaseUrl + 'queryPlans');
  }

  // 获取计划相关数据
  QueryDataByPlan(planName: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.planWorkbenchBaseUrl + 'queryDataByPlan', { planName }
    );
  }

  // 获取二维计划台数据
  QueryPlanWorkbenchEx(inputDto: any, CUSTOMER_APPOINT_VENDOR: any): Observable<ResponseDto> {
    inputDto['customerAppointVendor'] = CUSTOMER_APPOINT_VENDOR;
    return this.http.post<ResponseDto>(
      this.planWorkbenchBaseUrl + 'queryPlanWorkbenchEx', inputDto,
      // { inputDto: inputDto, CUSTOMER_APPOINT_VENDOR: CUSTOMER_APPOINT_VENDOR },
    );
  }

  // 修改计划订单数量和时间
  UpdatePlannedOrder(inputDto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.planWorkbenchBaseUrl + 'updatePlannedOrder', inputDto, // { listSaveData: inputDto },
    );
  }

  // Mrp发布采购计划单
  PublishPlannedOrder(inputDto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      this.planWorkbenchBaseUrl + 'publishPlannedOrder', inputDto,
    );
  }
  
}

