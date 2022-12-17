import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { FunctionmanagerService } from '../../../modules/generated_module/services/functionmanager-service';
import { NzMessageService } from 'ng-zorro-antd';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { _HttpClient } from '@delon/theme';
import { DemandclearupnoticeService } from '../../../modules/generated_module/services/demandclearupnotice-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';
const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const itemIndex = (item: any, data: any[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].REQ_DATE === item.REQ_DATE && data[idx].REQ_QTY === item.REQ_QTY) {
      return idx;
    }
  }

  return -1;
};

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));
@Injectable()
// tslint:disable-next-line:class-name
export class DemandorderclearnoticeEditService extends BehaviorSubject<any[]> {
  [x: string]: any;
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];


  constructor(
    public http: _HttpClient,
    private demandclearupnoticeService: DemandclearupnoticeService,
    public msgSrv: NzMessageService,
  ) {
    super([]);
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
    return Boolean(this.deletedItems.length || this.updatedItems.length || this.createdItems.length);
  }


  public assignValues(target: any, source: any): void {
    Object.assign(target, source);
  }

  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify(data)}` : '';
  }

  public saveChanges(): Promise<ResponseDto> {
    if (!this.hasChanges()) {
      return;
    }
    const completed = [];
    completed.push(this.createdItems);
    completed.push(this.updatedItems);
    return this.demandclearupnoticeService
      .saveSplitOrder(completed)
      .map(res => {
        if (res.code  === 200) {
          // this.query();
        }
        return res;
      }).toPromise();

  }

  public saveChanges2(): void {
    if (!this.hasChanges()) {
      return;
    }
    const completed = [];
    completed.push(this.createdItems);
    completed.push(this.updatedItems);
    this.demandclearupnoticeService
      .saveNonStdResquest(completed)
      .subscribe(res => {
        if (res.Success === true) {
          this.msgSrv.success(this.appTranslationService.translate('拆分成功'));
          // this.query();
        } else {
          this.msgSrv.warning(this.appTranslationService.translate(res.Message));
        }

      });

  }

  public SplitOrder() {
    // 弹出确认框
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('确定要拆分吗？'),
      nzOnOk: () => {
        this.demandclearupnoticeService
          .saveSplitOrder(this.mySelection)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('拆分成功'));
              // this.query();
            } else {
              this.msgSrv.warning(this.appTranslationService.translate(res.msg));
            }

          });
      },
    });
  }

  private fetch(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    return this.http
      .get<GridSearchResponseDto>(this.demandclearupnoticeService.seachSplitUrl, queryParams)
      .pipe(map(res => res.Result));
  }

  private fetch2(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    return this.http
      .get<ResponseDto>(this.demandclearupnoticeService.seachnonstdreqUrl, queryParams)
      .pipe(map(res => res.data));
  }

  private fetchhistory(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    return this.http
      .get<ResponseDto>(this.demandclearupnoticeService.seachhistoryUrl, queryParams)
      .pipe(map(res => res.data));
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

  public read2(queryParams?: any) {

    if (this.data.length && queryParams === undefined) {
      return super.next(this.data);
    }

    this.fetch2(queryParams).subscribe(data => {
      this.data = data;
      this.originalData = cloneData(data);
      super.next(data);
    });
  }

  public export(
    queryParams: any = {},
    excelexport: any
  ) {
    if (this.data.length && queryParams === undefined) {
      super.next(this.data);
      excelexport.export(this.data);
    } else {
      this.fetchhistory(queryParams).subscribe(data => {
        this.data = data;
        this.originalData = cloneData(data);
        super.next(data);
        excelexport.export(data);
      });
    }
  }

  public readhistory(queryParams?: any) {

    if (this.data.length && queryParams === undefined) {
      return super.next(this.data);
    }

    this.fetchhistory(queryParams).subscribe(data => {
      this.data = data;
      this.originalData = cloneData(data);
      super.next(data);
    });
  }

  /**
   * create by jianl
   * 上面的旧方法貌似有问题，第一次没有return，重新实现一个新的方法
   * @param queryParams 查询参数
   */
  public readhistory2(queryParams?: any): Observable<any[]> {
    return this.fetchhistory(queryParams);
  }
}
