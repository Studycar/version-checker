import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { BasePsBomService } from '../../../modules/generated_module/services/base-psbom-service';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';

const itemIndex = (item: any, data: any[]): number => {
    for (let idx = 0; idx < data.length; idx++) {
        if (data[idx].LOOKUP_TYPE_ID === item.LOOKUP_TYPE_ID) {
            return idx;
        }
    }
    return -1;
};

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable()
export class BasePsBomEditService extends BehaviorSubject<any[]> {
    private data: any[] = [];
    private originalData: any[] = [];
    constructor(
        private http: HttpClient,
        public msgSrv: NzMessageService,
        private bomservice: BasePsBomService
    ) {
        super([]);
    }

    public read(action?: HttpAction, queryParams?: any) {
        if (this.data !== undefined && this.data.length && queryParams === undefined) {
            return super.next(this.data);
          }
          this.fetch(action, queryParams).subscribe(data => {
              console.log(data);
            this.data = data;
            // this.originalData = cloneData(data);
            super.next(data);
          });
    }

    private fetch(action?: HttpAction, queryParams?: any): Observable<any[]> {
        if (action.method === 'GET') {
            let paramsStr = '';
            if (queryParams !== undefined) {
              if (typeof (queryParams) === 'string') {
                paramsStr = queryParams;
              } else {
                paramsStr = '?';
                for (const paramName in queryParams) {
                  paramsStr += `${paramName}=${(queryParams[paramName] !== null ? queryParams[paramName] : '')}&`;
                }
                paramsStr = paramsStr.substr(0, paramsStr.length - 1);
              }
            }
            return this.http
              .get(action.url + paramsStr)
              .pipe(map(res => <any[]>(<any>res).Result));
          } else {
            return this.http
              .post(action.url, queryParams)
              .pipe(map(res => <any[]>(<any>res).Result));
          }
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

}
