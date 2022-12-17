import { Injectable } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class IdeListQueryService extends CommonQueryService {
  // 接口模板
  public queryUrl = '/api/pi/pi-ide/get-todo';
}
