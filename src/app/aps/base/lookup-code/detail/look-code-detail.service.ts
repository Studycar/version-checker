import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/Observable';

import { ActionResponseDto } from '../../../../modules/generated_module/dtos/action-response-dto';
import { codeUrl } from './config';
import { LookupCodeDetail } from './model';
import { ResponseDto } from '../../../../modules/generated_module/dtos/response-dto';


@Injectable()
export class LookCodeDetailService {
  private initParams: { code, lookupTypeId, lng, LngOptions };

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
      ...new LookupCodeDetail(),
      STATE: 'add',
      lookupTypeId: this.initParams.lookupTypeId,
    };
  }


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
      codeUrl.getCode + '?typeCode=' + code + '&language=' + lng,
      {},
    );
  }


  /**
   * 根据整行新数据保存快码
   * @param {object} addItem
   * @return {Observable<ActionResponseDto>}
   * */
  saveCode(addItem: { [key: string]: any }[]): Observable<ResponseDto> {
    return this.http.post(codeUrl.save, addItem);
  }

  /**
   * 根据修改的数据（整行）更新快码
   * @param {{[p: string]: any}[]} updateItem
   * @return {Observable<ActionResponseDto>}
   */
  updateCode(updateItem: { [key: string]: any }[]): Observable<ResponseDto> {
    return this.http.post(codeUrl.update, updateItem);
  }

  /**
   * 根据codeID删除快码
   * @param {string} id
   * @return {Observable<ActionResponseDto>}
   */
  deleteCode(id: string): Observable<ResponseDto> {
    return this.http.get(codeUrl.delete + '/' + id);
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
