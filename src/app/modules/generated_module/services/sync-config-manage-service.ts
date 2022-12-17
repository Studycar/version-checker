import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ActionResultDto } from 'app/modules/generated_module/dtos/action-result-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';

@Injectable()
/** 用户管理服务 */
export class SyncConfigManageService {

  constructor(private appApiService: AppApiService) { }
  seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serversycnconfig/sycnconfig/SearchGet';
  exportUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serversycnconfig/sycnconfig/Export';
  
  /** 获取导出数据 */
  Export(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serversycnconfig/sycnconfig/Export',
      {
        dto
      }, { method: 'POST' });
  }
  /** 搜索 */
  Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
    return this.appApiService.call<GridSearchResponseDto>(
      '/afs/serversycnconfig/sycnconfig/SearchGet',
      {
        request
      });
  }
  /** 新增/编辑 */
  Edit(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serversycnconfig/sycnconfig/Save',
      {
        dto: dto
      });
  }

  /** 获取 */
  Get(systemCode: string, targetTableName: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serversycnconfig/sycnconfig/Get?systemCode=' + systemCode + '&targetTableName=' + targetTableName,
      {
      }, { method: 'GET' });
  }

  /** 批量删除 */
  RemoveBath(ids: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serversycnconfig/sycnconfig/delsysconfigbyid',
      {
        ids: ids
      });
  }
}
