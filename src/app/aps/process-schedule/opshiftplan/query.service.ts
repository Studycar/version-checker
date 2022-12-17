import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';


@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  public queryUrl = '/afs/serverpsopshiftplan/OpShiftPlanServiceService/QueryAllDataTable';
  public exportUrl = '/afs/serverpsopshiftplan/OpShiftPlanServiceService/QueryAllDataTable';
  /** 搜索 /api/ps/psOperation/getData */
  // Search(dto: any): Observable<ActionResponseDto> {
  //   return this.http
  //     .post('/afs/serverpsopshiftplan/OpShiftPlanServiceService/QueryAllDataTable', {
  //       plantCode: this.nvl(dto.plantCode),
  //       lineIdsStr: this.nvl(dto.lineIdsStr),
  //       startTime: this.nvl(dto.startTime),
  //       endTime: this.nvl(dto.endTime)
  //     });
  // }
  /** 搜索 /api/ps/psOperation/getData */
  Search(dto: any): Observable<ActionResponseDto> {
    return this.http
      .post('/api/ps/psopshiftscheduledetail/queryOpPageDataTable', {
        plantCode: this.nvl(dto.plantCode),
        lineIdsStr: this.nvl(dto.lineIdsStr),
        startTime: this.nvl(dto.startTime),
        endTime: this.nvl(dto.endTime)
      });
  }



  /** 导出数据 */
  Export(dto: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopshiftplan/OpShiftPlanServiceService/QueryAllDataTable', {
        plantCode: this.nvl(dto.plantCode),
        lineIdsStr: this.nvl(dto.lineIdsStr),
        startTime: this.nvl(dto.startTime),
        endTime: this.nvl(dto.endTime)
      });
  }
}


