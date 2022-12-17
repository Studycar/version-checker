import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';
import { decimal } from '@shared';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Injectable()
export class SalesDistDetailedQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/sales/dist/detailed';
  public queryUrl = this.baseUrl + '/query';
  public updateContractUrl = this.baseUrl + '/updateContract';
  public refreshHasRawContractUrl = this.baseUrl + '/reloadhavecontract';
  private getOneUrl = this.baseUrl + '/get';
  private taskUrl = this.baseUrl + '/page/task';
  private computeUrl = '/api/ps/simulationcalcmarkup/submitCalcMarkupRequest';
  private matchContractUrl = '/api/ps/salesOrder/page/task';
  private saveUrl = this.baseUrl + '/save';
  private transferOrderBilledUrl = this.baseUrl + '/transferOrderBilled';
  private deleteUrl = this.baseUrl + '/delete';
  private importUrl = this.baseUrl + '/importData';
  private confirmCancelFhUrl = this.baseUrl + '/confirmCancelFh';
  private batchDeductionContractUrl = this.baseUrl + '/batchDeductionContract';
  private matchCustomOrderUrl = this.baseUrl + '/page/update/quantity/task'; // 自动分货

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids)
  }

  updateContract(batchCodes: string[]): Observable<ResponseDto> {
    return this.http.post(this.updateContractUrl, batchCodes)
  }

  refreshHasRawContract(): Observable<ResponseDto> {
    return this.http.post(this.refreshHasRawContractUrl);
  }

  confirmCancelFh(ids: string[], stockSaleFlag: 'Y' | 'N'): Observable<ResponseDto> {
    return this.http.post(this.confirmCancelFhUrl, ids, {
      stockSaleFlag
    });
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data)
  }

  transferOrderBilled(data): Observable<ResponseDto> {
    return this.http.post(this.transferOrderBilledUrl, data)
  }

  task(plantCode, warehouse): Observable<ResponseDto> {
    return this.http.post(this.taskUrl, {
      plantCode: plantCode,
      warehouseCode: warehouse
    });
  }

  compute(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.computeUrl, ids);
  }

  matchCustomOrder(id): Observable<ResponseDto> {
    return this.http.post(this.matchCustomOrderUrl, {
      id
    });
  }
  
  matchContract(id): Observable<ResponseDto> {
    return this.http.post(this.matchContractUrl, {
      id
    });
  }
  
  batchDeductionContract(id, contractCode): Observable<ResponseDto> {
    return this.http.post(this.batchDeductionContractUrl + '?contractCode=' + contractCode, id);
  }

  getOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getOneUrl, {
      id: id
    })
  }

  Import(datas): Observable<ResponseDto> {
    return this.http.post(this.importUrl, datas);
  }

  // 判断合同待分货量和批号数量是否满足条件
  combineQuantity(data, quantitySy, productCategoryOptions) {
    return new Promise<void>((resolve, reject) => {
      if(!data.contractCode) {
        resolve();
        return;
      }
      const theoreticalWeight = decimal.div(data.theoreticalWeight, 1000); // a
      quantitySy = decimal.mul(quantitySy, 1); // b
      if(theoreticalWeight <= quantitySy) {
        resolve();
        return;
      }
      const prodIndex = productCategoryOptions.findIndex(d => data.productCategory === d.value);
      if(prodIndex === -1) {
        this.msgSrv.error(this.appTranslationService.translate('找不到对应的产品大类'));
        reject();
        return;
      }
      if(decimal.minus(theoreticalWeight, quantitySy) <= Number(productCategoryOptions[prodIndex].attribute2)) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('分货数量将超出合同待分货量，是否提交？'),
          nzOnOk: () => {
            resolve();
          },
          nzOnCancel: () => {
            reject();
          },
        })
      } else {
        this.msgSrv.warning(this.appTranslationService.translate('该次分货后将超过合同可交货上限，请重新选择！'));
        reject();
      }
    })
  }

}
