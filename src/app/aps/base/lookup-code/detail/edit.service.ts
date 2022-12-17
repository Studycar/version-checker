import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { LookupCodeManageService } from '../../../../modules/generated_module/services/lookup-code-manage-service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { ActionResponseDto } from '../../../../modules/generated_module/dtos/action-response-dto';
import { deepCopy } from '@delon/util';
import { defer, of } from 'rxjs/index';
import { tap } from 'rxjs/internal/operators';
import { _HttpClient } from '@delon/theme';

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
export class BaseLookupCodeDetailEditService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];
  public code: any;
  public lng: any;
  public lookupTypeId: string | number = -1;

  constructor(
    private http: _HttpClient,
    private modal: NzModalRef,
    private lookupCodeManageService: LookupCodeManageService,
    public appTranslationService: AppTranslationService,
    public msgSrv: NzMessageService) {
    super([]);
  }

  public read() {
    if (this.data.length) {
      super.next(this.data);
    }
    this.fetch()
      .subscribe(data => {
        this.data = data;
        this.originalData = cloneData(data);
        super.next(data);
      });
  }

  public create(item: any): void {
    item.LOOKUP_TYPE_ID = this.lookupTypeId;
    item.LOOKUP_CODE_ID = item.ID,
      item.LANGUAGE = this.lng;
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

  public removeindex(item: any): void {
    let index = itemIndex(item, this.data);
    this.data.splice(index, 1);

    index = itemIndex(item, this.createdItems);
    if (index >= 0) {
      this.createdItems.splice(index, 1);
    } else {
      // this.deletedItems.push(item);
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

  public formatDateTime(time: any) {
    if (time !== '' && time !== null && time !== undefined) {
      const Dates = new Date(time);
      const year: number = Dates.getFullYear();
      const month: any = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
      const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
      const hours: any = Dates.getHours() < 10 ? '0' + Dates.getHours() : Dates.getHours();
      const minutes: any = Dates.getMinutes() < 10 ? '0' + Dates.getMinutes() : Dates.getMinutes();
      const seconds: any = Dates.getSeconds() < 10 ? '0' + Dates.getSeconds() : Dates.getSeconds();
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    } else {
      return '';
    }
  }

  public saveChanges(): void {
    if (!this.hasChanges()) {
      return;
    }

    const completed = [];
    completed.push(this.createdItems);
    completed.push(this.updatedItems);
    completed.push(this.deletedItems);
    console.log(this.createdItems[0]);

    if (this.createdItems.length > 0) {
      this.http.post(this.lookupCodeManageService.saveDetailUrl, { dto: this.createdItems }).subscribe(res => {
        const ress = <ActionResponseDto>res;
        if (ress.Success) {
          this.msgSrv.success(this.appTranslationService.translate(ress.Message || '保存成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate('保存失败:' + ress.Message));
        }
      });
    }
    if (this.updatedItems.length > 0) {
      this.http.post(this.lookupCodeManageService.UpdateDetailUrl, { dto: this.updatedItems }).subscribe(res => {
        const ress = <ActionResponseDto>res;
        if (ress.Success) {
          this.msgSrv.success(this.appTranslationService.translate(ress.Message || '修改成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate('修改失败:' + ress.Message));
        }
      });
    }
    if (this.deletedItems.length > 0) {
      this.http.post(this.lookupCodeManageService.DeleteDetailUrl, { dto: this.deletedItems }).subscribe(res => {
        const ress = <ActionResponseDto>res;
        if (ress.Success) {
          this.msgSrv.success(this.appTranslationService.translate(ress.Message || '删除成功'));
        } else {
          this.msgSrv.error(this.appTranslationService.translate('删除失败:' + ress.Message));
        }
      });
    }


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

  private reset() {
    this.data = [];
    this.deletedItems = [];
    this.updatedItems = [];
    this.createdItems = [];
  }

  private fetch(action: string = '', data?: any): Observable<any[]> {
    return this.lookupCodeManageService.GetDetail(this.code, this.lng)
      .pipe(map(res => <any[]>(<any>res).Result));
  }

  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify(data)}` : '';
  }

  public GetApplications(): Observable<any> {
    return this.lookupCodeManageService.GetAppliaction();
  }

  /** 删除快码明细 */
  public RemoveLookupCodeValue(id: any): Observable<any> {
    return this.lookupCodeManageService.RemoveLookupCodeVaule(id);
  }


}
