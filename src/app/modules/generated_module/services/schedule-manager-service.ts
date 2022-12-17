import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { CommonInputDto } from '../dtos/common-input-dto';
import { ActionResultDto } from '../dtos/action-result-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 事业部和计划维护服务 */
export class ScheduleManagerService {
  constructor(private appApiService: AppApiService,
    public http: _HttpClient
  ) { }

  queryUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/api/admin/psscheduleregion/queryInfo';

  saveUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/api/admin/psscheduleregion/queryInfo/SaveInfo';

  /** 保存 */
  Save(dto: any): Observable<ResponseDto> {
    return this.http.post(
      '/api/admin/psscheduleregion/save', dto ,
    );
  }

  /** 获取事业部 */
  GetScheduleRegion(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/api/admin/psscheduleregion/getScheduleRegion/' + 'Y',
      {}, { method: 'GET' }
    );
  }

  /** 获取所有应用程序 */
  // GetAppliaction(): Observable<ActionResponseDto> {
  //   return this.appApiService.call<ActionResponseDto>(
  //     '/afs/serverbaselookupcode/lookuptype/GetAppliaction',
  //     {},
  //   );
  // }
}
