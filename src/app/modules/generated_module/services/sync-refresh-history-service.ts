import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SyncRefreshHistoryInputDto } from 'app/modules/generated_module/dtos/sync-refresh-history-input-dto';

@Injectable()
/** 刷新信息管理服务 */
export class SyncRefreshHistoryService {
    constructor(private appApiService: AppApiService) { }

    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serversyncrefreshhistory/syncrefreshhistory/QuerySyncHistory';

    seachUrlInfo = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serversyncrefreshhistory/syncrefreshhistory/QuerySyncHistoryInfo';

    /** 获取导出数据 */
    Export(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serversyncrefreshhistory/syncrefreshhistory/Export',
            {
                sysCode: dto.sysCode,
                sysName: dto.sysName,
                createDT: dto.createDT,
                endDT: dto.endDT,
            },
        );
    }


    /** 获取导出明细数据 */
    ExportInfo(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serversyncrefreshhistory/syncrefreshhistory/ExportInfo',
            {
                sysCode: dto.sysCode,
                sysName: dto.sysName,
            },
        );
    }


    /** 搜索 子页面查询*/
    Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            '/afs/serversyncrefreshhistory/syncrefreshhistory/QuerySyncHistoryInfo',
            {
                request
            });
    }



    /**编辑页面 获取所有绑定的组织*/
    GetAppliactioPlant(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serversyncrefreshhistory/syncrefreshhistory/GetAppliactioPlant',
            {
            });
    }

    /** 编辑刷新信息 */
    Edit(dto: SyncRefreshHistoryInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serversyncrefreshhistory/syncrefreshhistory/Edit',
            {
                dto
            });
    }


    /** 编辑刷新信息 */
    EditRefreshDate(dto: SyncRefreshHistoryInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serversyncrefreshhistory/syncrefreshhistory/initlasetrefreshNEW',
            {
                dto
            });
    }

    /** 编辑刷新信息 */
    EditChild(dto: SyncRefreshHistoryInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serversyncrefreshhistory/syncrefreshhistory/EditChild',
            {
                dto
            });
    }
}
