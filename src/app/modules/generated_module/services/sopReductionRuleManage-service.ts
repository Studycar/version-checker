import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
/** 快码管理服务 */
export class SopreductionrulemanageService {
  constructor(private appApiService: AppApiService) { }
  queryUrl = '/api/sop/sopreductionrulemanage/queryconsume'; /* 非分页查询 */

  getConsumeProduction(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/sop/sopreductionrulemanage/getconsumeproduction',
      {
      }, { method: 'GET' });
  }

  // 后台过滤掉重复的
  filterLookUpByCode(lookupCode: string, plantCode: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/sop/sopreductionrulemanage/getlookupbycode?lookupCode=' + lookupCode + '&plantCode=' + plantCode,
      {
      }, { method: 'GET' });
  }
  
  Save(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/sop/sopreductionrulemanage/save',
        dto
    );
  }

  Update(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/sop/sopreductionrulemanage/update',
        dto
    );
  }

  queryConsume(consumeCode: string): Observable<any> {
    return this.appApiService.call<any>(
      '/api/sop/sopreductionrulemanage/queryconsume',
      {
        consumeCode
      }, { method: 'POST' });
  }

  removeBatch(ids: string[]): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/sop/sopreductionrulemanage/batchremove',
      ids
    );
  }
}
