import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { PsPrivilegeService } from '../../../modules/generated_module/services/ps-privilege-service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { PsPrivilegeInputDto } from '../../../modules/generated_module/dtos/ps-privilege-input-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

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
export class BasePsPrivilegeEditService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];

  constructor(
    public http: _HttpClient,
    private psPrivilegeService: PsPrivilegeService,
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
    return !item.id;
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


  seachUrl = '/api/admin/psprivilege/queryPrivilegeKenDo';
  // 查询方法
  private fetch(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    return this.http
      .get<ResponseDto>(this.seachUrl, queryParams)
      .pipe(map(res => res.data));
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



  /** 根据ID获取 */
  public Get(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psprivilege/getById',
      {
        id: id
      });
  }

  /** 编辑用户 */
  public save(dto: PsPrivilegeInputDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/psprivilege/save',
      {
        ...dto
      });
  }

  /** 删除用户 */
  public Remove(dto: PsPrivilegeInputDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/psprivilege/remove',
      {
        id : dto.id
      });
  }
  /** 批量删除用户 */
  public RemoveBath(dtos: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/psprivilege/removeBath',
      dtos);
  }

  /**获取所有绑定的用户*/
  public GetAppliactioUser(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psprivilege/getAppliactioUser',
      {
      });
  }
  /**获取所有绑定的组织*/
  public GetAppliactioPlant(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psprivilege/getAppliactioPlant',
      {
      });
  }

  /**获取所有计划组*/
  public GetAppliactioGroup(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psprivilege/getAppliactioGroup',
      {
      });
  }

  /**获取所有计划组 根据工厂ID*/
  public GetAppliactioGroupByPlantID(plantId: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psprivilege/getAppliactioGroup?plantId=' + plantId,
      {
      });
  }

  /** 获取所有资源*/
  public GetAppliactioLine(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psprivilege/getAppliactioLine',
      {
      });
  }

  /** 获取所有资源*/
  public GetAppliactioGroupIDLine(groupId: String): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psprivilege/getAppliactioLine?groupId=' + groupId,
      {
      });
  }

  /** 导入excel数据 */
  public imports(dto: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/psprivilege/imports',
      dto);
  }

}
