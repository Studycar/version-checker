import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


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
export class ItemCycleTimeEditService extends BehaviorSubject<any[]> {
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


  public assignValues(target: any, source: any): void {
    Object.assign(target, source);
  }

  public reset() {
    this.data = [];
    this.deletedItems = [];
    this.updatedItems = [];
    this.createdItems = [];
  }

  //seachUrl = '/afs/serverpsitemdefine/itemcycletime/QueryInfo';
  seachUrl = '/api/ps/ppItemCycleTime/queryInfo';

  /** 编辑 */
  public Edit(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/ppItemCycleTime/edit', dto);
  }

  /** 删除 */
  public Remove(dto: any): Observable<ActionResponseDto> {

    return this.http.post<ActionResponseDto>(
      '/afs/serverpsitemdefine/itemcycletime/Remove',
      {
        dto
      });
  }

  /** 批量删除 */
  public RemoveBath(dtos: any[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsitemdefine/itemcycletime/RemoveBath',
      {
        dtos
      });
  }


  /** 获取id对应的对象 */
  public Get(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/ppItemCycleTime/getByID',
      {
        id: id
      });
  }

  /** 导入excel数据 */
  public Import(dtos: any[]): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/ppItemCycleTime/importInfo', dtos);
  }
  public SearchItemInfoByCode(ITEM_CODE: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprodlineitem/psprodlineitem/GetByItemCode',
      {
        ITEM_CODE: ITEM_CODE
      },
    );
  }
  public SearchItemInfoByID(ID: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprodlineitem/psprodlineitem/GetByItemId',
      {
        ID: ID
      },
    );
  }
  public SearchItemInfo(plantID: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprodlineitem/psprodlineitem/QueryItem',
      {
        PLANT_CODE: plantID
      },
    );
  }

}
