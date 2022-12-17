import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { BaseApplicationInputDto } from 'app/modules/generated_module/dtos/base-application-input-dto';
import { BaseApplicationOutputDto } from 'app/modules/generated_module/dtos/base-application-ouput-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 应用模块定义服务 */
export class BaseApplicationManageService {
    constructor(private appApiService: AppApiService) { }

    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaseapplication/baseapplication/SearchGet';

    /** 获取应用模块 */
    Get(id: string): Observable<ResponseDto> {
      return this.appApiService.call<ResponseDto>(
          '/api/admin/application/get/' + id,
          {
          }, { method: 'GET' });
    }

    /** 编辑应用模块 */
    Edit(dto: BaseApplicationInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/application/save', dto
            );
    }
}
