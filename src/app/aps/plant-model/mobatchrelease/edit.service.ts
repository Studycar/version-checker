import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { MOBatchReleaseService } from '../../../modules/generated_module/services/mobatchrelease-service';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';


// import { TokenService } from '@delon/auth';
const UPDATE_ACTION = 'update';
const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));
@Injectable()
export class EditService extends CommonQueryService {
  // private data: any[] = [];
  private originalData: any[] = [];
  private updatedItems: any[] = [];
  public queryUrl = '/api/ps/moBatchRelease/pageQueryBatchReleasePost';
  public queryform = '/api/ps/moBatchRelease/queryFromMoBatchRel';
  public excUrlForm = '/afs/serverpsmobatchrelease/mobatchrelease/ExportInfoFrom';
  public excUrl = '/api/ps/moBatchRelease/exportInfo';

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    public msgSrv: NzMessageService,
    public mOBatchReleaseService: MOBatchReleaseService,
  ) {
    super(http, appApiService);
  }
  
  public getSelection(monum: string): Observable<any> {
    return this.mOBatchReleaseService.getSelection(monum);
  }

  public BacthRelease(ids: any, flag: any, monum: any, plantcode: string): Observable<any> {
    return this.mOBatchReleaseService.BacthRelease(ids, flag, monum, plantcode);
  }

  public query(parms: any, PAGE_INDEX: number, PAGE_SIZE: number): Observable<any> {
    return this.mOBatchReleaseService.Query(parms, PAGE_INDEX, PAGE_SIZE);
  }

  public QueryFrom(plantids: any, orderid: any, PAGE_INDEX: number, PAGE_SIZE: number): Observable<GridSearchResponseDto> {
    return this.mOBatchReleaseService.QueryFrom(plantids, orderid, PAGE_INDEX, PAGE_SIZE);
  }
  
  public GetDescByItemCode(itemcode: any): Observable<any> {
    return this.mOBatchReleaseService.GetDescByItemCode(itemcode);
  }

  // 转化时间格式，解决时间控件报错的问题
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
}
