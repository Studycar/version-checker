import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class BranchCustomerOrderQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/psbranchcusorder';
  public queryUrl = this.baseUrl + '/list';
  private issueCusOrderUrl = this.baseUrl + '/issueCusOrder'; // 订单下发
  private bindUrl = this.baseUrl + '/bind'; // 绑定
  private unbindUrl = this.baseUrl + '/unbind'; // 解绑
  private refreshStatesUrl = this.baseUrl + '/refreshStates'; // 解绑
  private distributeCusOrderUrl = this.baseUrl + '/distributeCusOrder'; // 订单分配
  private matchingOnhandUrl = this.baseUrl + '/matchingOnhand'; // 匹配现货
  private distributeCusOrderManualUrl = this.baseUrl + '/distributeCusOrderManual'; // 订单分配
  private refreshUrl = this.baseUrl + '/page/task'; // 刷新
  private clearMantissaUrl = this.baseUrl + '/clearMantissa'; // 清除尾数
  private resetMantissaUrl = this.baseUrl + '/resetMantissa'; // 重置尾数

  public issueCusOrder(ids): Observable<ResponseDto> {
    return this.http.post(this.issueCusOrderUrl, {
      ids: ids
    })
  }

  refresh(plantCode, productCategory): Observable<ResponseDto> {
    return this.http.post(this.refreshUrl, {
      plantCode,
      productCategory
    });
  }

  public bind(ids): Observable<ResponseDto> {
    return this.http.post(this.bindUrl, ids);
  }

  public unbind(bindindNums): Observable<ResponseDto> {
    return this.http.post(this.unbindUrl, bindindNums);
  }

  public refreshStates(ids): Observable<ResponseDto> {
    return this.http.post(this.refreshStatesUrl, ids);
  }

  public distributeCusOrder(productCategory): Observable<ResponseDto> {
    return this.http.post(this.distributeCusOrderUrl, productCategory)
  }

  public matchingOnhand(productCategory): Observable<ResponseDto> {
    return this.http.post(this.matchingOnhandUrl, productCategory)
  }

  public distributeCusOrderManual(plantCode, ids): Observable<ResponseDto> {
    return this.http.post(this.distributeCusOrderManualUrl, {
      plantCode: plantCode,
      ids: ids
    })
  }

  public clearMantissa(ids): Observable<ResponseDto> {
    return this.http.post(this.clearMantissaUrl, ids)
  }

  public resetMantissa(ids): Observable<ResponseDto> {
    return this.http.post(this.resetMantissaUrl, ids)
  }

}