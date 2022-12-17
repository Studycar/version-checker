import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';

@Injectable()
export class PricingSimulatorQueryService extends PlanscheduleHWCommonService {
  // 接口模板
  compute(dto: any): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/simulationcalcmarkup/simulation',
      dto,
    )
  }
}
