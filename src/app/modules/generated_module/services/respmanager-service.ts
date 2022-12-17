import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { RespmanagerInputDto } from 'app/modules/generated_module/dtos/Respmanager-input-dto';
import { FunctionmanagerInputDto } from 'app/modules/generated_module/dtos/Functionmanager-input-dto';
import { ResponseDto } from '../dtos/response-dto';
@Injectable()
/** 职责管理服务 */
export class RespmanagerService {
  constructor(private appApiService: AppApiService) { }

  /*seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaserespmanager/baserespmanager/QueryInfo';
  exportUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaserespmanager/baserespmanager/ExportInfo';


  seachChildUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaserespmanager/baserespmanager/QueryChildInfo';
  exportChildUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaserespmanager/baserespmanager/ExportChildInfo';

  seachRequestUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaserespmanager/baserespmanager/QueryRequestInfo';
  exportRequestUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaserespmanager/baserespmanager/ExportRequestInfo';
   */
  seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/responsibility/resplist';
  exportUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/responsibility/ExportInfo';


  seachChildUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/responsibility/menulist';
  exportChildUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/responsibility/ExportChildInfo';

  seachRequestUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/responsibility/grouplist';
  exportRequestUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/responsibility/ExportRequestInfo';
  /** 获取导出数据 */
  Export(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/afs/serverbaserespmanager/baserespmanager/Export',
      {
        StrRespsName: dto.StrRespsName,
        strRespsCode: dto.strRespsCode,
        strDescription: dto.strDescription,
        strLanguage: dto.strLanguage
      });
  }

  /** 获取查询条件中的语言下拉框值*/
  GetSysLanguage(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/afs/serverbasefunctionmanager/basefunctionmanager/GetSysLanguage',
      {
      });
  }

  /** 获取function管理 */
  GetInfo(id: string, language: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      /*'/afs/serverbaserespmanager/baserespmanager/GetSingle?id=' + id + '&language=' + language,*/
      '/api/admin/responsibility/getsingle?id=' + id + '&language=' + language,
      {
      }, { method: 'GET' });
  }


  /** 获取请求名称下拉框*/
  GetRequestGroupName(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/responsibility/getRequestGroupName',
      {
      });
  }

  /** 编辑职责管理 */
  Edit(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      /*'/afs/serverbaserespmanager/baserespmanager/Edit',*/
      '/api/admin/responsibility/respsave', dto);
  }

  /** 编辑职责管理明细 */
  EditChild(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      /*'/afs/serverbaserespmanager/baserespmanager/EditChild',*/
      '/api/admin/responsibility/menusave', dto);
  }

  /** 获取菜单组下拉框*/
  GetMenuGroupOption(language?: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      // '/afs/serverbaserespmanager/baserespmanager/GetMenuGroupOption',
      '/api/admin/basemenugroupb/getList?language=' + language,
      {
      }, { method: 'GET' });
  }

  /** 编辑请求组 */
  EditRequestGroup(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      /*'/afs/serverbaserespmanager/baserespmanager/EditRequestGroup',*/
      '/api/admin/responsibility/groupsave', dto);
  }

  /** 删除 */
  RemoveRespRequestGroup(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      /*'/afs/serverbaserespmanager/baserespmanager/DeleteRespRequestGroup',*/
      '/api/admin/responsibility/groupdelete', dto);
  }

  /** 删除 */
  Remove(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      /*'/afs/serverbaserespmanager/baserespmanager/DeleteRespChild',*/
      '/api/admin/responsibility/menudelete', dto);
  }

  /**
   * 导入职责
   * @param dto
   */
  imports(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/responsibility/imports', dto, { method: 'POST' });
  }


}

