import { Injectable } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';

@Injectable()
export class QueryService extends PlanscheduleHWCommonService {
  public queryUrl = '/api/ps/psrealpurchasedemand/unMatchList';
  getVersionList(plantCode: string, coatingFlag: string): Observable<ResponseDto> {
    return this.http.get(
      '/api/ps/psrealpurchasedemand/getVersionList',
      {
        plantCode,
        coatingFlag
      },
    );
  }
}
