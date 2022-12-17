import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { MenuManagerInputDto } from 'app/modules/generated_module/dtos/menu-manager-input-dto';
import { ChildMenuInputDto } from 'app/modules/generated_module/dtos/child-menu-input-dto';
import { ActionResultDto } from '../dtos/action-result-dto';
import { CommonInputDto } from '../dtos/common-input-dto';
import { AppConfigService } from '../../base_module/services/app-config-service';

@Injectable()
/** 菜单管理服务 */
export class MenuManagerManageService {

  constructor(private appApiService: AppApiService) { }
  // queryUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbasemenumanager/MenuManagerService/QueryInfo'; /* 非分页查询 */
  // queryChildUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbasemenumanager/MenuManagerService/QueryChild';

  queryUrl = '/afs/serverbasemenumanager/MenuManagerService/QueryInfo'; /* 非分页查询 */
  queryChildUrl = '/afs/serverbasemenumanager/MenuManagerService/QueryChild';
  /** 获取 */
  Get(menuId: string, language: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/GetInfo',
      {
        menuId: menuId,
        language: language
      }, { method: 'POST' });
  }
  /** 获取子菜单 */
  GetChild(id: string, language: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/GetChild',
      {
        id: id,
        language: language
      }, { method: 'POST' });
  }

  /** 获取菜单导出数据 */
  Export(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/QueryInfo',
      {
        menuName: dto.menuName,
        parentMenuName: dto.parentMenuName,
        fastCode: dto.fastCode,
        description: dto.description,
        language: dto.language,
        menuType: dto.menuType
      });
  }
  /** 获取子菜单导出数据 */
  ExportChild(parentMenuId: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/QueryChild',
      {
        parentMenuId: parentMenuId
      });
  }
  /** 新增/编辑 */
  Edit(dto: MenuManagerInputDto): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/Save',
      {
        dto: dto
      });
  }
  /** 新增/编辑 */
  EditChild(dto: ChildMenuInputDto): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/SaveChild',
      {
        dto: dto
      });
  }
  /** 批量删除 */
  RemoveBatch(ids: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/DeleteList',
      {
        ids: ids
      });
  }
  /** 子菜单关系批量删除 */
  RemoveChildBatch(ids: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/DeleteChildList',
      {
        ids: ids
      });
  }

  /** 获取菜单 */
  GetMenus(menuName: string, language?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/QueryMenuForLov?menuName=' + menuName + '&language=' + (language === undefined ? '' : language),
      {
      }, { method: 'GET' });
  }
  /** 获取功能 */
  GetFunctions(functionName: string, language?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/QueryFunctionForLov?functionname=' + functionName + '&language=' + (language === undefined ? '' : language),
      {
      }, { method: 'GET' });
  }

  /** 获取菜单组 */
  GetMenuGroups(language: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemenumanager/MenuManagerService/QueryMenuGroup?language=' + language,
      {
      }, { method: 'GET' });
  }
}
