import { Injectable } from "@angular/core";

/**
 * 废料销售模块公用服务
 */
@Injectable()
export class WasteSaleService {
  private wasteSaleTypes = ['04', '05', '07']; // 废料销售类型

  public getSaleType(arr: any[], salesOrderTypeOptions: any[]) {
    salesOrderTypeOptions.length = 0;
    if(arr && arr.length > 0) {
      arr.forEach(d => {
        // if(this.wasteSaleTypes.indexOf(d.lookupCode) > -1) {
          salesOrderTypeOptions.push({
            label: d.meaning,
            value: d.lookupCode,
            cklb: d.additionCode,
            cklbRemarks: d.attribute1,
          })
        // }
      })
    }
  }
}
