import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';

@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }

thisBaseApiUrl = '/afs/ServerPSMoLoss/MoLossService/';
public queryDataUrl = this.thisBaseApiUrl + 'QueryMainData';

  // 根据ID查询数据
  QueryDataById(strId: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      this.thisBaseApiUrl + 'QueryDataById', { relationId: strId }
    );
  }

  // 删除数据
  DeleteMoLoss(listIds: any): Observable<ActionResponseDto> {
    return this.http.post(
      this.thisBaseApiUrl + 'DeleteMoLoss', { listIds: listIds }
    );
  }

  // 保存数据
  SaveMoLoss(saveData: any, isUpdate: Boolean): Observable<ActionResponseDto> {
    return this.http.post(
      this.thisBaseApiUrl + 'SaveMoLoss', { saveData: saveData, isUpdate: isUpdate }
    );
  }
  
  // 查询物料
  QueryItemData(input: any): Observable<GridSearchResponseDto> {
    return this.http.post(
      this.thisBaseApiUrl + 'QueryItemData', { input: input }
    );
  }

    // 查询类别
  QueryCategory(input: any): Observable<GridSearchResponseDto> {
    return this.http.post(
      this.thisBaseApiUrl + 'QueryCategory', { input: input }
    );
  }

  // 数据导入
  ImportData(listInputData: any[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
       this.thisBaseApiUrl + 'ImportData', { listInputData: listInputData }
    );
  }
}

