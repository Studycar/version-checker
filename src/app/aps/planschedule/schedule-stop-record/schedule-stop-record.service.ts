import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';

@Injectable()
export class ScheduleStopRecordService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  // CommonUrl = '/afs/serverpsplanschedule/ScheduleStopProductionService/';
  // QueryUrl = this.CommonUrl + 'GetStopRecord/';
  //seachUrl = '/api/ps/ppSafeStock/query';
  QueryUrl = '/api/ps/psstopproductionrecord/GetStopRecord';
}
