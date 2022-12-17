import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class SalesOrderQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/salesOrder';
  private baseDetailUrl = '/api/ps/salesOrderDetailed';
  public queryUrl = this.baseUrl + '/query';
  public queryDetailUrl = this.baseDetailUrl + '/query';
  public queryChangeDetailUrl = '/api/ps/salesOrderModifyRecord/query';
  public queryDetailChangeDetailUrl = '/api/ps/salesOrderDetailedModify/query';
  private getOneUrl = this.baseUrl + '/get';
  private taskUrl = this.baseDetailUrl + '/page/task';
  private computeUrl = this.baseUrl + '/page/compute';
  private saveUrl = this.baseUrl + '/save';
  private detailSaveUrl = this.baseDetailUrl + '/save';
  public getDetailedOneUrl = this.baseDetailUrl + '/get';
  private detailSaveFormUrl = this.baseDetailUrl + '/saveForm';
  private deleteUrl = this.baseUrl + '/delete';
  private deleteDetailedUrl = this.baseDetailUrl + '/delete';
  private importUrl = this.baseUrl + '/importData';
  private examineUrl = this.baseUrl + '/examine';

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids)
  }

  deleteDetailed(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteDetailedUrl, ids)
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data)
  }

  task(plantCode, productCategory): Observable<ResponseDto> {
    return this.http.post(this.taskUrl, {
      plantCode: plantCode,
      productCategory: productCategory
    });
  }

  compute(plantCode, productCategory): Observable<ResponseDto> {
    return this.http.post(this.computeUrl, {
      plantCode: plantCode,
      productCategory: productCategory
    });
  }

  detailSave(data): Observable<ResponseDto> {
    return this.http.post(this.detailSaveUrl, data)
  }

  detailSaveForm(data): Observable<ResponseDto> {
    return this.http.post(this.detailSaveFormUrl, data)
  }

  getOne(salesOrderCode: string): Observable<ResponseDto> {
    return this.http.post(this.getOneUrl, {
      salesOrderCode: salesOrderCode
    })
  }

  getDetailedOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getDetailedOneUrl, {
      id: id
    })
  }

  examine(id: string, saleFlag='Y'): Observable<ResponseDto> {
    return this.http.post(this.examineUrl + `?id=${id}&saleFlag=${saleFlag}`)
  }

  Import(datas): Observable<ResponseDto> {
    return this.http.post(this.importUrl, datas);
  }
}