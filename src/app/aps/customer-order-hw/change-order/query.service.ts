import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class CustomerChangeOrderQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/psChangeOrder'
  public queryUrl = this.baseUrl + '/list';
  private applyUrl = this.baseUrl +'/apply'; // 执行
  private auditUrl = this.baseUrl +'/audit'; // 评审
  private deleteUrl = this.baseUrl + '/delete'; // 删除
  private cancelUrl = this.baseUrl + '/cancel'; // 废弃
  public getUrl = this.baseUrl + '/get';
  private saveUrl = this.baseUrl + '/save';
  private saveFormUrl = this.baseUrl + '/saveForm';
  private saveBatchUrl = this.baseUrl + '/saveBatch';
  private setCusOrderStateUrl = this.baseUrl + '/setCusOrderState';

  Import(data): Observable<ResponseDto> {
    return this.http.post(this.saveBatchUrl, data);
  }

  apply(plantCode, productCategory): Observable<ResponseDto> {
    return this.http.post(this.applyUrl, {
      plantCode,
      productCategory,
    });
  }

  changeApproval(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.auditUrl, ids);
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  saveForm(data): Observable<ResponseDto> {
    return this.http.post(this.saveFormUrl, data);
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

  get(id): Observable<ResponseDto> {
    return this.http.get(this.getUrl, {
      id: id
    });
  }
}