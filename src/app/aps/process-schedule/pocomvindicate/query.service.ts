import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class QueryService extends CommonQueryService {
  excUrl = '/afs/serverpsopcomvindicate/psopcomvindicate/ExportInfo';
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    public msgSrv: NzMessageService,
  ) {
    super(http, appApiService);
  }
}
