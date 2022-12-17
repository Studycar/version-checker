/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2021-03-04 16:23:06
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-11 14:57:39
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NzMessageService } from 'ng-zorro-antd';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ComVindicateService  } from '../../../modules/generated_module/services/comvindicate-service';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
@Injectable()
export class EditService extends CommonQueryService {
  queryUrl = '/afs/serverpscomvindicate/pscomvindicate/query';
  expUrl = '/api/ps/pscomvindicate/export';
  queryMoComUrl = '/api/ps/pscomvindicate/pageQuery';
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    public msgSrv: NzMessageService,
    public comVindicateService: ComVindicateService,
    // private tokenService: TokenService,
  ) {
    super(http, appApiService);
  }
}
