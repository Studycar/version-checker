import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class SopDemandAnalysisdm {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {}

    url = '/api/sop/sopDemandDivision/query';

    /*GetRegion(plantCode: string, user: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/GetPlantBusiness?userid=' + user + '&plantCode=' + plantCode,
            {

            }, { method: 'GET' }
        );
    }*/

    /*GetById(Id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }*/


    /*EditData(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/EditData',
            {
                dto
            }
        );
    }*/

    /*remove(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/remove',
            {
                dto
            }
        );
    }*/

    /*RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/RemoveBath',
            {
                dtos
            }
        );
    }*/

    /*SaveForNew(dto: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDemandAnalysisdm/ServerSopDemandAnalysisdm/SaveForNew',
            {
                dto
            }
        );
    }*/

    save(dto: {[key: string]: any}): Observable<ResponseDto> {
      return this.http.post(
        '/api/sop/sopDemandDivision/save',
        dto
      );
    }

    /*GetGroup(value: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDimmainresreView/ServerSopDimmainresreView/GetGroup?plantCode=' + value,
            {

            }, { method: 'GET' }
        );
    }*/

    /*GetDivision(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/ServerSopDimmainresreView/ServerSopDimmainresreView//GetDivision',
            {

            }, { method: 'GET' }
        );
    }*/

    GetDemand(businessUnitCode: string): Observable<ResponseDto> {
        return this.http.get(
          '/api/sop/sopDemandDivision/getDemandDimension',
          { businessUnitCode }
        );
    }
}
