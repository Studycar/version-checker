import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class CustomerOrderReviewQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/psorderreceiving1'
  public queryUrl = this.baseUrl + '/list';
  private getUrl = this.baseUrl + '/get';
  private deleteUrl = this.baseUrl + '/delete';
  private saveUrl = this.baseUrl + '/save';
  private saveBatchUrl = this.baseUrl + '/saveBatch';

  Import(data): Observable<ResponseDto> {
    return this.http.post(this.saveBatchUrl, data);
  }

  get(id): Observable<ResponseDto> {
    return this.http.get(this.getUrl, {
      id: id
    });
  }
  
  delete(ids): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, {
      ids: ids
    });
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }
}