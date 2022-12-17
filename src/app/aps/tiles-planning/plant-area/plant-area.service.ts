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

  CommonUrl = '/api/tp/ppplantareatiles/';
  QueryUrl = this.CommonUrl + 'Query';
  /** 保存 */
  public Save(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(this.CommonUrl + 'Save', dto);
  }
  /** 删除 */
  public Delete(Ids: string[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(this.CommonUrl + 'Delete', { Ids: Ids });
  }

  /** 获取销售公司/区域 {SCHEDULE_REGION_CODE: "CFDQSD", CUST_DIVISION_TYPE: "REGION/DC",PAREAT_DIVISION_ID:"", ENABLE_FLAG: "",QueryParams:{PageIndex:1,PageSize:20}}*/
  public GetDivisions(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>('/afs/serversalespolicy/serversalespolicyservice/GetDivisions',
      dto);
  }

  public GetSaleCompany(dto:any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>('/afs/serversalespolicy/serversalespolicyservice/GetDivisions',
      dto);
  } 


  /** 获取客户信息 **/
  public GetCustomers(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>('/afs/serverpscustomer/pscustomerservice/Query',
      dto);
  }

  /** 获取省信息 **/
  public GetProvinces(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>('/api/tp/psprovince/getProvinces');
  }

  /** 获取地级市信息 **/
  public GetCities(strProvinceId: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/tp/psprovince/getCities', 
      {strProvinceId: strProvinceId});
  }

    
}
