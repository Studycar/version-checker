import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { UserManagerInputDto } from 'app/modules/generated_module/dtos/user-manager-input-dto';
import { UserManagerRespInputDto } from 'app/modules/generated_module/dtos/user-manager-resp-input-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 用户管理服务 */
export class UserManagerManageService {

  constructor(private appApiService: AppApiService) { }
  queryUrl = '/api/admin/baseusers/userPage';
  queryRespUrl = '/api/admin/baseusers/userList';

  /** 搜索 */
  Search(dto: any, page: number, pageSize: number): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/userPage',
      {
        userName: dto.userName,
        description: dto.description,
        startBegin: dto.startBegin,
        startEnd: dto.startEnd,
        endBegin: dto.endBegin,
        endEnd: dto.endEnd,
        page: page,
        pageSize: pageSize
      }, { method: 'GET' });
  }
  /** 获取用户导出数据 */
  ExportUser(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/userList',
      {
        userName: dto.userName,
        description: dto.description,
        startBegin: dto.startBegin,
        startEnd: dto.startEnd,
        endBegin: dto.endBegin,
        endEnd: dto.endEnd
      }, { method: 'GET' });
  }
  /** 用户职责搜索 */
  SearchUserResp(userId: any, page: number, pageSize: number): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/userRespPage',
      {
        userId: userId,
        page: page,
        pageSize: pageSize
      }, { method: 'GET' });
  }
  /** 获取用户职责导出数据 */
  ExportUserResp(userId: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/userRespList',
      {
        userId: userId
      }, { method: 'GET' });
  }
  /** 获取 */
  Get(userId: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/getUserById/' + userId,
      {
        // userId: userId
      }, { method: 'GET' });
  }

  /** 新增/编辑 */
  Edit(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      // '/afs/serverusermanager/UserService/SaveUser',
      '/api/admin/baseusers/userSave', dto
     // {dto: dto}
     , { method: 'POST' });
  }

  /** 批量删除 */
  RemoveBatch(ids: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/userBatchDelete',
      {
        ids: ids
      }, { method: 'POST' });
  }

  /** 获取所有职责 */
  GetAllResp(language: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/getAllResp?language=' + language,
      {
      }, { method: 'GET' });
  }
  /** 新增/编辑 */
  EditUserResp(dto: UserManagerRespInputDto): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/userRespSave', dto
      , { method: 'POST' });
  }
  /** 设置启动程序 */
  SetStartInfo(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/setStartInfo',
      {
        dto: dto
      }, { method: 'POST' });
  }
  /** 获取用户菜单 */
  GetUserMenus(userId: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/getUserMenus?userId=' + userId,
      {
      }, { method: 'GET' });
  }
  /** 获取菜单 */
  GetMenus(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/getMenus?menuName=',
      {
      }, { method: 'GET' });
  }
  /** 更新密码 */
  UpdatePwd(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/passwordUpdate', dto, { method: 'POST' });
  }

  private serializeParams(request: any, page: number, pageSize: number): string {
    let paramsStr = '';
    if (request !== undefined) {
      paramsStr = '?';
      for (const paramName in request) {
        paramsStr += `${paramName}=${(request[paramName] !== null ? request[paramName] : '')}&`;
      }
      paramsStr = paramsStr + `page=${page}&pageSize=${pageSize}`;
    }
    return paramsStr;
  }
  private null2Empty(input: any): string {
    return (input === undefined || input === null) ? '' : input;
  }

  /** 导入excel数据 */
  public imports(dto: any[]): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseusers/imports', dto
      , { method: 'POST' });
  }
}
