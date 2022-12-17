import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { EnergyConstraintsService } from '../query.service';

@Injectable()
export class ItemResourceEnergyOptimizeService extends EnergyConstraintsService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }

  public queryUrl = '/api/ps/psItemResourceEnergyOptimize/pageOptimize';
  public exportUrl = '/api/ps/psItemResourceEnergyOptimize/pageOptimize';
  private publishUrl = '/api/ps/psItemResourceEnergyOptimize/updateResourceEnergy';
  private submitRequestUrl = '/api/ps/psItemResourceEnergyOptimize/submitRequest';
  
  optimizationPublish(dtos: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.publishUrl,  dtos 
    );
  }

  submitRequest(dtos: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.submitRequestUrl,  dtos 
    );
  }
}
