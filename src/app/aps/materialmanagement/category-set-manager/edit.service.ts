import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { CategorySetManagerInputDto } from '../../../modules/generated_module/dtos/category-set-manager-input-dto';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';

import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { CategorySetsInputDto } from 'app/modules/generated_module/dtos/category-sets-input-dto';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const itemIndex = (item: any, data: any[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].ID === item.ID) {
      return idx;
    }
  }
  return -1;
};

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable()
export class CategorySetManagerEditService extends BehaviorSubject<any[]> {
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
    return !item.ID;
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

  baseUrl = '/api/ps/pscategorysets/'; // 基路径
  seachUrl = this.baseUrl + 'getList';

  // seachUrl = '/afs/servercategorymanager/categorymanager/querycategorysetKenDo';
  // 查询方法
  private fetch(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    return this.http
      .post<GridSearchResponseDto>(this.seachUrl, queryParams)
      .pipe(map(res => res.Result));
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


  // /** 编辑 */
  // public Edit(dto: any): Observable<ActionResponseDto> {
  //   return this.http.post<ActionResponseDto>(
  //     '/afs/servercategorymanager/categorymanager/Edit', dto);
  // }

  /** 新增/编辑 */
  Edit(dto: CategorySetsInputDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'save', dto);
  }



  /** 删除类别集 */
  public Remove(ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.baseUrl + 'delete', ids);
  }

  // public Remove(dto: CategorySetManagerInputDto): Observable<ActionResponseDto> {
  //   return this.http.post<ActionResponseDto>(
  //     '/afs/servercategorymanager/categorymanager/Remove',
  //     {
  //       dto
  //     });
  // }


  /** 根据主键获取 */
  public Get(id: string): Observable<ResponseDto> {
      return this.http.get<ResponseDto>(
      this.baseUrl + 'getItem',
      {
    id: id
      });
  }
 
  /** 批量删除类别 */
  public RemoveBath(dtos: CategorySetManagerInputDto[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/servercategorymanager/categorymanager/RemoveBath',
      {
        dtos
      });
  }

}
