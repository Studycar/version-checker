import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';

@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  commonUrl = '/api/sop/sopSupplyCapCustomized/';
  queryUrl = this.commonUrl + 'querySopSupplyCapCustomized';

  /** 保存 */
  public saveSopSupplyCapCustomized(dto: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.commonUrl + 'saveSopSupplyCapCustomized', dto);
  }

  /** 删除 */
  public deleteSopSupplyCapCustomized(ids: string[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.commonUrl + 'deleteSopSupplyCapCustomized', ids);
  }

  /** 导入excel数据 */
  public importSopSupplyCapCustomized(dtos: any[]): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.commonUrl + 'importSopSupplyCapCustomized', dtos);
  }

  /** 查询物料合格供应商 */
  public queryApprovedVendorList(plantCode: string, itemCode: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>('/api/pc/pcApprovedVendorList/queryApprovedVendorList',
      {
        plantCode: plantCode,
        itemCodeEq: itemCode,
        isExport: true, // 导出查询所有数据
      });
  }
}
