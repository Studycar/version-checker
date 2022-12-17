import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';

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
export class MixedResourceIssuedResourceIssuedEditService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];

  constructor(
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private appApiService: AppApiService
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

  private getIndex(item: any, data: any[], keyField = 'Id'): number {
    for (let idx = 0; idx < data.length; idx++) {
      if (data[idx][keyField] === item[keyField]) {
        return idx;
      }
    }
    return -1;
  }


  public update(item: any): void {
    const index = this.getIndex(item, this.updatedItems);
    if (index !== -1) {
      this.updatedItems.splice(index, 1, item);
    } else {
      this.updatedItems.push(item);
    }
  }

  public getUpdateItems(): any[] {
    return this.updatedItems;
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
  seachUrl = '/api/ps/ppMixedResourceIssued/QueryMixedResourceIssued';

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

  public SearchItemInfoByID(ID: string, PLANT_CODE: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprodlineitem/psprodlineitem/GetByItemId',
      {
        ID: ID,
        PLANT_CODE: PLANT_CODE,
      },
    );
  }
  public SearchItemInfoByCode(ITEM_CODE: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprodlineitem/psprodlineitem/GetByItemCode',
      {
        ITEM_CODE: ITEM_CODE
      },
    );
  }

  /** 根据ID获取数据 */
  public Get(id: string, LANGUAGE: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/api/ps/ppMixedResourceIssued/GetByID',
      {
        id: id,
        LANGUAGE: LANGUAGE
      });
  }

  /** 编辑备注 */
  public updateMake(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/api/ps/ppMixedResourceIssued/updateMake', dto

    );
  }

  /** 编辑工艺版本 */
  public SendVersion(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/api/ps/ppMixedResourceIssued/updateMakeVersion', { dto: dto }

    );
  }


  /** 获取数据 递归 */
  SearchGetMenuInfo(dto: any): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/api/ps/ppMixedResourceIssued/QueryMixedResourceIssuedPage', dto);
  }

  /** AG  获取数据 递归 */
  SearchGetMenuInfoAG(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/ppMixedResourceIssued/QueryMixedResourceIssuedAG', dto);
  }

  /**下达 */
  SendMarkOrder(plantCode: string, markOrderList: string, assMarkOrderList: string, dto: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/ppMixedResourceIssued/SendMarkOrder',
      {
        plantCode: plantCode,
        markOrderList: markOrderList,
        assMarkOrderList: assMarkOrderList,
        dto: dto
      });
  }


  /** 刷新单个工单 */
  public loadMark(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/ppMixedResourceIssued/loadMark', dto

    );
  }

  /** 刷新 */
  public reload(plantCode: string, markorderlist = ''): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/ppMixedResourceIssued/reload?plantCode=' + plantCode + '&markOrderList=' + markorderlist,
      {
      }, {method: 'GET'});
  }

  public hasMrpSupply(plantCode: string, makeOrderNum: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/mrp/mrpsupply/hasMrpSupply', {plantCode, moNum: makeOrderNum}
    );
  }

  queryListMrpSupply =  '/api/mrp/mrpsupply/listMrpSupply'; //计划单组件清单查询
  public listMrpSupply(plantCode: string, makeOrderNum: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/mrp/mrpsupply/listMrpSupply', {plantCode, moNum: makeOrderNum}
    );
  }
}
