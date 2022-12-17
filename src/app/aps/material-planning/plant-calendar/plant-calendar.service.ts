import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class PlantCalendarService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  queryUrl = '/api/mrp/mrpcalendar/queryPlantCalendar';

  getPlantCalendarById(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/mrp/mrpcalendar/queryPlantCalendarById',
      { id }
    );
  }

  removePlantCalendar(plantCodes: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/mrp/mrpcalendar/deletePlantCalendar',
      plantCodes 
    );
  }

  savePlantCalendar(saveData: object, isUpdate: boolean): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/mrp/mrpcalendar/savePlantCalendar',
       saveData
    );
  }

  initPlantCalendar(listPlantCode: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/mrp/mrpcalendar/initPlantCalendar',
       listPlantCode 
    );
  }

  copyPlantCalendar(sourcePlant: string, listTargetPlants: string[]): Observable<ResponseDto> {
    return this.http.post(
      '/api/mrp/mrpcalendar/copyPlantCalendar',
      { sourcePlant, listTargetPlants }
    );
  }

  queryPlantCalendarDetail(plantCode: string, yearMonth: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/mrp/mrpcalendar/queryPlantCalendarDetail',
      { plantCode : plantCode, 
        yearMonth : yearMonth }
    );
  }

  savePlantCalendarDetail(plantCode: string, calendarDay: Date, enableFlag: string) {
    return this.http.get<ResponseDto>(
      '/api/mrp/mrpcalendar/savePlantCalendarDetail',
      { plantCode : plantCode, 
        calendarDay : calendarDay, 
        enableFlag : enableFlag }
    );
  }

  getSourcePlantOptions(params: {[key: string]: any}): Observable<ResponseDto> {
    return this.http.get(
      '/api/mrp/mrpcalendar/queryPlantCalendar',
      { ...params }
    );
  }
}
