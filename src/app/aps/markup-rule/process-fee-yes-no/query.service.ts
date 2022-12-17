import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class ProcessFeeYesNoQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/invoice/bill';
  public queryUrl = this.baseUrl + '/query';
  private getOneUrl = this.baseUrl + '/get';
  private saveUrl = this.baseUrl + '/save';
  private deleteUrl = this.baseUrl + '/delete';

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

  Import(data): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, data);
  }

}