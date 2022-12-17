import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

@Injectable()
export class SalesPolicyService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  CommonUrl = '/api/ps/ppSalesPolicy/';
  QueryUrl = this.CommonUrl + 'query';
  
  /** 保存 */
  public Save(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(this.CommonUrl + 'save', dto);
  }
  /** 删除 */
  public Delete(ids: string[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(this.CommonUrl + 'delete', ids);
  }

  /** 获取产品编码 {SCHEDULE_REGION_CODE: "CFDQSD", ITEM_CODE: "", ENABLE_FLAG: "",QueryParams:{PageIndex:1,PageSize:20}}*/
  public GetItems(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(this.CommonUrl + 'GetItems',
      dto);
  }

  /** 获取销售公司/区域 {SCHEDULE_REGION_CODE: "CFDQSD", CUST_DIVISION_TYPE: "REGION/DC",PAREAT_DIVISION_ID:"", ENABLE_FLAG: "",QueryParams:{PageIndex:1,PageSize:20}}*/
  public GetDivisions(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>('/api/ps/dpCustDivision/getData',
      dto);
  }
}
