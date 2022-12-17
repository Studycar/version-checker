import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class ProdlineItemOptimizationService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  queryUrl = '/api/ps/psitemroutingsoptimize/query';
  exportUrl = '/api/ps/psitemroutingsoptimize/export';

  dataRefresh(data: object): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psitemroutingsoptimize/submitRequestOptimize',
      {...data}
      );
  }

  processOptimization(dtos: any[], queryDto: object | null): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psitemroutingsoptimize/optimize',  dtos 
    //  {dtos, queryDto}
    );
  }

  cellValueSave(data: object): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psitemroutingsoptimize/update',
      {...data}
    );
  }
}
