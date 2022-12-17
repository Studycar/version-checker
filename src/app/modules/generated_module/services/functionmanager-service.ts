import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { FunctionmanagerInputDto } from 'app/modules/generated_module/dtos/Functionmanager-input-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()
/** Function管理服务 */
export class FunctionmanagerService {
  constructor(private appApiService: AppApiService) { }

  CommonUrl = '/api/admin/basefunctionsb';
  seachUrl = this.appApiService.appConfigService.getApiUrlBase() + this.CommonUrl + '/functionlist';
  exportUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbasefunctionmanager/basefunctionmanager/ExportInfo';


  /** 获取导出数据 */
  Export(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasefunctionmanager/basefunctionmanager/Export',
      {
        strFunctionName: dto.functionName,
        strFunctionCode: dto.functionCode,
        strFunctionPath: dto.functionPath,
        strDescription: dto.description
      });
  }


  /** 获取function管理 */
  GetInfo(id: string, language: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      this.CommonUrl + '/getsingle?id=' + id + '&language=' + language,
      {
      }, { method: 'GET' });
  }

  /** 编辑function管理 */
  Edit(dto: FunctionmanagerInputDto): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      this.CommonUrl + '/functionsave',
      dto
    );
  }


  /** 获取所有绑定的语言下拉框值*/
  // GetSysLanguage(): Observable<ActionResponseDto> {
  //   return this.appApiService.call<ActionResponseDto>(
  //     '/afs/serverbasefunctionmanager/basefunctionmanager/FND_LANGUAGE',
  //     {
  //     });
  // }

  /** 获取功能类型 */
  // GetFunctionType(): Observable<ActionResponseDto> {
  //   return this.appApiService.call<ActionResponseDto>(
  //     '/afs/servermessage/MessageService/GetLookUpType',
  //     {
  //       lookUpType: 'FND_FUNCTION_TYPE',
  //     },
  //   );
  // }
}
