import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';


@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  queryUrl = '/api/admin/baseusers/userPage';
  exportUrl = '/api/admin/baseusers/userList';
  /** 搜索 */
  Search(dto: any, page: number, pageSize: number): Observable<ResponseDto> {
    return this.http.get('/api/admin/baseusers/userPage',dto
      //'/afs/serverusermanager/UserService/QueryUser', 
     /* {
        userName: dto.userName,
        description: dto.description,
        startBegin: dto.startBegin,
        startEnd: dto.startEnd,
        endBegin: dto.endBegin,
        endEnd: dto.endEnd,
        page: page,
        pageSize: pageSize
      }*/);
  }
  /** 获取用户导出数据 */
  ExportUser(dto: any): Observable<ResponseDto> {
    return this.http
      .get('/api/admin/baseusers/userList', {
        userName: dto.userName,
        description: dto.description,
        startBegin: dto.startBegin,
        startEnd: dto.startEnd,
        endBegin: dto.endBegin,
        endEnd: dto.EndEendEndnd
      });
  }
}


