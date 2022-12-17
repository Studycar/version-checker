import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()
export class CustomerService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  CommonUrl = '/api/ps/psCustomer/';
  QueryUrl = this.CommonUrl + 'queryList';
  /** 保存 */
  public save(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.CommonUrl + 'save', dto);
  }
  /** 获取当前记录 */
  public getDataById(id: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(this.CommonUrl + 'Get', { id: id });
  }
}
