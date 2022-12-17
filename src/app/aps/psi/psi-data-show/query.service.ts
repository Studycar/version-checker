import { Injectable } from '@angular/core';
import { PsiService } from '../psi.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends PsiService {
  // 
  getSopWarningVersionList(dataType: string, invCode: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/sop/sys/sopWarningVersion/list',
      {
        dataType: dataType,
        invCode: invCode,
      }
    )
  }

  getTableList(type: string, typeValue: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto> (
      '/api/sop/sys/sopThresholdValue/list',
      {
        type: type,
        typeValue: typeValue
      }
    )
  }

  getItemQualifiedRateList(requestId, divisionValue): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/sop/sys/itemQualifiedRate/page',
      {
        requestId: requestId,
        divisionValue: divisionValue
      }
    )
  }

  getItemQualifiedRateCount(requestId): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/sop/sys/itemQualifiedRate/count',
      {
        requestId: requestId,
      }
    )
  }

  getSopPlantQualifiedRateList(businessUnitCode): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/sop/sys/sopPlantQualifiedRate/list',
      {
        buOrgCode: businessUnitCode,
      }
    )
  }

  downLoad(params): Observable<any[]> {
    return this.http.get<any[]>(
      `/api/sop/sys/sopWarningVersion/export?paramsJson=${encodeURI(JSON.stringify(params))}`,
    )
  }

}
