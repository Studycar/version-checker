import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
/** 生产订单类型维护 */
export class ModelChangeTimeService {
  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient,

  ) { }
  //constructor(private appApiService: AppApiService) { }
  /** 获取生产订单类型 */
  Save(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psItemSwitchTime/save',
      dto
    );
  }

  Remove(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psItemSwitchTime/remove',
      dto
    );
  }

  public getCatPageList(value: string, PageIndex: number = 1, PageSize: number = 10): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psItemSwitchTime/pageQueryCat',
      {
        value: value,
        pageIndex: PageIndex,
        pageSize: PageSize
      });
  }
}
