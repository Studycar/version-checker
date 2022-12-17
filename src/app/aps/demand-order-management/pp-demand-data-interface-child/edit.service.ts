import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

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
export class PpDemandDataInterfaceChildEditService extends BehaviorSubject<any[]> {
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
    Search(dto: any, page: number, pageSize: number): Observable<GridSearchResponseDto> {
      return this.http
        .post('/afs/serverppdemanddatainterface/ppdemanddatainterface/QueryDemandDataInterfaceChildKenDoPage', {
          PLANT_CODE: dto.PLANT_CODE,
          REQ_NUMBER: dto.REQ_NUMBER,
          REQ_LINE_NUM: dto.REQ_LINE_NUM,
          page: page,
          pageSize: pageSize
        });
    }


  seachUrl = '/api/pi/piReqOrders/queryPopupData';
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

  public GetByResouceByCode(Code: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverppdemanddatainterface/ppdemanddatainterface/GetByResouceByCode',
      {
        Code: Code
      },
    );
  }

}
