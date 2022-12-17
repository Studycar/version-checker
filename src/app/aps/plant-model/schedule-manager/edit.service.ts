import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { ScheduleManagerService } from '../../../modules/generated_module/services/schedule-manager-service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { NzMessageService } from 'ng-zorro-antd';
import { CommonInputDto } from '../../../modules/generated_module/dtos/common-input-dto';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const itemIndex = (item: any, data: any[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].SCHEDULE_REGION_ID === item.SCHEDULE_REGION_ID) {
      return idx;
    }
  }

  return -1;
};

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable()
export class ScheduleManagerEditService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];

  constructor(
    private http: HttpClient,
    private scheduleManagerService: ScheduleManagerService,
    private messageManageService: MessageManageService,
    public msgSrv: NzMessageService,
  ) {
    super([]);
  }

  public read(queryObj: any = {}) {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.fetch('', queryObj).subscribe(data => {
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
    return !item.SCHEDULE_REGION_ID;
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
    const userId = CommonInputDto.USER_ID;
    const completed = [];

    completed.push(userId);
    completed.push(this.createdItems);
    completed.push(this.updatedItems);
    completed.push(this.deletedItems);
    this.http
      .post(this.scheduleManagerService.saveUrl, completed)
      .subscribe(res => {
        const ress = <any>res;
        if (ress.success) {
          this.msgSrv.success('保存成功');
        } else {
          this.msgSrv.error(ress.message.content);
        }
      });
    this.reset();

    zip(...completed).subscribe(() => this.read());
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

  public export(
    queryObj: any = {},
    excelexport: any
  ) {
    if (this.data.length) {
      super.next(this.data);
      excelexport.export(this.data);
    } else {
      this.fetch('', queryObj).subscribe(data => {
        this.data = data;
        this.originalData = cloneData(data);
        super.next(data);
        excelexport.export(data);
      });
    }
  }

  private fetch(action: string = '', data?: any): Observable<any[]> {
    const parms = `?data=${JSON.stringify(data)}`;
    return this.http
      .get(this.scheduleManagerService.queryUrl + parms)
      .pipe(map(res => <any[]>(<any>res).data));
  }

  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify(data)}` : '';
  }

  public GetEnableFlags(): Observable<any> {
    return this.messageManageService.GetEnableFlags();
  }

  public GetPlanTypes(): Observable<any> {
    return this.messageManageService.GetPlanTypes();
  }

  public GetIdByCode(code: any): number {
    let id = -1;
    this.originalData.forEach(d => {
      if (d.SCHEDULE_REGION_CODE === code) {
        id = d.SCHEDULE_REGION_ID;
        return;
      }
    });
    return id;
  }
}
