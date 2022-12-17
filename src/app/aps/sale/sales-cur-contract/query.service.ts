import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { IdeSubmitService } from 'app/modules/base_module/services/ide-submit.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { decimal } from '@shared';

@Injectable()
export class SalesCurContractQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    private ideSubmitService: IdeSubmitService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/pscontractstock';
  public queryUrl = this.baseUrl + '/getList';
  public queryChangeDetailUrl = this.baseUrl + '/history/query';
  public getOneUrl = this.baseUrl + '/queryById';
  public getOneByContractCodeUrl = this.baseUrl + '/queryByContractCode';
  public queryWithDetailsByContractCodeUrl = this.baseUrl + '/queryWithDetailsByContractCode';
  private getFormUrl = this.baseUrl + '/get';
  private saveUrl = this.baseUrl + '/saveData';
  private changeSaveUrl = this.baseUrl + '/change';
  public submitUrl = this.baseUrl + '/submit';
  private deleteUrl = this.baseUrl + '/deleteList';
  public downloadUrl = this.baseUrl + '/smartVisa';

  getOne(id: string): Observable<ResponseDto> {
    return this.http.get(this.getOneUrl + '/' + id);
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  // 变更保存
  changeSave(data): Observable<ResponseDto> {
    return this.http.post(this.changeSaveUrl, data);
  }

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids);
  }

  queryWithDetailsByContractCode(contractCode): Observable<ResponseDto> {
    return this.http.get(this.queryWithDetailsByContractCodeUrl + `/${contractCode}`);
  }
  
  goToIdeCurContractFlow(id, options) {
    const { contractCode, modalRef, businessType } = options;
    this.http.get(this.getFormUrl + `/${id}`).subscribe(res => {
      if(res.code === 200 && res.data) {
        // 转定子无需校验
        if(res.data.head.categoryCode !== '70' && res.data.body.some(item => this.priceIsNotConfirm(item))) {
          return;
        }
        const hasDiff = res.data.body.some(item => item.hasDiff);
        const params: any = {
          getFormParams: {
            url: this.getFormUrl + `/${id}`,
            method: 'get',
          },
          contractCode: contractCode,
          businessType: businessType,
        }
    
        if (modalRef && modalRef.close) {
          modalRef.close(true)
        }
        let ideFlowPath = '';
        switch (businessType) {
          case 'add':
            ideFlowPath = 'ideCurContractAdd';
            break;
        
          case 'cancel':
            ideFlowPath = 'ideCurContractCancel';
            break;
        
          case 'change':
            ideFlowPath = 'ideCurContractChange';
            break;
        
          default:
            break;
        }
        if(hasDiff) {
          ideFlowPath += 'Diff';
        }
    
        this.ideSubmitService.navigate(ideFlowPath, params)
      } else {
        return this.msgSrv.error(this.appTranslationService.translate('请求合同最新信息失败'))
      }
    });
    
  }

  priceIsNotConfirm(data) {
    const { sameDayBasePrice, basePrice, rebateMarkup } = data;
    if (!basePrice) {
      this.msgSrv.error(this.appTranslationService.translate('基价不能为0或空'));
      return true;
    }
    if (!sameDayBasePrice) {
      this.msgSrv.error(this.appTranslationService.translate('当日开盘价不能为0或空'));
      return true;
    }
    if (!rebateMarkup) {
      this.msgSrv.error(this.appTranslationService.translate('当前合同无对应返利，请先维护返利加价'));
      return true;
    }
    data.hasDiff = decimal.add(sameDayBasePrice, rebateMarkup) !== basePrice;
    return false;
  }

}
