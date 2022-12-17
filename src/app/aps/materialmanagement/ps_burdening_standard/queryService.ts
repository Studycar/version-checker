import { Injectable } from '@angular/core';
import { CommonQueryService, HttpAction } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

@Injectable()
export class PsBurdeningStandardService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }
  seachUrl = '/api/ps/psburdeningstandard/getList';
  seachExUrl = '/api/ps/psburdeningstandard/getListEx';
  exportDataUrl = '/api/ps/psburdeningstandard/exportData';


  /** 启用 禁用 */
  public turnOnOff(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psburdeningstandard/turnOnOff',
      dto
    );
  }

  /** 启用 禁用 */
  public turnOnOffEx(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psburdeningstandard/turnOnOffEx',
      dto
    );
  }

  /** 删除 */
  public deleteByIds(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psburdeningstandard/deleteByIds',
      dto
    );
  }



  get(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      `/api/ps/psburdeningstandard/queryById/${id}`,
      {
      }, { method: 'GET' });
  }

  getEx(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      `/api/ps/psburdeningstandard/queryByIdEx/${id}`,
      {
      }, { method: 'GET' });
  }
  /** 编辑是否有效 --over*/
  edit(dto: { [key: string]: any }): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psburdeningstandard/saveData',
      {
        ...dto
      });
  }
  /** 编辑是否有效 --over*/
  editEx(dto: { [key: string]: any }): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psburdeningstandard/saveDataEx',
      {
        ...dto
      });
  }

  importData(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psburdeningstandard/importData',
      dtos
    );
  }

  importDataPlates(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psburdeningstandard/importDataPlates',
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




  /**
   * 获取工序编码
   * @param plantCode 
   * @param processCode 
   * @param pageIndex 
   * @param pageSize 
   * @returns 
   */
  public getProcessPageList(
    plantCode: string,
    processCode: string,
    pageIndex: number = 1,
    pageSize: number = 1000,
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psprodmanufspec/getPageByPlantCode',
      {
        plantCode: plantCode,
        operationCode: processCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      }
    );
  }
}

