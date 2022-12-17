import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';


@Injectable()
export class EditService extends CommonQueryService {
  /* -------------------调整网格编辑------------------ */
  private updatedItems: any[] = [];

  private getIndex(item: any, data: any[], keyField = 'ID'): number {
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
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
  queryUrl = '/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/QueryAll';
  /** 搜索 */
  Search(scheduleRegionCode: string, plantCode: string, productLineCodeList: string[], startTime: string, endTime: string, isLoadRoutings: boolean = true, ids: string[] = []): Observable<GridSearchResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/QueryAll', {
        scheduleRegionCode,
        plantCode,
        productLineCodeList,
        startTime,
        endTime,
        isLoadRoutings,
        ids
      });
  }
  /** 调整保存 */
  Save(scheduleRegionCode: string, plantCode: string, startTime: string, endTime: string, dtos: any[]): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/Adjust', {
        scheduleRegionCode: scheduleRegionCode,
        plantCode: plantCode,
        startTime: startTime,
        endTime: endTime,
        dtos: dtos
      });
  }
  /** 批量按资源调整 */
  BatchMove(targetMoId: string, sourceMoIds: string[]): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/BatchMove', {
        targetMoId: targetMoId,
        sourceMoIds: sourceMoIds
      });
  }
  /** 产能平衡 */
  CaculateWorking(plantCode: string, productLineCode: string, startTime: string, endTime: string, sourceMoIds: string[]): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/CaculateWorking', {
        plantCode: plantCode,
        productLineCode: productLineCode,
        startTime: startTime,
        endTime: endTime,
        sourceMoIds: sourceMoIds
      });
  }
  /** 置尾单 */
  SetEndMo(moIds: string[], reason: string): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/SetEndMo', {
        moIds: moIds,
        reason: reason
      });
  }
  /** 固定 */
  FixMo(fixMoList: any[], fixType: boolean): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/FixMo', {
        fixMoList: fixMoList,
        fixType: fixType
      });
  }
  /** 备注 */
  RemarkMo(dtos: any[]): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/RemarkMo', {
        dtos: dtos
      });
  }
  /** 获取多个物料工艺路线的交集 */
  GetItemIntersection(plantCode: string, itemIds: string[]): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/GetItemIntersection', {
        plantCode: plantCode,
        itemIds: itemIds
      });
  }
  /** 获取计划组(集约选线时间) */
  GetScheduleGroup(PLANT_CODE: string, SCHEDULE_GROUP_CODE: string): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/GetScheduleGroup', {
        PLANT_CODE: PLANT_CODE,
        SCHEDULE_GROUP_CODE: SCHEDULE_GROUP_CODE
      });
  }
  /** 获取产线日历列表
   * dto格式:{
      PLANT_CODE: '',
      RESOURCE_CODE: '',
      SHOW_CALENDAR_DAY: ''
    }*/
  GetCalendarList(dto = {}): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpscalendar/CalendarService/GetResTimeList', {
        dto
      });
  }
  /** 获取工序工单簇 */
  GetMoLevel(moId: string, dealLevel: boolean = true, isExpand: boolean = true): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/GetMoLevel', {
        moId: moId,
        dealLevel: dealLevel,
        isExpand: isExpand
      });
  }

  /** 获取工单簇 */
  GetGraphicalMoLevel(moId: string): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/GetGraphicalMoLevel', {
        moId: moId
      });
  }

  /** 刷新 */
  Refresh(plantCode: string, productLineCodeList: string[], startTime: string, endTime: string, refreshType: string = 'S'): Observable<any> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/Refresh', {
        plantCode,
        productLineCodeList,
        refreshType,
        startTime,
        endTime
      });
  }
  /** 工序工单联动 */
  SubmitRequest_MoRecursive(plantCode: string, resourceCodes: string[], scheduleGroupCodes: string[] = []): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/SubmitRequest_MoRecursive', {
        plantCode: plantCode,
        resourceCodes: resourceCodes,
        scheduleGroupCodes: scheduleGroupCodes
      });
  }

  /* 计划发布--- 以下功能后台未修改 */
  // 事业部、计划组、工厂、生产线、开始时间、结束时间、版本号、确认标识
  PlanRelease(regionCode: string,
    schedule_group_code: string,
    plantCode: string,
    productLineCodeList: string[],
    startTime: string,
    endTime: string,
    version: string,
    confirm_flag: string,
    remark: string
  ): Observable<any> {
    // 转化时间
    startTime = this.formatDateTime(startTime);
    endTime = this.formatDateTime(endTime);
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/PlanRelease', {
        regionCode,
        schedule_group_code,
        plantCode,
        productLineCodeList,
        startTime,
        endTime,
        version,
        confirm_flag,
        remark
      });
  }
  /** 集约选线 */
  SubmitRequest_ChooseSchedule(dtos: any[]): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/SubmitRequest_ChooseSchedule', {
        dtos: dtos
      });
  }
  /** 上层联动 */
  SubmitRequest_UpperLevelLinkage(plantCode: string, resourceCodes: string[], scheduleGroupCodes: string[] = []): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsdigitalizationworkbenchrs/DigitalizationWorkbenchService/SubmitRequest_UpperLevelLinkage', {
        plantCode: plantCode,
        resourceCodes: resourceCodes,
        scheduleGroupCodes: scheduleGroupCodes
      });
  }
  /** 工单指定资源速率 */
  SetResourceAndRate(moIds: string[], dto: any): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/SetResourceAndRate', {
        moIds: moIds,
        dto: dto
      });
  }

  /** 工单指定资源速率 */
  GetResourceAndRate(id): Observable<ActionResponseDto> {
    return this.http.post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/GetResourceAndRate', {
      id
    });
  }

  /** 获取单个物料的工艺路线 */
  GetItemRoutings(plantCode: string, itemId: string, processCode: string): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/GetItemRoutings', {
        plantCode: plantCode,
        itemId: itemId,
        processCode: processCode
      });
  }
  /** 保存工序工单数量拆分 */
  SaveSplitMoQty(dtos: any[]): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/SaveSplitMoQty', {
        dtos: dtos
      });
  }

  /** 保存颜色 */
  MarkColour(ID: string, MARK_COLOUR: string): Observable<ActionResponseDto> {
    return this.http
      .post('/afs/serverpsopdigitalizationworkbench/OpDigitalizationWorkbenchService/MarkColour', {
        ID: ID,
        MARK_COLOUR: MARK_COLOUR
      });
  }
}


