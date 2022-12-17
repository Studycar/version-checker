import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class TransferOrderQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/transfer/order';
  private baseDetailedUrl = '/api/ps/transfer/order/detailed'
  public queryUrl = this.baseUrl + '/query';
  public taskUrl = this.baseUrl + '/page/task';
  public queryDetailedUrl = this.baseDetailedUrl + '/query';
  public queryChangeDetailUrl = this.baseUrl + '/history/query';
  public queryDetailChangeDetailUrl = this.baseDetailedUrl + '/history/query';
  private getOneUrl = this.baseUrl + '/get';
  private examineUrl = this.baseUrl + '/examine';
  private getDetailedOneUrl = this.baseDetailedUrl + '/get';
  private saveUrl = this.baseUrl + '/save';
  private saveDetailedUrl = this.baseDetailedUrl + '/save';
  private deleteUrl = this.baseUrl + '/delete';
  private deleteDetailedUrl = this.baseDetailedUrl + '/delete';

  getOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getOneUrl, {
      id: id
    });
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  task(productCategory, plantCode): Observable<ResponseDto> {
    return this.http.post(this.taskUrl, {
      productCategory: productCategory,
      plantCode: plantCode,
    });
  }

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids);
  }

  examine(id: string, inWarehouseCode: string, inWarehouse: string): Observable<ResponseDto> {
    return this.http.post(this.examineUrl, {
      id,
      inWarehouseCode,
      inWarehouse
    });
  }

  getDetailedOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getDetailedOneUrl, {
      id: id
    });
  }

  saveDetailed(data): Observable<ResponseDto> {
    return this.http.post(this.saveDetailedUrl, data);
  }

  deleteDetailed(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteDetailedUrl, ids);
  }
}