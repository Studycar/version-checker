import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { SopDimmainresrevViewDto } from '../dtos/sopdimmainresrevview-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()  

export class SopCrossDistrictPlanService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {}

    //url = '/afs/ServerSopCrossDistrictPlan/ServerSopCrossDistrictPlan/GetData';
    url = '/api/sop/sopCrossDistrictPlan/query';
    //exportUrl = '/afs/ServerSopCrossDistrictPlan/ServerSopCrossDistrictPlan/ExportData';
    exportUrl = '/api/sop/sopCrossDistrictPlan/export';


   /* getDivisionName(language?: string): Observable<ResponseDto> {
      return this.appApiService.call<ResponseDto>(
        // '/afs/serverbaserespmanager/baserespmanager/GetMenuGroupOption',
        '/api/admin/basemenugroupb/getList?language=' + language,
        {
        }, { method: 'GET' });
    }*/
    
  public getDivisionName(businessUnitCode: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      //'/afs/ServerSopCrossDistrictPlan/ServerSopCrossDistrictPlan/GetDivisionName',
      '/api/sop/sopCrossDistrictPlan/getDivisionName?businessUnitCode='+businessUnitCode,
      {},
    );
  }
}
