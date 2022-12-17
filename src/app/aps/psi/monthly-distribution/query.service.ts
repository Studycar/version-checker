import { Injectable } from '@angular/core';
import { PsiService } from '../psi.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends PsiService {
  // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopProdcutMonthPsiSRate/page', dto);
  }

  // 新增
  save(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopProdcutMonthPsiSRate', dto);
  }

  // 修改
  edit(dto): Observable<ResponseDto> {
    return this.http.put<ResponseDto>(`/api/sop/sopProdcutMonthPsiSRate/${dto.id}`, dto);
  }

  // 删除
  delete(id): Observable<ResponseDto> {
    return this.http.delete<ResponseDto>(`/api/sop/sopProdcutMonthPsiSRate/${id}`);
  }

  // 复制
  copy(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopProdcutMonthPsiSRate/copy', dto);
  }

  // 历史比率计算
  historyRateCalculate(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopProdcutMonthPsiSRate/updateData', dto);
  }

  // 导出
  export(dto): void {
    const a = document.createElement('a');
    // a.href = `/api/sopExport/exportSopProdcutMonthPsiSRate?paramsJson=${encodeURI(JSON.stringify(dto))}`;
    a.href = `/api/sop/sopExport/exportSopProdcutMonthPsiSRate?paramsJson=${encodeURI(JSON.stringify(dto))}`;

    a.style.display = 'none';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
