import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class SopMaterialPurchaseMaintenanceService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    baseUrl = '/api/sop/sopmaterialpurchasemaintenance';
    exportUrl = '/api/sop/sopmaterialpurchasemaintenance/ExportData';


    getById(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
          this.baseUrl + '/getById?id=' + id,
            {},
          { method: 'GET' }
        );
    }


    update(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
          this.baseUrl + '/update',
          dto
        );
    }

    remove(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          this.baseUrl + '/remove',
        {
          id: id
        },
      );
    }


    updateBatch(ids: string[], value: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
          this.baseUrl + '/updateBatch?reviewFlag=' + value,
          ids,
        );
    }

  public getCategoryPage(
    categorySetCode: string,
    categoryCode: string,
    PageIndex: number = 1,
    PageSize: number = 10,
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/pscategories/QueryPage',
      {
        categorySetCode: categorySetCode,
        categoryCode: categoryCode,
        enableFlag: 'Y',
        PageIndex: PageIndex,
        PageSize: PageSize,
      },
    );
  }
}
