import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { MenuGroupPluginInputDto } from '../dtos/menu-group-plugin-input-dto';


@Injectable()
/** 快码管理服务 */
export class MenuGroupPluginService {
    constructor(private appApiService: AppApiService) { }
    // 绑定查询菜单组
    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/servermenugroupplugin/usermanager/QueryMenuGroupKenDo';
    // 绑定查询菜单 顶级菜单
    seachUrlMENU = this.appApiService.appConfigService.getApiUrlBase() + '/afs/servermenugroupplugin/usermanager/SearchGetMENU';

    // 绑定下拉框
     seachUrlAppName = this.appApiService.appConfigService.getApiUrlBase() + '/afs/servermenugroupplugin/usermanager/GetApplication';




    /** 搜索 */
    Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            '/afs/servermenugroupplugin/usermanager/menugrop',
            {
                request
            });
    }

    /** 获取导出数据 */
    Export(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servermenugroupplugin/usermanager/SearchGetMenuInfo',
            {
                ID: dto.Id,
            },
        );
    }

    /** 获取数据 递归 */
    SearchGetMenuInfo(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servermenugroupplugin/usermanager/QueryMenuD',
            {
                GROUP_ID: dto.Id
            }, { method: 'POST' }
        );
    }
    /** 获取所有绑定的应用模块*/
    GetApplication(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servermenugroupplugin/usermanager/GetApplication',
        {
        }, { method: 'GET' });
    }

    /** 获取 */
    Get(id: string, LANGUAGE: string): Observable<ActionResponseDto> {
      return this.appApiService.call<ActionResponseDto>(
          '/afs/servermenugroupplugin/usermanager/GetByID?id=' + id + '&LANGUAGE=' + LANGUAGE,
          {
          }, { method: 'GET' });
    }

    /** //新增或保存 菜单组*/
    Edit(dto: MenuGroupPluginInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servermenugroupplugin/usermanager/Edit',
            {
                dto
            });
    }

    /** 编辑 */
    SaveMenuNEW(dto: MenuGroupPluginInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servermenugroupplugin/usermanager/SaveMenuNEW',
            {
                dto
            });
    }

    /** 删除菜单 */
    Remove(dto: MenuGroupPluginInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servermenugroupplugin/usermanager/Remove',
            {
                dto
            });
    }
    /** 批量删除 */
    RemoveBath(dtos: MenuGroupPluginInputDto[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servermenugroupplugin/usermanager/RemoveBath',
            {
                dtos
            });
    }


      /** 获取所有绑定的语言*/
      GetAppliactionLanguageEdit(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/servermenugroupplugin/usermanager/GetAppliactionLanguageEdit',
        {
        });  
  }

        /** 获取所有顶级菜单*/
        GetMenuTOP(): Observable<ActionResponseDto> {
            return this.appApiService.call<ActionResponseDto>(
                '/afs/servermenugroupplugin/usermanager/GetMenuTOP',
            {
            });  
      }
    
        /** 获取所有子菜单*/
        GetMenuChild(): Observable<ActionResponseDto> {
            return this.appApiService.call<ActionResponseDto>(
                '/afs/servermenugroupplugin/usermanager/GetMenuChild',
            {
            });  
      }
  
}
