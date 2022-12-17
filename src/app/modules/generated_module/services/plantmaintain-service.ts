/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:49
 * @LastEditors: Zwh
 * @LastEditTime: 2020-08-19 20:10:41
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { PlantMaintainInputDto } from 'app/modules/generated_module/dtos/PlantMaintain-input-dto';
import { PlantMaintainOutputDto } from 'app/modules/generated_module/dtos/PlantMaintain-output-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 工厂维护管理服务 */
export class PlantMaintainService {
  constructor(
    private appApiService: AppApiService,
    private _httpClient: _HttpClient,
  ) {}

  seachUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/api/admin/psplant/QueryInfo';
  exportUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/api/admin/psplant/QueryInfo';

  /** 获取快码 */
  GetInfo(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psplant/getById?Id=' + id,
      {},
      { method: 'GET' },
    );
  }

  /** 获取 事业部 */
  GetScheduleRegion(enableFlag = 'Y'): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/workbench/GetUserScheduleRegion',
      {
        enableFlag: enableFlag,
      },
      { method: 'GET' },
    );
  }
  // /** 获取工单类型 */
  GetMoType(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psplant/getMoType',
      {},
      { method: 'GET' },
    );
  }

  /** 获取 主组织 */
  GetMasterOrganizationids(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psplant/getMasterOrganizations',
      {},
    );
  }

  /** 编辑 */
  Edit(dto: PlantMaintainInputDto): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psplant/save',
        dto,
    );
  }

  /** create by jianl，获取工厂的统一接口 */
  Query(dto: {
    plantCode?: string
  }): Observable<ResponseDto> {
    return this._httpClient.get<ResponseDto>(
      '/api/admin/psplant/getByCode',
      dto,
    );
  }
}
