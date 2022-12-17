import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { LookupCodeManageService } from '../../../modules/generated_module/services/lookup-code-manage-service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { LookupCodeInputDto } from '../../../modules/generated_module/dtos/lookup-code-input-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';


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
export class BaseLookupCodeEditService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];
  public queryUrl = '/afs/serverbaselookupcode/lookupcode/querylookuptype';

  constructor(
    private http: _HttpClient,
    private lookupCodeManageService: LookupCodeManageService,
    public msgSrv: NzMessageService,
  ) {
    super([]);
  }

 public export(
  action: HttpAction /*{url:'',method:'GET|POST'}*/,
  queryParams: any = {},
  excelexport: any
) {
  this.fetch(action, queryParams).subscribe(data => {
    this.data = data;
    // this.originalData = cloneData(data);
    super.next(data);
    excelexport.export(data);
  });
}

  public read(action?: HttpAction, queryParams?: any) {
    if (this.data !== undefined && this.data.length && queryParams === undefined) {
      return super.next(this.data);
    }
    this.fetch(action, queryParams).subscribe(data => {
      this.data = data;
      // this.originalData = cloneData(data);
      super.next(data);
    });
  }

  public fetch(action?: HttpAction, queryParams?: any): Observable<any[]> {
    if (action.method === 'GET') {
      let paramsStr = '';
      if (queryParams !== undefined) {
        if (typeof (queryParams) === 'string') {
          paramsStr = queryParams;
        } else {
          paramsStr = '?';
          for (const paramName in queryParams) {
            paramsStr += `${paramName}=${(queryParams[paramName] !== null ? queryParams[paramName] : '')}&`;
          }
          paramsStr = paramsStr.substr(0, paramsStr.length - 1);
        }
      }
      return this.http
        .get(action.url + paramsStr)
        .pipe(map(res => <any[]>(<any>res).Result));
    } else {
      return this.http
        .post(action.url, queryParams)
        .pipe(map(res => <any[]>(<any>res).Result));
    }
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

  public saveChanges(): void {
    if (!this.hasChanges()) {
      return;
    }

    const completed = [];

    completed.push(this.createdItems);
    completed.push(this.updatedItems);
    completed.push(this.deletedItems);
    this.http
      .post(this.lookupCodeManageService.saveUrl, completed)
      .subscribe(res => {
        const ress = <any>res;
        if (ress.success) {
          this.msgSrv.success('保存成功');
        } else {
          this.msgSrv.error(ress.message.content);
        }
      });
    this.reset();

    // zip(...completed).subscribe(() => this.read());
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

  /*
  private fetch(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    return this.http
      .get<GridSearchResponseDto>('/afs/serverbaselookupcode/lookupcode/querylookuptype', queryParams)
      .pipe(map(res => res.Result));
  }
  */

  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify(data)}` : '';
  }

  public GetApplications(): Observable<any> {
    return this.lookupCodeManageService.GetAppliaction();
  }

  public GetInitLunguage(): Observable<any> {
    return this.lookupCodeManageService.GetInitLunguage();
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
    return this.lookupCodeManageService.Get(id);
  }

  /** 编辑快码 */
  public Edit(dto: LookupCodeInputDto): Observable<ResponseDto> {
    return this.lookupCodeManageService.Edit(dto);
  }

  /** 删除快码 */
  public Remove(ID: string): Observable<ResponseDto> {
    return this.lookupCodeManageService.Remove(ID);
  }

  /** 批量删除 */
  BatchRemove(ids: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverbaselookupcode/lookupcode/DeleteList', {
        ids: ids
      });
  }

  /** 批量删除明细 */
  BatchRemoveDetail(ids: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverbaselookupcode/lookupcode/DeleteDetailList', {
        ids: ids
      });
  }
}
