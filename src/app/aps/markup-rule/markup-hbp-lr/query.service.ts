import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";


@Injectable()
export class MarkupHbpLrQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/psmarkuphbplr';
  public queryUrl = this.baseUrl + '/list';
  public queryChangeDetailUrl = this.baseUrl + '/history/query';
  private getOneUrl = this.baseUrl + '/get';
  private saveUrl = this.baseUrl + '/save';
  private deleteUrl = this.baseUrl + '/delete';
  private importUrl = this.baseUrl + '/saveBatch';
  private updateStateUrl = this.baseUrl + '/updateState';

  getOne(id: string): Observable<ResponseDto> {
    return this.http.get(this.getOneUrl + `/${id}`);
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids);
  }

  Import(data): Observable<ResponseDto> {
    return this.http.post(this.importUrl, data);
  }
  
  updateState(ids: string[], operType: string = ''): Observable<ResponseDto> {
    return this.http.post(this.updateStateUrl, {
      ids: ids,
      operType: operType
    });
  }

}