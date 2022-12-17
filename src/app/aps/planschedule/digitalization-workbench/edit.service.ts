import { Injectable } from '@angular/core';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { MOBatchReleaseService } from '../../../modules/generated_module/services/mobatchrelease-service';


@Injectable()
export class EditService extends CommonQueryService {

  /* -------------------调整网格编辑------------------ */
  private updatedItems: any[] = [];

  private getIndex(item: any, data: any[], keyField = 'id'): number {
    for (let idx = 0; idx < data.length; idx++) {
      if (data[idx][keyField] === item[keyField]) {
        return idx;
      }
    }
    return -1;
  }

  public update(item: any): void {
    const index = this.getIndex(item, this.updatedItems);
    if (index !== -1) {
      this.updatedItems.splice(index, 1, item);
    } else {
      this.updatedItems.push(item);
    }
  }
  public getUpdateItems(): any[] {
    return this.updatedItems;
  }

  public hasChanges(): boolean {
    return Boolean(this.updatedItems.length);
  }

  public reset() {
    this.updatedItems = [];
  }

  /* ---------------------------------------------- */

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    public mOBatchReleaseService: MOBatchReleaseService,
  ) {
    super(http, appApiService);
  }
  queryUrl = '/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/QueryAll';
  /** 获取遗传算法中已经设置指标的计划组 */
  queryUrlGroup = '/api/ps/digitalizationworkbenchrs/getGAGroup';
  /** 搜索 */
  Search(scheduleRegionCode: string, 
    plantCode: string, 
    projectNumber: string,
    productLineCodeList: string[], 
    startTime: string, endTime: string, isLoadRoutings: boolean = true, ids: string[] = []): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/queryAll', {
        scheduleRegionCode,
        plantCode,
        projectNumber,
        productLineCodeList,
        startTime,
        endTime,
        isLoadRoutings,
        ids
      });
  }
  /** 刷新 */
  Refresh(plantCode: string, productLineCodeList: string[], startTime: string, endTime: string, refreshType: string = 'S'): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/refresh', {
        plantCode,
        productLineCodeList,
        refreshType,
        startTime,
        endTime
      });
  }

  /* 计划发布 */
  // 事业部、计划组、工厂、生产线、开始时间、结束时间、版本号、确认标识
  PlanRelease(regionCode: string,
    scheduleGroupCode: string,
    plantCode: string,
    productLineCodeList: string[],
    startTime: string,
    endTime: string,
    version: string,
    confirmFlag: string,
    similarFlag: string,
    remark: string
  ): Observable<any> {
    // 转化时间
    startTime = this.formatDate(startTime);
    endTime = this.formatDate(endTime);
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/planRelease', {
        regionCode,
        scheduleGroupCode,
        plantCode,
        productLineCodeList,
        startTime,
        endTime,
        version,
        confirmFlag,
        similarFlag,
        remark
      });
  }
  /** 调整保存 */
  Save(scheduleRegionCode: string, plantCode: string, startTime: string, endTime: string, dtos: any[]): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/graphicalScheduling/adjust', {
        scheduleRegionCode: scheduleRegionCode,
        plantCode: plantCode,
        startTime: startTime,
        endTime: endTime,
        dtos: dtos
      });
  }
  /** 批量按资源调整 */
  BatchMove(targetMoId: string, sourceMoIds: string[]): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/digitalizationworkbenchrs/batchMove', {
        targetMoId: targetMoId,
        sourceMoIds: sourceMoIds
      });
  }
  /** 产能平衡 */
  CaculateWorking(plantCode: string, productLineCode: string, startTime: string, endTime: string, sourceMoIds: string[]): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/caculateWorking', {
        plantCode: plantCode,
        productLineCode: productLineCode,
        startTime: startTime,
        endTime: endTime,
        sourceMoIds: sourceMoIds
      });
  }
  /** 获取物料工艺路线 */
  GetItemRoutings(plantCode: string, itemId: string): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/GetItemRoutings', {
        plantCode: plantCode,
        itemId: itemId
      });
  }
  /** 获取多个物料工艺路线的交集 */
  GetItemIntersection(plantCode: string, itemIds: string[]): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/getItemIntersection', {
        plantCode: plantCode,
        itemIds: itemIds
      });
  }


  /** 获取产线日历列表
   * dto格式:{
      PLANT_CODE: '',
      RESOURCE_CODE: '',
      SHOW_CALENDAR_DAY: ''
    }*/
  GetCalendarList(dto = {}): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/pscalendars/getResTimeList', dto);
  }
  /** 置尾单 */
  SetEndMo(moIds: string[], reason: string, backlogClass: string): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/digitalizationworkbenchrs/setEndMo', {
        moIds: moIds,
        reason: reason,
        backlogClass: backlogClass
      });
  }
  /** 固定 */
  FixMo(fixMoList: any[], fixType: boolean): Observable<ActionResponseDto> {
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/fixMo', {
        fixMoList: fixMoList,
        fixType: fixType
      });
  }
  /** 备注 */
  RemarkMo(dtos: any[]): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/remarkMo', dtos);
  }
  /** 获取工单簇 */
  GetMoLevel(moId: string, dealLevel: boolean = true, isExpand: boolean = true): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/GetMoLevel', {
        moId: moId,
        dealLevel: dealLevel,
        isExpand: isExpand
      });
  }

  /** 获取工单簇 */
  GetGraphicalMoLevel(moId: string): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/getGraphicalMoLevel', {
        moId: moId
      });
  }

  /** 工单联动 */
  SubmitRequest_MoRecursive(plantCode: string, resourceInfos: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/graphicalScheduling/moRecursive', {
        plantCode: plantCode,
        resourceInfos: resourceInfos
      });
  }
  /** 上层联动 */
  SubmitRequest_UpperLevelLinkage(plantCode: string, resourceInfos: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/graphicalScheduling/upperLevelLinkage', {
        plantCode: plantCode,
        resourceInfos: resourceInfos
      });
  }
  /** 工单下发到MES */
  SubmitRequest_SendMO2Mes(plantCode: string, resourceInfos: any): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/send2Mes', {
        plantCode: plantCode,
        productLineCodeList: resourceInfos
      });
  }
  /** 集约选线 */
  SubmitRequest_ChooseSchedule(dtos: any[]): Observable<ResponseDto> {
    return this.http
      .post('/api/ps/graphicalScheduling/focusChooseLine', dtos);
  }

  /** 提交智能排产请求 */
  SendGADigit(groupCode: string[], plantCode: string, endBegin: string, endEnd: string): Observable<ActionResponseDto> {
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/sendGADigit', {
        groupCode: groupCode,
        plantCode: plantCode,
        endBegin: endBegin,
        endEnd: endEnd
      });
  }


  /** 获取计划组(集约选线时间) */
  GetScheduleGroup(PLANT_CODE: string, SCHEDULE_GROUP_CODE: string): Observable<ResponseDto> {
    return this.http
      .get('/api/admin/workbench/getScheduleGroupByCode', {
        plantCode: PLANT_CODE,
        scheduleGroupCode: SCHEDULE_GROUP_CODE
      });
  }
  /** 计划单拆分 */
  SplitMo(moId: string, splitList: any[]): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/SplitMo', {
        moId: moId,
        splitList: splitList
      });
  }

  /** 工单指定资源速率 */
  SetResourceAndRate(moIds: string[], dto: any): Observable<ResponseDto> {
    return this.http
      .get('/api/ps/digitalizationworkbenchrs/setResourceAndRate', {
        moIds: moIds,
        dto: dto
      });
  }

  /** 工单指定资源速率 */
  GetResourceAndRate(id, type: string = '1'): Observable<ResponseDto> {
    return this.http.get('/api/ps/digitalizationworkbenchrs/getResourceAndRate', id);
  }

  /** 保存颜色 */
  MarkColour(ID: string, MARK_COLOUR: string): Observable<ActionResponseDto> {
    return this.http
      .post('/api/ps/digitalizationworkbenchrs/markColor', {
        id: ID,
        markColour: MARK_COLOUR,
      });
  }
  /** 开始时间 */
  updateTime(dto: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/updateTime', dto);
  }

  /** 固定时间 */
  updateTimeGD(dto: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/updateTimeGD', dto);
  }

  selfmadeOutsourcing(plantCode: any, itemCode: any) {
    return this.http
      .get('/api/ps/digitalizationworkbenchrs/selfmadeOutsourcing', {
        plantCode: plantCode,
        itemId: itemCode
      });
  }

  /**
   * MO总结
   */
  public queryMoSummary = { url: '/api/ps/digitalizationworkbenchrs/queryMoSummary', method: 'POST' };

  /** 计划单拆分 */
  splitMo(dataItem: any, splitList: any[]): Observable<ResponseDto> {
    return this.http.post('/api/ps/digitalizationworkbenchrs/splitMo', {
      sourceMo: dataItem,
      listSplitMo: splitList
    });
  }

  /** 计划单拆分验证 */
  splitMoCheck(dataItem: any): Observable<ResponseDto> {
    return this.http.post('/api/ps/digitalizationworkbenchrs/splitMoCheck', dataItem);
  }

  /** 齐套计算 */
  kitCalculate(plantCode: string, scheduleGroupCode: string): Observable<ResponseDto> {
    return this.http.get('/api/ps/digitalizationworkbenchrs/kitCalculate',
      { plantCode: plantCode, scheduleGroupCode: scheduleGroupCode }
    );
  }

  /** 排产模拟视频 */
  simulationVideo() {
    return this.http.get('/api/ps/simulation/simulationVideo', {});
  }

  cancelOrder(ids): Observable<ResponseDto> {
    return this.http.post('/api/ps/psMakeOrder/cancelMo', ids);
  }


  public moBacthRelease(ids: any, flag: any, monum: any, plantcode: string): Observable<any> {
    return this.mOBatchReleaseService.BacthRelease(ids, flag, monum, plantcode);
  }
}


