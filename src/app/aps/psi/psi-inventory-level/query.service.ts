import { Injectable } from "@angular/core";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { Observable } from "rxjs";
import { PsiService } from "../psi.service";

@Injectable()
export class QueryService extends PsiService {
  public queryUrl = '/api/sop/sys/sopThresholdValue/page';
  private addUrl = '/api/sop/sys/sopThresholdValue';
  private editUrl = '/api/sop/sys/sopThresholdValue';
  private deleteUrl = '/api/sop/sys/sopThresholdValue';
  
  save(isModify: boolean, dto): Observable<ResponseDto> {
    if(!isModify) {
      return this.http.post<ResponseDto>(
        this.addUrl,
        dto,
      );
    } else {
      dto.totalValue = 0;
      return this.http.put<ResponseDto>(
        this.editUrl + '/' + dto.id,
        dto,
      );
    }
  }

  delete(id: string): Observable<ResponseDto> {
    return this.http.delete<ResponseDto>(
      this.deleteUrl + '/' + id
    )
  }
}
