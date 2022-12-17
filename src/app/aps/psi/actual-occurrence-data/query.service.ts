import { Injectable } from '@angular/core';
import { PsiService } from '../psi.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends PsiService {
  // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopCrystalBallData/page', dto);
  }

  // 新增/修改
  save(dto): Observable<ResponseDto> {
    if (dto.id === null) { // 新增
      return this.http.post<ResponseDto>('/api/sop/sopCrystalBallData', dto);
    } else { // 修改
      return this.http.put<ResponseDto>(`/api/sop/sopCrystalBallData/${dto.id}`, dto);
    }
  }
}
