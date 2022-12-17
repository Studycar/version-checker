import { Injectable } from '@angular/core';
import { SupplierService } from '../../../../../modules/generated_module/services/supplier-service';
import { CommonQueryService } from '../../../../../modules/generated_module/services/common-query.service';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class ParameterPassService {

  constructor(
    public http: _HttpClient,
    private commonQueryService: CommonQueryService,
    private supplierService: SupplierService,
  ) {
  }

  /**
   * 获取工厂/组织
   */
  getUserPlant(): Observable<any[] | null> {
    return this.commonQueryService.GetUserPlant().pipe(map(res => {
      if (res.Success) {
        return res.Extra.map(item => ({ label: item.PLANT_CODE, value: item.PLANT_CODE }));
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

    // return this.supplierService.GetBuyerPageList('', '').pipe(map(res => {
    //   if (res.Result.length > 0) {
    //     return res.Result.map(item => ({ label: item.FULL_NAME, value: item.EMPLOYEE_NUMBER }));
    //   } else {
    //     return null;
    //   }
    // })).catch(err => throwError(err));
  }

  /**
   * 获取计划名称
   */
  getPlanName(): Observable<any[] | null> {
    return this.http.get('/afs/ServerMrpPlanWorkbench/MrpPlanWorkbenchService/QueryPlans').pipe(map(res => {
      if (res.Success) {
        return res.Extra.map(item => ({ label: item.DESCRIPTION, value: item.PLAN_NAME }));
      } else {
        return null;
      }
    }));
  }

  /**
   *
   * @param type 请求类型
   * @param {ParameterType} parameter 参数
   */
  confirm(type, parameter: ParameterType): void {
    const { selectedBuyer, selectedOrganization, selectedItemCode, selectedPlanName } = parameter;
    /**
     * 0：MRP,1: 齐套,2：备料
     */
    switch (type) {
      case 0:
        // api selectedPlanName
        break;
      case 1:
        // api selectedOrganization
        break;
      case 2:
        // api selectedBuyer selectedOrganization selectedItemCode
        break;
    }
  }
}

export interface ParameterType {
  selectedBuyer: any;
  selectedOrganization: any;
  selectedItemCode: any;
  selectedPlanName: any;
}
