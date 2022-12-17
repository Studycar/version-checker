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

  commonUrl = '/api/sop/sopforecast/';

  /**查询版本号 */
  public queryVersion(plantCode: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.commonUrl + 'queryVersion', { plantCode: plantCode });
  }

  /**查询分页数据 */
  public querySopForecastPage(sopForecastQO: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.commonUrl + 'querySopForecastPage', sopForecastQO);
  }

  /** 导入excel数据 */
  public importSopForecast(inputImportQO: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.commonUrl + 'importSopForecast', inputImportQO);
  }
}
