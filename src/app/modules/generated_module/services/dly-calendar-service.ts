import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { DlyCalendarDto } from '../dtos/dly-calendar-dto';
import { DeliveryCalendarInputDto } from '../dtos/delivery-calendar-input-dto';
import { ResponseDto } from '../dtos/response-dto';
import { AppTranslationService } from '../../base_module/services/app-translation-service';
import { _HttpClient } from '@delon/theme';
@Injectable()

export class DlyCalendarService {

    constructor(
        private appApiService: AppApiService,
        private appTranslationService: AppTranslationService,
        public http: _HttpClient,

    ) { }

    // url = '/afs/serverpcdlycalendar/DlyCalendar/GetData';
    // url1 = '/afs/serverpcdlycalendar/DlyCalendar/GetViewData';
    baseUrl = '/api/pc/pcdeliverycalendar/'; // 基路径
    seachUrl = this.baseUrl + 'getList';
    url1 = this.baseUrl + 'getDetailList';
    GetCalendar(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/pc/pcdeliverycalendar/GetCALENDAR',
            {

            }, { method: 'GET' }
        );
    }

    /** 根据主键获取 */
    public GetById(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getItem',
            {
                id: id
            });
    }

    GetPlant(userid: string) {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcdlycalendar/DlyCalendar/GetPlant?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }

    /** 新增/编辑 */
    EditData(dto: DeliveryCalendarInputDto): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'save', dto);
    }

    SaveForNew(dto: DlyCalendarDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcdlycalendar/DlyCalendar/SaveForNew',
            {
                dto
            }
        );
    }

    Delete(dto: DlyCalendarDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcdlycalendar/DlyCalendar/Remove',
            {
                dto
            }
        );
    }


    // GetByViewId(Id: string): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpcdlycalendar/DlyCalendar/GetByViewId?Id=' + Id,
    //         {

    //         }, { method: 'GET' }
    //     );
    // }


    /** 根据主键获取 */
    public GetByViewId(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getDetailItem',
            {
                id: id
            });
    }

    // EditViewData(dto: DlyCalendarDto): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpcdlycalendar/DlyCalendar/EditViewData',
    //         {
    //             dto
    //         }
    //     );
    // }
    /** 新增/编辑 */
    EditViewData(dto: DeliveryCalendarInputDto): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'saveDetail', dto);
    }

    SaveForView(dto: DlyCalendarDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcdlycalendar/DlyCalendar/SaveForView',
            {
                dto
            }
        );
    }

    /**批量删除 */
    ViewDelete(ids: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.baseUrl + 'deleteDetailList', ids
        );
    }

    /**批量删除 */
    RemoveBath(ids: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.baseUrl + 'deleteList', ids
        );
    }

    RemoveBathView(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcdlycalendar/DlyCalendar/RemoveBathView',
            {
                dtos
            }
        );
    }
}
