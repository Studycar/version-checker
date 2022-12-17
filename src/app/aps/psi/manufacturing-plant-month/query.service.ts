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
  //       content: [{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2020","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030000375","itemName":"F50-21B6(线控) 电热水器 亚光白 不含混水阀和花洒 工程专供","baseCode":"","productModel":"F50-21B6(线控)","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"在销售","platform":"","dataKey":"389ef5a361aa98e51a93eb5c26ca600f","status":"","productionN1":"0","monthQtyStr":"2020-06,750;2020-07,450;2020-08,1300;2020-09,700;2020-10,200;2020-11,1360;2020-12,1250","productRatio":"","yearQtyBefore0":"5100","yearQtyBefore1":"6010","yearQtyBefore2":"0","remark":"","productQtyM1":"","productQtyM2":"","productQtyM3":"","productQtyM4":"","productQtyM5":"","productQtyM6":"750","productQtyM7":"450","productQtyM8":"1300","productQtyM9":"700","productQtyM10":"200","productQtyM11":"1360","productQtyM12":"1250"},{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2021","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030000375","itemName":"F50-21B6(线控) 电热水器 亚光白 不含混水阀和花洒 工程专供","baseCode":"","productModel":"F50-21B6(线控)","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"在销售","platform":"","dataKey":"389ef5a361aa98e51a93eb5c26ca600f","status":"","productionN1":"0","monthQtyStr":"2021-01,900;2021-04,800;2021-05,2900;2021-06,500","productRatio":"","yearQtyBefore0":"5100","yearQtyBefore1":"6010","yearQtyBefore2":"0","remark":"","productQtyM1":"900","productQtyM2":"","productQtyM3":"","productQtyM4":"800","productQtyM5":"2900","productQtyM6":"500","productQtyM7":"","productQtyM8":"","productQtyM9":"","productQtyM10":"","productQtyM11":"","productQtyM12":""},{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2020","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030000827","itemName":"F60-21WA1 电热水器 亚光白 　 不含混水阀和花洒","baseCode":"","productModel":"F60-21WA1","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"在销售","platform":"","dataKey":"b94d97d74bb799a16fb3bdfcb5d92344","status":"","productionN1":"0","monthQtyStr":"2020-06,3450;2020-07,12260;2020-08,8010;2020-09,750;2020-11,1920;2020-12,7011","productRatio":"","yearQtyBefore0":"49337","yearQtyBefore1":"33401","yearQtyBefore2":"0","remark":"","productQtyM1":"","productQtyM2":"","productQtyM3":"","productQtyM4":"","productQtyM5":"","productQtyM6":"3450","productQtyM7":"12260","productQtyM8":"8010","productQtyM9":"750","productQtyM10":"","productQtyM11":"1920","productQtyM12":"7011"},{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2021","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030000827","itemName":"F60-21WA1 电热水器 亚光白 　 不含混水阀和花洒","baseCode":"","productModel":"F60-21WA1","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"在销售","platform":"","dataKey":"b94d97d74bb799a16fb3bdfcb5d92344","status":"","productionN1":"0","monthQtyStr":"2021-01,1000;2021-02,1800;2021-03,15538;2021-04,20650;2021-05,6779;2021-06,3570","productRatio":"","yearQtyBefore0":"49337","yearQtyBefore1":"33401","yearQtyBefore2":"0","remark":"","productQtyM1":"1000","productQtyM2":"1800","productQtyM3":"15538","productQtyM4":"20650","productQtyM5":"6779","productQtyM6":"3570","productQtyM7":"","productQtyM8":"","productQtyM9":"","productQtyM10":"","productQtyM11":"","productQtyM12":""},{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2020","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030000828","itemName":"F80-21WA1 电热水器 亚光白 　 不含混水阀和花洒","baseCode":"","productModel":"F80-21WA1","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"在销售","platform":"","dataKey":"48489e3eccb12a21405867b925f20728","status":"","productionN1":"0","monthQtyStr":"2020-06,1380;2020-07,5730;2020-08,1250;2020-09,7150;2020-10,2980;2020-11,5500;2020-12,3962","productRatio":"","yearQtyBefore0":"17619","yearQtyBefore1":"27952","yearQtyBefore2":"0","remark":"","productQtyM1":"","productQtyM2":"","productQtyM3":"","productQtyM4":"","productQtyM5":"","productQtyM6":"1380","productQtyM7":"5730","productQtyM8":"1250","productQtyM9":"7150","productQtyM10":"2980","productQtyM11":"5500","productQtyM12":"3962"},{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2021","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030000828","itemName":"F80-21WA1 电热水器 亚光白 　 不含混水阀和花洒","baseCode":"","productModel":"F80-21WA1","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"在销售","platform":"","dataKey":"48489e3eccb12a21405867b925f20728","status":"","productionN1":"0","monthQtyStr":"2021-01,2186;2021-02,308;2021-03,5420;2021-04,8750;2021-05,955","productRatio":"","yearQtyBefore0":"17619","yearQtyBefore1":"27952","yearQtyBefore2":"0","remark":"","productQtyM1":"2186","productQtyM2":"308","productQtyM3":"5420","productQtyM4":"8750","productQtyM5":"955","productQtyM6":"","productQtyM7":"","productQtyM8":"","productQtyM9":"","productQtyM10":"","productQtyM11":"","productQtyM12":""},{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2020","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030001765","itemName":"F8030-A6(HEY) 电热水器 亚光白","baseCode":"","productModel":"F8030-A6(HEY)","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"制造终止","platform":"","dataKey":"ce1363d7dfc0753ee1e72c8525c909ed","status":"","productionN1":"0","monthQtyStr":"2020-07,330","productRatio":"","yearQtyBefore0":"0","yearQtyBefore1":"330","yearQtyBefore2":"0","remark":"","productQtyM1":"","productQtyM2":"","productQtyM3":"","productQtyM4":"","productQtyM5":"","productQtyM6":"","productQtyM7":"330","productQtyM8":"","productQtyM9":"","productQtyM10":"","productQtyM11":"","productQtyM12":""},{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2020","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030003045","itemName":"F50-15WB5(Y) 电热水器 极地白 不含混水阀和花洒 2100W , 机械（2）","baseCode":"","productModel":"F50-15WB5(Y)","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"在销售","platform":"","dataKey":"e9808a8d245ebf4c004ac63c1452ea39","status":"","productionN1":"0","monthQtyStr":"2020-06,940;2020-07,1880;2020-08,1930;2020-09,1780;2020-10,3380;2020-11,900;2020-12,1520","productRatio":"","yearQtyBefore0":"6553","yearQtyBefore1":"12330","yearQtyBefore2":"0","remark":"","productQtyM1":"","productQtyM2":"","productQtyM3":"","productQtyM4":"","productQtyM5":"","productQtyM6":"940","productQtyM7":"1880","productQtyM8":"1930","productQtyM9":"1780","productQtyM10":"3380","productQtyM11":"900","productQtyM12":"1520"},{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2021","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030003045","itemName":"F50-15WB5(Y) 电热水器 极地白 不含混水阀和花洒 2100W , 机械（2）","baseCode":"","productModel":"F50-15WB5(Y)","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"在销售","platform":"","dataKey":"e9808a8d245ebf4c004ac63c1452ea39","status":"","productionN1":"0","monthQtyStr":"2021-01,1900;2021-02,1273;2021-03,650;2021-04,1700;2021-05,1030","productRatio":"","yearQtyBefore0":"6553","yearQtyBefore1":"12330","yearQtyBefore2":"0","remark":"","productQtyM1":"1900","productQtyM2":"1273","productQtyM3":"650","productQtyM4":"1700","productQtyM5":"1030","productQtyM6":"","productQtyM7":"","productQtyM8":"","productQtyM9":"","productQtyM10":"","productQtyM11":"","productQtyM12":""},{"demandDate":"2021-11","demandStartTime":"2021-11-01 00:00:00","demandEndTime":"2021-11-30 23:59:59","yearNum":"2020","monthNum":"","yearNumStart":"2019","yearNumEnd":"2021","monthNumStart":"1","monthNumEnd":"12","psiMonthId":"","buCode":"30015305","buName":"厨热事业部","salesType":"内销","organizationId":"590","organizationCode":"M47","organizationName":"INV_M47_芜湖美的厨卫-电热产品制造","itemId":"","itemCode":"21051030003046","itemName":"F60-15WB5(Y) 电热水器 极地白 不含混水阀和花洒 2100W , 机械（2）","baseCode":"","productModel":"F60-15WB5(Y)","transactionId":"","transactionDate":"","productSeries":"","productCatgory":"电热","lifeCycle":"在销售","platform":"","dataKey":"f1195a1f30a3f7f798898f7f16ddf730","status":"","productionN1":"0","monthQtyStr":"2020-05,18;2020-06,11500;2020-07,30031;2020-08,10450;2020-09,37703;2020-10,38515;2020-11,4710;2020-12,20767","productRatio":"","yearQtyBefore0":"38958","yearQtyBefore1":"153694","yearQtyBefore2":"0","remark":"","productQtyM1":"","productQtyM2":"","productQtyM3":"","productQtyM4":"","productQtyM5":"18","productQtyM6":"11500","productQtyM7":"30031","productQtyM8":"10450","productQtyM9":"37703","productQtyM10":"38515","productQtyM11":"4710","productQtyM12":"20767"}],
  //       totalElements: 100,
  //     },
  //     extra: null,
  //   });
  // }

    // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sys/SopPsiProductMonth/page', dto);
  }
}
