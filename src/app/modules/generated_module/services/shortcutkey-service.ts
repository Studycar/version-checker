import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ShortcutKeysInputDto } from 'app/modules/generated_module/dtos/Shortcut-keys-input-dto';

@Injectable()
/** 快捷键管理服务 */
export class ShortcutkeyService {
    constructor(private appApiService: AppApiService) { }

    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/shortcutkey/baseshortcutkey/SearchGet';
    seachUrlType = this.appApiService.appConfigService.getApiUrlBase() + '/afs/shortcutkey/baseshortcutkey/GetAppliactionTypeList';
    seachUrlFunction = this.appApiService.appConfigService.getApiUrlBase() + '/afs/shortcutkey/baseshortcutkey/GetAppliactionFunctionList';

    /** 搜索快捷键 */
    Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            '/afs/shortcutkey/baseshortcutkey/queryfastkeyinfo',
            {
                request
            });
    }

    /** 获取快捷键 */
    Get(id: string): Observable<ActionResponseDto> {
      return this.appApiService.call<ActionResponseDto>(
          '/afs/shortcutkey/baseshortcutkey/Get?id=' + id,
          {
          }, { method: 'GET' });
    }

    /** 编辑快捷键 */
    Edit(dto: ShortcutKeysInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/shortcutkey/baseshortcutkey/Edit',
            {
                dto
            });
    }

    /** 删除快捷键 */
    Remove(dto: ShortcutKeysInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/shortcutkey/baseshortcutkey/Remove',
            {
                dto
            });
    }
    /** 批量删除快捷键 */
    RemoveBath(dtos: ShortcutKeysInputDto[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/shortcutkey/baseshortcutkey/RemoveBath',
            {
                dtos
            });
    }

    /** 获取所有绑定的动作*/
    GetAppliactionType(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
        '/afs/shortcutkey/baseshortcutkey/GetAppliactionType',
        {
        });
    }
      /** 获取所有绑定的动作*/
      GetAppliactionAction(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
        '/afs/shortcutkey/baseshortcutkey/GetAppliactionAction',
        {
        });  
  }
}
