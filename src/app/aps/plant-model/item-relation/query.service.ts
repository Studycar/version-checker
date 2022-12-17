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

  public queryUrl = '/api/ps/psLeadTimeProduction/query';

  /** 搜索 */
  /*Search(dto: any, page: number, pageSize: number): Observable<GridSearchResponseDto> {
    return this.http
      .post('/afs/serveritemrelation/ItemRelationService/QueryInfo', {
        DOWNSTREAM_PLANT_CODE: dto.DOWNSTREAM_PLANT_CODE,
        DOWNSTREAM_VALUES: dto.DOWNSTREAM_VALUES,
        UPSTREAM_PLANT_CODE: dto.UPSTREAM_PLANT_CODE,
        UPSTREAM_VALUES: dto.UPSTREAM_VALUES,
        PLANT_CODE_STR: dto.PLANT_CODE_STR,
        page: page,
        pageSize: pageSize
      });
  }*/

  /** 获取导出数据 */
  /*Export(dto: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serveritemrelation/ItemRelationService/ExportInfo', {
        DOWNSTREAM_PLANT_CODE: dto.DOWNSTREAM_PLANT_CODE,
        DOWNSTREAM_VALUES: dto.DOWNSTREAM_VALUES,
        UPSTREAM_PLANT_CODE: dto.UPSTREAM_PLANT_CODE,
        UPSTREAM_VALUES: dto.UPSTREAM_VALUES,
        PLANT_CODE_STR: dto.PLANT_CODE_STR
      });
  }*/

  /** 获取单记录数据 */
  /*Get(id: string): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serveritemrelation/ItemRelationService/GetInfo', {
        id: id
      });
  }*/

  /** 保存数据 */
  Save(dto: {[key: string]: any}): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/psLeadTimeProduction/save',
      dto
    );
  }
  /** 删除 */
  Remove(ids: string[]): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/psLeadTimeProduction/delete',
      ids
    );
  }

  /** 批量删除 */
  /*BatchRemove(ids: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serveritemrelation/ItemRelationService/DeleteList', {
        ids: ids
      });
  }*/

  /** 获取上游工厂 */
  /*GetUpPlants(scheduleRegion = ''): Observable<ActionResponseDto> {
    return this.http
      .get('/afs/serveritemrelation/ItemRelationService/GetPlants', {
        scheduleRegion: scheduleRegion,
        strPlantCode: ''
      });
  }*/

  /** 获取下游工厂 */
  /*GetDownPlants(scheduleRegion = '', strPlantCode = ''): Observable<ActionResponseDto> {
    return this.http
      .get('/afs/serveritemrelation/ItemRelationService/GetDownPlants', {
        scheduleRegion: scheduleRegion,
        strPlantCode: strPlantCode
      });
  }*/

  /** 获取物料 */
 /* GetItems(plantCode: string, itemCode: string): Observable<ActionResponseDto> {
    return this.http
      .get('/afs/serveritemrelation/ItemRelationService/GetItems', {
        plantCode: plantCode,
        itemCode: itemCode
      });
  }*/

  /** 获取分类 */
  /*GetCategories(categoryCode: string): Observable<ActionResponseDto> {
    return this.http
      .get('/afs/serveritemrelation/ItemRelationService/GetCategories', {
        categoryCode: categoryCode
      });
  }*/

  /** 获取计划组 */
  /*GetScheduleGroups(scheduleRegion: string, plantCode: string, groupCode: string): Observable<ActionResponseDto> {
    return this.http
      .get('/afs/serveritemrelation/ItemRelationService/GetScheduleGroups', {
        scheduleRegion: scheduleRegion,
        plantCode: plantCode,
        groupCode: groupCode
      });
  }*/
  /**
   * 根据code和lng查询快码
   * @param {string} code
   * @param {string} lng
   * @return {Observable<DataReturn>}
   */
   getCode(code: string, lng: string): Observable<ResponseDto> {
    // return new Observable(subscriber => {
    //   this.http.get<DataReturn>(codeUrl.getCode, { strLookUpTypeCode: code, strLanguage: lng }).subscribe(res => subscriber.next(res));
    // });
    return this.http.get<ResponseDto>(
      '/api/admin/baselookuptypesb/querylookupvalue?typeCode=' + code + '&language=' + lng,
      {},
    );
  }
}


