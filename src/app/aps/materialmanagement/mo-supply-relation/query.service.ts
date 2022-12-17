import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }

thisBaseApiUrl = '/api/ps/psMoSupplyRelationship/';
public queryDataUrl = this.thisBaseApiUrl + 'queryMainData';

  // 查询子库
  QuerySubinventories(plantCode: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.thisBaseApiUrl + 'querySubinventories', plantCode 
    );
  }

  // 根据ID查询数据
  QueryDataById(strId: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.thisBaseApiUrl + 'queryDataById',  strId 
    );
  }

  // 删除数据
  DeleteMoSupplyRelationship(listIds: any): Observable<ResponseDto> {
    return this.http.post(
      this.thisBaseApiUrl + 'deleteList', listIds
    );
  }

  // 保存数据
  SaveMoSupplyRelationship(saveData: any, isUpdate: Boolean): Observable<ResponseDto> {
    return this.http.post(
      this.thisBaseApiUrl + 'saveData', saveData
    );
  }
  
  // 查询物料
  QueryItemData(input: any): Observable<ResponseDto> {
    return this.http.get(
      this.thisBaseApiUrl + 'queryItemData', input
    );
  }

    // 查询类别
    QueryCategory(input: any): Observable<ResponseDto> {
    return this.http.get(
      this.thisBaseApiUrl + 'queryCategory', input
    );
  }

  // 数据导入
  ImportData(listInputData: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
       this.thisBaseApiUrl + 'fileImport', listInputData
    );
  }
}

