import { Injectable } from "@angular/core";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { Observable } from "rxjs";
import { PsiService } from "../../psi.service";

@Injectable()
export class WaningObjectQueryService extends PsiService {

  private baseUrl = '/api/sop/sopOrderWarnConfigMsg/'
  public queryUrl = this.baseUrl + 'page';
  private saveUrl = this.baseUrl + 'save';
  private deleteUrl = this.baseUrl + 'delete';
  private getByIdUrl = this.baseUrl + 'getById';

  save(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.saveUrl,
      dto
    )
  }

  getById(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      this.getByIdUrl,
      { id: id }
    )
  }

  delete(id: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.deleteUrl,
      id
    )
  }
}