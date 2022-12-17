import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { NzMessageService } from "ng-zorro-antd";

@Injectable()
export class SalesCurContractDetailQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    private ideSubmitService: IdeSubmitService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/pscontractstockdetail';
  public queryUrl = this.baseUrl + '/getList';
}