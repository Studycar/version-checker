import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class ExpandedOutputRateService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  queryUrl = '/afs/ServerPocRoyalItemYield/pocRoyalItemYieldService/Query';

  save(data: {[key: string]: any}): Observable<ActionResponseDto> {
    return this.http.post(
      '/afs/ServerPocRoyalItemYield/pocRoyalItemYieldService/Save',
      data,
    );
  }

  remove(ids: string[]): Observable<ActionResponseDto> {
    return this.http.post(
      '/afs/ServerPocRoyalItemYield/pocRoyalItemYieldService/Delete',
      {Ids: ids}
    );
  }

}
