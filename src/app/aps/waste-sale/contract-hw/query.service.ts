import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { NzMessageService, NzModalRef } from "ng-zorro-antd";
import { Observable } from "rxjs";
import { decimal } from "@shared";

@Injectable()
export class PlanscheduleHWContractService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private ideSubmitService: IdeSubmitService,
  ) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/contract'
  public queryUrl = this.baseUrl + '/query/waste';
}