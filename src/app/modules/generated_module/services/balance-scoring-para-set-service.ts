import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
//import { ActionResponseDto } from '../dtos/action-response-dto';
import { ShareIssuedDto } from 'app/modules/generated_module/dtos/share-issued-workbench-dto';
import { CommonQueryService, HttpAction } from './common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
/** 平衡计分卡参数设置 */
export class BalanceScoringParaSetService extends CommonQueryService {
  constructor(
    public httpClient: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(httpClient, appApiService);
  }
  //strUrl = '/afs/serverbasebalancescoring/balancescoring/';
  baseUrl = '/api/ps/BaseBalanceScoring/';


  /** 保存信息 */
  SaveData(dto: any, selects: any[], selectDto: any, flag: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.baseUrl + 'SaveData', { listSave: dto, selects: selects, selectDto: selectDto, flag: flag });
  }


  CheckExistsScheduleGroup(selects: any[], selectDto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      this.baseUrl + 'CheckExistsScheduleGroup', selects, selectDto ,
    );
  }

}
