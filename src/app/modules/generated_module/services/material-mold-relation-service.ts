/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-09-11 11:11:12
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-20 11:11:10
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { MaterialmaintenanceInputDto } from 'app/modules/generated_module/dtos/Materialmaintenance-input-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class MaterialMoldRelationService {
  constructor(private appApiService: AppApiService, public http: _HttpClient) {}
  seachUrl =
    '/afs/serverppmaterialresourcerelation/ServerPPMaterialResourceRelation/GetData';
  ExportUrl = '/afs/serverpsitemdefine/psitemdefine/ExportMatemaintenance';

  GetById(id: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverppmaterialresourcerelation/ServerPPMaterialResourceRelation/GetById?id=' +
        id,
      {},
      { method: 'GET' },
    );
  }

  Edit(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverppmaterialresourcerelation/ServerPPMaterialResourceRelation/Edit',
      {
        dto,
      },
    );
  }

  Remove(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverppmaterialresourcerelation/ServerPPMaterialResourceRelation/remove',
      {
        dto,
      },
    );
  }

  SaveForNew(dto: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverppmaterialresourcerelation/ServerPPMaterialResourceRelation/SaveForNew',
      {
        dto,
      },
    );
  }

  RemoveBatch(dto: string[]): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverppmaterialresourcerelation/ServerPPMaterialResourceRelation/RemoveBath',
      {
        dto,
      },
    );
  }

  GetGroup(PLANT_CODE: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverppmaterialresourcerelation/ServerPPMaterialResourceRelation/GetGroup?PLANT_CODE=' +
        PLANT_CODE,
      {},
      { method: 'GET' },
    );
  }

  /*GetResource(PLANT_CODE: string, SCHEDULE_GROUP_CODE: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverppmaterialresourcerelation/ServerPPMaterialResourceRelation/GetResource',
            {
                PLANT_CODE: (PLANT_CODE === undefined ? '' : PLANT_CODE),
                SCHEDULE_GROUP_CODE: (SCHEDULE_GROUP_CODE === undefined ? '' : SCHEDULE_GROUP_CODE)
            },
        );
    }*/
  GetResource(
    PLANT_CODE: string,
    MOULD_CODE: string,
    pageIndex: number,
    pageSize: number,
    ENABLE_FLAG: string = '',
  ): Observable<GridSearchResponseDto> {
    return this.appApiService.call<GridSearchResponseDto>(
      '/afs/serverppmouldmanager/ServerPPMouldManager/GetDataForSelect',
      {
        PLANT_CODE: PLANT_CODE,
        MOULD_CODE: MOULD_CODE,
        MOULD_STATUS: '',
        pageIndex: pageIndex,
        pageSize: pageSize,
        ENABLE_FLAG: ENABLE_FLAG,
      },
    );
  }
}
