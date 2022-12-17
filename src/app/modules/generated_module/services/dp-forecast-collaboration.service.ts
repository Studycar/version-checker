import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class DpForecastCollaborationService{

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  // 获取ag-grid表格数据的URL
  summaryQueryUrl = 'afs/serverppforecastcoordination/ppforecastcoordinationservice/query';               // 汇总
  detailQueryUrl = 'afs/serverppforecastcoordination/ppforecastcoordinationservice/querydetail';          // 明细

  /*getSummaryGridData(queryParams: object): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      'afs/serverppforecastcoordination/ppforecastcoordinationservice/query',
      { ...queryParams }
    );
  }*/

  /*getDetailGridData(queryParams: object): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      'afs/serverppforecastcoordination/ppforecastcoordinationservice/querydetail',
      { ...queryParams }
    );
  }*/

  // 根据物料编码获取物料详细信息
  public SearchItemInfoByCode(ITEM_CODE: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprodlineitem/psprodlineitem/GetByItemCode',
      {
        ITEM_CODE: ITEM_CODE
      },
    );
  }

  // 获取用户角色权限列表
  getUserRole(): Promise<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      'afs/serverppforecastcoordination/ppforecastcoordinationservice/getuserrole'
    ).toPromise();
  }

  // 获取产品维度
  getProductDimensionOptions(): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      'afs/serverppforecastcoordination/ppforecastcoordinationservice/getproductdimension'
    );
  }

  // 获取客户维度
  getCustomerDimensionOptions(cust_division_name: string = '', cust_division_value: string = ''): Observable<ActionResponseDto> {
    return this.http.post(
      'afs/serverppforecastcoordination/ppforecastcoordinationservice/getcustomerdimension',
      { cust_division_name, cust_division_value }
    );
  }

  getCustomerOptions(customer_short_name: string = ''): Observable<ActionResponseDto> {
    return this.http.post(
      'afs/serverppforecastcoordination/ppforecastcoordinationservice/querypscustomer',
      { customer_short_name }
    );
  }

  importFile(Records: any[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      'afs/serverppforecastcoordination/ppforecastcoordinationservice/importData',
      { dtos: Records }
    );
  }

}
