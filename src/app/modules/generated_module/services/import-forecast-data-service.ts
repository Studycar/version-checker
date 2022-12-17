import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
// import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
// import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
// import { ActionResponseDto } from '../dtos/action-response-dto';
import { ActionResultDto } from '../dtos/action-result-dto';

@Injectable()
/** 预测数据导入服务 */
export class ImportForecastDataService {
  constructor(private appApiService: AppApiService) { }

  searchUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/afs/serverppimportforecastdata/ppimportforecastdata/querydatapost';

  tempDataUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/afs/serverppimportforecastdata/ppimportforecastdata/querytemp';
  /** 搜索 */
  Search(request: any): Observable<ActionResultDto> {
    return this.appApiService.call<ActionResultDto>(
      '/afs/serverppimportforecastdata/ppimportforecastdata/querydatapost',
      {
        request
      });
  }
  /** 搜索临时数据 */
  SearchTemp(sessionid: string): Observable<ActionResultDto> {
    return this.appApiService.call<ActionResultDto>(
      '/afs/serverppimportforecastdata/ppimportforecastdata/querytemp',
      {
        sessionid: sessionid
      });
  }
  /** 获取快码是否 */
  GetYesNoTypes(): Observable<ActionResultDto> {
    return this.appApiService.call<ActionResultDto>(
      '/afs/serverppimportforecastdata/ppimportforecastdata/getlookupbytype?type=YES_NO',
      {}, { method: 'GET' }
    );
  }
  /** 插入临时数据 */
  InsertTemp(data: any[]): Observable<ActionResultDto> {
    return this.appApiService.call<ActionResultDto>(
      '/afs/serverppimportforecastdata/ppimportforecastdata/inserttempdata',
      { listStr: data }
    );
  }
  /** 删除数据 */
  DeleteData(sessionid: string): Observable<ActionResultDto> {
    return this.appApiService.call<ActionResultDto>(
      '/afs/serverppimportforecastdata/ppimportforecastdata/deletedatabysessionid?sessionid=' + sessionid,
      {}, { method: 'GET' }
    );
  }
  /** 校验数据 */
  CheckData(sessionid: string): Observable<ActionResultDto> {
    return this.appApiService.call<ActionResultDto>(
      '/afs/serverppimportforecastdata/ppimportforecastdata/checkdata',
      { sessionid: sessionid }
    );
  }
  /** 插入 */
  Insert(userid: string, sessionid: string): Observable<ActionResultDto> {
    return this.appApiService.call<ActionResultDto>(
      '/afs/serverppimportforecastdata/ppimportforecastdata/insertdata',
      { userid: userid, sessionid: sessionid }
    );
  }
}
