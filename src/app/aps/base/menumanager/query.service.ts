import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { MenuManagerInputDto } from 'app/modules/generated_module/dtos/menu-manager-input-dto';


@Injectable()
export class MenuQueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }
  baseUrl = '/api/admin/basemenusb/'; // 基路径
  queryUrl = this.baseUrl + 'getList';
  queryChildUrl = this.baseUrl + 'getChildList';

  /** 获取 */
  Get(menuId: string, language: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.baseUrl + 'getItem',
      {
        menuId: menuId,
        language: language
      });
  }
  /** 获取子菜单 */
  GetChilds(parentMenuId: string, language: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.queryChildUrl,
      {
        parentMenuId: parentMenuId,
        language: language
      });
  }

  /** 新增/编辑 */
  Save(dto: MenuManagerInputDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'save', dto);
  }
  /** 获取功能 */
  GetFunctions(functionName: string, language?: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/basefunctionsb/functionlist',
      {
        functionName: functionName
      });
  }

  /**
   * 导入
   * @param functionName
   * @param language
   * @constructor
   */
  imports(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/basemenusb/imports', dto);
  }

}
