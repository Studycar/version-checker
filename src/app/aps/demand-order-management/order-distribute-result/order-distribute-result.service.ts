import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';

@Injectable()
export class OrderDistributeResultService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  CommonUrl = '/api/ps/orderDistributeResult';
  QueryUrl = this.CommonUrl + '/query';
  /** 保存--修改分配工厂/分配日期 */
  public Save(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(this.CommonUrl + '/save', dto);
  }
  /** 获取批次号 */
  public GetBatchNoList(): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(this.CommonUrl + '/getBatchNoList');
  }
}
