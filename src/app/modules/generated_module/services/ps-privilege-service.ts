import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { PsPrivilegeInputDto } from 'app/modules/generated_module/dtos/ps-privilege-input-dto';


@Injectable()
/** 权限管理服务 */
export class PsPrivilegeService {
    constructor(private appApiService: AppApiService) { }

    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsprivilege/psprivilege/QueryPrivilegeKenDo';

    seachGetUserslUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsprivilege/psprivilege/GetAppliactioUser';

    savePlantUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsprivilege/psprivilege/GetAppliactioPlant';

    savePlantGrouplUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsprivilege/psprivilege/GetAppliactioGroup';

    savePlantLinelUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsprivilege/psprivilege/GetAppliactioLine';

    /** 获取导出数据 */
    Export(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/Export',
            {
                userID: dto.userID,
                plantID: dto.plantID,
                plantGroup: dto.plantGroup,
                productLineID: dto.productLineID,
                modify: dto.modify,
                publish: dto.publish,
            },
        );
    }

    /** 获取快码 */
    Get(id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/GetByID',
            {
                id: id
            }, { method: 'POST' });
    }

    /** 编辑用户 */
    Edit(dto: PsPrivilegeInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/Edit',
            {
                dto
            });
    }

    /** 删除用户 */
    Remove(dto: PsPrivilegeInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/Remove',
            {
                dto
            });
    }
    /** 批量删除用户 */
    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/RemoveBath',
            {
                dtos
            });
    }

    /**获取所有绑定的用户*/
    GetAppliactioUser(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/GetAppliactioUser',
            {
            }, { method: 'GET' });
    }
    /**获取所有绑定的组织*/
    GetAppliactioPlant(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/GetAppliactioPlant',
            {
            }, { method: 'GET' });
    }

    /**获取所有计划组*/
    GetAppliactioGroup(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/GetAppliactioGroup',
            {
            }, { method: 'GET' });
    }

    /**获取所有计划组 根据工厂ID*/
    GetAppliactioGroupByPlantID(plantId: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/GetAppliactioGroup?plantId=' + plantId,
            {
            }, { method: 'GET' });
    }

    /** 获取所有资源*/
    GetAppliactioLine(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/GetAppliactioLine',
            {
            }, { method: 'GET' });
    }

    /** 获取所有资源*/
    GetAppliactioGroupIDLine(groupID: String): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/GetAppliactioLine?groupID=' + groupID,
            {
            });
    }
    /**辑页面 获取快码*/
    GetlookupbytypeNew(type: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsprivilege/psprivilege/GetlookupbytypeNew?type=' + type,
            {
            });
    }
}
