import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { MessageInputDto } from 'app/modules/generated_module/dtos/message-input-dto';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ResponseDto } from '../dtos/response-dto';
import { HttpClient } from '@angular/common/http';
import { _HttpClient } from '@delon/theme';

@Injectable()
/** 消息维护服务 */
export class MessageManageService {
  constructor(
    private appApiService: AppApiService,
    public httpClient: _HttpClient,
  ) { }
  // queryUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/servermessage/MessageService/QueryInfo';
  queryUrl = '/api/admin/basemessagesb/queryInfo';

  /** 根据ID获取消息 */
  Get(id: string, language: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/basemessagesb/getInfo?id=' + id + '&language=' + language,
      { },
      { method: 'GET' },
    );
  }
  /** 根据代码获取消息 */
  GetByCode(code: string, language: string): Observable<ResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/afs/servermessage/MessageService/GetByCode',
    //   {
    //     code: code,
    //     language: language
    //   },
    //   { method: 'GET' },
    // );
    return null;
  }
  /** 新增/编辑 */
  Edit(dto: MessageInputDto): Observable<ResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/api/admin/basemessagesb/saveInfo',
    //   {
    //     baseMessageBDTO: dto,
    //   },
    //   { method: 'POST' },
    // );
    return this.httpClient.post<ResponseDto>('/api/admin/basemessagesb/saveInfo', dto);
  }
  /** 删除 */
  Remove(id: string): Observable<ResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/api/admin/basemessagesb/deleteInfo',
    //   {
    //     id: id
    //   },
    //   { method: 'POST' },
    // );
    return this.httpClient.post<ResponseDto>('/api/admin/basemessagesb/deleteInfo', id);
  }
  /** 批量删除 */
  removeBatch(ids: string[]): Observable<ResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/api/admin/basemessagesb/deleteList',
    //   {
    //     ids: ids,
    //   },
    //   { method: 'POST' },
    // );
    return this.httpClient.post<ResponseDto>('/api/admin/basemessagesb/deleteList', ids);
  }
  /** 获取所有应用程序 */
  GetAppliaction(language?: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/basemessagesb/getAppliaction?language=' + language,
      { }, { method: 'GET' } );
  }
  /** 获取语言 */
  GetLanguages(language?: string): Observable<ActionResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/afs/servermessage/MessageService/GetLookUpType',
    //   {
    //     lookUpType: 'FND_LANGUAGE', // SYS_LANGUAGE
    //     language: (language === undefined ? '' : language)
    //   },
    // );
    return null;
  }

  /** 获取菜单类型 */
  GetMenuTypes(language?: string): Observable<ActionResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/afs/servermessage/MessageService/GetLookUpType',
    //   {
    //     lookUpType: 'FND_MENU_TYPE', // SYS_MENU_TYPE
    //     language: (language === undefined ? '' : language)
    //   },
    // );
    return null;
  }
  /** 获取窗口类型 */
  GetWindowTypes(language?: string): Observable<ActionResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/afs/servermessage/MessageService/GetLookUpType',
    //   {
    //     lookUpType: 'FND_WINDOW_TYPE', // WINDOW_TYPE
    //     language: (language === undefined ? '' : language)
    //   },
    // );
    return null;
  }
  /** 获取刷新模式 */
  GetRefreshTypes(language?: string): Observable<ActionResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/afs/servermessage/MessageService/GetLookUpType',
    //   {
    //     lookUpType: 'PS_SYNC_CONFIG_REFRESH_MODE', // PS_SYNC_CONFIG_REFRESH_MODE 删除
    //     language: (language === undefined ? '' : language)
    //   },
    // );
    return null;
  }
  /** 获取是否有效 */
  GetEnableFlags(language?: string): Observable<ActionResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/afs/servermessage/MessageService/GetLookUpType',
    //   {
    //     lookUpType: 'FND_YES_NO', // SYS_ENABLE_FLAG
    //     language: (language === undefined ? '' : language)
    //   },
    // );
    return null;
  }
  /** 获取总装跟单件提前期设置类别集 */
  GetCategorySet(language?: string): Observable<ActionResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/afs/servermessage/MessageService/GetLookUpType',
    //   {
    //     lookUpType: 'PS_DIMENSION', // PS_CATEGORY
    //     language: (language === undefined ? '' : language)
    //   },
    // );
    return null;
  }
  /** 获取计划类型 */
  GetPlanTypes(language?: string): Observable<ActionResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/afs/servermessage/MessageService/GetLookUpType',
    //   {
    //     lookUpType: 'FND_PLANNING_TYPE', // PLANNING_TYPE 删除
    //     language: (language === undefined ? '' : language)
    //   },
    // );
    return null;
  }
  /** 获取计划协同方法 */
  GetPlanMethods(language?: string): Observable<ActionResponseDto> {
    // return this.appApiService.call<ResponseDto>(
    //   '/afs/servermessage/MessageService/GetLookUpType',
    //   {
    //     lookUpType: 'PS_PLANNING_COLLABORATIVE_METHOD', // PLANNING_COLLABORATIVE_METHOD 删除
    //     language: (language === undefined ? '' : language)
    //   },
    // );
    return null;
  }
}
