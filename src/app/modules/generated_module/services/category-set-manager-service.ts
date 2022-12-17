import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { CategorySetManagerInputDto } from 'app/modules/generated_module/dtos/category-set-manager-input-dto';


@Injectable()
/** 权限管理服务 */
export class CategorySetManagerService {
    constructor(private appApiService: AppApiService) { }

    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/servercategorymanager/categorymanager/querycategorysetKenDo';


    /** 获取导出数据 */
    Export(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servercategorymanager/categorymanager/Export',
            {
                categorySetName: dto.categorySetName,
                description: dto.description

            },
        );
    }

     /** 获取类别 */
     Get(id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servercategorymanager/categorymanager/GetByID?id=' + id,
            {
            }, { method: 'GET' });
      }

    /** 编辑类别 */
    Edit(dto: CategorySetManagerInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servercategorymanager/categorymanager/Edit',
            {
                dto
            });
    }

    /** 删除类别 */
    Remove(dto: CategorySetManagerInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servercategorymanager/categorymanager/Remove',
            {
                dto
            });
    }
    /** 批量删除类别 */
    RemoveBath(dtos: CategorySetManagerInputDto[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servercategorymanager/categorymanager/RemoveBath',
            {
                dtos
            });
    }


}
