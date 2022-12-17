import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Injectable()
/** 例外数据检查服务*/
export class DataExceptionService extends CommonQueryService {

  /**构造函数 */
  constructor(
    private appConfig: AppConfigService,
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }

  /**actions */
  public queryUrl = '/api/admin/dataexception/query';
  public querySingleUrl = '/api/admin/dataexception/querysingle?id=';
  public saveUrl = '/api/admin/dataexception/save';
  public deleteUrl = '/api/admin/dataexception/delete';
  public configUrl = '/api/admin/dataexception/config';
  public calcaulateUrl = '/api/admin/dataexception/calculate';
  public queryDetailUrl = '/api/admin/dataexception/querydetail';

  public readAction = { url: this.queryUrl, method: 'POST' };
  public readDetailAction = { url: this.queryDetailUrl, method: 'POST' };

  /**查询 */
  public query(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      this.queryUrl,
      dto,
      // {
      //   APPLICATION_CODE: dto.APPLICATION_CODE,
      //   EXCEPTION_TYPE: dto.EXCEPTION_TYPE,
      //   SHOW_EXCEPTION: dto.SHOW_EXCEPTION,
      //   ENABLE_FLAG: dto.ENABLE_FLAG
      // },
      { method: 'POST' });
  }

  /**查询 */
  public querySingle(id: string): Observable<ActionResponseDto> {

    return this.appApiService.call<ActionResponseDto>(
      this.querySingleUrl + id+'&plantCode='+this.appConfig.getPlantCode(),
      {},
      { method: 'GET' });
  }

  /**保存 */
  public save(dto: any): Observable<ActionResponseDto> {

    return this.appApiService.call<ActionResponseDto>(
      this.saveUrl,
      dto,
      // {
      //   ID: dto.ID,
      //   APPLICATION_CODE: dto.APPLICATION_CODE,
      //   EXCEPTION_TYPE: dto.EXCEPTION_TYPE,
      //   DESCRIPTION: dto.DESCRIPTION,
      //   ORDER_BY_CODE: dto.ORDER_BY_CODE,
      //   ENABLE_FLAG: dto.ENABLE_FLAG
      // },
      { method: 'POST' });
  }

  /**删除 */
  public delete(dto: any): Observable<ActionResponseDto> {

    return this.appApiService.call<ActionResponseDto>(
      this.deleteUrl,
      dto,
      // {
      //   APPLICATION_CODE: dto.APPLICATION_CODE,
      //   EXCEPTION_TYPE: dto.EXCEPTION_TYPE,
      //   SHOW_EXCEPTION: dto.SHOW_EXCEPTION,
      //   ENABLE_FLAG: dto.ENABLE_FLAG
      // },
      { method: 'POST' });
  }

  /**脚本配置 */
  public config(dto: any): Observable<ActionResponseDto> {

    return this.appApiService.call<ActionResponseDto>(
      this.configUrl,
      dto,
      // {
      //   APPLICATION_CODE: dto.APPLICATION_CODE,
      //   EXCEPTION_TYPE: dto.EXCEPTION_TYPE,
      //   SHOW_EXCEPTION: dto.SHOW_EXCEPTION,
      //   ENABLE_FLAG: dto.ENABLE_FLAG
      // },
      { method: 'POST' });
  }

  /**计算 */
  public calculate(dto: any): Observable<ActionResponseDto> {

    return this.appApiService.call<ActionResponseDto>(
      this.calcaulateUrl,
      dto,
      // {
      //   ID: id
      // },
      { method: 'POST' });
  }

  /**查询明细 */
  public queryDetail(id: string): Observable<GridSearchResponseDto> {

    return this.appApiService.call<GridSearchResponseDto>(
      this.queryDetailUrl,
      {
        ID: id
      },
      { method: 'POST' });
  }

  /**异步更新网格数据 */
  private gridData: any[];
  public updateDetailGridData(lstData: any[]): void {

    if (this.gridData !== null && this.gridData !== undefined && this.gridData.length > 0) {

      this.next(this.gridData);
      return;
    }
    this.gridData = lstData;
    this.next(lstData);
  }

}
