import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';

@Injectable()
export class EnergyConstraintsService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }

  public getResourceUrl = '/api/admin/psResource/queryResource'
  public getScheduleGroupCodeUrl = '/api/admin/psResource/getScheduleGroupCode?plantCode=';
  private seahItemByIDUrl = '/api/ps/psitemroutings/getByItemId?id=';
  
  /**根据工厂获取用户权限内计划组*/
  public GetScheduleGroupCode(value: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      this.getScheduleGroupCodeUrl +
      value,
      {},
      { method: 'GET' },
    );
  }

  /**通过计划组编码获取所有资源*/
  public GetResourceBySchedule(plantCode: string, scheduleGroupCode: string, resourceCode: string = ''): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.getResourceUrl + '?txtPlantCode=' + plantCode + '&txtScheduleGroupCode=' + scheduleGroupCode + '&txtResourceCode=' + resourceCode,
      {});
  }

  /**通过物料ID获取物料描述、计量单位 */
  public SearchItemInfoByID(id: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      this.seahItemByIDUrl + id,
      {
      },
    );
  }

  public GetEnergyTypeByTypeRef(type: string, arrayRef: any[], language = '') {
    this.GetLookupByTypeLang(type, language).subscribe(result => {
      arrayRef.length = 0;
      result.Extra.forEach(d => {
        arrayRef.push({
          label: d.meaning,
          value: d.lookupCode,
          attribute1: d.attribute1
        });
      });
    });
  }
}
