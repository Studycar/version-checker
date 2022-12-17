import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class CustomerOrderQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/psCusOrder';
  public queryUrl = this.baseUrl + '/list';
  public queryChangeDetailUrl = '/api/ps/pscusorderchangehis/list';
  public saveUrl = this.baseUrl + '/save';
  private getByIdUrl = this.baseUrl + '/get';
  private importUrl = this.baseUrl + '/saveBatch';
  private acceptOrderAndAuditUrl = this.baseUrl + '/acceptOrderAndAudit'; // 接单审核
  private splitCusOrder2BranchUrl = this.baseUrl + '/splitCusOrder2Branch'; // 订单分行
  private deleteUrl = this.baseUrl + '/delete';
  private cancelUrl = this.baseUrl + '/cancel';

  getById(id: string): Observable<ResponseDto> {
    return this.http.get(this.getByIdUrl, {
      id: id
    })
  }

  Import(data): Observable<ResponseDto> {
    return this.http.post(this.importUrl, data);
  }

  edit(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  acceptOrderAndAudit(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.acceptOrderAndAuditUrl, ids);
  }

  splitCusOrder2Branch(plantCode, productCategory): Observable<ResponseDto> {
    return this.http.post(this.splitCusOrder2BranchUrl, {
      plantCode,
      productCategory,
    });
  }

  delete(ids): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, {
      ids: ids
    });
  }

  cancel(ids): Observable<ResponseDto> {
    return this.http.post(this.cancelUrl, {
      ids: ids
    });
  }
}