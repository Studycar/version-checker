import { Injectable } from '@angular/core';
import { PsiService } from '../psi.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class QueryService extends PsiService {
  // 获取数据
  getData(dto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopCustomerPsiService/getData', dto);
  }

  /** 导入excel数据 */
  importData(dtos: any[]): Observable<ResponseDto> {
    return this.http.post('/api/sop/sopCustomerPsiService/importUpdate', dtos);
  }

  // 导出
  export(params) {
    const a = document.createElement('a');
    a.href = `/api/sop/sopCustomerPsiService/export?paramsJson=${encodeURI(JSON.stringify(params))}`;
    a.style.display = 'none';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // 保存
  // 参数：{"queryDtoList":[{"id":"120617","monthForecastQty":200,"applicationQty":"1"}]}
  save(dto: any) {
    return this.http.post<ResponseDto>('/api/sop/sopCustomerPsiService/updateMonthForecastQty', dto);
  }

  // 获取营销大类
  getSalesCategoryBigOptions(dto?: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopCustomerPsiService/psiLabel', {
      labelType: 'SALES_CATGORY_BIG',
      businessUnitCode: dto.businessUnitCode,
    });
  }

  // 获取营销小类
  getSalesCategorySubOptions(dto?: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/sop/sopCustomerPsiService/psiLabel', {
      labelType: 'SALES_CATGORY_SUB',
      businessUnitCode: dto.businessUnitCode,
      salesCatgoryBig: dto.salesCatgoryBig || dto.salesCategoryBig,
    });
  }
}
