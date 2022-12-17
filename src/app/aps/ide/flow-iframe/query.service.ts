import { Injectable } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class IdeFlowQueryService extends CommonQueryService {
  
  getFlowUrl(templateCode, formDataId = '', procInstId = ''): Observable<ResponseDto> {
    return this.http.get(
      '/api/pi/pi-ide/get-ide-sign',
      {
        templateCode: templateCode,
        formDataId: formDataId,
        procInstId: procInstId
      }
    )
  }

  getTemplateCodeByModelCode(modelCode) {
    return this.http.get(
      '/api/pi/pi-ide/get-template-code',
      { modelCode }
    )
  }

  setRelation(formDataId: string, instanceId: string): Observable<ResponseDto> {
    return this.http.get('/api/pi/pi-ide/set-relation', {
      formDataId: formDataId,
      procInstId: instanceId
    })
  }

  getInstance(instanceId: string): Observable<any> {
    return this.http.get('/api/pi/pi-ide/get-todo', {
      instanceId: instanceId
    })
  }
}
