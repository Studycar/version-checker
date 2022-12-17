import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

@Injectable()
export class OrderCommitmentService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  queryUrl = '/api/ps/gopOrderPromise/queryOrderPrimose';

  getSalesRegionOrSalesArea(dto: object): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/api/ps/dpCustDivision/getData',
      { ...dto }
    );
  }

  getCustomers(dto: object): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/api/ps/psCustomer/getData',
      { ...dto }
    );
  }

  /** 重新计算 */
  calculationCap(dto: any): Observable<ActionResponseDto> {
    return this.http.post('api/ps/gopOrderPromise/calculationCap', dto);
  }

  /** 产能释放 */
  releaseCap(dto: any): Observable<ActionResponseDto> {
    return this.http.post('api/ps/gopOrderPromise/releaseCap', dto);
  }

  deliveryCommitment(data: Array<object>): Observable<DeliveryCommitmentResponse> {
    return this.http.post<DeliveryCommitmentResponse>(
      '/api/ps/gopOrderPromise/save', data
    );
  }
}

export class DeliveryCommitmentResponse {
  public code: number;
  public data: any;
  public msg: string;
  // public Success: boolean;
}
