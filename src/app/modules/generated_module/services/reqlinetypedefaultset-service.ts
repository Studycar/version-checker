import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ResponseDto } from '../dtos/response-dto';
import { ReqLineTypeDefaultSetDto } from '../dtos/req-line-type-defaultset-dto';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()

export class ReqLineTypeDefaultSetService {
    constructor(
        private appApiService: AppApiService,
        public http: _HttpClient,
    ) {}
    url  = '/api/ps/ppreqlinetypedefaultset/getData';

    /*GetSchedule(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/afs/serverppreqlinetypedefaultset/PPReqLineTypeDefaultSet/GetScheduleRegion',
            {

            }, { method: 'GET' }
        );
    }*/

      /**获取物料分页信息*/
  public GetUserPlantItemPageList(plantCode: string, itemCode: string, descriptions: string, pageIndex: number = 1, pageSize: number = 10, itemId: string = ''): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psItem/pageItem?plantCode=' + plantCode + '&itemId=' + itemId + '&itemCode=' + itemCode + '&descriptions=' + descriptions + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
      {
        // plantCode: plantCode,
        // itemId: itemId,
        // itemCode: itemCode,
        // descriptions: descriptions,
        // pageIndex: pageIndex,
        // pageSize: pageSize
      });
  }

  GetSchedule(): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto> (
      '/api/ps/ppreqlinetypedefaultset/getScheduleRegion',
      { },
      { method: 'GET' }
    );
  }

    GetPlant(region: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset//getPlant?region=' + region,
            {

            }
        );
    }

    GetLineType(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/getLineType',
            {

            }, { method: 'GET' }
        );
    }

    GetMoType(plantCode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/getMoType?plantCode=' + plantCode,
            {

            }, { method: 'GET' }
        );
    }

    remove(dto: ReqLineTypeDefaultSetDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/remove', dto
            
        );
    }

    RemoveBath(dtos: string[]) {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/removeBath', dtos
         
        );
    }

    GetById(id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/getById?id=' + id,
            {

            }, { method: 'GET' }
        );
    }


    GetGroup(plantcode: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/getGroup?plantCode=' + plantcode,
            {

            }, { method: 'GET' }
        );
    }


    GetResource(group: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/getResource?group=' + group,
            {

            }, { method: 'GET' }
        );
    }

    EditData(dto: ReqLineTypeDefaultSetDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/editData', dto
        );
    }

    SaveForNew(dto: ReqLineTypeDefaultSetDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/saveForNew', dto
        );
    }


    GetRegion(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/getScheduleRegion',
            {

            }, { method: 'GET' }
        );
    }

    GetSchedule1(plantcode: string) {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/ppreqlinetypedefaultset/getSchedule1?plantCode=' + plantcode,
            {

            }, { method: 'GET' }
        );
    }

}
