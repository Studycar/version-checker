import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { EnergyConstraintsService } from '../query.service';


@Injectable()
export class EnergyPriceService extends EnergyConstraintsService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  private getItemUrl = '/api/ps/psEnergyPrice/getById/';
  private saveItemUrl = '/api/ps/psEnergyPrice/save';
  public queryUrl = '/api/ps/psEnergyPrice/queryEnergyPrice';
  private syncUrl = '/api/pi/pienergyprice/syncEnergyPrice';
  public exportUrl = '/api/ps/psEnergyPrice/queryEnergyPrice';
  private importUrl = '/api/ps/psEnergyPrice/saveList';

  GetEnergyPriceItem(energyPriceId: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.getItemUrl + energyPriceId,
      {
      });
  }

  SaveEnergyPriceItem(energyPriceItem: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.saveItemUrl,
      energyPriceItem
    )
  }

  SyncEnergyPrice(plantCode, energyType = ''): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.syncUrl,
      {
        plantCode:plantCode,
        energyType:energyType
      }
    )
  }

  Import(dtos: any[]): Observable<ActionResponseDto> {
    return this.http
      .post(this.importUrl, dtos);
  }

}


