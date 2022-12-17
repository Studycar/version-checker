import { Injectable } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends CommonQueryService {
  private saveUrl = '/api/ps/psMakeOrder/updateResource';
  // 接口模板
  save(dto: any): Observable<ResponseDto> {
    return this.http.post(
      this.saveUrl,
      dto,
    )
  }

  public GetById(Id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
        '/api/ps/psMakeOrder/getById?Id=' + Id
    );
}
}
