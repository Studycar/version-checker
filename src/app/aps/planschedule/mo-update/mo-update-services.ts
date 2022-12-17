import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CommonQueryService,
  HttpAction,
} from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { SSL_OP_ALL } from 'constants';
import { Size } from '@progress/kendo-drawing/dist/npm/geometry';
import { Observable } from 'rxjs';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';

@Injectable()
export class MoUpdateService extends CommonQueryService {
  constructor(public http: _HttpClient, public appApiService: AppApiService) {
    super(http, appApiService);
  }

  loadDataHttpAction = {
    url: '/afs/serverpsmomanager/psmomanager/loadmolist',
    method: 'POST',
  };
  updateDataHttpAction = {
    url: '/afs/serverpsmomanager/psmomanager/updatemoearlieststarttime',
    method: 'POST',
  };

  /** 更新操作 */
  doUpdate(paramObj: any) {
    return this.http.post<ActionResponseDto>(
      this.updateDataHttpAction.url,
      paramObj,
    );
  }
}
