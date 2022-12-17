import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { GridSearchRequestDto } from 'app/modules/generated_module/dtos/grid-search-request-dto';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { SupplierDro } from '../../../modules/generated_module/dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  queryUrl = '/api/ps/pijswitchtime/pageQuery';

  getItemDataById(Id: string): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/afs/serverpijinjectionmolding/switchtimeappservice/query',
      { Id }
    );
  }

  // 新增修改同一个
  add(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/pijswitchtime/save',
      {
        id: dto.id,
        plantCode: dto.plantCode,
        switchType: dto.switchType,
        colorTypeFrom: dto.colorTypeFrom || '',
        colorTypeTo: dto.colorTypeTo || '',
        enableFlag: dto.enableFlag,
        switchTime: dto.switchTime,
        mouldCode: dto.mouldCode || ''
      }
    );
  }

  remove(id: string): Observable<ResponseDto> {
    return this.http.get(
      '/api/ps/pijswitchtime/delete/' + id,
    );
  }

  getMouldCodes(plantCode: string): Observable<ResponseDto> {
    return this.http.get(
      '/api/ps/pijswitchtime/getMouldCodes/' + plantCode,
    );
  }

  importFile(Records: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/pijswitchtime/import', Records
    );
  }
}
