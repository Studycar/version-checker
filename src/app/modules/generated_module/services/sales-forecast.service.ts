import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class SalesForecastService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  queryUrl = '/afs/serverppforecastdisplay/ppforecastcoordinationservice/query';

  // 获取版本
  getVersion(schedule_region: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverppforecastdisplay/ppforecastcoordinationservice/getforecastversion',
      { schedule_region }
    );
  }

  // 获取产品维度值
  getProductDimensionValue(forecast_paramenter_version: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverppforecastdisplay/ppforecastcoordinationservice/getproductdimensionvalue',
      { forecast_paramenter_version }
    );
  }

  // 获取客户维度值
  getCustomerDimensionValue(forecast_paramenter_version: string): Observable<ActionResponseDto> {
    return this.http.post(
      '/afs/serverppforecastdisplay/ppforecastcoordinationservice/getcustomerdimensionvalue',
      { forecast_paramenter_version }
    );
  }

  // 数据导入
  importFile(Records: any[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverppforecastdisplay/ppforecastcoordinationservice/importdata',
      { dtos: Records }
    );
  }

  getChartData(params: object): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/afs/serverppforecastdisplay/ppforecastcoordinationservice/query',
      params
    );
  }
}
