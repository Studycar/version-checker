import { Injectable } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends CommonQueryService {
  searchUrl = '/api/ps/ppMixedResourceIssued/queryMixedResourceIssuedHW';

  /** 获取工厂列表 */
  public GetAppliactioPlant(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psprivilege/getAppliactioPlant',
      {}
    )
  }

  /**根据工厂获取用户权限内计划组*/
  public GetScheduleGroupCode(value: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      `/api/admin/psResource/getScheduleGroupCode?plantCode=${value}`,
      {},
      { method: 'GET' },
    );
  }

  /**通过计划组编码获取所有资源*/
  public GetResourceBySchedule(plantCode: string, scheduleGroupCode: string, resourceCode: string = ''): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psResource/queryResource' + '?txtPlantCode=' + plantCode + '&txtScheduleGroupCode=' + scheduleGroupCode + '&txtResourceCode=' + resourceCode,
      {}
    );
  }

  /** 批量下达 */
  BatchIssue(ids: string[], plantCode: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/ppMixedResourceIssued/SendMarkOrder', {
        makeOrderNumList: ids,
        plantCode,
        // TODO 以下是后台需要的多余参数
        assMarkOrderList: '',
        markOrderList: '',
        nodeDTOS: []
      },
      { method: 'POST' }
    );
  }

  /** 批量回退 */
  Rollback(ids: string[], plantCode: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/ppMixedResourceIssued/cancelPlanOrder', {
        makeOrderNumList: ids,
        plantCode,
        // TODO 以下是后台需要的多余参数
        assMarkOrderList: '',
        markOrderList: '',
        nodeDTOS: []
      },
      { method: 'POST' }
    );
  }

}
