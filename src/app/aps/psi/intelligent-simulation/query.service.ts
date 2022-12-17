import { Injectable } from '@angular/core';
import { PsiService } from '../psi.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends PsiService {
  // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearParam/page', dto);
  }

  // 保存
  save(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearParam/batchUpdate', dto);
  }

  // 模拟
  simulation(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearSmlt', dto);
  }

  // 获取版本列表
  getVersionOptions(dto): Observable<ResponseDto> { // { businessUnitCode, marketCategory, planPeriodMonth }
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearParam/listParamVersion', dto);
  }
}
