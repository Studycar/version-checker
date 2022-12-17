import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
//import { ResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }

  public queryUrl = 'afs/serverpscalendar/CalendarService/QueryCalendarPage';
  public seachUrl1 = '/api/admin/workbench/getUserPlantRegionLine';

  /* -------------------------------日历编码----------------------- */
  /** 日历编码查询 */
  QueryCalendar(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/queryCalendarPage',
        dto
      );
  }
  /** 日历编码列表获取 */
  GetCalendarList(dto = {}): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/getCalendarList',
        dto
      );
  }
  /** 通过资源编码获取关联的日历编码 */
  GetCalendarByResourceCode(plantCode: string, resourceCode: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/getCalendarByResourceCode',
        { plantCode: plantCode, resourceCode: resourceCode }
      );
  }
  GetCalendarListRef(dto = {}, arrayRef: any[]) {
    arrayRef.length = 0;
    this.GetCalendarList(dto).subscribe(result => {
      result.data.forEach(d => {
        arrayRef.push({
          label: d.calendarCode,
          value: d.calendarCode,
          scheduleRegionCode: d.scheduleRegionCode
        });
      });
    });
  }
  /** 日历编码单记录数据获取 */
  GetCalendar(id: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/getCalendar', {
        id: id
      });
  }
  /** 日历编码保存数据 */
  SaveCalendar(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/saveCalendar', dto);
  }
  /** 日历编码删除 */
  RemoveCalendar(id: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/deleteCalendar', {
        id: id
      });
  }
  /** 日历编码批量删除 */
  BatchRemoveCalendar(ids: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/deleteCalendarList', {
        ids: ids
      });
  }

  /* -------------------------------日历班次----------------------- */
  /** 日历班次查询 */
  QueryShift(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/queryShiftPage',
        dto
      );
  }
  /** 日历班次列表获取 */
  GetShiftList(dto = {}): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/getShiftList',
        dto
      );
  }
  GetShiftListRef(dto = {}, arrayRef: any[]) {
    this.GetShiftList(dto).subscribe(result => {
      arrayRef.length = 0;
      result.data.forEach(d => {
        if (d.enableFlag === 'Y') {
          arrayRef.push({
            value: d.shiftCode,
            label: d.descriptions
          });
        }
      });
    });
  }
  /** 日历班次单记录数据获取 */
  GetShift(id: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/getShift', {
        id: id
      });
  }
  /** 日历班次保存数据 */
  SaveShift(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/saveShift', { dto: dto });
  }
  /** 日历班次删除 */
  RemoveShift(id: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/deleteShift', {
        id: id
      });
  }
  /** 日历班次批量删除 */
  BatchRemoveShift(ids: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/deleteShiftList', {
        ids: ids
      });
  }

  /* -------------------------------日历班次时段----------------------- */
  /** 时段查询 */
  QueryTime(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/queryTimePage',
        dto
      );
  }
  /** 时段列表获取 */
  GetTimeList(dto = {}): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/getTimeList',
        dto
      );
  }
  /** 时段单记录数据获取 */
  GetTime(id: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/getTime', {
        id: id
      });
  }
  /** 时段保存数据 */
  SaveTime(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/saveTime', dto);
  }
  /** 时段删除 */
  RemoveTime(id: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/deleteTime', {
        id: id
      });
  }
  /** 日历班次批量删除 */
  BatchRemoveTime(ids: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/deleteTimeList', {
        ids: ids
      });
  }

  /* -------------------------------产线班次----------------------- */
  /** 产线班次查询 */
  QueryResShift(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/queryResShiftPage',
        dto
      );
  }
  /** 产线班次列表获取 */
  GetResShiftList(dto = {}): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/getResShiftList',
        dto
      );
  }
  /** 产线班次单记录数据获取 */
  GetResShift(id: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/getResShift', {
        id: id
      });
  }
  /** 产线班次保存数据 */
  SaveResShift(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/saveResShift', dto);
  }
  /** 产线班次删除 */
  RemoveResShift(id: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/deleteResShift', {
        id: id
      });
  }
  /** 产线班次批量删除 */
  BatchRemoveResShift(ids: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/deleteResShiftList', {
        ids: ids
      });
  }
  /* -------------------------------产线日历----------------------- */
  QueryResTimeUrl = '/api/ps/pscalendars/queryResTimePage';
  /** 产线日历查询 */
  QueryResTime(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/queryResTimePage',
        dto
      );
  }
  /** 产线日历列表获取 */
  GetResTimeList(dto = {}): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/getResTimeList',
        dto
      );
  }
  /** 产线日历单记录数据获取 */
  GetResTime(id: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/pscalendars/getResTime', {
        id: id
      });
  }
  /** 产线日历初始化数据 */
  InitResTime(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/initResTime', dto);
  }
  /** 产线日历更新 */
  UpdateResTime(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/updateResTime', dto);
  }
  /** 产线日历删除 */
  RemoveResTime(dto: any, timeId: string, resourceCodes: string[]): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/deleteResTime', {
        dto,
        timeId,
        resourceCodes
      });
  }
  /** 产线日历批量删除 */
  BatchRemoveResTime(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/deleteResTimeList',
        dto
      );
  }

  /* -------------------------------产线日历复制----------------------- */
  /** 按日期复制 */
  CopyByDate(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/copyByDate',
        dto
      );
  }

  /** 按产线复制 */
  CopyByLine(dto: any,): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/copyByLine',
        dto,
      );
  }

  /* -------------------------------批量修改----------------------- */
  BatchModifyEfficency(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/batchModifyEfficency', dto);
  }

  // 获取用户权限下的工厂
  getUserPlant(userId: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/afs/serverpsprivilege/psprivilege/getuserprivilage_plant',
      { UserID: userId }
    );
  }
}


