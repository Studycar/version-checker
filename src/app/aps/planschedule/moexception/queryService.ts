import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { SSL_OP_ALL } from 'constants';
import { Size } from '@progress/kendo-drawing/dist/npm/geometry';
import { Observable } from 'rxjs';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()

export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
  ) {
    super(http, appApiService);
  }
  queryUrl = '/api/ps/psmoexceptionmsg/querynew';
  // 通过版本号找例外接口
  queryByVersionUrl = '/api/ps/psmoexceptionmsg/queryByVersion';
  exportUrl = '/api/ps/psmoexceptionmsg/exportnew';
  /** 例外生成请求 */
  SubmitRequest_Exception(plantCode: string, scheduleGroupCode: string, resourceCode: string): Observable<ResponseDto> {
    return this.http.post('/api/ps/psmoexceptionmsg/submitrequestexception', {
        plantCode: plantCode,
        scheduleGroupCode: scheduleGroupCode,
        resourceCode: resourceCode
      });
  }
  /** 根据工单号获取工序簇 */
  GetMoLevelNew(MAKE_ORDER_NUM: string, dealLevel: boolean = true, isExpand: boolean = true): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/GetMoLevelNew', {
        MAKE_ORDER_NUM: MAKE_ORDER_NUM,
        dealLevel: dealLevel,
        isExpand: isExpand
      });
  }
}
