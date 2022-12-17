import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';

@Injectable()
/** 快码管理服务 */
export class SopReductionRuleManageService {
  constructor(private appApiService: AppApiService) { }
  queryUrl = '/afs/serverSopReductionRuleManage/sopReductionRuleManage/queryConsume'; /* 非分页查询 */

  getConsumeProduction(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverSopReductionRuleManage/sopReductionRuleManage/getConsumeProduction',
      {
      }, { method: 'GET' });
  }

  // 后台过滤掉重复的
  filterLookUpByCode(lookupCode: string, plantCode: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverSopReductionRuleManage/sopReductionRuleManage/getLookUpByCode?lookupCode=' + lookupCode + '&plantCode=' + plantCode,
      {
      }, { method: 'GET' });
  }
  
  Save(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverSopReductionRuleManage/sopReductionRuleManage/save',
      {
        dto
      }, { method: 'POST' }
    );
  }

  Update(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverSopReductionRuleManage/sopReductionRuleManage/update',
      {
        dto
      }, { method: 'POST' }
    );
  }

  queryConsume(CONSUME_CODE: string): Observable<any> {
    return this.appApiService.call<any>(
      '/afs/serverSopReductionRuleManage/sopReductionRuleManage/queryConsume',
      {
        CONSUME_CODE
      }, { method: 'POST' });
  }

  removeBatch(ids: string[]): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverSopReductionRuleManage/sopReductionRuleManage/delete',
      {
        deleteId: ids,
      },
    );
  }
}
