import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { Observable } from 'rxjs';
import { GetScheduleGroupCodesInputDto } from '../dtos/get-schedule-group-codes-input-dto';
import { GetScheduleGroupResourcesInputDto } from '../dtos/get-schedule-group-resources-input-dto';
import { GetPlantPlatformDataInputDto } from '../dtos/get-plant-platform-data-input-dto';

@Injectable({
  providedIn: 'root'
})
export class OPPlantPlatformService {

  constructor(private http: _HttpClient) { }

  /**获取计划工作台查询条件*/
  public GetPlantPlatformQueryConditions(): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverpsopplantplatform/PSOPPlantPlatformService/GetPlantPlatformQueryConditions'
    );
  }

  /**获取计划组*/
  public GetScheduleGroupCodes(inputDto: GetScheduleGroupCodesInputDto): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverpsopplantplatform/PSOPPlantPlatformService/GetScheduleGroupCodes',
      {
        ScheduleRegionCode: inputDto.ScheduleRegionCode,
        PlantCode: inputDto.PlantCode
      }
    );
  }

  /**获取计划组和资源（生产线）数据*/
  public GetScheduleGroupResources(inputDto: GetScheduleGroupResourcesInputDto): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverpsopplantplatform/PSOPPlantPlatformService/GetScheduleGroupResources',
      {
        ScheduleRegionCode: inputDto.ScheduleRegionCode,
        PlantCode: inputDto.PlantCode,
        ScheduleGroupCode: inputDto.ScheduleGroupCode
      }
    );
  }

  /**获取计划工作台数据输出参数*/
  public GetPlantPlatformData(inputDto: GetPlantPlatformDataInputDto): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsopplantplatform/PSOPPlantPlatformService/GetPlantPlatformData',
      {
        StartDate: inputDto.StartDate,
        EndDate: inputDto.EndDate,
        ScheduleGroupResources: inputDto.ScheduleGroupResources,
        PlantCode: inputDto.PlantCode
      }
    );
  }
}
