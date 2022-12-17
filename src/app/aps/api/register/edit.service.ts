import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()
export class EditService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }
  /*****************************Java版本********************************** */
  baseUrl = '/api/api/apiregister/';
  queryUrl = this.baseUrl + '/page';
  exportUrl = this.baseUrl + '/list';
  /** 根据ID获取记录 */
  get(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.baseUrl + 'get',
      {
        id: id
      }
    );
  }
  /** 新增/编辑 */
  save(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'save',
      dto,
    );
  }
  /** 删除 */
  remove(apiCode: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'delete',
      apiCode,
    );
  }
  /** 批量删除 */
  removeBatch(apiCodes: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'deleteList',
      apiCodes,
    );
  }
  /** 代码生成 */
  generateCode(apiCodes: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'generateCode',
      apiCodes,
    );
  }
  /** DTO代码生成 */
  generateDto(apiCode: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'generateDto',
      apiCode,
    );
  }
  /** 获取接口表 */
  getPiTables(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.baseUrl + 'getPiTables',
      {
      },
    );
  }
  /** 获取接口表字段 */
  getPiTableFields(TABLE_NAME: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.baseUrl + 'getPiTableFields',
      {
        tableName: TABLE_NAME
      },
    );
  }

  baseUrlEntity = '/api/api/apientity/';
  queryEntityUrl = this.baseUrlEntity + 'list';
  /** 获取接口卡信息 */
  queryEntitys(apiCode: String): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.baseUrlEntity + 'list',
      {
        apiCode: apiCode
      },
    );
  }
  /** 新增/编辑 接口卡信息 */
  saveEntitys(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrlEntity + 'save',
      dtos,
    );
  }
  /** 删除 接口卡信息 */
  removeEntity(id: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrlEntity + 'delete',
      id,
    );
  }
  /** 导入excel数据 */
  importData(dtos: any[], apiCode: string): Observable<ResponseDto> {
    return this.http
      .post(this.baseUrlEntity + 'importData',
        { details: dtos, apiCode: apiCode }
      );
  }

  baseUrlSource = '/api/api/apisource/';
  querySourceUrl = this.baseUrlSource + 'list';
  /** 获取关联系统 */
  querySources(dto: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.baseUrlSource + 'list',
      dto,
    );
  }
  /** 新增/编辑 关联系统 */
  saveSource(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrlSource + 'save',
      dto,
    );
  }
  /** 批量删除 关联系统*/
  removeSources(ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrlSource + 'deleteList',
      ids,
    );
  }

  /*****************************C#版本********************************** */

  /** 根据ID获取记录 */
  Get(id: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/GetInfo',
      {
        id: id
      },
      { method: 'POST' },
    );
  }
  /** 新增/编辑 */
  Save(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/SaveInfo',
      {
        dto,
      },
    );
  }
  /** 删除 */
  Remove(apiCode: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/DeleteInfo',
      {
        apiCode: apiCode
      },
    );
  }
  /** 批量删除 */
  RemoveBatch(apiCodes: string[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/DeleteList',
      {
        apiCodes: apiCodes,
      },
    );
  }
  /** 新增/编辑 接口卡信息 */
  SaveEntitys(dtos: any[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/SaveEntitys',
      {
        dtos: dtos,
      },
    );
  }
  /** 删除 接口卡信息 */
  RemoveEntity(id: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/DeleteEntity',
      {
        id: id
      },
    );
  }
  /** 导入excel数据 */
  Import(dtos: any[], apiCode: string): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverapiregister/ApiRegisterService/ImportInfo', { dtos: dtos, apiCode: apiCode });
  }
  /** 代码生成 */
  CodeGenerate(apiCodes: string[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/CodeGenerate',
      {
        apiCodes: apiCodes,
      },
    );
  }
  /** DTO代码生成 */
  DtoCodeGenerate(apiCode: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/DtoCodeGenerate',
      {
        apiCode: apiCode,
      },
    );
  }
  /** 获取接口表 */
  GetPiTables(): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/GetPiTables',
      {
      },
    );
  }
  /** 获取接口表字段 */
  GetPiTableFields(TABLE_NAME: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/GetPiTableFields',
      {
        TABLE_NAME: TABLE_NAME
      },
    );
  }

  /** 获取关联系统 */
  QuerySources(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/QuerySources',
      {
        dto: dto
      },
    );
  }
  /** 新增/编辑 关联系统 */
  SaveSource(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/SaveSource',
      {
        dto: dto,
      },
    );
  }
  /** 批量删除 关联系统*/
  RemoveSources(ids: string[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverapiregister/ApiRegisterService/DeleteSources',
      {
        ids: ids,
      },
    );
  }
}

