/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:49
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-18 19:42:00
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { MoManagerDto } from './../dtos/mo-manager-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class MoManagerService {
    constructor(private appApiService: AppApiService) { }
    searchUrl = '/api/ps/psMakeOrder/pageQuery';
    exportUrl = '/api/ps/psMakeOrder/export';

    public GetResource(schedulegroup: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psMakeOrder/getResource?scheduleGroupCode=' + schedulegroup,
            {

            }, { method: 'GET' }
        );
    }

    public GetGroup(plantcode: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/admin/psschedulegroup/getScheduleGroup?plantcode=' + plantcode,
            {
            }, { method: 'GET' }
        );
    }


    public countmocap(dto: MoManagerDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/tp/tpCommon/countmocap',
            {
                dto
            }
        );
    }


    // public countmocap(dto: MoManagerDto): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpsmomanager/psmomanager/countmocap',
    //         {
    //             dto
    //         }
    //     );
    // }

    public GetById(Id: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psMakeOrder/getById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }
    public GetById_java(Id: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/tp/tpCommon/getById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }


    public Edit(dto: MoManagerDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psMakeOrder/edit', dto
        );
    }

    public edit_java(dto: MoManagerDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/tp/tpCommon/edit', dto, { method: 'POST' }
        );
    }


    GetResourceByItem(itemCode: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmomanager/psmomanager/GetResourceByItem?itemCode=' + itemCode,
            {

            }, { method: 'GET' }
        );
    }

    changeSchedule(dtos: string[]): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psMakeOrder/changeSchedule', dtos
        );
    }

    checkSchedule(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsmomanager/psmomanager/checkSchedule', dtos
        );
    }

    GetPrivilege(userId: string, plantCode: string, scheduleGroupCode: string, resourceCode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/psprivilege/getPrivilege',
            {
                strUserId: userId,
                plantCode: plantCode,
                scheduleGroupCode: scheduleGroupCode,
                resourceCode: resourceCode
            }, { method: 'POST' }
        );
    }
    /**根据物料获取工艺版本*/
    public GetThenVersionByItem(
        itemCode: string,
        resource = '',
      ): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
          '/api/tp/tpCommon/getThenVersionByItem?itemCode=' + itemCode,
          {
            
          }, { method: 'GET' }
        );
      }

/**根据物料编码获取物料的磨具*/
public GetItemMolds({
    itemCode,
    plantCode ,
  }): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/api/tp/tpCommon/querymaterialmold',
      {
        itemCode: itemCode,
        plantCode: plantCode,
      }, { method: 'POST' }
    );
  }

}
