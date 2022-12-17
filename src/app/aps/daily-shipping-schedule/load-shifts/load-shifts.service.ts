import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class LoadShiftsService extends CommonQueryService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  seachUrl = '/api/admin/spLoadShifts/pageQuery';

  /** 查询 */
  Query(dto: any): Observable<ResponseDto> {
    return this.http.get('/api/admin/spLoadShifts/pageQuery', dto);
  }

  /** 查询 */
  QueryInternals(dto: any): Observable<ResponseDto> {
    return this.http.get('/api/admin/spLoadShifts/pageQueryInternals', dto);
  }

  /** 保存 */
  Save(dto: any): Observable<ResponseDto> {
    return this.http.post('/api/admin/spLoadShifts/edit', dto);
  }

  /** 删除 */
  Delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post('/api/admin/spLoadShifts/delete', ids);
  }

  /** 导入 */
  Import(dtos: any): Observable<ResponseDto> {
    console.log("导入数据");
    console.log(dtos);
    return this.http.post('/api/admin/spLoadShifts/fileImport', dtos);
  }
}

