import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';

@Injectable()
export class ItemJointHDEditService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  seachUrl = '/afs/serverpsitemdefine/itemjointhd/Query';

  /** 编辑 */
  public Save(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsitemdefine/itemjointhd/Save', dto);
  }

  /** 删除 */
  public Delete(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsitemdefine/itemjointhd/Delete', dto);
  }

  /** 导入excel数据 */
  public Import(dtos: any[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>('/afs/serverpsitemdefine/itemjointhd/Import', { dtos: dtos });
  }

  /** 排产资源 */
  public GetResourceCodes(dto): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>('/afs/serverpsitemdefine/itemjointhd/GetResourceCodes', dto);
  }
}
