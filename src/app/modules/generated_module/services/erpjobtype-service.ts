import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ERPJobTypeInputDto } from '../dtos/erpjobtype-input-dto.';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 生产订单类型维护 */
export class ERPJobTypeService {
  constructor(private appApiService: AppApiService) { }

  // queryUrl = this.appApiService.appConfigService.getApiUrlBase() + '/api/admin/psorganizationtranadvance/query';
  // querybycodeUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/querybycode';
  // seachDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/lookupvalue/querylookupvalue';

  // saveUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/save';

  // deleteUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/psorganizationtranadvance/delete';

  // saveDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsorganizationtranadvance/lookupvalue/saveandupdate';

  // GetLngMapping = this.appApiService.appConfigService.getApiUrlBase() + '/afs/servertranslator/translator/GetLngMapping';


  /** 获取生产订单类型 */
  Save(dto: ERPJobTypeInputDto): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psMoType/save',
      dto, { method: 'POST' }
    );
  }

  Remove(id: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/afs/ps/psMoType/del',
      {
        id
      }, { method: 'POST' }
    );
  }

  /** 获取生产订单类型 */
  Update(dto: ERPJobTypeInputDto): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psMoType/update',
      dto, { method: 'POST' }
    );
  }

  /** 获取当前工厂所属的事业部 */
  GetSch_Reg(plantCode: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psMoType/getScheduleRegion?plantCode=' + plantCode ,
      {
      }, { method: 'GET' }
    );
  }

  /** 获取生产订单类型 */
  GetMo_Type(dto: any): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psMoType/getMoTypeDistinct',
      {
        dto
      }, { method: 'GET' }
    );
  }

  /** 获取 主组织 */
  GetMasterOrganizationids(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psMoType/getMasterPlant',
      {
      }, { method: 'GET' });
  }

  /** 获取 事业部 */
  GetScheduleRegion(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/workbench/GetAllScheduleRegion',
      {
        enableFlag : "Y"
      }, { method: 'GET' }
    );
  }


  /** 获取事业部 */
  GetSCh_REG(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/admin/workbench/GetUserScheduleRegion',
      {
        enableFlag : "Y"
      }, { method: 'GET' }
    );
  }

  /** 获取初始化工厂 */
  GetPlantCode(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/psMoType/getPlant',
      {
      }, { method: 'GET' }
    );
  }

  // QueryPage(strPlantCode: string, strItemCode: string, strEnableFlag: string, strDescriptions: string, page: number, pageSize: number): Observable<GridSearchResponseDto> {
  //   return this.appApiService.call<GridSearchResponseDto>(
  //     '/afs/serverpserpjobtype/erpjob/GetOrganizations?QueryPage=' + strPlantCode + '&strItemCode=' + strItemCode + '&strEnableFlag=' + strEnableFlag + '&strDescriptions=' + strDescriptions + '&pageIndex=' + page.toString() + '&pageSize=' + pageSize.toString(),
  //     {
  //     }, { method: 'POST' });
  // }

  // QueryPageByPOST(dto: any): Observable<any> {
  //   return this.appApiService.call<any>(
  //     '/afs/serverpserpjobtype/erpjob/GetOrganizations',
  //     {
  //       dto
  //     }, { method: 'POST' });
  // }
}
