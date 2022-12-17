import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { MaterialmaintenanceInputDto } from 'app/modules/generated_module/dtos/Materialmaintenance-input-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
/** 物料维护服务 */
export class MaterialmaintenanceService {
  constructor(private appApiService: AppApiService,
    public http: _HttpClient
  ) { }
  baseUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsitemdefine/psitemdefine';
  seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/ps/psItem/pageItem';
  saveUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsitemdefine/psitemdefine/Save';
  NewExportUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/ps/psItem/export';

  Get(id: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverpsitemdefine/psitemdefine/Get?id=' + id,
      {
      }, { method: 'GET' });
  }

  /** 编辑物料管理 */
  Edit(dto: MaterialmaintenanceInputDto): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverpsitemdefine/psitemdefine/Edit',
      {
        dto
      });
  }

  /** 获取 物料类型 */
  GetItemTypes(language?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/servermessage/MessageService/GetLookUpType',
      {
        lookUpType: 'PS_ITEM_TYPE',
        language: (language === undefined ? '' : language)
      },
    );
  }

  /** 获取 制造 采购 */
  GetWipSupplyTypes(language?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/servermessage/MessageService/GetLookUpType',
      {
        lookUpType: 'WIP_SUPPLY_TYPE',
        language: (language === undefined ? '' : language)
      },
    );
  }

  /** 获取 物料状态*/
  GetItemStatusCodes(language?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/servermessage/MessageService/GetLookUpType',
      {
        lookUpType: 'PP_MTL_ITEM_STATUS',
        language: (language === undefined ? '' : language)
      },
    );
  }

  /** 获取 组织 */
  GetOrganizationids(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverpsitemdefine/psitemdefine/GetPlant',
      {
      }
    );
  }

  /** 获取 物料 */
  GetItemCodes(plantcode?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverpsitemdefine/psitemdefine/GetItemCodes',
      {
        plantcode: (plantcode === undefined ? '' : plantcode)
      },
    );
  }

  /** 获取 自制 采购 */
  GetMakeBuyCodes(language?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/servermessage/MessageService/GetLookUpType',
      {
        lookUpType: 'PS_MAKE_BUY_CODE',
        language: (language === undefined ? '' : language)
      },
    );
  }
  /** 获取 是否有效 */
  GetYesNos(language?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/servermessage/MessageService/GetLookUpType',
      {
        lookUpType: 'FND_YES_NO',
        language: (language === undefined ? '' : language)
      },
    );
  }

  QueryRequest(queryParams: any): Observable<GridSearchResponseDto> {
    return this.http
      .post<GridSearchResponseDto>(this.baseUrl + '/QueryMatemaintenance', queryParams);
  }

 }
