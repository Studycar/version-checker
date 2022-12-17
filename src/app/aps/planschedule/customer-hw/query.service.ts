import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class PlanscheduleHWCustomerService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/customerHw';
  private baseFullUrl = '/api/ps/customerFull';
  public queryUrl = this.baseUrl + '/list';
  public queryFullUrl = this.baseFullUrl + '/list';
  public getByTaxNumUrl = this.baseFullUrl + '/getByTaxNum';
  private editUrl = this.baseUrl + '/save';
  private checkNameAndAbbreviationUrl = this.baseUrl + '/checkNameAndAbbreviation';
  private editFullUrl = this.baseFullUrl + '/save';
  private saveFormUrl = this.baseUrl + '/saveForm';
  private saveCusFullUrl = this.baseUrl + '/saveCustomerFull';
  private deleteUrl = this.baseUrl + '/delete';
  private deleteFullUrl = this.baseFullUrl + '/delete';
  private queryLimitUrl = this.baseUrl + '/getU8Info';
  public submitUrl = this.baseUrl + '/submit4Audit';
  private uploadFileUrl = '/api/ps/oss/attachInfo/upload2';
  public getByIdUrl = this.baseUrl + '/get';
  public getFullByIdUrl = this.baseFullUrl + '/get';
  public setCusStateUrl = '/api/ps/pscustomerhwstatechange/setCusState';

  getById(id: string): Observable<ResponseDto> {
    return this.http.get(this.getByIdUrl, {
      id: id
    })
  }

  getFullById(id: string): Observable<ResponseDto> {
    return this.http.get(this.getFullByIdUrl, {
      id: id
    })
  }

  queryLimit(cusCodes: any[]): Observable<ResponseDto> {
    return this.http.post(this.queryLimitUrl, cusCodes)
  }

  Import(data): Observable<ResponseDto> {
    return this.http.post('')
  }

  delete(ids): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, {
      ids: ids
    })

  }

  deleteFull(ids): Observable<ResponseDto> {
    return this.http.post(this.deleteFullUrl, {
      ids: ids
    })

  }

  edit(data): Observable<ResponseDto> {
    return this.http.post(this.editUrl, data)
  }

  checkNameAndAbbreviation(data): Observable<ResponseDto> {
    return this.http.post(this.checkNameAndAbbreviationUrl, data)
  }

  saveForm(data): Observable<ResponseDto> {
    return this.http.post(this.saveFormUrl, data)
  }

  submit(ids): Observable<ResponseDto> {
    return this.http.post(this.submitUrl, {
      ids: ids
    })
  }

  setCusState(cusCode: string, cusStateNew: string, reason: string): Observable<ResponseDto> {
    return this.http.post(this.setCusStateUrl, {
      cusCode: cusCode,
      cusStateNew: cusStateNew,
      reason: reason
    });
  }

  uploadFile(fileList, busType='PS_CUSTOMER_HW', remarks='') :Observable<ResponseDto> {
    return this.http.post(this.uploadFileUrl + '?busType='+busType+'&remarks='+remarks, fileList);
  }

  getByTaxNum(taxNum: string): Observable<ResponseDto> {
    return this.http.get(this.getByTaxNumUrl, {
      taxNum: taxNum
    });
  }

  saveCusFull(dataItem: any): Observable<ResponseDto> {
    return this.http.post(this.saveCusFullUrl, {
      ...dataItem
    });
  }

}