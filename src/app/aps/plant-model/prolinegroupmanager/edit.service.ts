import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { NzMessageService } from 'ng-zorro-antd';
//import { TokenService } from '@delon/auth';
const UPDATE_ACTION = 'update';
const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));
@Injectable()
//import { TokenService } from '@delon/auth';

export class PlantMaintainEditService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  private originalData: any[] = [];  
  private updatedItems: any[] = [];


  constructor(
    private http: HttpClient,
    private plantmaintainService: PlantMaintainService,
    public msgSrv: NzMessageService,
    //private tokenService: TokenService,
  ) {
    super([]);
  }

  //public read() {
  //  if (this.data.length) {
  //    return super.next(this.data);
  //  }

  //  this.fetch().subscribe(data => {
  //    this.data = data;
  //    this.originalData = cloneData(data);
  //    super.next(data);
  //  });
  //}

  public update(item: any): void {   
        this.updatedItems.push(item);     
   
  }

  public assignValues(target: any, source: any): void {
    Object.assign(target, source);
  }

  public reset() {
    this.data = [];    
    this.updatedItems = [];    
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
  public hasChanges(): boolean {
    return Boolean(      
      this.updatedItems.length,
    );
  }
  //public saveChanges(): void {
  //  if (!this.hasChanges()) {
  //    return;
  //  }
  //  //const userId = this.tokenService.get().userId;
  //  const completed = [];

  //  completed.push([]);   
  //  completed.push(this.updatedItems);
  //  completed.push(0);  
  //  this.http
  //    .post(this.plantmaintainService.saveUrl, completed)
  //    .subscribe(res => {
  //      const ress = <any>res;
  //      if (ress.success) {
  //        this.msgSrv.success('保存成功');
  //      } else {
  //        this.msgSrv.error(ress.message.content);
  //      }
  //    });
  //  this.reset();

  //  zip(...completed).subscribe(() => this.read());
  //}
  private fetch(queryParams?: any, action: string = '', data?: any): Observable<any[]> {
    let paramsStr = '';
    if (queryParams !== undefined) {
      paramsStr = '?';
      for (const paramName in queryParams) {
        paramsStr += `${paramName}=${(queryParams[paramName] !== null ? queryParams[paramName] : '')}&`;
      }
      paramsStr = paramsStr.substr(0, paramsStr.length - 1);
    }
    return this.http
      .get(this.plantmaintainService.seachUrl + paramsStr)
      .pipe(map(res => <any[]>(<any>res).data.dt));
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
 
}
