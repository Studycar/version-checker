import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { ItemCategoriesInputDto } from 'app/modules/generated_module/dtos/item-categories-input-dto';
@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }

  // public queryUrl = '/afs/serverpsitemcategoryassign/ItemCategoryAssignService/QueryPage';
  public exportUrl = '/api/ps/psitemcategories/getList';

  baseUrl = '/api/ps/psitemcategories/'; // 基路径
  queryUrl = this.baseUrl + 'getList';

  /** 搜索 */
  Query(dto: any): Observable<GridSearchResponseDto> {
    return this.http
      .post('/afs/serverpsitemcategoryassign/ItemCategoryAssignService/QueryPage', dto);
  }
  /** 获取导出数据 */
  Export(dto: any): Observable<ActionResponseDto> {
    return this.http
      .post('/api/ps/psitemcategories/getList', {
        plantCode: dto.plantCode,
        itemCode: dto.itemCode,
        categorySetCode: dto.categorySetCode,
        categoryCode: dto.categoryCode
      });
  }
  /** 导入excel数据 */
  // Import(dtos: any[]): Observable<ActionResponseDto> {
  //   return this.http
  //     .post('/afs/serverpsitemcategoryassign/ItemCategoryAssignService/ImportInfo', { dtos: dtos });
  // }

  Import(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'importData', dtos);
  }

  // /** 获取单记录数据 */
  // Get(id: string): Observable<ActionResponseDto> {
  //   return this.http
  //     .post('/afs/serverpsitemcategoryassign/ItemCategoryAssignService/GetInfo', {
  //       id: id
  //     });
  // }

  /** 根据主键获取 */
  public Get(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.baseUrl + 'getItem',
      {
        id: id
      });
  }

  // /** 保存数据 */
  // Save(dto: any): Observable<ActionResponseDto> {
  //   return this.http
  //     .post('/afs/serverpsitemcategoryassign/ItemCategoryAssignService/SaveInfo', {
  //       dto: dto
  //     });
  // }

  /** 新增/编辑 */
  Save(dto: ItemCategoriesInputDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'save', dto);
  }

  /** 删除类别集 */
  public Remove(ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'delete', ids);
  }


  /** 批量删除 */
  BatchRemove(ids: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsitemcategoryassign/ItemCategoryAssignService/DeleteList', {
        ids: ids
      });
  }

}


