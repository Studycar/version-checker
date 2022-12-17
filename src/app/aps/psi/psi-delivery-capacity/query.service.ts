import { Injectable } from "@angular/core";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { Observable } from "rxjs";
import { PsiService } from "../psi.service";

@Injectable()
export class QueryService extends PsiService {

  public queryUrl = '/api/sop/sopSellPlan/page';
  private saveUrl = '/api/sop/sopSellPlan/save';
  private deleteUrl = '/api/sop/sopSellPlan/delete';
  private getByIdUrl = '/api/sop/sopSellPlan/getById';

  getById(id:string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.getByIdUrl,
      { id: id }
    )
  }

  save(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.saveUrl,
      dto
    )
  }

  delete(id: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.deleteUrl,
      id
    )
  }

  getData(dto): Observable<ResponseDto> {
    return Observable.of({
      code: 200,
      msg: '',
      data: {
        content: [
          {
            "createdBy": "2618350",
            "lastUpdatedBy": "2618350",
            "creationDate": "2021-11-25 14:20:15",
            "lastUpdateDate": "2021-11-25 14:20:15",
            "createdByName": "ex_liuhh4 刘5571",
            "lastUpdatedByName": "ex_liuhh4 刘5571",
            "id": "900014",
            "buName": "洗衣机事业部",
            "buCode": "30009804",
            "organizationId": "",
            "storeId": "",
            "type": "BASE",
            "organizationCode": "",
            "organizationName": "",
            "typeValue": "S4C46A1110",
            "planYear": "2021",
            "planMonth01": "1000",
            "planMonth02": "1000",
            "planMonth03": "1000",
            "planMonth04": "1000",
            "planMonth05": "1000",
            "planMonth06": "1000",
            "planMonth07": "1000",
            "planMonth08": "1000",
            "planMonth09": "1000",
            "planMonth10": "1000",
            "planMonth11": "1000",
            "planMonth12": "1000",
            "descriptions": ""
          },
          {
            "createdBy": "2618350",
            "lastUpdatedBy": "2618350",
            "creationDate": "2021-11-25 16:59:55",
            "lastUpdateDate": "2021-11-25 16:59:55",
            "createdByName": "ex_liuhh4 刘5571",
            "lastUpdatedByName": "ex_liuhh4 刘5571",
            "id": "900018",
            "buName": "洗衣机事业部",
            "buCode": "30009804",
            "organizationId": "",
            "storeId": "",
            "type": "BASE",
            "organizationCode": "",
            "organizationName": "",
            "typeValue": "STC32E3320",
            "planYear": "2021",
            "planMonth01": "5000",
            "planMonth02": "5000",
            "planMonth03": "5000",
            "planMonth04": "5000",
            "planMonth05": "5000",
            "planMonth06": "5000",
            "planMonth07": "5000",
            "planMonth08": "5000",
            "planMonth09": "5000",
            "planMonth10": "5000",
            "planMonth11": "5000",
            "planMonth12": "5000",
            "descriptions": ""
          },
          {
            "createdBy": "2618350",
            "lastUpdatedBy": "2618350",
            "creationDate": "2021-11-25 17:01:19",
            "lastUpdateDate": "2021-11-25 17:01:19",
            "createdByName": "ex_liuhh4 刘5571",
            "lastUpdatedByName": "ex_liuhh4 刘5571",
            "id": "900019",
            "buName": "洗衣机事业部",
            "buCode": "30009804",
            "organizationId": "",
            "storeId": "",
            "type": "PLANT",
            "organizationCode": "",
            "organizationName": "",
            "typeValue": "M72",
            "planYear": "2021",
            "planMonth01": "2000",
            "planMonth02": "2000",
            "planMonth03": "2000",
            "planMonth04": "2000",
            "planMonth05": "2000",
            "planMonth06": "2000",
            "planMonth07": "2000",
            "planMonth08": "2000",
            "planMonth09": "2000",
            "planMonth10": "2000",
            "planMonth11": "2000",
            "planMonth12": "2000",
            "descriptions": "INV_M72_无锡小天鹅股份_制造"
          },
          {
            "createdBy": "2618350",
            "lastUpdatedBy": "2618350",
            "creationDate": "2021-11-25 16:59:00",
            "lastUpdateDate": "2021-11-26 11:28:21",
            "createdByName": "ex_liuhh4 刘5571",
            "lastUpdatedByName": "ex_liuhh4 刘5571",
            "id": "900017",
            "buName": "洗衣机事业部",
            "buCode": "30009804",
            "organizationId": "",
            "storeId": "",
            "type": "BASE",
            "organizationCode": "",
            "organizationName": "",
            "typeValue": "STC34A1110",
            "planYear": "2021",
            "planMonth01": "22300",
            "planMonth02": "22000",
            "planMonth03": "22000",
            "planMonth04": "18000",
            "planMonth05": "18000",
            "planMonth06": "27000",
            "planMonth07": "22000",
            "planMonth08": "22000",
            "planMonth09": "20000",
            "planMonth10": "20000",
            "planMonth11": "25000",
            "planMonth12": "22000",
            "descriptions": ""
          },
          {
            "createdBy": "2716982",
            "lastUpdatedBy": "2716982",
            "creationDate": "2021-11-23 17:50:53",
            "lastUpdateDate": "2021-11-23 17:50:53",
            "createdByName": "zhouren4 周4893",
            "lastUpdatedByName": "zhouren4 周4893",
            "id": "900001",
            "buName": "洗衣机事业部",
            "buCode": "30009804",
            "organizationId": "",
            "storeId": "",
            "type": "BASE",
            "organizationCode": "",
            "organizationName": "",
            "typeValue": "SXC34A1180",
            "planYear": "2021",
            "planMonth01": "1111",
            "planMonth02": "",
            "planMonth03": "2222",
            "planMonth04": "",
            "planMonth05": "",
            "planMonth06": "",
            "planMonth07": "",
            "planMonth08": "",
            "planMonth09": "",
            "planMonth10": "",
            "planMonth11": "",
            "planMonth12": "",
            "descriptions": ""
          },
          {
            "createdBy": "2716982",
            "lastUpdatedBy": "2716982",
            "creationDate": "2021-11-23 18:03:01",
            "lastUpdateDate": "2021-11-23 18:03:01",
            "createdByName": "zhouren4 周4893",
            "lastUpdatedByName": "zhouren4 周4893",
            "id": "900003",
            "buName": "洗衣机事业部",
            "buCode": "30009804",
            "organizationId": "",
            "storeId": "",
            "type": "BASE",
            "organizationCode": "",
            "organizationName": "",
            "typeValue": "SXC32E3311",
            "planYear": "2022",
            "planMonth01": "5464",
            "planMonth02": "",
            "planMonth03": "",
            "planMonth04": "",
            "planMonth05": "",
            "planMonth06": "",
            "planMonth07": "",
            "planMonth08": "",
            "planMonth09": "",
            "planMonth10": "",
            "planMonth11": "",
            "planMonth12": "6546",
            "descriptions": ""
          },
          {
            "createdBy": "-1",
            "lastUpdatedBy": "2618350",
            "creationDate": "2021-11-24 08:46:34",
            "lastUpdateDate": "2021-11-25 14:07:00",
            "createdByName": "",
            "lastUpdatedByName": "ex_liuhh4 刘5571",
            "id": "900004",
            "buName": "洗衣机事业部",
            "buCode": "30009804",
            "organizationId": "",
            "storeId": "",
            "type": "PLANT",
            "organizationCode": "",
            "organizationName": "",
            "typeValue": "ME5",
            "planYear": "2021",
            "planMonth01": "1212",
            "planMonth02": "2000",
            "planMonth03": "1000",
            "planMonth04": "2000",
            "planMonth05": "1212",
            "planMonth06": "2000",
            "planMonth07": "1000",
            "planMonth08": "2000",
            "planMonth09": "1000",
            "planMonth10": "3000",
            "planMonth11": "1200",
            "planMonth12": "3400",
            "descriptions": "INV_ME5_无锡小天鹅电器-无锡工厂_制造"
          },
          {
            "createdBy": "2618350",
            "lastUpdatedBy": "2618350",
            "creationDate": "2021-11-25 17:02:00",
            "lastUpdateDate": "2021-11-25 17:02:00",
            "createdByName": "ex_liuhh4 刘5571",
            "lastUpdatedByName": "ex_liuhh4 刘5571",
            "id": "900020",
            "buName": "洗衣机事业部",
            "buCode": "30009804",
            "organizationId": "",
            "storeId": "",
            "type": "PLANT",
            "organizationCode": "",
            "organizationName": "",
            "typeValue": "ME8",
            "planYear": "2021",
            "planMonth01": "2000",
            "planMonth02": "2000",
            "planMonth03": "2000",
            "planMonth04": "2000",
            "planMonth05": "2000",
            "planMonth06": "2000",
            "planMonth07": "2000",
            "planMonth08": "2000",
            "planMonth09": "2000",
            "planMonth10": "2000",
            "planMonth11": "2000",
            "planMonth12": "2000",
            "descriptions": "INV_ME8_无锡小天鹅电器-无锡工厂_模具工厂"
          },
          {
            "createdBy": "2618350",
            "lastUpdatedBy": "2618350",
            "creationDate": "2021-11-25 14:21:06",
            "lastUpdateDate": "2021-11-25 14:21:06",
            "createdByName": "ex_liuhh4 刘5571",
            "lastUpdatedByName": "ex_liuhh4 刘5571",
            "id": "900015",
            "buName": "洗衣机事业部",
            "buCode": "30009804",
            "organizationId": "",
            "storeId": "",
            "type": "PLANT",
            "organizationCode": "",
            "organizationName": "",
            "typeValue": "M69",
            "planYear": "2021",
            "planMonth01": "1000",
            "planMonth02": "1000",
            "planMonth03": "1000",
            "planMonth04": "1000",
            "planMonth05": "1000",
            "planMonth06": "1000",
            "planMonth07": "1000",
            "planMonth08": "1000",
            "planMonth09": "1000",
            "planMonth10": "1000",
            "planMonth11": "1000",
            "planMonth12": "1000",
            "descriptions": "INV_M69_合肥洗衣机_制造"
          }
        ],
        totalElements: 3
      },
      extra: null,
    })
  }
}