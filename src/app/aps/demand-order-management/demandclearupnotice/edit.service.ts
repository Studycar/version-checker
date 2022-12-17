import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { DemandclearupnoticeService } from '../../../modules/generated_module/services/demandclearupnotice-service';
import { NzMessageService } from 'ng-zorro-antd';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
const UPDATE_ACTION = 'update';
const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));
@Injectable()
export class DemandclearnoticeEditService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  private originalData: any[] = [];
  private updatedItems: any[] = [];
  constructor(
    private http: HttpClient,
    private demandclearupnoticeService: DemandclearupnoticeService,
    public msgSrv: NzMessageService,   
  ) {
    super([]);
  }

  public read(queryParams?: any, skip?: any, pagesize?: any) {
    if (this.data.length && queryParams === undefined) {
      return super.next(this.data);
    }

    this.fetch(queryParams).subscribe(data => {
      this.data = data;
      this.originalData = cloneData(data);
      super.next(data);
    });
  }




  public assignValues(target: any, source: any): void {
    Object.assign(target, source);
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
      .post<GridSearchResponseDto>(this.demandclearupnoticeService.exportUrl , queryParams)
      .pipe(map(res => res.Result));
  }

  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify(data)}` : '';
  }
 
}
