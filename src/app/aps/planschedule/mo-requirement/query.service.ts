import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class PSMoRequirementQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/psmorequirementmanual';
  public queryUrl = this.baseUrl + '/getList';
  private getOneUrl = this.baseUrl + '/queryById';
  private saveUrl = this.baseUrl + '/saveData';
  private deleteUrl = this.baseUrl + '/deleteList';
  private importUrl = this.baseUrl + '/importData';
  private importCoatingUrl = this.baseUrl + '/importCoating';
  private saveCoatingUrl = this.baseUrl + '/saveCoating';
  private pushToSrmUrl = this.baseUrl + '/demandSummaryPush';
  private getCoatingTypeUrl = '/api/ps/psproduction/getList/getCoatingType';
  getOne(id: string): Observable<ResponseDto> {
    return this.http.get(this.getOneUrl + '/' + id);
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  saveCoating(data): Observable<ResponseDto> {
    return this.http.post(this.saveCoatingUrl, data);
  }

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids);
  }

  Import(data): Observable<ResponseDto> {
    return this.http.post(this.importUrl, data);
  }

  ImportCoating(data): Observable<ResponseDto> {
    return this.http.post(this.importCoatingUrl, data);
  }
  getCoatingType(): Observable<ResponseDto> {
    return this.http.get(this.getCoatingTypeUrl);
  }

  pushToSrm(ids, plantCode): Observable<ResponseDto> {
    return this.http.post(this.pushToSrmUrl + '?plantCode=' + plantCode, ids);
  }
}