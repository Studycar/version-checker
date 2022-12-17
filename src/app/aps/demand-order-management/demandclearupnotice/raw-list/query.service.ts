import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';
import { Observable } from 'rxjs';

@Injectable()
export class QueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/psorderlockraw';
  private baseUrlEx = '/api/ps/psorderlockrawtemp';
  public queryUrl = this.baseUrl + '/getList';
  private saveUrl = this.baseUrlEx + '/saveData';
  private deleteUrl = this.baseUrlEx + '/delete';
  public getRowUrl = '/api/pi/piReqOrders/queryProdMaterialList';

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  delete(dtos: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, dtos);
  }

}