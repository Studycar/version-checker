import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { OrganizationTranAdvanceInputDto } from '../dtos/organization-tran-advance-input-dto';

@Injectable()
/** 计划组间传输提前期 */
export class OrganizationTranAdvanceService {
    constructor(private appApiService: AppApiService) { }

    queryUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/query';
    querybycodeUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querybycode';
    seachDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/lookupvalue/querylookupvalue';

    saveUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/save';

    deleteUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/delete';

    saveDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/lookupvalue/saveandupdate';

    /** 查找快码 */
    Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            '/afs/serverbaselookupcode/lookuptype/Search',
            {
                request
            });
    }

    Query(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/query',
            {

            }, { method: 'GET' }
        );
    }

    QueryByCode(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querybycode',
            {

            }, { method: 'GET' }
        );
    }
    /** 获取快码 */
    Get(id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaselookupcode/lookuptype/Get?id=' + id,
            {
            }, { method: 'GET' });
    }

    /** 保存新增/修改的数据 */
    Edit(dto: OrganizationTranAdvanceInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/Edit',
            {
                dto
            });
    }

    /** 删除快码 */
    Remove(dto: OrganizationTranAdvanceInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/delete',
            {
                dto
            });
    }

    /** 批量删除快码 */
    RemoveBath(dtos: OrganizationTranAdvanceInputDto[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaselookupcode/lookuptype/RemoveBath',
            {
                dtos
            });
    }

    GetAppliaction2(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/...',
            {

            }
        );
    }

    /** 获取所有应用程序 */
    GetAppliaction(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/GetAppliaction',
            {
            });
    }

    /** 获取快码 */
    GetDetail(code: string, lng: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaselookupcode/lookupvalue/querylookupvalue?strLookUpTypeCode=' + code + '&strLanguage=lng',
            {
            }, { method: 'GET' });
    }

    /** 保存数据 */
    Save(dto: OrganizationTranAdvanceInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/save',
            {
                dto
            });
    }

    /** 获取组织和计划组 */
    GetOrgAndPlant(): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querygvprodlinegroup',
            {
            }, { method: 'GET' });
    }

    /** 获取组织 */
    GetOrg(OrgName: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querygvauthorizedplants',
            {
            }, { method: 'GET' });
    }

    /** 获取计划组 */
    GetPlant(PlantName: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querygvprodlinegroup',
            {
            }, { method: 'GET' });
    }
}
