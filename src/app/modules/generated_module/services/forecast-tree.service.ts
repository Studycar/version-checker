import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class ForecastTreeService {
  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) {}

  url = '/afs/serverppdemandforecast/ServerPPDemandForecast/GetData';

  getItemDataById(Id: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverppdemandforecast/ServerPPDemandForecast/GetById',
      { Id: Id }
    );
  }

  add(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverppdemandforecast/ServerPPDemandForecast/SaveForNew',
      { dto }
    );
  }

  saveEditResult(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverppdemandforecast/ServerPPDemandForecast/EditData',
      { dto }
    );
  }

  remove(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverppdemandforecast/ServerPPDemandForecast/remove',
      { dto }
    );
  }

  removeBatch(dtos: string[]): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverppdemandforecast/ServerPPDemandForecast/RemoveBath',
      { dtos }
    );
  }

  getProductOptions({ categorySetName = '', description = '' } = {}): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/afs/servercategorymanager/categorymanager/querycategorysetKenDo',
      { categorySetName: categorySetName, description: description }
    );
  }

  getCustomerOptions(fastCode: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getlookupbytype',
      { type: fastCode }
    );
  }
}
