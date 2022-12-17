/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-09-08 20:35:42
 * @LastEditors: Zwh
 * @LastEditTime: 2021-02-26 14:32:31
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NzMessageService } from 'ng-zorro-antd';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { MOBatchReleaseService } from '../../../../modules/generated_module/services/mobatchrelease-service';
import { CommonQueryService, HttpAction } from '../../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class EditService extends CommonQueryService {

  public queryform = '/api/ps/psMakeOrder/queryFromMoBatchRel';
  public excUrlForm = '/api/ps/psMakeOrder/exportInfoFrom';

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    public msgSrv: NzMessageService,
    public mOBatchReleaseService: MOBatchReleaseService,
  ) {
    super(http, appApiService);
  }

  public getSelection(monum: string): Observable<any> {
    return this.mOBatchReleaseService.getSelection(monum);
  }

  public BacthRelease(ids: any, flag: any, monum: any, plantcode: string): Observable<any> {
    return this.mOBatchReleaseService.BacthRelease(ids, flag, monum, plantcode);
  }

  public query(parms: any, PAGE_INDEX: number, PAGE_SIZE: number): Observable<any> {
    return this.mOBatchReleaseService.Query(parms, PAGE_INDEX, PAGE_SIZE);
  }

  public QueryFrom(plantids: any, orderid: any, PAGE_INDEX: number, PAGE_SIZE: number): Observable<ResponseDto> {
    return this.mOBatchReleaseService.QueryFrom(plantids, orderid, PAGE_INDEX, PAGE_SIZE);
  }

  public GetDescByItemCode(plantcode: any, itemcode: any): Observable<any> {
    return this.mOBatchReleaseService.GetDescByItemCode(itemcode);
  }

}
