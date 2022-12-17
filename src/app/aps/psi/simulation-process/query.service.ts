import { Injectable } from '@angular/core';
import { PsiService } from '../psi.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends PsiService {
  // 获取数据
  // getData(dto): Observable<ResponseDto> {
  //   // return this.http.get<ResponseDto>('/sys/sopCustomerPsiService/getData', dto);
  //   return Observable.of({
  //     code: 200,
  //     msg: '',
  //     data: {
  //       content: [{"createdBy":"148619","lastUpdatedBy":"148619","creationDate":"2021-11-22 18:29:02","lastUpdateDate":"2021-11-22 18:29:02","createdByName":"huangqt 黄4893","lastUpdatedByName":"huangqt 黄4893","smltId":"900052","smltNum":"2021112200003","planPeriodMonth":"2021-10","yearNum":"2021","buCode":"30009804","buName":"洗衣机事业部","marketCategory":"单桶","buTotalAmount":"13.27","paramVersion":"1","status":"3","psiCode":"","smltRandCount":"1","smltStartTime":"2021-11-22 18:29:02","smltEndTime":"2021-11-22 18:29:02","smltMsg":"年度PSI模拟品类[单桶]-自有库存(线上)月份[2021-10]数据不存在","userId":"148619","userCode":"huangqt","userName":"黄4893"},{"createdBy":"148619","lastUpdatedBy":"148619","creationDate":"2021-11-22 17:26:38","lastUpdateDate":"2021-11-22 17:26:38","createdByName":"huangqt 黄4893","lastUpdatedByName":"huangqt 黄4893","smltId":"900051","smltNum":"2021112200002","planPeriodMonth":"2021-10","yearNum":"2021","buCode":"30009804","buName":"洗衣机事业部","marketCategory":"单桶","buTotalAmount":"13.27","paramVersion":"0","status":"3","psiCode":"","smltRandCount":"1","smltStartTime":"2021-11-22 17:26:38","smltEndTime":"2021-11-22 17:26:38","smltMsg":"年度PSI模拟品类[单桶]-自有库存(线上)月份[2021-10]数据不存在","userId":"148619","userCode":"huangqt","userName":"黄4893"},{"createdBy":"148619","lastUpdatedBy":"148619","creationDate":"2021-11-22 14:43:53","lastUpdateDate":"2021-11-22 14:43:53","createdByName":"huangqt 黄4893","lastUpdatedByName":"huangqt 黄4893","smltId":"900050","smltNum":"2021112200001","planPeriodMonth":"2021-10","yearNum":"2021","buCode":"30009804","buName":"洗衣机事业部","marketCategory":"单桶","buTotalAmount":"13.27","paramVersion":"0","status":"3","psiCode":"","smltRandCount":"1","smltStartTime":"2021-11-22 14:43:53","smltEndTime":"2021-11-22 14:43:53","smltMsg":"年度PSI模拟品类[单桶]-自有库存(线上)月份[2021-10]数据不存在","userId":"148619","userCode":"huangqt","userName":"黄4893"},{"createdBy":"-1","lastUpdatedBy":"-1","creationDate":"2021-10-16 11:07:41","lastUpdateDate":"2021-10-16 11:07:41","createdByName":"","lastUpdatedByName":"","smltId":"475","smltNum":"2021101600002","planPeriodMonth":"2021-10","yearNum":"2021","buCode":"30009804","buName":"洗衣机事业部","marketCategory":"单桶","buTotalAmount":"13.27","paramVersion":"0","status":"3","psiCode":"","smltRandCount":"1","smltStartTime":"2021-10-16 11:07:41","smltEndTime":"2021-10-16 11:07:41","smltMsg":"年度PSI模拟品类[单桶]计划期月份[2021-10]-月度出仓比率(线上),月份比率总和应等于1","userId":"2618350","userCode":"ex_liuhh4","userName":"刘8122"},{"createdBy":"-1","lastUpdatedBy":"-1","creationDate":"2021-10-16 10:45:35","lastUpdateDate":"2021-10-16 10:45:35","createdByName":"","lastUpdatedByName":"","smltId":"474","smltNum":"2021101600001","planPeriodMonth":"2021-10","yearNum":"2021","buCode":"30009804","buName":"洗衣机事业部","marketCategory":"单桶","buTotalAmount":"13.27","paramVersion":"0","status":"3","psiCode":"","smltRandCount":"1","smltStartTime":"2021-10-16 10:45:35","smltEndTime":"2021-10-16 10:45:35","smltMsg":"年度PSI模拟品类[单桶]计划期月份[2021-10]-月度出仓比率(线上),月份比率总和应等于1","userId":"2618350","userCode":"ex_liuhh4","userName":"刘8122"}],
  //       totalElements: 100,
  //     },
  //     extra: null,
  //   });
  // }

  // 查看日志
  
    // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearSmlt/page', dto);
  }
  
  // 获取日志
  getSmltLog(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearSmlt/pageSmltLog', dto);
    // return Observable.of({
    //   code: 200,
    //   msg: '',
    //   data: {
    //     content: [{"seqId":"901637","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-新增模拟,smltId=900051,smltNum=2021112200002,slmtData={\"buCode\":\"30009804\",\"buName\":\"洗衣机事业部\",\"createdBy\":148619,\"lastUpdatedBy\":148619,\"marketCategory\":\"单桶\",\"paramVersion\":\"0\",\"planPeriodMonth\":\"2021-10\",\"psiCode\":\"\",\"smltId\":900051,\"smltMsg\":\"\",\"smltNum\":\"2021112200002\",\"smltRandCount\":1,\"smltStartTime\":1637573198491,\"status\":0,\"userCode\":\"huangqt\",\"userId\":148619,\"userName\":\"黄4893\",\"yearNum\":2021}"},{"seqId":"901638","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-登记模拟品类,smltId=900051,smltNum=2021112200002,catData=[{\"creationDate\":1637573198505,\"lastUpdateDate\":1637573198505,\"marketCategory\":\"单桶\",\"smltCatId\":900002,\"smltId\":900051,\"smltNum\":\"2021112200002\"}]"},{"seqId":"901639","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-登记模拟参数,smltId=900051,smltNum=2021112200002,parmData=[{\"buCode\":\"30009804\",\"buName\":\"洗衣机事业部\",\"buTotalAmount\":13.27,\"categoryTotalAmount\":10.4,\"createdBy\":-1,\"creationDate\":1637573198527,\"invRevolveMaxDays\":60,\"invRevolveMinDays\":45,\"invSalesRatio\":14.9,\"lastUpdateDate\":1637573198527,\"lastUpdatedBy\":-1,\"marketCategory\":\"单桶\",\"monthFluRatio\":10,\"originPlanningAmount\":4.6,\"paramVersion\":\"0\",\"planPeriodMonth\":\"2021-10\",\"planningAmount\":4.6,\"planningRatio\":34.66,\"prodFluSd\":0.8,\"saleChannel\":\"2\",\"salesType\":\"内销\",\"smltId\":900051,\"smltNum\":\"2021112200002\",\"smltParamId\":900004,\"yearNum\":2021},{\"buCode\":\"30009804\",\"buName\":\"洗衣机事业部\",\"buTotalAmount\":13.27,\"categoryTotalAmount\":10.4,\"createdBy\":-1,\"creationDate\":1637573198527,\"invRevolveMaxDays\":60,\"invRevolveMinDays\":45,\"invSalesRatio\":13.9,\"lastUpdateDate\":1637573198527,\"lastUpdatedBy\":-1,\"marketCategory\":\"单桶\",\"monthFluRatio\":10,\"originPlanningAmount\":5.8,\"paramVersion\":\"0\",\"planPeriodMonth\":\"2021-10\",\"planningAmount\":5.8,\"planningRatio\":43.71,\"prodFluSd\":0.8,\"saleChannel\":\"1\",\"salesType\":\"内销\",\"smltId\":900051,\"smltNum\":\"2021112200002\",\"smltParamId\":900005,\"userCode\":\"ex_liuhh4\",\"userId\":2618350,\"userName\":\"刘8122\",\"yearNum\":2021}]"},{"seqId":"901640","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-登记模拟任务,smltId=900051,smltNum=2021112200002,taskData=[{\"buCode\":\"30009804\",\"buName\":\"洗衣机事业部\",\"createdBy\":148619,\"creationDate\":1637573198548,\"lastUpdateDate\":1637573198548,\"lastUpdatedBy\":148619,\"marketCategory\":\"单桶\",\"planPeriodMonth\":\"2021-10\",\"smltCatId\":900002,\"smltId\":900051,\"smltNum\":\"2021112200002\",\"smltRandCount\":1,\"smltStartTime\":1637573198548,\"smltTaskId\":900002,\"status\":0,\"taskVersion\":0,\"userCode\":\"huangqt\",\"userId\":148619,\"userName\":\"黄4893\",\"yearNum\":2021}]"},{"seqId":"901641","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-更新模拟,smltId=900051,smltNum=2021112200002,buTotalAmount=13.27"},{"seqId":"901642","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-生成模拟任务-执行开始,smltId=900051,smltNum=2021112200002,startTIme=2021-11-22 17:26:38"},{"seqId":"901643","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-更新模拟-更新状态成功,smltId=900051,smltNum=2021112200002,status=2,smltStartTime=2021-11-22 17:26:38,smltEndTime=null,smltMsg=null"},{"seqId":"901644","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-模拟任务流程-执行成功-[{INV_REVOLVE-1000-获取库存周转天数}],smltId={900051},smltNum={2021112200002},smltTaskId={900002},rsltData=[{\"hasOfflineChannel\":true,\"hasOnlineChannel\":true,\"marketCategory\":\"单桶\",\"offInvRevolveMaxDays\":60,\"offInvRevolveMinDays\":45,\"onlInvRevolveMaxDays\":60,\"onlInvRevolveMinDays\":45,\"sopPsiYearSmltParmMap\":{\"1\":{\"buCode\":\"30009804\",\"buName\":\"洗衣机事业部\",\"buTotalAmount\":13.27,\"categoryTotalAmount\":10.4,\"createdBy\":-1,\"creationDate\":1637573198000,\"invRevolveMaxDays\":60,\"invRevolveMinDays\":45,\"invSalesRatio\":13.9,\"lastUpdateDate\":1637573198000,\"lastUpdatedBy\":-1,\"marketCategory\":\"单桶\",\"monthFluRatio\":10,\"originPlanningAmount\":5.8,\"paramVersion\":\"0\",\"planPeriodMonth\":\"2021-10\",\"planningAmount\":5.8,\"planningRatio\":43.71,\"prodFluSd\":0.8,\"saleChannel\":\"1\",\"salesType\":\"内销\",\"smltId\":900051,\"smltNum\":\"2021112200002\",\"smltParamId\":900005,\"userCode\":\"ex_liuhh4\",\"userId\":2618350,\"userName\":\"刘8122\",\"yearNum\":2021},\"2\":{\"buCode\":\"30009804\",\"buName\":\"洗衣机事业部\",\"buTotalAmount\":13.27,\"categoryTotalAmount\":10.4,\"createdBy\":-1,\"creationDate\":1637573198000,\"invRevolveMaxDays\":60,\"invRevolveMinDays\":45,\"invSalesRatio\":14.9,\"lastUpdateDate\":1637573198000,\"lastUpdatedBy\":-1,\"marketCategory\":\"单桶\",\"monthFluRatio\":10,\"originPlanningAmount\":4.6,\"paramVersion\":\"0\",\"planPeriodMonth\":\"2021-10\",\"planningAmount\":4.6,\"planningRatio\":34.66,\"prodFluSd\":0.8,\"saleChannel\":\"2\",\"salesType\":\"内销\",\"smltId\":900051,\"smltNum\":\"2021112200002\",\"smltParamId\":900004,\"yearNum\":2021}}}],paramObj=[{\"buCode\":\"30009804\",\"buName\":\"洗衣机事业部\",\"createdBy\":148619,\"creationDate\":1637573198000,\"lastUpdateDate\":1637573198000,\"lastUpdatedBy\":148619,\"marketCategory\":\"单桶\",\"planPeriodMonth\":\"2021-10\",\"smltCatId\":900002,\"smltId\":900051,\"smltNum\":\"2021112200002\",\"smltRandCount\":1,\"smltStartTime\":1637573198000,\"smltTaskId\":900002,\"status\":0,\"taskVersion\":0,\"userCode\":\"huangqt\",\"userId\":148619,\"userName\":\"黄4893\",\"yearNum\":2021}]"},{"seqId":"901645","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-模拟任务流程-执行失败-[{AVG_INV_SELF-1110-(自有)获取过去12个月月末平均库存}],smltId={900051},smltNum={2021112200002},smltTaskId={900002},errMsg={年度PSI模拟品类[单桶]-自有库存(线上)月份[2021-10]数据不存在},paramObj=[{\"buCode\":\"30009804\",\"buName\":\"洗衣机事业部\",\"createdBy\":148619,\"creationDate\":1637573198000,\"lastUpdateDate\":1637573198000,\"lastUpdatedBy\":148619,\"marketCategory\":\"单桶\",\"planPeriodMonth\":\"2021-10\",\"smltCatId\":900002,\"smltId\":900051,\"smltNum\":\"2021112200002\",\"smltRandCount\":1,\"smltStartTime\":1637573198000,\"smltTaskId\":900002,\"status\":0,\"taskVersion\":0,\"userCode\":\"huangqt\",\"userId\":148619,\"userName\":\"黄4893\",\"yearNum\":2021}]"},{"seqId":"901646","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-生成模拟任务-执行失败,smltId=900051,smltNum=2021112200002,errMsg=年度PSI模拟品类[单桶]-自有库存(线上)月份[2021-10]数据不存在"},{"seqId":"901647","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-更新模拟-更新状态成功,smltId=900051,smltNum=2021112200002,status=3,smltStartTime=2021-11-22 17:26:38,smltEndTime=2021-11-22 17:26:38,smltMsg=年度PSI模拟品类[单桶]-自有库存(线上)月份[2021-10]数据不存在"},{"seqId":"901648","processId":"","processNum":"2021112200002","programCode":"system","logDate":"2021-11-22 17:26:38","logMessage":"年度PSI模拟-生成模拟任务-执行结束,smltId=900051,smltNum=2021112200002,endTIme=2021-11-22 17:26:38"}],
    //     totalElements: 100,
    //   },
    //   extra: null,
    // });
  }

  // 获取导出参数
  getExportParams(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearSmlt/exportData', dto);
  }

  // 获取状态列表
  getStatusOptions(): Observable<ResponseDto> { // { buCode, marketCategory, planPeriodMonth }
    // return this.http.get<ResponseDto>('/sys/sopCustomerPsiService/getData', dto);
    return Observable.of({
      code: 200,
      msg: '',
      data:   [{"createdBy":"1400265627461746700","lastUpdatedBy":"1400265627461746700","creationDate":"2021-10-09 14:21:45","lastUpdateDate":"2021-10-09 14:22:26","createdByName":"","lastUpdatedByName":"","lookupValueId":"186","lookupType":"SOP_SMLT_STATUS","lookupCode":"0","meaning":"初始","lookupTag":"","description":"初始","enableFlag":"Y","startDateActive":"","endDateActive":""},{"createdBy":"1400265627461746700","lastUpdatedBy":"-1","creationDate":"2021-10-09 14:22:43","lastUpdateDate":"2021-10-09 14:22:43","createdByName":"","lastUpdatedByName":"","lookupValueId":"187","lookupType":"SOP_SMLT_STATUS","lookupCode":"1","meaning":"成功","lookupTag":"","description":"成功","enableFlag":"Y","startDateActive":"","endDateActive":""},{"createdBy":"1400265627461746700","lastUpdatedBy":"-1","creationDate":"2021-10-09 14:22:55","lastUpdateDate":"2021-10-09 14:22:55","createdByName":"","lastUpdatedByName":"","lookupValueId":"188","lookupType":"SOP_SMLT_STATUS","lookupCode":"2","meaning":"运行中","lookupTag":"","description":"运行中","enableFlag":"Y","startDateActive":"","endDateActive":""},{"createdBy":"1400265627461746700","lastUpdatedBy":"-1","creationDate":"2021-10-09 14:23:04","lastUpdateDate":"2021-10-09 14:23:04","createdByName":"","lastUpdatedByName":"","lookupValueId":"189","lookupType":"SOP_SMLT_STATUS","lookupCode":"3","meaning":"失败","lookupTag":"","description":"失败","enableFlag":"Y","startDateActive":"","endDateActive":""},{"createdBy":"1400265627461746700","lastUpdatedBy":"-1","creationDate":"2021-10-09 14:23:13","lastUpdateDate":"2021-10-09 14:23:13","createdByName":"","lastUpdatedByName":"","lookupValueId":"190","lookupType":"SOP_SMLT_STATUS","lookupCode":"4","meaning":"关闭","lookupTag":"","description":"关闭","enableFlag":"Y","startDateActive":"","endDateActive":""}],
      extra: null,
    });
  }

  // 保存
  save(dto): Observable<ResponseDto> {
    const dtoTest = {
      "smltId" : "900000",
      "smltNum" : "2021112000001",
      "planPeriodMonth" : "2021-11",
      "yearNum" : "2021",
      "businessUnitCode" : "30015305",
      "businessUnit" : "厨房和热水事业部",
      "marketCategory" : "洗碗机",
      "buTotalAmount" : "35.47",
      "paramVersion" : "0",
      "status" : "3",
      "psiCode" : "",
      "smltRandCount" : "1",
      "smltStartTime" : "2021-11-20 16:07:42",
      "smltEndTime" : "2021-11-20 16:07:57",
      "smltMsg" : "年度PSI模拟-品类[洗碗机]渠道[线下]模拟共尝试200次,检查不通过导致失败.详细原因: [CHK_AVG_YEAR_INV-3220-库存收入比检查]不通过, 库存收入比(年度库存均值[0.69894068],年度收入[4.6],计算值[15.19],设置值[14.9])"
    };
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearSmlt', dtoTest);
  }
}
