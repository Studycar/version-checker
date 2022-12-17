import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class SchedulePriorityService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  //queryUrl = '/afs/ServerPocRoyalSchedulePriorty/pocRoyalSchedulePriortyService/Query'; 
  queryUrl = '/api/ps/pocroyalschedulepriorty/query';

  /** 保存 */
  save(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/ps/pocroyalschedulepriorty/save', dto);
  }

  /** 删除 */
  remove(ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/ps/pocroyalschedulepriorty/delete', ids);
  }

}
