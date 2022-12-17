import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class InvoiceOrderQueryService extends PlanscheduleHWCommonService {
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
  private taskUrl = this.baseUrl + '/page/task';
  private baseDetailedUrl = '/api/ps/invoice/bill/detailed';
  public queryChangeDetailUrl = this.baseUrl + '/history/query';
  public queryDetailChangeDetailUrl = this.baseDetailedUrl + '/history/query';
  public queryDetailedUrl = this.baseDetailedUrl + '/query';
  private getDetailedOneUrl = this.baseDetailedUrl + '/get';
  private saveDetailedUrl = this.baseDetailedUrl + '/save';
  private deleteDetailedUrl = this.baseDetailedUrl + '/delete';
  private importUrl = this.baseDetailedUrl + '/importData';
  private examineUrl = this.baseUrl + '/examine';

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

  examine(id: string): Observable<ResponseDto> {
    return this.http.post(this.examineUrl + `?id=${id}`)
  }
  
  Import(data): Observable<ResponseDto> {
    return this.http.post(this.importUrl, data);
  }

  task(plantCode, productCategory): Observable<ResponseDto> {
    return this.http.post(this.taskUrl, {
      plantCode: plantCode,
      productCategory: productCategory
    });
  }

}