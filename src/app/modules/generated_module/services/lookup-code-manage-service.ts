import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { LookupCodeInputDto } from 'app/modules/generated_module/dtos/lookup-code-input-dto';
import { LookupCodeOutputDto } from 'app/modules/generated_module/dtos/lookup-code-ouput-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 快码管理服务 */
export class LookupCodeManageService {
    constructor(private appApiService: AppApiService) { }
    queryUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/baselookuptypesb/querylookuptype';
    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/baselookuptypesb/querylookuptype';
    seachDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/baselookuptypesb/queryLookupvalue';
    saveUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaselookupcode/lookuptype/saveandupdate';
    saveDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaselookupcode/lookupcode/savelookupvalue';
    UpdateDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaselookupcode/lookupcode/updatelookupvalue';
    DeleteDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaselookupcode/lookupcode/deletelookupvalue';




    /** 搜索快码 *
    Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            '/afs/serverbaselookupcode/lookuptype/Search',
            {
                request
            });
    }

    /** 获取快码 */
    Get(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverbaselookupcode/lookuptype/Get?id=' + id,
            {
            }, { method: 'GET' });
    }

    GetInitLunguage(): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaselookupcode/lookupcode/GetAllLanguage?dev_lng=FND_LANGUAGE',
            {
            }, { method: 'GET' });
    }

    /** 编辑快码 */
    Edit(dto: LookupCodeInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverbaselookupcode/lookuptype/Edit',
            {
                dto
            });
    }

    /** 删除快码明细 */
    RemoveLookupCodeVaule(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverbaselookupcode/lookupcode/deletelookupcodevalue?id=' + id,
            {
            }, { method: 'GET' });
    }

    /** 删除快码 */
    Remove(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baselookuptypesb/deletelookupcode/' + id,
            {
            }, { method: 'GET' });
    }

    /** 批量删除快码 */
    RemoveBath(dtos: LookupCodeInputDto[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverbaselookupcode/lookuptype/RemoveBath',
            {
                dtos
            });
    }

    /** 获取所有应用程序 */
    GetAppliaction(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/workbench/getApplication',
            {
            }
            , { method: 'GET' });
    }

    /** 获取快码 */
    GetDetail(code: string, lng: string): Observable<any> {
        return this.appApiService.call<any>(
            '/api/admin/baselookuptypesb/queryLookupvalue?strLookUpTypeCode=' + code + '&strLanguage=' + lng,
            {
            }, { method: 'GET' });
    }

    /** 保存快码 */
    Save(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baselookuptypesb/savelookupcode',

                dto

            );
    }

    /** 保存快码 */
    Update(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baselookuptypesb/savelookupcode',
                dto
            );
    }


    /** 保存快码明细 */
    SaveDetail(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.saveDetailUrl,
            {
                dto: dto
            });
    }

    /** 更新快码明细 */
    UpdateDetail(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.UpdateDetailUrl,
            {
                dto: dto
            });
    }

    /** 删除快码明细 */
    DeleteDetail(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            this.DeleteDetailUrl,
            {
                dto: dto
            });
    }

  /**
   * 导入快码
   * @param dto
   */
  public imports(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baselookuptypesb/imports', dto, { method: 'POST' }
    );
  }
}
