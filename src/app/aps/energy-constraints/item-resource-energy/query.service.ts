import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { EnergyConstraintsService } from '../query.service';

@Injectable()
export class ItemResourceEnergyService extends EnergyConstraintsService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }

  private getUrl = '/api/ps/psItemResourceEnergy/getById/';
  exportUrl = '/api/ps/psItemResourceEnergy/pageItemResourceEnergy';
  queryUrl = '/api/ps/psItemResourceEnergy/pageItemResourceEnergy';
  private importUrl = '/api/ps/psItemResourceEnergy/saveBatch';
  private saveUrl = '/api/ps/psItemResourceEnergy/save';
  private deleteUrl = '/api/ps/psItemResourceEnergy/deleteIds';
  public getItemByItemCode = '/api/ps/psItem/getItemDetail/';
  public getItemById = '/api/ps/psitemroutings/getByItemId?id=';

  GetItemResourceEnergyItem(itemResourceEnergyId: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.getUrl + itemResourceEnergyId,
      {
      });
  }

  public SaveItem(itemResourceEnergy: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.saveUrl,
      itemResourceEnergy
    )
  }

  public deleteItems(ids: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.deleteUrl,
      ids
    )
  }

  public Import(dtos: any[]): Observable<ActionResponseDto> {
    return this.http
      .post(this.importUrl, dtos );
  }

}
