import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";

@Injectable()
export class DeliveredOrderDetailPageQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/delivery/order';
  public queryUrl = this.baseUrl + '/queryDeliveryOrderCarDetail';
}