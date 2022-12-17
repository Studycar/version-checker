import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class PurchaseQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/purchase/demand/summary';
  public queryUrl = this.baseUrl + '/query';
  private taskUrl = this.baseUrl + '/page/task';
  private pushToSrmUrl = this.baseUrl + '/demandSummaryPush';
  private getCoatingTypeUrl = '/api/ps/psproduction/getList/getCoatingType';
  
  task(): Observable<ResponseDto> {
    return this.http.post(this.taskUrl);
  }

  pushToSrm(ids): Observable<ResponseDto> {
    return this.http.post(this.pushToSrmUrl, ids);
  }
  getCoatingType(): Observable<ResponseDto> {
    return this.http.get(this.getCoatingTypeUrl);
  }
}