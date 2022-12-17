import { Injectable } from '@angular/core';
import { PsiService } from '../psi.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends PsiService {
  // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearAdjustMaster/page', dto);
    // return Observable.of({
    //   code: 200,
    //   msg: '',
    //   data: {
    //     content: [{"createdBy":"1400265627461746810","lastUpdatedBy":"1400265627461746810","creationDate":"2021-11-16 14:41:29","lastUpdateDate":"2021-11-16 14:41:29","createdByName":"ex_huaxh 华6352","lastUpdatedByName":"ex_huaxh 华6352","id":"1010","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","psiType":"1","psiStatus":"0","smltNum":"2021111600004","rsltVersion":"0","psiCode":"2021111614412972869","items":[],"targetVersion":"","isMerge":"0","lockMonth":"","isAvailableUpdate":"1","adjustMonth":"","mark":""},{"createdBy":"1400265627461746810","lastUpdatedBy":"1400265627461746810","creationDate":"2021-11-16 14:21:07","lastUpdateDate":"2021-11-16 14:21:07","createdByName":"ex_huaxh 华6352","lastUpdatedByName":"ex_huaxh 华6352","id":"1009","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","psiType":"1","psiStatus":"0","smltNum":"2021111600003","rsltVersion":"0","psiCode":"2021111614210772169","items":[],"targetVersion":"","isMerge":"0","lockMonth":"","isAvailableUpdate":"1","adjustMonth":"","mark":""},{"createdBy":"2618350","lastUpdatedBy":"2618350","creationDate":"2021-11-16 13:57:39","lastUpdateDate":"2021-11-16 13:57:39","createdByName":"ex_liuhh4 刘6352","lastUpdatedByName":"ex_liuhh4 刘6352","id":"1008","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","psiType":"2","psiStatus":"0","smltNum":"2021111500001","rsltVersion":"4","psiCode":"2021111518412372084","items":[],"targetVersion":"","isMerge":"0","lockMonth":"","isAvailableUpdate":"1","adjustMonth":"","mark":""},{"createdBy":"2618350","lastUpdatedBy":"2618350","creationDate":"2021-11-16 13:51:31","lastUpdateDate":"2021-11-16 13:51:31","createdByName":"ex_liuhh4 刘6352","lastUpdatedByName":"ex_liuhh4 刘6352","id":"1007","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","psiType":"2","psiStatus":"0","smltNum":"2021111500001","rsltVersion":"3","psiCode":"2021111518412372084","items":[],"targetVersion":"","isMerge":"0","lockMonth":"","isAvailableUpdate":"0","adjustMonth":"","mark":""},{"createdBy":"1400265627461746810","lastUpdatedBy":"1400265627461746810","creationDate":"2021-11-16 13:45:15","lastUpdateDate":"2021-11-16 13:45:15","createdByName":"ex_huaxh 华6352","lastUpdatedByName":"ex_huaxh 华6352","id":"1006","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","psiType":"1","psiStatus":"0","smltNum":"2021111600002","rsltVersion":"0","psiCode":"2021111613451572694","items":[],"targetVersion":"","isMerge":"0","lockMonth":"","isAvailableUpdate":"1","adjustMonth":"","mark":""},{"createdBy":"1400265627461746810","lastUpdatedBy":"1400265627461746810","creationDate":"2021-11-16 13:41:09","lastUpdateDate":"2021-11-16 13:41:09","createdByName":"ex_huaxh 华6352","lastUpdatedByName":"ex_huaxh 华6352","id":"1005","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","psiType":"1","psiStatus":"0","smltNum":"2021111600001","rsltVersion":"0","psiCode":"2021111613410971568","items":[],"targetVersion":"","isMerge":"0","lockMonth":"","isAvailableUpdate":"1","adjustMonth":"","mark":""},{"createdBy":"2618350","lastUpdatedBy":"2618350","creationDate":"2021-11-15 19:02:50","lastUpdateDate":"2021-11-15 19:02:50","createdByName":"ex_liuhh4 刘6352","lastUpdatedByName":"ex_liuhh4 刘6352","id":"1004","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","psiType":"2","psiStatus":"0","smltNum":"2021111500001","rsltVersion":"2","psiCode":"2021111518412372084","items":[],"targetVersion":"","isMerge":"0","lockMonth":"","isAvailableUpdate":"0","adjustMonth":"","mark":""},{"createdBy":"2618350","lastUpdatedBy":"2618350","creationDate":"2021-11-15 18:41:23","lastUpdateDate":"2021-11-15 18:41:23","createdByName":"ex_liuhh4 刘6352","lastUpdatedByName":"ex_liuhh4 刘6352","id":"1003","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","psiType":"2","psiStatus":"0","smltNum":"2021111500001","rsltVersion":"1","psiCode":"2021111518412372084","items":[],"targetVersion":"","isMerge":"0","lockMonth":"","isAvailableUpdate":"0","adjustMonth":"","mark":""},{"createdBy":"2618350","lastUpdatedBy":"2618350","creationDate":"2021-11-15 15:15:37","lastUpdateDate":"2021-11-15 15:15:37","createdByName":"ex_liuhh4 刘6352","lastUpdatedByName":"ex_liuhh4 刘6352","id":"1002","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","psiType":"1","psiStatus":"0","smltNum":"2021111500001","rsltVersion":"0","psiCode":"2021111515153771712","items":[],"targetVersion":"","isMerge":"0","lockMonth":"","isAvailableUpdate":"1","adjustMonth":"","mark":""},{"createdBy":"2618350","lastUpdatedBy":"-1","creationDate":"2021-11-15 09:29:34","lastUpdateDate":"2021-11-15 09:29:34","createdByName":"ex_liuhh4 刘6352","lastUpdatedByName":"","id":"1001","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"滚筒,波轮全自动,双桶","psiType":"3","psiStatus":"0","smltNum":"2021111200003|2021111200002|2021111000001","rsltVersion":"0","psiCode":"2021111509293472184","items":[],"targetVersion":"","isMerge":"1","lockMonth":"","isAvailableUpdate":"1","adjustMonth":"","mark":"ex_liuhh4数据更新合并标志"}],
    //     totalElements: 100,
    //   },
    //   extra: null,
    // });
  }

  // 获取PSI编码
  getPsiCodeOptions(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>('/api/sop/sopPsiYearAdjustMaster/psiCodeList');
  }

  // PSI状态
  getPsiStatusOptions(): Observable<ResponseDto> {
    // return this.http.get<ResponseDto>('/sys/sopCustomerPsiService/getData', dto);
    return Observable.of({
      code: 200,
      msg: '',
      data: [{"createdBy":"1400265627461746700","lastUpdatedBy":"-1","creationDate":"2021-10-20 16:37:04","lastUpdateDate":"2021-10-20 16:37:04","createdByName":"","lastUpdatedByName":"","lookupValueId":"191","lookupType":"SOP_YEAR_PSI_STATUS","lookupCode":"0","meaning":"版本","lookupTag":"","description":"版本","enableFlag":"Y","startDateActive":"","endDateActive":""},{"createdBy":"1400265627461746700","lastUpdatedBy":"1400265627461746700","creationDate":"2021-10-20 16:37:55","lastUpdateDate":"2021-10-22 09:37:58","createdByName":"","lastUpdatedByName":"","lookupValueId":"192","lookupType":"SOP_YEAR_PSI_STATUS","lookupCode":"1","meaning":"已发布","lookupTag":"","description":"已发布","enableFlag":"Y","startDateActive":"","endDateActive":""}],
      extra: null,
    });
  }

  // 发布
  release(dto: any): Observable<ResponseDto> {
    return this.http.put<ResponseDto>('/api/sop/sopPsiYearAdjustMaster/updateStatus', dto);
  }

  // 通过rsltVersion 和 psiCode 获取 PSI记录
  getInfo(dto: any):  Observable<ResponseDto> { // /sys/sopPsiYearAdjustMaster/2021111614412972869/0
    return this.http.get<ResponseDto>(`/api/sop/sopPsiYearAdjustMaster/${dto.psiCode}/${dto.rsltVersion}`);
  }

  // 预览
  showPsi(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearAdjust/previewList', dto);
  }

  // PSI规划指标
  getPsiKpi(dto: any):  Observable<ResponseDto> { // {"id":"1010","psiCode":"2021111614412972869","rsltVersion":"0"}
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearAdjustMaster/psiIndexList', dto);
  }

  // PSI明细调整
  getAdjustPsi(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearAdjust/list', dto);
  }

  // PSI明细调整-获取版本号
  getVersionList(dto: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(`/api/sop/sopPsiYearAdjustMaster/findAvailableVersion/${dto.psiCode}/${dto.rsltVersion}`);
  }

  // 保存
  // {"rsltVersion":"5","targetVersion":"5","isMerge":0,"mark":"","psiCode":"2021111518412372084","items":[{"createdBy":"2717401","lastUpdatedBy":"2618350","creationDate":"2021-11-16 13:57:39","lastUpdateDate":"2021-11-16 13:57:39","createdByName":"","lastUpdatedByName":"","id":"900100","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","prodAmt":"0.24406666","entitySelfPlanning":"4.6489","emptyPlanning":"0","oemPlanning":"0","prodAvgPrice":"525","entitySelfAmt":"0.2441","oemPlanningAmt":"0","pickUpGoodsNum":"3.4667","pickUpGoodsAtm":"0.182","pickUpGoodsRatio":"-0.1256","salePlanningAmt":"0.182","salePlanningRatio":"0.2957","valInvAmt":"0.39727489","selfInvAmt":"0.24644","chnlInvAmt":"0.15083489","mthAvgSaleAmt":"0.14046455","valInvSaveSaleRatio":"84.8","selfInvSaveSaleRatio":"52.6","chnlInvSaveSaleRatio":"32.2","smltNum":"2021111500001","rsltVersion":"5","channel":"1","month":"1","year":"2022","masterId":"900050","psiCode":"2021111518412372084","monthFluRatio":"","invSalesRatio":"","prodFluSd":"","originSmltNum":"2021111500001","lockMonth":"","valInvAmtLast":"0.13490584","selfInvAmtLast":"0.04665182","chnlInvAmtLast":"0.08825402","mthAvgSaleAmtLast":"0.14046455","valInvSaveSaleRatioLast":"29","selfInvSaveSaleRatioLast":"10","chnlInvSaveSaleRatioLast":"19","invRevolveMinDays":"45","invRevolveMaxDays":"60","edit":false},{"createdBy":"2717401","lastUpdatedBy":"2618350","creationDate":"2021-11-16 13:57:39","lastUpdateDate":"2021-11-16 13:57:39","createdByName":"","lastUpdatedByName":"","id":"900101","buCode":"30009804","buName":"洗衣机事业部","planPeriodMonth":"2022-01","marketCategory":"双桶","prodAmt":"0.4421854","entitySelfPlanning":"9.5504","emptyPlanning":"0","oemPlanning":"0","prodAvgPrice":"463","entitySelfAmt":"0.4422","oemPlanningAmt":"0","pickUpGoodsNum":"17.0194","pickUpGoodsAtm":"0.788","pickUpGoodsRatio":"0.024","salePlanningAmt":"0.78844","salePlanningRatio":"2.6522","valInvAmt":"0.78844","selfInvAmt":"0.58790817","chnlInvAmt":"0.20053183","mthAvgSaleAmt":"0.21587852","valInvSaveSaleRatio":"110","selfInvSaveSaleRatio":"82","chnlInvSaveSaleRatio":"28","smltNum":"2021111500001","rsltVersion":"5","channel":"2","month":"1","year":"2022","masterId":"900050","psiCode":"2021111518412372084","monthFluRatio":"","invSalesRatio":"","prodFluSd":"","originSmltNum":"2021111500001","lockMonth":"","valInvAmtLast":"0.08651139","selfInvAmtLast":"0.06450774","chnlInvAmtLast":"0.02200365","mthAvgSaleAmtLast":"0.21587852","valInvSaveSaleRatioLast":"12","selfInvSaveSaleRatioLast":"9","chnlInvSaveSaleRatioLast":"3","invRevolveMinDays":"45","invRevolveMaxDays":"60","edit":false}],"lockMonth":"","planPeriodMonth":"2022-01"}
  saveAdjustPsi(dto: any) {
    return this.http.put<ResponseDto>('/api/sop/sopPsiYearAdjustMaster/updateBatch', dto);
  }

}
