import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
//dtos/response-dto
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';

@Injectable()
export class ScheduleStopProductionService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  // CommonUrl = '/afs/serverpsplanschedule/ScheduleStopProductionService/';
  // QueryUrl = this.CommonUrl + 'Query/';
  // QueryGroupDetailUrl = this.CommonUrl + 'QueryGroup/';

  CommonUrl = '/api/ps/psstopproduction/';
  CommonDetailUrl = '/api/ps/psstopproductiongroup/';
  QueryUrl = this.CommonUrl + 'query';
  QueryGroupDetailUrl = this.CommonDetailUrl + 'queryGroup';

  //QueryUrl = '/api/ps/psstopproductionrecord/GetStopRecord';
  public Get(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      this.QueryUrl + `/${dto}`, {
    });
  }

  /** 编辑 */
  public Save(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      this.CommonUrl + 'save', {
      ...dto
    });
  }

  /** 删除 */
  public Delete(Ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.CommonUrl + 'delete', Ids);
  }

  /** 导入excel数据 */
  public Import(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.CommonUrl + 'importData', dtos);
  }

  /** 编辑 */
  public SaveGroup(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.CommonDetailUrl + 'saveGroup', dto);
  }

  /** 删除 */
  public DeleteGroup(Ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.CommonDetailUrl + 'deleteGroup', Ids);
  }
}
