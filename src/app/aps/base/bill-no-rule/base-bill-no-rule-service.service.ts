import { Injectable } from '@angular/core';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { Observable } from 'rxjs';
import { BaseBillNoRuleDto } from './dtos/base-bill-no-rule-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
/** 工单规则服务 */
export class BaseBillNoRuleService {
  constructor(private http: _HttpClient) { }

  /**保存/修改*/
  public Save(dto: BaseBillNoRuleDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/basebillnorule/save',
      {
        id: dto.id,
        code: dto.code,
        name: dto.name,
        prefix: dto.prefix,
        dateFormat: dto.dateFormat,
        noDigits: dto.noDigits,
        sort: dto.sort,
        active: dto.active === false ? 0 : 1,
      });
  }

  /**删除 */
  public Delete(ids: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/basebillnorule/delete', { ids: ids });
  }

  /**查询规则 */
  public GetRule(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/basebillnorule/getRule/', { id: id });
  }

  /**查询规则 */
  public GetRules(): Observable<any> {
    return this.http.get<any>(
      '/api/admin/basebillnorule/getRules'
    );
  }

  /**查询记录 */
  public GetRecords(ruleId: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/basebillnorule/getRecords', { ruleId: ruleId });
  }

  /**生成工单 */
  public GetBillNoRule(code: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/basebillnorule/getBillNoRule', { code: code });
  }
}
