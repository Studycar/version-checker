import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { BaseFlexValueSetsInputDto } from 'app/modules/generated_module/dtos/base-flex-value-sets-input-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { BaseFlexValueSetsManageService } from 'app/modules/generated_module/services/base-flex-value-sets-manage-service';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends CommonQueryService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    public baseFlexValueSetsManageService: BaseFlexValueSetsManageService,
  ) {
    super(http, appApiService);
  }

  public GetFlexValueSets(): Observable<any> {
    return this.baseFlexValueSetsManageService.GetFlexValueSets();
  }

  public GetFormatType(): Observable<any> {
    return this.baseFlexValueSetsManageService.GetFormatType();
  }

  public GetValidationType(): Observable<any> {
    return this.baseFlexValueSetsManageService.GetValidationType();
  }

  public Remove(dto: BaseFlexValueSetsInputDto): Observable<ResponseDto> {
    return this.baseFlexValueSetsManageService.Remove(dto);
  }

  /** 获取 是否有效 */
  public GetYesNos(language?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/servermessage/MessageService/GetLookUpType',
      {
        lookUpType: 'FND_YES_NO2',
        language: language === undefined ? '' : language,
      },
    );
  }
}
