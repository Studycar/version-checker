import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class CustomerReturnQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/return';
  public queryUrl = this.baseUrl + '/query';
  private getOneUrl = this.baseUrl + '/get';
  private saveUrl = this.baseUrl + '/save';
  private deleteUrl = this.baseUrl + '/delete';
  private taskUrl = this.baseUrl + '/page/task';
  private baseDetailedUrl = '/api/ps/return/detailed';
  public queryChangeDetailUrl = this.baseUrl + '/history/query';
  public queryDetailChangeDetailUrl = this.baseDetailedUrl + '/history/query';
  private taskDetailedUrl = '/api/ps/return/detailed/page/task';
  public queryDetailedUrl = this.baseDetailedUrl + '/query';
  private getDetailedOneUrl = this.baseDetailedUrl + '/get';
  private confirmDetailedUrl = this.baseDetailedUrl + '/examine';
  private saveDetailedUrl = this.baseDetailedUrl + '/save';
  private deleteDetailedUrl = this.baseDetailedUrl + '/delete';

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

  task(plantCode): Observable<ResponseDto> {
    return this.http.post(this.taskUrl, {
      plantCode
    });
  }

  taskDetailed(plantCode): Observable<ResponseDto> {
    return this.http.post(this.taskDetailedUrl, {
      plantCode
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

  confirmDetailed(id, state): Observable<ResponseDto> {
    return this.http.post(this.confirmDetailedUrl, {
      id,
      state
    });
  }

  deleteDetailed(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteDetailedUrl, ids);
  }

}