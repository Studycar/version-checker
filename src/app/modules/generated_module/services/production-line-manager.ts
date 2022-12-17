import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ResourceManagerInputDto } from '../../../modules/generated_module/dtos/resource-manager-input-dto';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 快码管理服务 */
export class ProductLineManagerService {
  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient,
  ) { }

  seachUrl = '/api/admin/psResource/queryResource';

  seachUrl2 = '/api/admin/psResource/queryResourceExport';

  seachDetailUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/afs/serverbaselookupcode/lookupvalue/querylookupvalue';

  saveUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/afs/serverbaselookupcode/lookuptype/saveandupdate';

  saveDetailUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/afs/serverbaselookupcode/lookupvalue/saveandupdate';

  /** 搜索快码 */
  Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
    return this.appApiService.call<GridSearchResponseDto>(
      '/afs/serverbaselookupcode/lookuptype/Search',
      {
        request,
      },
    );
  }

  /** GetPlant 方法*/
  GetPlant(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverproductlinemanager/psproductlinemanager/GetPlant',
      {},
      { method: 'GET' },
    );
  }

  /**根据工厂获取用户权限内计划组*/
  GetScheduleGroupCode(value: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psResource/getScheduleGroupCode?plantCode=' +
      value,
      {},
      { method: 'GET' },
    );
  }

  /**获取计划组（jianl新增，支持可选参数的）*/
  GetScheduleGroupCode2({
    PLANT_CODE = '',
    SCHEDULE_REGION_CODE = '',
    ValidatePrivilage = true,
  }): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverpsprolinegroupmanager/psprolinegroupmanager/Get',
      { PLANT_CODE, SCHEDULE_REGION_CODE, ValidatePrivilage },
      { method: 'POST' },
    );
  }

  /**GetByID 方法 */
  Get(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psResource/getByID?id=' + id,
      {},
      { method: 'GET' },
    );
  }

  /** 编辑功能*/
  Edit(dto: ResourceManagerInputDto): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psResource/edit', dto
    );
  }

  /** 删除快码 */
  Remove(dto: ResourceManagerInputDto): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psResource/remove',
      {
        dto,
      },
    );
  }

  /**新增 */
  Insert(dto: ResourceManagerInputDto): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psResource/insert', dto
    );
  }

  /**查询绑定资源编码 */
  GetResourceCode(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverproductlinemanager/psproductlinemanager/GetResourceCode',
      {},
      { method: 'GET' },
    );
  }

  GetResourceType(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psResource/getResourceType',
      {},
      { method: 'GET' },
    );
  }

  QueryRequest(
    txtResourceCode: string,
    txtResourceDesc: string,
    txtResourceType: string,
    txtPlantCode: string,
    txtScheduleGroupCode: string,
    lueEnableFlag: string,
    page: number,
    pageSize: number,
  ): Observable<GridSearchResponseDto> {
    return this.appApiService.call<GridSearchResponseDto>(
      '/afs/serverproductlinemanager/psproductlinemanager/queryresource?txtResourceCode=' +
      txtResourceCode +
      '&txtResourceDesc=' +
      txtResourceDesc +
      '&txtResourceType=' +
      txtResourceType +
      '&txtPlantCode=' +
      txtPlantCode +
      '&txtScheduleGroupCode=' +
      txtScheduleGroupCode +
      '&lueEnableFlag=' +
      lueEnableFlag +
      '&pageIndex=' +
      page.toString() +
      '&pageSize=' +
      pageSize.toString(),
      {},
      { method: 'GET' },
    );
  }

  GetMoType(plantCode: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psMoType/getMoType?plantCode=' +
      plantCode,
      {},
      { method: 'GET' },
    );
  }

  GetScheduleRegion(plangCode: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/psResource/getScheduleRegion?plantCode=' +
      plangCode,
      {},
      { method: 'GET' },
    );
  }

  GetVendor(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverproductlinemanager/psproductlinemanager/getVendor',
      {},
      { method: 'GET' },
    );
  }

  getRandomNameList(url: String): Observable<string[]> {
    return this.http
      .get(`${url}`)
      .pipe(map((res: any) => res.Extra))
      .pipe(
        map((list: any) => {
          return list.map(item => `${item.VENDOR_NUMBER}`);
        }),
      );
  }

  GetName(value: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverproductlinemanager/psproductlinemanager/getName?value=' +
      value,
      {},
      { method: 'GET' },
    );
  }

  public GetVendorPageList(
    VENDOR_NUMBER: string,
    VENDOR_NAME: string,
    PageIndex: number = 1,
    PageSize: number = 10,
    ID1: string = '',
  ): Observable<ResponseDto> {
    const dto = {
      id: ID1,
      vendorNumber: VENDOR_NUMBER,
      vendorName: VENDOR_NAME,
      pageIndex: PageIndex,
      pageSize: PageSize
    };
    return this.http.post<ResponseDto>(
      '/api/pc/pcvendors/getVendorPageList', dto
    );
  }

  public GetVendorSitePageList(
    PLANT_CODE: string,
    VENDOR_NUMBER: string,
    VENDOR_SITE_CODE: string,
    VENDOR_SITE_NAME: string,
    PageIndex: number = 1,
    PageSize: number = 10,
    ID2: string = '',
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/pc/pcvendorSites/getVendorSitePageList',
      {
        id: ID2,
        plantCode: PLANT_CODE,
        vendorNumber: VENDOR_NUMBER,
        vendorSiteCode: VENDOR_SITE_CODE,
        vendorSiteName: VENDOR_SITE_NAME,
        pageIndex: PageIndex,
        pageSize: PageSize,
      },
    );
  }
}
