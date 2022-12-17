import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';
import { Error } from 'tslint/lib/error';

@Injectable()
export class ApsJobAdminService {

  constructor(
    public http: _HttpClient,
    private commonQueryService: CommonQueryService,
  ) {
  }

  /**
   * 获取工厂/组织
   */
  getUserPlant(): Observable<any[] | null> {
    return this.commonQueryService.GetUserPlant().pipe(map(res => {
      if (res.Success) {
        return res.Extra.map(item => ({ label: item.descriptions, value: item.plantCode }));
      } else {
        return null;
      }
    }));
  }

  /**
   * 获取采购员
   */
  getBuyerPageList(): Observable<any[] | null> {
    return this.http.get('/api/pc/pcEntityKitQuery/listBuyer').pipe();
  }

  /**
   * 获取计划名称
   */
  getPlanName(): Observable<any[] | null> {
    return this.http.get('/api/mrp/mrpPlanWorkbenchController/queryPlans').pipe(map(res => {
      res = ConvertToResponseDto(res);
      if (res.Success) {
        return res.Extra.map(item => ({ label: item.description, value: item.planName }));
      } else {
        return null;
      }
    }));
  }

}

/**
 * 将对象转成get param参数格式 eg: {a:1,b:2} => a=1&b=2
 * @param {{[p: string]: any}} params
 * @return {string}
 */
export function translateToGetParams(params): string {
  if (Object.prototype.toString.call(params) === '[object Object]') {
    return Object.keys(params).map(key => `${key}=${params[key]}&`).join('').slice(0, -1);
  }
  throw new Error('param must be type Object');
}

export function ConvertToResponseDto(res: ResponseDto) {
  const actionResponseDto = new ActionResponseDto();
  actionResponseDto.Extra = res.data;
  actionResponseDto.Message = res.msg;
  if (res.code === 200) {
    actionResponseDto.Success = true;
  } else {
    actionResponseDto.Success = false;
  }
  return actionResponseDto;
}


