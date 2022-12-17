import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CommonQueryService,
  HttpAction,
} from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';

@Injectable()
export class MakeDataService extends CommonQueryService {
  private make_data_url =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/api/admin/baseexportimport';

  constructor(public http: _HttpClient, public appApiService: AppApiService) {
    super(http, appApiService);
  }

  /**
   * @param data
   */
  public deleteData(data: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      this.make_data_url + '/delete',
      data,
    );
  }
}
