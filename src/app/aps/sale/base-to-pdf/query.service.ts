import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';

@Injectable()
export class QueryService extends PlanscheduleHWCommonService {
  // 接口模板
  test(dto: any): Observable<ResponseDto> {
    return this.http.get(
      '请求地址',
      dto,
    )
  }
}
