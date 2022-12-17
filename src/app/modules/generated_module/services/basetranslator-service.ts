import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { BaseTranslatorInputDto } from '../dtos/base-translator-input-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
export class BaseTranslstorService {
    constructor(private appApiService: AppApiService) { }

    queryUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/query';
    querybycodeUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querybycode';
    seachDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/lookupvalue/querylookupvalue';

    saveUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/save';

    deleteUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/delete';

    saveDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/lookupvalue/saveandupdate';

    GetLngMapping = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/baselngmapping/getLngMapping';

    /** 查找快码 */
    Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            '/afs/serverbaselookupcode/lookuptype/Search',
            {
                request
            });
    }

    GetInitLunguage(): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/servertranslator/translator/GetAllLanguage?dev_lng=FND_LANGUAGE&code=',
            {
            }, { method: 'GET' });
    }

    Query(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/query',
            {

            }, { method: 'GET' }
        );
    }

    QueryByCode(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querybycode',
            {

            }, { method: 'GET' }
        );
    }
    /** 获取快码 */
    Get(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverbaselookupcode/lookuptype/Get?id=' + id,
            {
            }, { method: 'GET' });
    }

    /** 保存新增/修改的数据 */
    Edit(dto: BaseTranslatorInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/Edit',
            {
                dto
            });
    }

    Remove(devLanguageId: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baselngmapping/deleteLngDev?devLanguageId=' + devLanguageId,
            {});
    }

    getPageDataByTranslate(requestDto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baselngmapping/getPageDataByTranslate',

                requestDto
            );
    }

    RefreshLngJson(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baselngmapping/refreshLngJson',
            {
            }, { method: 'GET' });
    }

    Update(dto: BaseTranslatorInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baselngmapping/updateTranslate',

                dto
            );
    }

    RemoveBath(dtos: BaseTranslatorInputDto[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/servertranslator/translator/UpdateMappingInfo',

                dtos
            );
    }

    GetAppliaction(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/GetAppliaction',
            {
            });
    }

    GetDetail(code: string, lng: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaselookupcode/lookupvalue/querylookupvalue?strLookUpTypeCode=' + code + '&strLanguage=lng',
            {
            }, { method: 'GET' });
    }

    Save(dto: BaseTranslatorInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baselngmapping/insertOneLngDev',

                dto
            );
    }

    GetOrgAndPlant(): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querygvprodlinegroup',
            {
            }, { method: 'GET' });
    }

    GetOrg(OrgName: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querygvauthorizedplants',
            {
            }, { method: 'GET' });
    }

    GetPlant(PlantName: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querygvprodlinegroup',
            {
            }, { method: 'GET' });
    }

  Import(dto: any[]): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/baselngmapping/importData',
      dto
    );
  }
}
