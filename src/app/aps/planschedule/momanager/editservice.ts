/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-09-08 20:35:42
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-18 16:25:36
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { SSL_OP_ALL } from 'constants';
import { Size } from '@progress/kendo-drawing/dist/npm/geometry';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }

  // 工单组件重读
  ReLoadMoRequirement(plantCode: string, listMoNums: any): Observable<any> {
    return this.http.get<any>(
      '/api/ps/psmorequirement/reLoadMoRequirement', { plantCode: plantCode, listMoNums: listMoNums }
    );
  }
}

