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

  // 新增
  save(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopPsiYearParam', dto);
  }

  // 修改
  edit(dto): Observable<ResponseDto> {
    return this.http.put<ResponseDto>(`/api/sop/sopPsiYearParam/${dto.id}`, dto);
  }

  // 删除
  delete(id): Observable<ResponseDto> {
    return this.http.delete<ResponseDto>(`/api/sop/sopPsiYearParam/${id}`);
  }
}
