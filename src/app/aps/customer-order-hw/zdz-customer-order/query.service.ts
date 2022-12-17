import { Injectable } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';

@Injectable()
export class QueryService extends PlanscheduleHWCommonService {
  private baseUrl = '/api/ps/psbranchcusorder';
  public queryUrl = this.baseUrl + '/list';
  public saveUrl = this.baseUrl + '/save';
  private getByIdUrl = this.baseUrl + '/get';
  private importUrl = this.baseUrl + '/saveBatch';
  private deleteUrl = this.baseUrl + '/delete';
  private issueCusOrderUrl = this.baseUrl + '/issueCusOrderZdz'; // 订单下发

  getById(id: string): Observable<ResponseDto> {
    return this.http.get(this.getByIdUrl, {
      id: id
    })
  }

  Import(data): Observable<ResponseDto> {
    return this.http.post(this.importUrl, data);
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  delete(ids): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids);
  }
  
  public issueCusOrder(ids): Observable<ResponseDto> {
    return this.http.post(this.issueCusOrderUrl, {
      ids: ids
    })
  }
}
