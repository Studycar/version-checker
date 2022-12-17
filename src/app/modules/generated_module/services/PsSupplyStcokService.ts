import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { PsusermanagerInputDto } from 'app/modules/generated_module/dtos/Psusermanager-input-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
export class PsSupplyStcokService {
  constructor(private appApiService: AppApiService, private http: _HttpClient
  ) { }

  seachUrl = '/api/ps/pssupplystcok/pageQuery';

  /** 获取导出数据 */
  Export(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/psserverusermanager/usermanager/Export',
      {
        strUserName: dto.strUserName
      });
  }

  remove(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/pssupplystcok/delete/' + id,
      {

      }, { method: 'GET' });
  }

  public GetById(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/pssupplystcok/getById/' + id,
      {

      }, { method: 'GET' }
    );
  }

  public save(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/pssupplystcok/add', dto
    );
  }

  public getVendorPageList(vendorNumber: string, vendorName: string, pageIndex: number = 1, pageSize: number = 10): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/pc/pcvendors/getVendorPageList',
      {
        vendorNumber,
        vendorName,
        pageIndex,
        pageSize
      });
  }

}
