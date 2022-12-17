import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class PlantAreaService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  CommonUrl = 'api/ps/ppPlantArea/';
  QueryUrl = this.CommonUrl + 'GetData/';
  /** 保存 */
  public Save(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.CommonUrl + 'save', dto);
  }
  /** 删除 */
  public Delete(Ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.CommonUrl + 'Delete', { ids: Ids });
  }

  /** 获取销售公司/区域 {SCHEDULE_REGION_CODE: "CFDQSD", CUST_DIVISION_TYPE: "REGION/DC",PAREAT_DIVISION_ID:"", ENABLE_FLAG: "",QueryParams:{PageIndex:1,PageSize:20}}*/
  public GetDivisions(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/ps/dpCustDivision/getData',
      dto);
  }
  /** 获取客户信息 **/
  public GetCustomers(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/ps/psCustomer/getData',
      dto);
  }
}
