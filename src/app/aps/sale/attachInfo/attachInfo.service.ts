import { Injectable } from '@angular/core';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import {Observable} from 'rxjs';
import {ResponseDto} from '../../../modules/generated_module/dtos/response-dto';
import {AttachInfoDto} from './attachInfo.dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';

@Injectable()
export class AttachInfoService extends PlanscheduleHWCommonService{

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }

  url = '/api/ps/oss/attachInfo/query';
  public uploadUrl = '/api/ps/oss/attachInfo/upload';

  /** 根据ID获取消息 */
  get(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/oss/attachInfo/get',
      { id: id},
      { method: 'POST' },
    );
  }

  /** 新增/编辑 */
  edit(dto: AttachInfoDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/ps/attachInfo/save', dto);
  }

  /** 批量删除 */
  removeBatch(ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/ps/attachInfo/delete', ids);
  }


  uploadFile(formData: FormData): Observable<ResponseDto> {
    return this.http.post(this.uploadUrl, formData);
  }
}
