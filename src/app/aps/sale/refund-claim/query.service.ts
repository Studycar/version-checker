import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class RefundClaimQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/refund/claim';
  public queryUrl = this.baseUrl + '/query';
  public getOneUrl = this.baseUrl + '/get';
  public getInfoUrl = this.baseUrl + '/getInfo'; // 流程表单
  private saveUrl = this.baseUrl + '/save';
  private deleteUrl = this.baseUrl + '/delete';
  private submitUrl = this.baseUrl + '/submitAudit';

  getOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getOneUrl, {
      id: id
    });
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids);
  }

  submit(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.submitUrl, ids);
  }

}