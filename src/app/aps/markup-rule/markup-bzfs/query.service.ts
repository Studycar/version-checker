import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";


@Injectable()
export class MarkupElement6QueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/psmarkupbzfs';
  public queryUrl = this.baseUrl + '/getList';
  public queryChangeDetailUrl = this.baseUrl + '/history/query';
  private getOneUrl = this.baseUrl + '/queryById';
  private saveUrl = this.baseUrl + '/saveData';
  private deleteUrl = this.baseUrl + '/deleteList';
  private importUrl = this.baseUrl + '/importData';
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