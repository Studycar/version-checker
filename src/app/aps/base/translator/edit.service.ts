import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { BaseTranslstorService } from '../../../modules/generated_module/services/basetranslator-service';
import { NzMessageService } from 'ng-zorro-antd';
import { BaseTranslatorInputDto } from '../../../modules/generated_module/dtos/base-translator-input-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const itemIndex = (item: any, data: any[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].LOOKUP_TYPE_ID === item.LOOKUP_TYPE_ID) {
      return idx;
    }
  }  return -1;
};

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable()
export class BaseTranslatorEditService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];

  constructor(
    public http: HttpClient,
    private basetranslstorservice: BaseTranslstorService,
    public msgSrv: NzMessageService,
  ) {
    super([]);
  }
  public reset() {
    this.data = [];
    this.deletedItems = [];
    this.updatedItems = [];
    this.createdItems = [];
  }

  /*
  private fetch(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    let paramsStr = '';
    if (queryParams !== undefined) {
      paramsStr = '?';
      for (const paramName in queryParams) {
        paramsStr += `${paramName}=${(queryParams[paramName] !== null ? queryParams[paramName] : '')}&`;
      }
      paramsStr = paramsStr.substr(0, paramsStr.length - 1);
    }
    return this.http
      .get(this.organizationtranadvanceservice.querybycodeUrl + paramsStr)
      .pipe(map(res => <any[]>(<any>res).data.dt));
  }
  */

  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify(data)}` : '';
  }

  public GetApplications(): Observable<any> {
    return this.basetranslstorservice.GetAppliaction();
  }

  public GetIdByCode(code: any): number {
    let id = -1;
    this.originalData.forEach(d => {
      if (d.LOOKUP_TYPE_CODE === code) {
        id = d.LOOKUP_TYPE_ID;
        return;
      }
    });
    return id;
  }

  /** 获取快码 */
  public Get(id: string): Observable<ResponseDto> {
    return this.basetranslstorservice.Get(id);
  }

  /** 编辑快码 */
  public Edit(dto: BaseTranslatorInputDto): Observable<ResponseDto> {
    return this.basetranslstorservice.Edit(dto);
  }

  /** 删除快码 */
  public Remove(dto: BaseTranslatorInputDto): Observable<ResponseDto> {
    return this.basetranslstorservice.Remove(dto.devLanguageId);
  }

  public Add(dto: BaseTranslatorInputDto): Observable<ResponseDto> {
    return this.basetranslstorservice.Save(dto);
  }

  /** 导入excel数据 */
  public Import(dtos: any[]): Observable<ResponseDto> {
    return this.basetranslstorservice.Import(dtos);
  }


}
