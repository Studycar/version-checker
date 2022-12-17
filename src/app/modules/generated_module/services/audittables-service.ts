import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { AudittablesInputDto } from 'app/modules/generated_module/dtos/Audittables-input-dto';

@Injectable()
/** 审计表定义管理服务 */
export class AudittablesService {
    constructor(private appApiService: AppApiService) { }

  seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serveraudittables/audittables/queryaudittablesbypage';
  
    /////** 搜索快捷键 */
    //Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
    //    return this.appApiService.call<GridSearchResponseDto>(
    //        '/afs/serveraudittables/audittables/queryaudittables',
    //        {
    //            request
    //        });
    //}

    ///** 获取审计表定义 */
    Get(id: string): Observable<ActionResponseDto> {
      return this.appApiService.call<ActionResponseDto>(
          '/afs/serveraudittables/audittables/Get?id=' + id,
          {
          }, { method: 'GET' });
    }

    ///** 编辑审计表定义 */
  Edit(dto: AudittablesInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serveraudittables/audittables/Edit',
            {
                dto
            });
    }
   ///** 应用审计表定义 */
  Apply(dto: AudittablesInputDto): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serveraudittables/audittables/Apply',
      {
        dto
      });
  }
  ///** 废弃审计表定义 */
  UnApply(dto: AudittablesInputDto): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serveraudittables/audittables/UnApply',
      {
        dto
      });
  }


  /** 获取所有绑定的应用模块*/
  GetAppliactionModule(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serveraudittables/audittables/GetAppliactionModule',
      {
      });
  }
  /** 获取所有绑定的表名*/
  GetTableName(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serveraudittables/audittables/GetTableName',
      {
      });
  }
    ///** 删除快捷键 */
    //Remove(dto: ShortcutKeysInputDto): Observable<ActionResponseDto> {
    //    return this.appApiService.call<ActionResponseDto>(
    //        '/afs/shortcutkey/baseshortcutkey/deletefastkeys',
    //        {
    //            dto
    //        });
    //}
    ///** 批量删除快捷键 */
    //RemoveBath(dtos: ShortcutKeysInputDto[]): Observable<ActionResponseDto> {
    //    return this.appApiService.call<ActionResponseDto>(
    //        '/afs/shortcutkey/baseshortcutkey/deletefastkeys',
    //        {
    //            dtos
    //        });
    //}

    ///** 获取所有应用程序 */
    //GetAppliaction(): Observable<ActionResponseDto> {
    //    return this.appApiService.call<ActionResponseDto>(
    //        '/afs/shortcutkey/baseshortcutkey/GetAppliaction',
    //        {
    //        });
    //}
}
