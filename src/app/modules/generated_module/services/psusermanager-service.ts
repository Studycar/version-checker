import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { PsusermanagerInputDto } from 'app/modules/generated_module/dtos/Psusermanager-input-dto';

@Injectable()
/** 用户事业部和工厂维护 */
export class PsusermanagerService {
  constructor(private appApiService: AppApiService) { }

  seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/psserverusermanager/usermanager/querypsusermanagerbypage';

  /** 获取导出数据 */
  Export(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/psserverusermanager/usermanager/Export',
      {
        strUserName: dto.strUserName
      });
  }
  /** 获取查询条件中的用户名 下拉框值*/
  GetUserName(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/psserverusermanager/usermanager/GetUserName',
      {
      });
  }

}
