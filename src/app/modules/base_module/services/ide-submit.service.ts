import { Injectable } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from './app-api-service';
import { NavigateDataTransferService } from './navigate-data-transfer.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class IdeSubmitService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    public ndtSrv: NavigateDataTransferService,
    public router: Router,
  ) {
    super(
      http,
      appApiService
    )
  }

  getFormDataByDataId(url: string = '', method = 'GET', params): Observable<ResponseDto> {
    if(method === 'GET') {
      return this.http.get(url, params);
    } else {
      return this.http.post(url, params);
    }
  }

  getFormData(formDataId: string): Observable<ResponseDto> {
    return this.http.get('/api/pi/pi-ide/get-form-data', {
      formDataId: formDataId
    })
  }

  getFormDataByProcInstId(instanceId: string): Observable<ResponseDto> {
    return this.http.get('/api/pi/pi-ide/get-form-data-by-procinstid', {
      procInstId: instanceId
    })
  }

  saveFormDataByTemplateCode(dataId: string, templateCode: string): Observable<ResponseDto> {
    return this.http.get('/api/pi/pi-ide/save-form-data-by-template-code', {
      dataId: dataId,
      templateCode: templateCode
    })
  }

  saveFormData(jsonObject): Observable<ResponseDto> {
    return this.http.post('/api/pi/pi-ide/save-form-data', {
      ...jsonObject
    })
  }

  submit(url, method, params): Observable<ResponseDto> {
    if(method === 'GET') {
      return this.http.get(url, params);
    } else {
      return this.http.post(url, params);
    }
  }

  navigate (pathName: string, params: IdeNavigateParams) {
    this.ndtSrv.setData(params)
    this.router.navigate([`./ide/idePortal`], {
      queryParams: { pathName },
    });
  }
}

type RequestParams = {
  url: string,
  method: 'GET' | 'POST',
  params: any
}

interface IdeNavigateParams {
  getFormParams?: RequestParams
  submitParams?: RequestParams
  [key: string]: any
}