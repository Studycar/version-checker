import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class DeliveryOrderQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/delivery/order';
  public queryUrl = this.baseUrl + '/queryDeliveryOrderCarList';
  public bindUrl = this.baseUrl + '/car'
  private getOneUrl = this.baseUrl + '/get';
  private examineUrl = this.baseUrl + '/examine';
  private saveUrl = this.baseUrl + '/save';
  private deleteUrl = this.baseUrl + '/delete';
  private refreshSubCodeUrl = this.baseUrl + '/reloadLocationSubmitRequest';
  private computeUrl = this.baseUrl + '/page/task'; // 自动开配送单
  private importUrl = this.baseUrl + '/importCarData'
  private carUrl = this.baseUrl + '/car'; // 手动配车
  private relieveCarUrl = this.baseUrl + '/relieveCar'; // 手动解除配车
  private baseDetailedUrl = '/api/ps/delivery/order/detailed';
  private issueUrl = this.baseDetailedUrl + '/send';
  public queryDetailedUrl = this.baseDetailedUrl + '/query';
  private getDetailedOneUrl = this.baseDetailedUrl + '/get';
  private saveDetailedUrl = this.baseDetailedUrl + '/save';
  private deleteDetailedUrl = this.baseDetailedUrl + '/delete';
  public queryChangeDetailUrl = this.baseUrl + '/history/query';
  public queryDetailChangeDetailUrl = this.baseDetailedUrl + '/history/query';
  public editCarNumberUrl = this.baseUrl + '/updateCarNumber  '
  public updataUrl = this.baseUrl + '/updatePendingInfo'

  getOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getOneUrl, {
      id: id
    });
  }
  Import(data): Observable<ResponseDto> {
    return this.http.post(this.importUrl, data);
  }
  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  delete(ids: any[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids);
  }

  refreshSubCode(): Observable<ResponseDto> {
    return this.http.post(this.refreshSubCodeUrl);
  }

  issue(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.issueUrl, ids);
  }

  compute(data): Observable<ResponseDto> {
    return this.http.post(this.computeUrl, data);
  }

  match(plantCode: string): Observable<ResponseDto> {
    return this.http.post(this.computeUrl, {
      plantCode: plantCode
    });
  }

  car(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.carUrl, ids);
  }

  relieveCar(pcNums: any[]): Observable<ResponseDto> {
    return this.http.post(this.relieveCarUrl, pcNums);
  }

  examine(dtos: any[]): Observable<ResponseDto> {
    return this.http.post(this.examineUrl, dtos);
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

  bindCar(data): Observable<ResponseDto> {
    return this.http.post(this.bindUrl, data);
  }

  editCarNumber (data: any[]): Observable<ResponseDto> {
    return this.http.post(this.editCarNumberUrl, data)
  }

  updataData (data): Observable<ResponseDto> {
    return this.http.post(this.updataUrl, data)
  }

}