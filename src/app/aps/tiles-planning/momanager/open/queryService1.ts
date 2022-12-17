import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NzMessageService } from 'ng-zorro-antd';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { MOBatchReleaseService } from '../../../../modules/generated_module/services/mobatchrelease-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class EditService extends CommonQueryService {

  public queryform = '/afs/serverpsmomanager/psmomanager/queryFromMoBatchRel';
  public excUrlForm = '/afs/serverpsmomanager/psmomanager/ExportInfoFrom';

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

  public GetDescByItemCode(plantcode: any, itemcode: any): Observable<any> {
    return this.mOBatchReleaseService.GetDescByItemCode(itemcode);
  }

}
