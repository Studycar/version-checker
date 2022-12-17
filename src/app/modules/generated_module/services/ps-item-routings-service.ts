import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const itemIndex = (item: any, data: any[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].id === item.id) {
      return idx;
    }
  }
  return -1;
};

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable()
export class PsItemRoutingsService extends BehaviorSubject<any[]> {
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


  /** 分页的搜索 */
  Search(dto: any, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
    return this.http
      .get('/api/ps/psitemroutings/getPageList', {
        plantID: dto.plantID,
        plantGroupID: dto.plantGroupID,
        productLineID: dto.productLineID,
        itemCode: dto.itemCode,
        itemDesc: dto.itemDesc,
        itemCodeS: dto.itemCodeS,
        itemCodeE: dto.itemCodeE,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
  }


  seachUrl = '/api/ps/psitemroutings/getAllList';

  seachUrl1 = '/api/ps/psitemroutings/getPageList';
  // 查询方法
  private fetch(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    return this.http
      .get<GridSearchResponseDto>(this.seachUrl, queryParams)
      .pipe(map(res => res.Result));
  }

  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify(data)}` : '';
  }

  public GetIdByCode(code: any): number {
    let id = -1;
    this.originalData.forEach(d => {
      if (d.lookupTypeCode === code) {
        id = d.lookupTypeId;
        return;
      }
    });
    return id;
  }

  /** 编辑 */
  public Edit(dto: any): Observable<ResponseDto> {

    return this.http.post<ResponseDto>(
      '/api/ps/psitemroutings/edit', dto);
  }

  /** 删除 */
  public Remove(dto: any): Observable<ResponseDto> {

    return this.http.post<ResponseDto>(
      '/api/ps/psitemroutings/remove',

      dto
    );
  }

  /** 批量删除类别 */
  public RemoveBath(dtos: any[]): Observable<ResponseDto> {

    return this.http.post<ResponseDto>(
      '/api/ps/psitemroutings/removeBath',

      dtos
    );
  }

  public SearchItemInfo(plantID: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemroutings/queryItem',
      {
        plantCode: plantID
      },
    );
  }

  public SearchProcessCode(plantID: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemroutings/getProcessCode',
      {
        plantCode: plantID
      },
    );
  }

  public SearchItemInfoByID(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemroutings/getByItemId',
      {
        id: id
      },
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
  public SearchItemInfoByCode(itemCode: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemroutings/getByItemCode',
      {
        itemCode: itemCode
      },
    );
  }
  /**获取物料分页信息*/
  public GetUserPlantItemPageList(plantCode: string, itemCode: string, descriptions: string, pageIndex: number = 1, pageSize: number = 10, itemId: string = '', regionCode: string = ''): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psItem/pageItem',
      {
        regionCode: regionCode,
        plantCode: plantCode,
        itemId: itemId,
        itemCode: itemCode,
        descriptions: descriptions,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
  }

  /** 获取id对应的对象 */
  public Get(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemroutings/getByID',
      {
        id: id
      });
  }

  /** 导入excel数据 */
  public Import(dtos: any[]): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/psitemroutings/importData', dtos);
  }

  /** 查询bom替代项 */
  public QueryBomDesignator(plantCode: string, itemId: string): Observable<ResponseDto> {
    return this.http
      .get<ResponseDto>('/api/ps/psitemroutings/queryBomDesignator?plantCode=' + plantCode + '&itemId=' + itemId);
  }
}
