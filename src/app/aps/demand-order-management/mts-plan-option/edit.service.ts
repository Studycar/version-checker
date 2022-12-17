import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { MtsPlanOptionInputDto } from '../../../modules/generated_module/dtos/mts-plan-option-input-dto';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const itemIndex = (item: any, data: any[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].LOOKUP_TYPE_ID === item.LOOKUP_TYPE_ID) {
      return idx;
    }
  }
  return -1;
};

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable()
export class MtsPlanOptionEditService extends BehaviorSubject<any[]> {

  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];

  constructor(
    public http: _HttpClient,
    public msgSrv: NzMessageService,
  ) {
    super([]);
  }

  public export(
    queryParams: any = {},
    excelexport: any
  ) {
    if (this.data.length && queryParams === undefined) {
      super.next(this.data);
      excelexport.export(this.data);
    } else {
      this.fetch(queryParams).subscribe(data => {
        this.data = data;
        this.originalData = cloneData(data);
        super.next(data);
        excelexport.export(data);
      });
    }
  }

  public read(queryParams?: any) {
    if (this.data.length && queryParams === undefined) {
      return super.next(this.data);
    }

    this.fetch(queryParams).subscribe(data => {
      this.data = data;
      this.originalData = cloneData(data);
      super.next(data);
    });
  }

  public create(item: any): void {
    this.createdItems.push(item);
    this.data.unshift(item);

    super.next(this.data);
  }

  public update(item: any): void {
    if (!this.isNew(item)) {
      const index = itemIndex(item, this.updatedItems);
      if (index !== -1) {
        this.updatedItems.splice(index, 1, item);
      } else {
        this.updatedItems.push(item);
      }
    } else {
      const index = this.createdItems.indexOf(item);
      this.createdItems.splice(index, 1, item);
    }
  }

  public remove(item: any): void {
    let index = itemIndex(item, this.data);
    this.data.splice(index, 1);

    index = itemIndex(item, this.createdItems);
    if (index >= 0) {
      this.createdItems.splice(index, 1);
    } else {
      this.deletedItems.push(item);
    }

    index = itemIndex(item, this.updatedItems);
    if (index >= 0) {
      this.updatedItems.splice(index, 1);
    }

    super.next(this.data);
  }

  public isNew(item: any): boolean {
    return !item.LOOKUP_TYPE_ID;
  }

  public hasChanges(): boolean {
    return Boolean(
      this.deletedItems.length ||
      this.updatedItems.length ||
      this.createdItems.length,
    );
  }



  public cancelChanges(): void {
    this.reset();

    this.data = this.originalData;
    this.originalData = cloneData(this.originalData);
    super.next(this.data);
  }

  public assignValues(target: any, source: any): void {
    Object.assign(target, source);
  }

  public reset() {
    this.data = [];
    this.deletedItems = [];
    this.updatedItems = [];
    this.createdItems = [];
  }

  method = 'POST';
  seachUrl = '/api/ps/ppMtsPlanOption/queryMtsPlanKenDo';
  // 查询方法
  private fetch(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    if (this.method === 'GET') {
      let paramsStr = '';
      if (queryParams !== undefined) {
        paramsStr = '?';
        for (const paramName in queryParams) {
          paramsStr += `${paramName}=${(queryParams[paramName] !== null ? queryParams[paramName] : '')}&`;
        }
        paramsStr = paramsStr.substr(0, paramsStr.length - 1);
      }
      return this.http
        .get(this.seachUrl + paramsStr)
        .pipe(map(res => <any[]>(<any>res).Result));
    } else {
      return this.http
        .post<GridSearchResponseDto>(this.seachUrl, queryParams)
        .pipe(map(res => res.Result));

    }
  }





  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify(data)}` : '';
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

  /** 根据ID获取数据 */
  public Get(id: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/ppMtsPlanOption/getById',
      id);
  }

  /** 编辑 */
  public Edit(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/ppMtsPlanOption/edit', dto);

  }

  //
  public Remove(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/ppMtsPlanOption/remove', dto);
  }

  /** 批量删除 */
  RemoveBath(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/ppMtsPlanOption/removeBath', dtos);
  }
}

