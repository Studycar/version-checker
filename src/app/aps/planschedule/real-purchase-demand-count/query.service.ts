import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';

@Injectable()
export class QueryService extends PlanscheduleHWCommonService {
  private baseUrl = '/api/ps/psrealpurchasedemand';
  public queryUrl = this.baseUrl + '/queryAll';
  private getVersionListUrl = this.baseUrl + '/getVersionList';
  private deleteUrl = this.baseUrl + '/deleteByIds';
  private saveUrl = this.baseUrl + '/addManual';
  private submitRequestPurchaseDemandCreateUrl = this.baseUrl + '/submitRequestPurchaseDemandCreate';
  private submitRequestSend2SrmUrl = this.baseUrl + '/submitRequestSend2Srm';
  private modifyManualUpdateQtyUrl = this.baseUrl + '/modifyManualUpdateQty'; // 修改数量 -- 原材料实时采购需求汇总
  private modifyManualUpdateMeterUrl = this.baseUrl + '/modifyManualUpdateMeter'; // 修改米数 -- 胶膜实时需求汇总
  private modifyCommentsUrl = this.baseUrl + '/modifyComments'; // 修改备注
  // 接口模板
  getVersionList(plantCode: string, coatingFlag: string): Observable<ResponseDto> {
    return this.http.get(
      this.getVersionListUrl,
      {
        plantCode,
        coatingFlag
      },
    );
  }

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids);
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  modifyManualUpdateQty(id, manualUpdateQty): Observable<ResponseDto> {
    return this.http.post(this.modifyManualUpdateQtyUrl, {
      id,
      manualUpdateQty,
    });
  }

  modifyManualUpdateMeter(id, manualUpdateMeter): Observable<ResponseDto> {
    return this.http.post(this.modifyManualUpdateMeterUrl, {
      id,
      manualUpdateMeter,
    });
  }

  modifyComments(id, comments): Observable<ResponseDto> {
    return this.http.post(this.modifyCommentsUrl, {
      id,
      comments,
    });
  }

  submitRequestSend2Srm(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.submitRequestSend2SrmUrl, ids);
  }

  submitRequestPurchaseDemandCreate(plantCode: string, coatingFlag: string): Observable<ResponseDto> {
    return this.http.get(this.submitRequestPurchaseDemandCreateUrl, 
      {
        plantCode,
        coatingFlag
      }
    );
  }
}
