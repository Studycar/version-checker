import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class PendingDeliveryOrderQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/pending/delivery';
  public queryUrl = this.baseUrl + '/query';
  private getOneUrl = this.baseUrl + '/get';
  private saveUrl = this.baseUrl + '/save';
  private deleteUrl = this.baseUrl + '/delete';
  private refreshListUrl = this.baseUrl + '/page/task'; // 更新列表
  private generateUrl = this.baseUrl + '/deliveryOrder'; // 开配送单
  private confirmUrl = this.baseUrl + '/confirm'; // 确认
  private importUrl = this.baseUrl + '/importData';

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

  confirm(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.confirmUrl, {
      ids: ids
    });
  }

  generate(ids: string[], deliveryOrderDate: string): Observable<ResponseDto> {
    return this.http.post(this.generateUrl, ids, {
      deliveryOrderDate
    });
  }

  refreshList(plantCode: string): Observable<ResponseDto> {
    return this.http.post(this.refreshListUrl, {
      plantCode
    });
  }

  Import(datas): Observable<ResponseDto> {
    return this.http.post(this.importUrl, datas);
  }
}