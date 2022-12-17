import { Injectable } from '@angular/core';
import { PsiService } from '../psi.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends PsiService {
  // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sys/sopDie/findListSopDieImplTrack', dto);
    // return Observable.of({
    //   code: 200,
    //   msg: '',
    //   data: {
    //     content: [],
    //     totalElements: 100,
    //   },
    //   extra: null,
    // });
  }
}
