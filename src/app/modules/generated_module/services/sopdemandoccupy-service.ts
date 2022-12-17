import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { MtsPlanOptionInputDto } from '../../../modules/generated_module/dtos/mts-plan-option-input-dto';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { _HttpClient } from '@delon/theme';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';

@Injectable()
export class SopDemandOccupyService {
  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  seachUrlSum = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupySumPage';
  seachUrlSumExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupySum';
  seachUrlChild = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyPage';
  seachUrlChildExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupy';
  seachUrlDtl = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDtlPage';
  seachUrlDtlExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDtl';

  // 总装资源检讨
  seachUrlFinalSum = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyFinalSumPage';
  seachUrlFinalSumExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyFinalSum';
  seachUrlFinalChild = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyFinalPage';
  seachUrlFinalChildExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyFinal';


  // 注塑机台
  seachUrlDemandSum = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDemandSumPage';
  seachUrlDemandSumExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDemandSum';
  seachUrlDemandChild = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDemandPage';
  seachUrlDemandChildExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDemand';
  seachUrlDemandDtl = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDtlDemandPage';
  seachUrlDemandDtlExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDtlDemand';
  
  // 模具
  seachUrlDieSum = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDieSumPage';
  seachUrlDieSumExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDieSum';
  seachUrlDieChild = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDiePage';
  seachUrlDieChildExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDie';
  seachUrlDieDtl = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDtlDiePage';
  seachUrlDieDtlExp = '/afs/serversopoccupy/sopoccupy/QuerySopDemandOccupyDtlDie';

  method = 'POST';


  public Edit(dto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serversopoccupy/sopoccupy/Edit', dto);

  }

  // /** 编辑 */
  // public Edit(PLANT_CODE: string, BATCH_TYPE: string, BATCH_NUMBER: string): Observable<ActionResponseDto> {

  //   return this.http.post<ActionResponseDto>(
  //     '/afs/serversopoccupy/sopoccupy/Edit',
  //     {
  //       PLANT_CODE: PLANT_CODE,
  //       BATCH_TYPE: BATCH_TYPE,
  //       BATCH_NUMBER: BATCH_NUMBER
  //     });
  // }


  /** 获取版本 */
  public GetBatchPageList(PLANT_CODE: string, BATCH_TYPE: string, BATCH_NUMBER: string, PageIndex: number = 1, PageSize: number = 10): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/afs/serversopoccupy/sopoccupy/GetBatch',
      {
        PLANT_CODE: PLANT_CODE,
        BATCH_TYPE: BATCH_TYPE,
        BATCH_NUMBER: BATCH_NUMBER,
        PageIndex: PageIndex,
        PageSize: PageSize
      });
  }

}

