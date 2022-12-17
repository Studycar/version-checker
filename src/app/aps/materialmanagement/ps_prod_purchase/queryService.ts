import { Injectable } from '@angular/core';
import { CommonQueryService, HttpAction } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

@Injectable()
export class PsProdPurchaseService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }
  seachUrl = '/api/ps/psprodpurchase/getList';
  seachExUrl = '/api/ps/psprodpurchase/getListEx';
  exportDataUrl = '/api/ps/psprodpurchase/exportData';


  /** 启用 禁用 */
  public turnOnOff(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psprodpurchase/turnOnOff',
      dto
    );
  }

  /** 启用 禁用 */
  public turnOnOffEx(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psprodpurchase/turnOnOffEx',
      dto
    );
  }

  /** 删除 */
  public deleteByIds(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psprodpurchase/deleteByIds',
      dto
    );
  }

  /** 删除 */
  public deleteExByIds(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psprodpurchase/deleteExByIds',
      dto
    );
  }



  get(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      `/api/ps/psprodpurchase/queryById/${id}`,
      {
      }, { method: 'GET' });
  }

  getEx(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      `/api/ps/psprodpurchase/queryByIdEx/${id}`,
      {
      }, { method: 'GET' });
  }
  /** 编辑是否有效 --over*/
  edit(dto: { [key: string]: any }): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psprodpurchase/saveData',
      {
        ...dto
      });
  }
  /** 编辑是否有效 --over*/
  editEx(dto: { [key: string]: any }): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psprodpurchase/saveDataEx',
      {
        ...dto
      });
  }

  importData(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psprodpurchase/importData',
      dtos
    );
  }

  importDataPlates(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psprodpurchase/importDataPlates',
      dtos
    );
  }

  public GetResouceCode(plantCode: string, code: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemroutings/getResouceCode',
      {
        plantCode: plantCode,
        code: code
      },
    );
  }




}

