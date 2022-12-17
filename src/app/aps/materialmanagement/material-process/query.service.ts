import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';


@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }

  Search(): Observable<GridSearchResponseDto> {
    return this.http
      .get('/afs/serverpsmaterialprocess/psmaterialprocess/query', {
      });
  }

  SaveEditFlow(dto: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsmaterialprocess/psmaterialprocess/Save', {
        dto: dto
      });
  }

  getItemProcess(plantcode: string): Observable<ActionResponseDto> {
    return this.http
      .get('/afs/serverpsmaterialprocess/psmaterialprocess/getItemProcess?plantcode=' + plantcode, {
      });
  }

  getInitFlowEdit(plantcode: string, item_id: string, TECH_VERSION: string): Observable<ActionResponseDto> {
    return this.http
      .get('/afs/serverpsmaterialprocess/psmaterialprocess/getInitFlowEdit?plantcode=' + plantcode + '&item_id=' + item_id + '&TECH_VERSION=' + TECH_VERSION, {
      });
  }

  Save(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverpsmaterialprocess/psmaterialprocess/Copy',
      {
        dto
      }, { method: 'POST' }
    );
  }

  CopyProcessNew(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverpsmaterialprocess/psmaterialprocess/CopyProcessNew',
      {
        dto
      }, { method: 'POST' }
    );
  }

  isExistItemCode(PLANTCODE: string, ITEM_CODE: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverpsmaterialprocess/psmaterialprocess/isExistItemCode?PLANTCODE=' + PLANTCODE + '&ITEM_CODE=' + ITEM_CODE,
      {
      }, { method: 'GET' }
    );
  }

  public getCatPageList(value: string, PageIndex: number = 1, PageSize: number = 10): Observable<GridSearchResponseDto> {
    return this.appApiService.call<GridSearchResponseDto>(
      '/afs/serverpsmaterialprocess/psmaterialprocess/QueryCatPageList?value=' + value + '&PageIndex=' + PageIndex + '&PageSize=' + PageSize,
      {
        value: value,
        PageIndex: PageIndex,
        PageSize: PageSize
      }, { method: 'GET' });
  }

  /** 导入excel数据 */
  Import(dtos: any[]): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsmaterialprocess/psmaterialprocess/ImportInfo', { dtos: dtos });
  }
}


