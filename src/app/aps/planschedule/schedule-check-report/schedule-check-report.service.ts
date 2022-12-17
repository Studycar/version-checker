import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';

@Injectable()
export class ScheduleCheckReportService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  MutexCommonUrl = '/afs/serverpsplanschedule/ScheduleMutexCheckService/';
  GetItemMutexUrl = this.MutexCommonUrl + 'GetItemMutex';
  GetResourceMutexUrl = this.MutexCommonUrl + 'GetResourceMutex';
  GetItemResourceMutexUrl = this.MutexCommonUrl + 'GetItemResourceMutex';
  GetResourceGroupMutexUrl = this.MutexCommonUrl + 'GetResourceGroupMutex';

  SupplyCommonUrl = '/afs/serverpsplanschedule/ScheduleSupplyCheckService/';
  GetDailySupplyCapacityUrl  = this.SupplyCommonUrl + 'GetDailySupplyCapacity';
  GetHourlyPipeRateUrl  = this.SupplyCommonUrl + 'GetHourlyPipeRate';
}
