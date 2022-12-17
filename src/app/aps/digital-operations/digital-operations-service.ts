import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/Observable';
// services
import { AppApiService } from '../../modules/base_module/services/app-api-service';
// dtos
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Injectable()
export class DigitalOperationsService extends CommonQueryService {
  kpi_division_url: string = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/kpidivision';

  kpi_form_division_url: string = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/kpiformsdivision';

  kpi_user_privilage_url: string = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/kpiuserprivilage';

  constructor(public http: _HttpClient, public appApiService: AppApiService) {
    super(http, appApiService);
  }

  /**
   * @param queryParams
   */
  public queryDivision(queryParams?: any): Observable<ResponseDto> {
    if (!queryParams) {
      queryParams = { formsDivision: '' };
    }
    return this.http.post<ResponseDto>(this.kpi_division_url + '/get', queryParams);
  }

  /**
   * 保存
   * @param data
   */
  public saveDivision(data?: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.kpi_division_url + '/save', data);
  }

  /**
   * @param data
   */
  public deleteDivision(data: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.kpi_division_url + '/delete', data);
  }

  /**
    * @param queryParams
    */
  public queryFormsDivision({ formsDivision = '', selectedReports = '' }): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.kpi_form_division_url + '/get', { formsDivision: formsDivision, selectedReports: selectedReports });
  }

  /**
   * @param data
   */
  public saveFormsDivision(data: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.kpi_form_division_url + '/save', data);
  }

  /**
   * @param data
   */
  public deleteFormsDivision(data: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.kpi_form_division_url + '/delete', data);
  }

  /**
   * @param queryParams
   */
  public queryUserPrivilage({ formsDivision = '', userName = '', plantCode = '' }): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.kpi_user_privilage_url + '/get', {
      formsDivision: formsDivision, userName: userName, plantCode: plantCode
    });
  }

  /**
   * @param queryParams
   */
  public saveUserPrivilage(data: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.kpi_user_privilage_url + '/save', data);
  }

}
