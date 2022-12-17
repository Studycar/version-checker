import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { Observable } from 'rxjs';
import { GetScheduleGroupCodesInputDto } from '@shared/model/graphicalworkbench/get-schedule-group-codes-input-dto';
import { GetScheduleGroupResourcesInputDto } from '@shared/model/graphicalworkbench/get-schedule-group-resources-input-dto';
import { GetGraphicalWorkbenchDataInputDto } from '@shared/model/graphicalworkbench/get-graphical-workbench-data-input-dto';

@Injectable({
  providedIn: 'root'
})
export class OPGraphicalWorkbenchService {

  constructor(private http: _HttpClient) { }

  /**获取计划工作台查询条件*/
  public GetGraphicalWorkbenchQueryConditions(): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverpsopgraphicalworkbench/PSOPGraphicalWorkbenchService/GetGraphicalWorkbenchQueryConditions'
    );
  }

  /**获取计划组*/
  public GetScheduleGroupCodes(inputDto: GetScheduleGroupCodesInputDto): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverpsopgraphicalworkbench/PSOPGraphicalWorkbenchService/GetScheduleGroupCodes',
      {
        ScheduleRegionCode: inputDto.ScheduleRegionCode,
        PlantCode: inputDto.PlantCode
      }
    );
  }

  /**获取计划组和资源（生产线）数据*/
  public GetScheduleGroupResources(inputDto: GetScheduleGroupResourcesInputDto): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverpsopgraphicalworkbench/PSOPGraphicalWorkbenchService/GetScheduleGroupResources',
      {
        ScheduleRegionCode: inputDto.ScheduleRegionCode,
        PlantCode: inputDto.PlantCode,
        ScheduleGroupCode: inputDto.ScheduleGroupCode
      }
    );
  }

  /**获取计划工作台数据输出参数*/
  public GetGraphicalWorkbenchData(inputDto: GetGraphicalWorkbenchDataInputDto): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsopgraphicalworkbench/PSOPGraphicalWorkbenchService/GetGraphicalWorkbenchData',
      {
        StartDate: inputDto.StartDate,
        EndDate: inputDto.EndDate,
        ScheduleGroupResources: inputDto.ScheduleGroupResources,
        PlantCode: inputDto.PlantCode
      }
    );
  }

  /**获取计划工作台数据输出参数*/
  public GetGraphicalWorkbenchDataCanvas(inputDto: GetGraphicalWorkbenchDataInputDto): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsopgraphicalworkbench/PSOPGraphicalWorkbenchService/GetGraphicalWorkbenchDataCanvas',
      {
        StartDate: inputDto.StartDate,
        EndDate: inputDto.EndDate,
        ScheduleGroupResources: inputDto.ScheduleGroupResources,
        PlantCode: inputDto.PlantCode
      }
    );
  }

  /** 日历编码列表获取 */
  GetCalendarList(dto = {}): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpscalendar/CalendarService/GetCalendarList', {
        dto
      });
  }
}
