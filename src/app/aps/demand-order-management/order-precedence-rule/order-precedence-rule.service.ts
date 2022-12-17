import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
// import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';


const URL = '/api/ps/pprulepriorityheader/';
const URLLine = '/api/ps/pprulepriorityline/';

@Injectable()
export class OrderPrecedenceRuleService {

  

  constructor(
    private http: _HttpClient,
    private commonQueryService: CommonQueryService,
  ) {
  }


  // query(dto: DTO, context): void {
  //   this.commonQueryService.loadGridViewNew({ url: `${URL}getData`, method: 'POST' }, dto, context);
  // }

  add(dto: DTO): Observable<ResponseDto> {
    return this.http.post(`${URL}edit`,  dto );
  }

  delete(Ids: string[]): Observable<ResponseDto> {
    console.log('aaaaaa');
    console.log(Ids);
    return this.http.post(`${URL}removeBath`,  Ids );
  }

  editDetail(dto: DTO): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${URLLine}SaveLine`,  dto );
  }

  SaveLines(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${URLLine}saveLines`,  dtos );
  }

  queryDetail(dto: DTO, context) {
    this.commonQueryService.loadGridViewNew({ url: `${URLLine}queryLine`, method: 'POST' },  dto , context);
  }

  // deleteDetail(Ids: string[]): Observable<ResponseDto> {
  //   return this.http.post(`${URL}DeleteLine`, { Ids });
  // }

  /***
   * 获取事业部
   * @return {Observable<ResponseDto>}
   */
  getAllScheduleRegion(): Observable<ResponseDto> {
    return this.commonQueryService.GetAllScheduleRegion();
  }
}

export interface DTO {
  [key: string]: any;
}
