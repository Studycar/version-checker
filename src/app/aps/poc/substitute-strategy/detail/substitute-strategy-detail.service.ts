import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/Observable';

import { ActionResponseDto } from '../../../../modules/generated_module/dtos/action-response-dto';
import { codeUrl } from './config';
import { SubstituteStrategyDetail } from './model';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';


@Injectable()
export class SubstituteStrategyDetailService {
  // private initParams: { code, lookupTypeId, lng, LngOptions };
  private initParams: { plantCode, substituteCode };
  constructor(private http: _HttpClient) {
  }

  /**
   * 初始化参数
   * @param params
   */
  init(params) {
    this.initParams = { ...params };
  }

  /**
   * 新增一条初始化快码
   * @return {{[p: string]: any}}
   */
  createNewItem(): { [key: string]: any } {
    return {
      ...new SubstituteStrategyDetail(),
      STATE: 'add',
      PLANT_CODE: this.initParams.plantCode,
      SUBSTITUTE_CODE: this.initParams.substituteCode,
    };
  }


  /**
   * 根据plantCode和substituteCode查询快码
   * @param {string} plantCode
   * @param {string} substituteCode
   * @return {Observable<DataReturn>}
   */
  getCode(plantCode: string, substituteCode: string): Observable<DataReturn> {
    return new Observable(subscriber => {
      this.http.get<DataReturn>(codeUrl.getCode, { strPlantCode: plantCode, strSubstituteCode: substituteCode }).subscribe(res => subscriber.next(res));
    });
  }


  /**
   * 根据整行新数据保存
   * @param {object} addItem
   * @return {Observable<ActionResponseDto>}
   * */
  saveCode(addItem: { [key: string]: any }[]): Observable<ActionResponseDto> {
    return this.http.post(codeUrl.save, { dto: addItem });
  }

  /**
   * 根据修改的数据（整行）更新快码
   * @param {{[p: string]: any}[]} updateItem
   * @return {Observable<ActionResponseDto>}
   */
  updateCode(updateItem: { [key: string]: any }[]): Observable<ActionResponseDto> {
    return this.http.post(codeUrl.update, { dto: updateItem });
  }

  /**
   * 根据ID删除明细
   * @param {string} id
   * @return {Observable<ActionResponseDto>}
   */
  deleteCode(id: string): Observable<ActionResponseDto> {
    return this.http.get(codeUrl.delete, { id });
  }

  getStrategyInfo(plantCode: string, substituteCode: string, strategyGroup: string): Observable<DataReturn> {
    return new Observable(subscriber => {
      this.http.get<DataReturn>(codeUrl.getStrategyInfo, { strPlantCode: plantCode, strSubstituteCode: substituteCode , strStrategyGroup: strategyGroup}).subscribe(res => subscriber.next(res));
    });
  }

  /**
   * 根据整行新数据保存
   * @param {object} addItem
   * @return {Observable<ActionResponseDto>}
   * */
  saveStrategyInfo(addItem: { [key: string]: any }[]): Observable<ActionResponseDto> {
    return this.http.post(codeUrl.saveStrategyInfo, { dto: addItem });
  }

  /**
   * 根据修改的数据（整行）更新快码
   * @param {{[p: string]: any}[]} updateItem
   * @return {Observable<ActionResponseDto>}
   */
  updateStrategyInfo(updateItem: { [key: string]: any }[]): Observable<ActionResponseDto> {
    return this.http.post(codeUrl.updateStrategyInfo, { dto: updateItem });
  }

  /**
   * 根据ID删除策略信息
   * @param {string} id
   * @return {Observable<ActionResponseDto>}
   */
  deleteStrategyInfo(id: string): Observable<ActionResponseDto> {
    return this.http.get(codeUrl.deleteStrategyInfo, { id });
  }

  /** 获取BOM装配件列表信息 */
  /**获取物料分页信息*/
  public GetBomItemPageList(
    PLANT_CODE: string,
    ITEM_CODE: string,
    DESCRIPTIONS_CN: string,
    PageIndex: number = 1,
    PageSize: number = 10,
    SUBSTITUTE_CODE: string = '',
    SUBSTITUTE_GROUP: string = '',
    USE_PRIORITY: string = '',
    BUY_PERSENT: string = '',
    USE_AGE:string='',
  ): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/afs/serverpocsubstitutestrategy/substitutestrategy/getBomItemPageList',
      {
        PLANT_CODE: PLANT_CODE,
        ITEM_CODE: ITEM_CODE,
        ITEM_DESC: DESCRIPTIONS_CN,
        SUBSTITUTE_CODE: SUBSTITUTE_CODE,
        SUBSTITUTE_GROUP: SUBSTITUTE_GROUP,
        USE_PRIORITY: USE_PRIORITY,
        BUY_PERSENT: BUY_PERSENT,
        USE_AGE: USE_AGE,
        PageIndex: PageIndex,
        PageSize: PageSize,
      },
    );
  }
  
  /**获取客户分页信息*/
  public GetUserPlantCustomerPageList(
    PLANT_CODE: string,
    CUSTOMER_CODE: string,
    CUSTOMER_DESC: string,
    PageIndex: number = 1,
    PageSize: number = 10
  ): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/afs/serverpocsubstitutestrategy/substitutestrategy/getUserPlantCustomerPageList',
      {
        PLANT_CODE: PLANT_CODE,
        CUSTOMER_CODE: CUSTOMER_CODE,
        CUSTOMER_DESC: CUSTOMER_DESC,
        PageIndex: PageIndex,
        PageSize: PageSize,
      },
    );
  }
}

/**
 * getCode返回的数据类型接口
 */
interface DataReturn {
  Extra: any;
  Page: number;
  Result: any[];
  TotalCount: number;
}
