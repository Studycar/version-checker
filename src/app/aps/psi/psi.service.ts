import { Injectable } from '@angular/core';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
export class PsiService extends CommonQueryService {
  // 获取事业部
  getScheduleRegion(dto?: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>('/api/admin/workbench/GetUserScheduleRegion', {
      enableFlag: 'Y',
    });
  }

  // 获取组织
  getPlant(dto: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>('/api/admin/workbench/getUserPlant', {
      scheduleRegionCode: dto.businessUnitCode,
    });
  }

  // 获取基地
  getBase(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/sop/sys/sopBasePlant/list',
      {
        businessUnitCode: dto.businessUnitCode,
      }
    )
  }

  // 获取商品编码
  getItems(keword: string, pageIndex: number = 1, pageSize: number = 10, dto: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psItem/pageItem',
      {
        regionCode: dto.businessUnitCode,
        plantCode: dto.plantCode,
        itemCode: keword,
        pageIndex: pageIndex,
        pageSize: pageSize
      },
    );
  }

  // 营销中心
  getAreaOptions(dto?: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>('/api/sop/sopCustomerPsiService/getCodeValueByType?type=area', dto);
  }

  // 获取客户列表
  getCustomersOptions(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>('/api/ps/psCustomer/getData', dto);
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

  // 获取维度列表
  getDivisionNameOptions() {
    return this.http.post<ResponseDto>('/api/sop/sopCenterPsiShow/psiLabel', {
      labelType: 'DIVISION_NAME',
    });
  }

  // 获取品类列表
  getCategoryOptions(businessUnitCode) {
    return this.http.get<ResponseDto>('/api/sop/sopSalecodeMarketcategory/findListMarketSubCategory', {
      businessUnitCode: businessUnitCode,
    });
  }

  // 内外销
  getSaleChannelOptions() {
    return Observable.of({
      code: 200,
      msg: '',
      data: [
        { lookupCode: 'Domestic', description: '内销', },
        { lookupCode: 'Global', description: '外销', },
      ],
      extra: []
    });
  }
}
