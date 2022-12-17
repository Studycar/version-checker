import { Injectable } from "@angular/core";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { Observable } from "rxjs";
import { PsiService } from "../psi.service";

@Injectable()
export class QueryService extends PsiService {

  private listWarnDaysSummaryUrl = '/api/sop/sopOrderWarnDtl/listWarnDaysSummary';
  public queryUrl = '/api/sop/sopOrderWarnDtl/page';

  getWarnDaysSummary(params: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      this.listWarnDaysSummaryUrl,
      params
    )
  }

}
