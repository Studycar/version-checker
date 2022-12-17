import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class MoreThanOneService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  queryUrl = '/afs/serverpijinjectionmolding/diemultimakeorderappservice/query';
  modalQueryUrl = '/afs/serverpijinjectionmolding/diemultimakeorderappservice/querydetail';

  getUserPlant(userId: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprivilege/psprivilege/getuserprivilage_plant',
      { UserID: userId }
    );
  }

  getMolds(PLANT_CODE: string, SCHEDULE_GROUP_CODE: string): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverpijinjectionmolding/diemultimakeorderappservice/getmould',
      { PLANT_CODE, SCHEDULE_GROUP_CODE }
    );
  }

  computed(dtos: string[]): Observable<ActionResponseDto> {
    return this.http.post(
      '/afs/serverpijinjectionmolding/diemultimakeorderappservice/calculationmatching',
      {
        dtos
      }
    );
  }

  clear(dtos: string[]): Observable<ActionResponseDto> {
    return this.http.post(
      '/afs/serverpijinjectionmolding/diemultimakeorderappservice/clearmatching',
      { dtos }
    );
  }

  matchManual(dtos: string[]): Observable<ActionResponseDto> {
    return this.http.post(
      '/afs/serverpijinjectionmolding/diemultimakeorderappservice/manualmatching',
      {dtos}
    );
  }

  getPrimaryItemPriority(PLANT_CODE: string, MOULD_CODE: string): Observable<ActionResponseDto> {
    return this.http.post(
      '/afs/serverpijinjectionmolding/diemultimakeorderappservice/getprimaryitempriority',
      {
        PLANT_CODE,
        MOULD_CODE
      }
    );
  }

  getDetailSelectMo(PLANT_CODE: string, MOULD_CODE: string, PRIMARY_ITEM_PRIORITY: string, PROJECT_NUMBER: string): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/afs/serverpijinjectionmolding/diemultimakeorderappservice/QueryMakeOrderCode',
      {
        PLANT_CODE,
        MOULD_CODE,
        PRIMARY_ITEM_PRIORITY,
        PROJECT_NUMBER
      }
    );
  }

  detailSave(dtos: any[]) {
    return this.http.post(
      '/afs/serverpijinjectionmolding/diemultimakeorderappservice/save',
      {dtos}
    );
  }

  detailDelete(dtos: string[]) {
    return this.http.post(
      '/afs/serverpijinjectionmolding/diemultimakeorderappservice/delete',
      {dtos}
    );
  }
}
