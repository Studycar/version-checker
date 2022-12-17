/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:49
 * @LastEditors: Zwh
 * @LastEditTime: 2020-08-19 15:42:07
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ProlineGroupMaintainInputDto } from 'app/modules/generated_module/dtos/ProlineGroupMaintain-input-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 计划组维护管理服务 */
export class ProLineGroupMaintainService {
  constructor(private appApiService: AppApiService) { }

  seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/psschedulegroup/QueryInfo';
  exportUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/psschedulegroup/QueryInfo';

  /** 获取 物料 */
  GetPlantCodes(ScheduleRegionCode?: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psprolinegroupmanager/GetPlantCodes',
      {
        ScheduleRegionCode: (ScheduleRegionCode === undefined ? '' : ScheduleRegionCode)
      },
    );
  }

  /** 获取 物料 */
  GetScheduleRegionByPlant(PLANT_CODE?: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psschedulegroup/getScheduleRegionByPlant?plantCode=' + (PLANT_CODE === undefined ? '' : PLANT_CODE),
      {
      }, { method: 'GET'}
    );
  }
  /** 获取 事业部 */
  GetScheduleRegion(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psschedulegroup/getScheduleRegion',
      {
      },
    );
  }

  /** 获取 计划组 */
  GetScheduleGroups(PLANT_CODE: string, ScheduleRegionCode?: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psschedulegroup/getScheduleGroups?plantCode=' + (PLANT_CODE === undefined ? '' : PLANT_CODE) + '&scheduleRegionCode=' + (ScheduleRegionCode === undefined ? '' : ScheduleRegionCode),
      {
      }, { method: 'GET' }
    );
  }

  /** 编辑 */
  Edit(dto: ProlineGroupMaintainInputDto): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psschedulegroup/save', dto);
  }

  GetInfo(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psschedulegroup/getById?Id=' + id,
      {
      }, { method: 'GET' });
  }

  getUserPlant(userId: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/api/admin/psprivilege/getUserPrivilagePlant',
      { UserID: userId }
    );
  }

}
