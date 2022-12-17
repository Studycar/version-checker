import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { AppTranslationService } from '../services/app-translation-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';

@Injectable({
  providedIn: 'root',
})
export class BaseImportsService {
  baseUrl = 'api/admin/baseexportimport';

  constructor(
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTransSrv: AppTranslationService,
    private httpSrv: _HttpClient,
  ) {}

  /**
   * 获取所有配置数据
   * @param importConfigQueryDto
   */
  get(importConfigQueryDto: any): Observable<ActionResponseDto> {
    return this.httpSrv.post<ActionResponseDto>(
      this.baseUrl + '/get',
      importConfigQueryDto,
    );
  }

  /**
   * 保存配置数据
   * @param BASE_IMPORT_CONFIG
   */
  save(BASE_IMPORT_CONFIG: any): Observable<ActionResponseDto> {
    return this.httpSrv.post<ActionResponseDto>(
      this.baseUrl + '/save',
      BASE_IMPORT_CONFIG,
    );
  }
}
