/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:39
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-12 17:32:28
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { Observable, of } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { map } from 'rxjs/internal/operators';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


/** url */
const GET_LOOK_UP_BY_TYPE = '/api/admin/workbench/listLookupByType?typeCode=';
const PS_MAKE_BUY_CODE = `${GET_LOOK_UP_BY_TYPE}PS_MAKE_BUY_CODE`;
const PS_ITEM_TYPE = `${GET_LOOK_UP_BY_TYPE}PS_ITEM_TYPE`;
const PP_MTL_ITEM_STATUS = `${GET_LOOK_UP_BY_TYPE}PP_MTL_ITEM_STATUS`;
const FND_YES_NO = `${GET_LOOK_UP_BY_TYPE}FND_YES_NO`;
const PS_MO_COMP_SUPPLY_TYPE = `${GET_LOOK_UP_BY_TYPE}PS_MO_COMP_SUPPLY_TYPE`;
const PS_ITEM_UNIT = `${GET_LOOK_UP_BY_TYPE}PS_ITEM_UNIT`;

@Injectable({
  providedIn: 'root',
})
export class MaterialMaintenanceEnumService {

  constructor(
    private commonQueryService: CommonQueryService,
    private http: _HttpClient,
  ) {
  }

  getOrganizationIds(): Observable<any[]> {
    return this.commonQueryService.GetUserPlant()
      .pipe(map(res => res.Extra.map(d => ({ label: d.plantCode, value: d.plantCode }))));
  }

  getMakeBuyCodes(): Observable<any[]> {
    return this.requestByUrl(PS_MAKE_BUY_CODE);
  }

  getItemTypes(): Observable<any[]> {
    return this.requestByUrl(PS_ITEM_TYPE);
  }

  getItemStatus(): Observable<any[]> {
    return this.requestByUrl(PP_MTL_ITEM_STATUS);
  }

  getYesNos(): Observable<any[]> {
    return this.requestByUrl(FND_YES_NO);
  }

  getWipSupplyTypes(): Observable<any[]> {
    return this.requestByUrl(PS_MO_COMP_SUPPLY_TYPE);
  }

  requestByUrl(url) {
    return this.http.get<ResponseDto>(url).pipe(
      map(res => this.mapOptions(res.data)),
    );
  }

  mapOptions(res) {
    return res.map(d => ({ label: d.meaning, value: d.lookupCode }));
  }

  getUnitOptions(): Observable<any[]> {
    return this.requestByUrl(PS_ITEM_UNIT);
  }
}
