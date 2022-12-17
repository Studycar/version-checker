/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2021-03-15 13:55:41
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-18 16:18:24
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  public queryUrl = '/api/ps/psshiftscheduledetail/queryPageDataTable';
  public exportUrl = '/api/ps/psshiftscheduledetail/queryPageDataTable';
  /** 搜索 */
  Search(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/psshiftscheduledetail/queryPageDataTable', {
        plantCode: this.nvl(dto.plantCode),
        lineIdsStr: this.nvl(dto.lineIdsStr),
        startTime: this.nvl(dto.startTime),
        endTime: this.nvl(dto.endTime)
      });
  }
  /** 导出数据 */
  Export(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/psshiftscheduledetail/queryPageDataTable', {
        plantCode: this.nvl(dto.plantCode),
        lineIdsStr: this.nvl(dto.lineIdsStr),
        startTime: this.nvl(dto.startTime),
        endTime: this.nvl(dto.endTime)
      });
  }
}




