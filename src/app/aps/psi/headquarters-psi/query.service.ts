import { Injectable } from '@angular/core';
import { PsiService } from '../psi.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends PsiService {
  // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopCenterPsiShow/page', dto);
  }

  // 导出
  export(params) {
    const a = document.createElement('a');
    a.href = `/api/sop/sopCenterPsiShow/export?paramsJson=${encodeURI(JSON.stringify(params))}`;
    a.style.display = 'none';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // 获取营销大类
  getSalesCategoryBigOptions(dto?: any): Observable<ResponseDto> { // APP，OPPO，WELLSUN
    return this.http.post<ResponseDto>('/api/sop/sopCenterPsiShow/psiLabel', {
      labelType: 'SALES_CATGORY_BIG',
      businessUnitCode: dto.businessUnitCode,
    });
  }

  // 获取营销小类
  getSalesCategorySubOptions(dto?: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopCenterPsiShow/psiLabel', {
      labelType: 'SALES_CATGORY_SUB',
      businessUnitCode: dto.businessUnitCode,
      salesCatgoryBig: dto.salesCatgoryBig || dto.salesCategoryBig,
    });
  }
}
