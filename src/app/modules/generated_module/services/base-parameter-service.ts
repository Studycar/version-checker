import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { inject } from '@angular/core/testing';
import { Action } from 'rxjs/internal/scheduler/Action';
import { BaseParameterDto } from '../../../modules/generated_module/dtos/base-parameter-dto';
import { BaseParameterValueDto } from '../../../modules/generated_module/dtos/base-parameter-value-dto';
import { GET } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable(

)
export class BaseParameterService {
    constructor(private appApiService: AppApiService) { }
    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/baseparameters/getQueryData';
    seachUrlfordetail = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/baseparameters/getViewData';

    public GetById(Id: any, Language: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseparameters/getMainDataById/' + Id + '/' + Language,
            {

            }, { method: 'GET' }
        );
    }

    public Edit1(dto: BaseParameterDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseparameters/save', dto
        );
    }

    public GetApplication(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/baseparameters/GetApplication1',
            {

            }, { method: 'GET' }
        );
    }

    public GetLanguage(LANGUAGE: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/baseparameters/GetLanguage?LANGUAGE=' + LANGUAGE,
            {

            }, { method: 'GET' }
        );
    }

    public SaveforNew(dto: BaseParameterDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseparameters/save', dto
        );
    }

    public Remove(Id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseparameters/deleteMainData/' + Id,
            {

            }, { method: 'GET' }
        );
    }

    public RemoveBath(dtos: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseparameters/deleteBatch',
                dtos
        );
    }

    public GetById1(Id: string, PARAMETER_VALUE_ID: any, Language: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseparameters/getViewById?Id=' + Id + '&parameterValueId=' + PARAMETER_VALUE_ID + '&language=' + Language,
            {

            }, { method: 'GET' }
        );
    }

    public Edit2(dto: BaseParameterValueDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseparameters/saveView',
                dto
        );
    }

    /**获取计划组 */
    public GetSchedule(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverbaseparameter/baseparameters/GetSchedule',
            {

            }, { method: 'GET' }
        );
    }

    /**获取组织--工厂 */
    public GetPlant(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverbaseparameter/baseparameters/GetPlant',
            {

            }, { method: 'GET' }
        );
    }

    /**  获取职责*/
    public GetResp(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverbaseparameter/baseparameters/GetResp',
            {

            }, { method: 'GET' }
        );
    }

    public GetUser(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverbaseparameter/baseparameters/GetUser',
            {

            }, {method: 'GET'}
        );
    }

    /**参数新增-保存 */
    public SaveForNew1(dto: BaseParameterValueDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseparameters/saveView',
                dto
        );
    }

    /**删除参数 */
    public Remove1(Id: String): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/admin/baseparameters/deleteView/' + Id,
            {

            }, {method: 'GET'}
        );
    }

  /**
   * 导入参数
   * @param dto
   */
  public imports(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baseparameters/imports', dto, { method: 'POST' }
    );
  }
}
