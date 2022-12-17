import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NzMessageService } from 'ng-zorro-antd';
import { ComVindicateService  } from '../../../modules/generated_module/services/comvindicate-service';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';

@Injectable()
export class EditService extends CommonQueryService {
  
  baseUrl = '/api/ps/psmorequirement/'; // 基路径
  queryUrl = this.baseUrl + 'getList';

  excUrl = '/afs/serverpscomvindicate/pscomvindicate/ExportInfo-ComVinicate';

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    public msgSrv: NzMessageService,
    public comVindicateService: ComVindicateService,
  ) {
    super(http, appApiService);
  }
  // public QueryMoByPlantCodeOrKey(plantcode: string, key: string ): Observable<any> {
  //   return this.comVindicateService.queryMo(plantcode, key);
  // }

  public QueryMoInfo(makeOrderNum: string): Observable<any> {
    return this.comVindicateService.queryMoInfo(makeOrderNum);
  }

  public query(mo: string, desc: string, plantcode: string): Observable<any> {
    return this.comVindicateService.query(mo, desc, plantcode);
  }

  // 删除组件
  DeleteMoRequirement(listIds: any, makeOrderNum: string, plantCode: string): Observable<ActionResponseDto> {
    return this.http.post(
      '/afs/serverpscomvindicate/pscomvindicate/DeleteMoRequirement', { listIds: listIds, makeOrderNum: makeOrderNum, plantCode: plantCode }
    );
  }

  // 查询子库
  QuerySubinventories(plantCode: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpscomvindicate/pscomvindicate/QuerySubinventories', { plantCode: plantCode }
    );
  }

  // 查询物料
  QueryItemData(input: any): Observable<GridSearchResponseDto> {
    return this.http.post(
      '/afs/serverpscomvindicate/pscomvindicate/QueryItemData', { input: input }
    );
  }
  
  // 查询工单组件维护页面数据
  QueryMoRequirementEditData(plantCode: string, makeOrderNum: string, moRequirementId: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpscomvindicate/pscomvindicate/QueryMoRequirementEditData', { plantCode: plantCode, makeOrderNum: makeOrderNum, moRequirementId: moRequirementId }
    );
  }

  // 查询物料关联的供应类型和子库
  QueryItemSupplyTypeAndSubinventories(plantCode: string, itemCode: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpscomvindicate/pscomvindicate/QueryItemSupplyTypeAndSubinventories', { plantCode: plantCode, itemCode: itemCode }
    );
  }

  // 保存工单组件
  SaveMoRequirement(saveData: any, isUpdate: boolean): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpscomvindicate/pscomvindicate/SaveMoRequirement', { saveData: saveData, isUpdate: isUpdate }
    );
  }
}
