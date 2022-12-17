/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2021-03-23 09:36:06
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-24 09:45:03
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { Observable } from 'rxjs';
import { GetScheduleGroupResourcesInputDto } from '../dtos/get-schedule-group-resources-input-dto';
import { GetPlantPlatformDataInputDto } from '../dtos/get-plant-platform-data-input-dto';
import { GetScheduleGroupCodesInputDto } from '../dtos/get-schedule-group-codes-input-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable({
  providedIn: 'root'
})
export class PlantPlatformService {

  constructor(private http: _HttpClient) { }

  /**获取计划工作台查询条件*/
  public GetPlantPlatformQueryConditions(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/graphicalScheduling/getPlantPlatformQueryConditions'
    );
  }

  /**获取计划组*/
  public GetScheduleGroupCodes(inputDto: GetScheduleGroupCodesInputDto): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverpsplantplatform/PSPlantPlatformService/GetScheduleGroupCodes',
      {
        ScheduleRegionCode: inputDto.ScheduleRegionCode,
        PlantCode: inputDto.PlantCode
      }
    );
  }

  /**获取计划组和资源（生产线）数据*/
  public GetScheduleGroupResources(inputDto: GetScheduleGroupResourcesInputDto): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psschedulegroup/queryGraphicalSchedulingResource',
      {
        scheduleRegionCode: inputDto.ScheduleRegionCode,
        plantCode: inputDto.PlantCode,
        scheduleGroupCode: inputDto.ScheduleGroupCode
      }
    );
  }

  /**获取计划工作台数据输出参数*/
  public GetPlantPlatformData(inputDto: GetPlantPlatformDataInputDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/graphicalScheduling/queryGraphicalSchedulingData',
      {
        startDate: inputDto.StartDate,
        endDate: inputDto.EndDate,
        scheduleGroupResources: inputDto.ScheduleGroupResources,
        plantCode: inputDto.PlantCode
      }
    );
  }

    /** 日历编码列表获取，API待改 */
    GetCalendarList(dto = {}): Observable<ActionResponseDto> {
      return this.http
        .post('/api/ps/pscalendars/getCalendarList', {
          dto
        });
    }

      /**获取计划工作台数据输出参数(新图形化组件), API待改*/
  public GetPlantPlatformDataCanvas(inputDto: GetPlantPlatformDataInputDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/graphicalScheduling/queryGraphicalSchedulingData',
      {
        startDate: inputDto.StartDate,
        endDate: inputDto.EndDate,
        scheduleGroupResources: inputDto.ScheduleGroupResources,
        plantCode: inputDto.PlantCode
      }
    );
  }
}
