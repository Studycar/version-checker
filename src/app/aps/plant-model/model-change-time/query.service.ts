import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  public queryUrl = '/api/ps/psItemSwitchTime/pageQueryModelChangeTime';
  public exportUrl = '/api/ps/psItemSwitchTime/ExportInfo';

  public getProcessPageList(
    plantCode: string,
    processCode: string,
    pageIndex: number = 1,
    pageSize: number = 1000,
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psprodmanufspec/getPageByPlantCode',
      {
        plantCode: plantCode,
        operationCode: processCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      }
    );
  }

   public import(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psItemSwitchTime/importData', dto, { method: 'POST' }
    );
  }
}


