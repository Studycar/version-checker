import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { Observable } from 'rxjs';

@Injectable()
export class StockPlanService {

  constructor(
    private http: _HttpClient,
  ) { }

  // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/aiClassificationOperation/getData', dto,
    );
  }

  // 修改生产工厂
  updateProdPlantCode(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/aiClassificationOperation/updateProdPlantCode', dto,
    );
  }

  // 将数据写入到安全库存表
  insertToSafeStock(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/ps/aiClassificationOperation/insertToSafeStock', dto,
    );
  }
}
