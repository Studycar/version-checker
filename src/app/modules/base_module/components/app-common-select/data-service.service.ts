import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class QueryService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  /**
   * 获取事业部数据
   * @param UserName 用户名称
   * @param ValidatePrivilage 是否权限验证
   * @returns {Observable<any>}
   */
  getRegion(UserName: string, ValidatePrivilage: boolean): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprivilege/psprivilege/get_schedule_region',
      { UserName, ValidatePrivilage }
    );
  }

  /**
   * 获取工厂数据
   * @param UserName 用户名称
   * @param ValidatePrivilage 是否权限验证
   * @param ScheduleRegionCode 事业部编码
   * @returns {Observable<any>}
   */
  getPlant(UserName: string, ValidatePrivilage: boolean, ScheduleRegionCode: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprivilege/psprivilege/get_plant',
      { UserName, ValidatePrivilage, ScheduleRegionCode }
    );
  }

  /**
   * 获取计划组数据
   * @param UserName 用户名称
   * @param ValidatePrivilage 是否权限验证
   * @param PlantCode 工厂编码
   * @returns {Observable<any>}
   */
  getGroup(UserName: string, ValidatePrivilage: boolean, ScheduleRegionCode: string, PlantCode: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprivilege/psprivilege/get_schedule_group',
      { UserName, ValidatePrivilage, ScheduleRegionCode, PlantCode }
    );
  }

  /**
   * 获取产线数据
   * @param UserName 用户名称
   * @param ValidatePrivilate 是否权限验证
   * @param ScheduleGroupCode 计划组编码
   * @returns {Observable<any>}
   */
  getLines(UserName: string, ValidatePrivilate: boolean, ScheduleGroupCode: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprivilege/psprivilege/get_resource',
      { UserName, ValidatePrivilate, ScheduleGroupCode }
    );
  }
}
