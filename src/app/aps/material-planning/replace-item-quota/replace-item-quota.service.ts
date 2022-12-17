import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';

@Injectable()
export class ReplaceItemQuotaService {
  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient,
  ) {}

  // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      `/api/ps/psReplacementGroupPercent/page?pageNum=${dto.pageIndex}&pageSize=${dto.pageSize}&export=${dto.isExport}`,
      dto,
    );
  }

  update(saveData: object): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/psReplacementGroupPercent/save', { ...saveData },
    );
  }

  getReplaceItemQuotaById(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      `/api/ps/psReplacementGroupPercent/queryById?id=${id}`
    );
  }

  remove(dto): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      `/api/ps/psReplacementGroupPercent/deleteById?id=${dto.id}`
    );
  }

    /**
   * 导入替代料配额
   * @param dto
   */
     public imports(dto: any): Observable<ResponseDto> {
      return this.appApiService.call<ResponseDto>(
        '/api/ps/psReplacementGroupPercent/imports', dto, { method: 'POST' }
      );
    }
}
