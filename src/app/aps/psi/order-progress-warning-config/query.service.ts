import { Injectable } from "@angular/core";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { Observable } from "rxjs";
import { PsiService } from "../psi.service";

@Injectable()
export class QueryService extends PsiService {
  public queryUrl = '/api/sop/sopOrderWarnConfig/page';
  private deleteUrl = '/api/sop/sopOrderWarnConfig/delete';
  private getByIdUrl = '/api/sop/sopOrderWarnConfig/getById';
  private saveUrl = '/api/sop/sopOrderWarnConfig/save';

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

  /**获取快码*/
  public GetWarnDimensionLookupByTypeRef(type: string, arrayRef: any[], language = '') {
    this.GetLookupByTypeLang(type, language).subscribe(result => {
      arrayRef.length = 0;
      result.Extra.forEach(d => {
        // let warnProject = [];
        // let warnCondition = [];
        // let warnObject = [];
        // this.GetLookupByTypeRef('SOP_WARN_PROJECT_' + d.lookupCode, warnProject);
        // this.GetLookupByTypeRef('SOP_WARN_CONDITION_' + d.lookupCode, warnCondition);
        // this.GetLookupByTypeRef('SOP_WARN_OBJECT_' + d.lookupCode, warnObject);
        arrayRef.push({
          label: d.meaning,
          value: d.lookupCode,
          // warnProject: warnProject,
          // warnCondition: warnCondition,
          // warnObject: warnObject,
        });
      });
    });
  }

}