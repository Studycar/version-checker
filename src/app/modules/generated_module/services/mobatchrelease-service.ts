/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:49
 * @LastEditors: Zwh
 * @LastEditTime: 2021-02-27 18:30:00
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';


@Injectable()
/** 快码管理服务 */
export class MOBatchReleaseService {
  constructor(private appApiService: AppApiService) { }

  seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaselookupcode/lookuptype/querylookuptype';

  /** 获取事业部 */
  GetCurSchReg(): Observable<any> {
    return this.appApiService.call<any>(
      '/afs/serverpsmobatchrelease/mobatchrelease/GetScheduleRegion',
      {
      }, { method: 'GET' }
    );
  }

  /** 获取事业部 */
  GetSCh_REG(): Observable<any> {
    return this.appApiService.call<any>(
      '/afs/serverbaseworkbench/workbench/GetUserScheduleRegion',
      {
      }, { method: 'GET' }
    );
  }

  /** 获取当前工厂所属的事业部 */
  GetCurSch_Reg(plant_code: string): Observable<any> {
    return this.appApiService.call<any>(
      '/afs/serverpsmobatchrelease/mobatchrelease/GetScheduleGroup?plant_code=' + plant_code,
      {
      }, { method: 'GET' }
    );
  }

  /** 查询*/
  Query(Param: any, PAGE_INDEX: number, PAGE_SIZE: number): Observable<any> {
    return this.appApiService.call<any>(
      '/afs/serverpsmobatchrelease/mobatchrelease/queryMoBatchRel',
      {
        Param,
        PAGE_INDEX,
        PAGE_SIZE,
      });
  }

  /** 查询子层*/
  QueryFrom(plantids: any, orderid: any, PAGE_INDEX: number, PAGE_SIZE: number): Observable<any> {
    return this.appApiService.call<any>(
      '/api/ps/moBatchRelease/queryFromMoBatchRel?plantCode=' + plantids + '&makeOrderNum=' + orderid
      + '&pageIndex=' + PAGE_INDEX + '&pageSize=' + PAGE_SIZE,
      {
      }, { method: 'GET' });
  }

  /** 输入ItemCode自动查询物料描述*/
  GetDescByItemCode(itemcode: any): Observable<any> {
    return this.appApiService.call<any>(
      '/api/ps/psItem/getItemDetail/' + itemcode,
      {
      }, { method: 'GET' });
  }

  /** 根据工单获取下层工单和它本身 */
  getSelection(monum: string): Observable<any> {
    return this.appApiService.call<any>(
      '/api/ps/moBatchRelease/getSelection?makeOrderNum=' + monum,
      {
      }, { method: 'GET' });
  }

  /* 批量发放*/
  BacthRelease(idList: any, flag: any, makeOrderNum: string, plantCode: string): Observable<any> {
    return this.appApiService.call<any>(
      '/api/ps/moBatchRelease/batchRelease',
      {
        idList,
        flag,
        makeOrderNum,
        plantCode
      }, { method: 'POST' });
  }
}
