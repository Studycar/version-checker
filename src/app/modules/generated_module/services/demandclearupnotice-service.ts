import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { DemandclearupnoticeInputDto } from 'app/modules/generated_module/dtos/Demandclearupnotice-input-dto';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/**需求整理工作台维护服务 */
export class DemandclearupnoticeService {
  constructor(
    private appApiService: AppApiService,
    private commonqueryService: CommonQueryService,
    public http: _HttpClient
  ) { }
  seachUrl = '/api/ps/ppReqOrders/post/queryReqOrdersInfo';
  exportUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverppdemandclearupnotice/demandclearupnotice/ExportInfo';
  seachSplitUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverppdemandclearupnotice/demandclearupnotice/GetSameParnetOrder';
  saveSplitOrderSUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverppdemandclearupnotice/demandclearupnotice/SplitAdd';
  seachnonstdreqUrl = '/api/ps/ppReqOrders/getNonStandard';
  seachhistoryUrl = '/api/ps/ppReqOrders/getChangeHistory';
  lockMaterSendMesUrl = '/api/ps/ppReqOrders/lockMaterSendMes';
  batchLockMaterForMesUrl = '/api/ps/ppReqOrders/batchLockRawRequest';
  batchUnLockMaterForMesUrl = '/api/ps/ppReqOrders/batchUnLockRawRequest';
  completeRouteInfoUrl = '/api/pi/piReqOrders/completeRouteInfo';
  validGenerateDispatchNumUrl = '/api/ps/ppReqOrders/validGenerateDispatchNum';

  QueryRequest(queryParams: any): Observable<GridSearchResponseDto> {
    return this.http
      .post<GridSearchResponseDto>(this.seachUrl + '/getorder', queryParams);
  }

  /** 取消拆分/合并 */
  cancelSplitorMergeOrder(id: string): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/cancelSplitMerge',
      id
    );
  }

  /** 取消订单 */
  cancelOrder(id: string, PLANT_CODE: string, REQ_NUMBER: string, REQ_LINE_NUM: string, CANCEL_COMMENTS: string): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/cancelOrder',
      {
        id: id,
        plantCode: PLANT_CODE,
        reqNumber: REQ_NUMBER,
        reqLineNum: REQ_LINE_NUM,
        cancelComments: CANCEL_COMMENTS,
      }
    );
  }

  /** 合并订单 */
  MergeOrder(ids: string[]): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/mergeOrder',
      ids
    );
  }

  /** 合并订单 */
  LockMaterSendMes(dtos: any[]): Observable<ResponseDto> {
    return this.http.post(
      this.lockMaterSendMesUrl,
      dtos
    );
  }

  /** 批量锁料 */
  batchLockMaterForMes(dtos: any[]): Observable<ResponseDto> {
    return this.http.post(
      this.batchLockMaterForMesUrl,
      dtos
    );
  }

  /** 批量解锁 */
  batchUnLockMaterForMes(dtos: any[]): Observable<ResponseDto> {
    return this.http.post(
      this.batchUnLockMaterForMesUrl,
      dtos
    );
  }

  /** 完善制造路径 */
  completeRouteInfo(dtos: any[]): Observable<ResponseDto> {
    return this.http.post(
      this.completeRouteInfoUrl,
      dtos
    );
  }

  /** 生成派单前校验订单 */
  ValidGenerateDispatchNum(plantCode: string, projectNumList: any[]): Observable<ResponseDto> {
    return this.http.post(
      this.validGenerateDispatchNumUrl,
      { plantCode, projectNumList }
    );
  }

  /** 绑定、解绑 */
  BindReqOrder(plantCode: string, projectNumberList: string[], bindReq: 'Y' | 'N'): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/bindReqOrder',
      {
        plantCode,
        projectNumberList,
        bindReq
      }
    );
  }

  /** 关闭 */
  closeReqOrder(id, cancelComments): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/close',
      {
        id,
        cancelComments
      }
    );
  }

  /** 编辑 */
  Edit(dto: DemandclearupnoticeInputDto): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/save',
      dto
    );
  }

  /** 复制 */
  Copy(id, cancelComments): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/copy',
      {
        id,
        cancelComments
      }
    );
  }

  EditNonStdReq(dto: DemandclearupnoticeInputDto): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/nonStandardSave',
      dto
    );
  }

  /** 删除 */
  Remove(id: string): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/deleteNonStandard',
      id
    );
  }



  /** 保存拆分订单  */
  saveSplitOrder(dtos: any[]): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/saveSplitOrder',
      dtos,
    );
  }

  /** 保存非标需求  */
  saveNonStdResquest(dtos: any): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverppdemandclearupnotice/demandclearupnotice/NonStdResquestAdd',

      dtos
      ,
    );
  }

  /** 发布MTS  */
  PublishData(plantCode: string, ids: string[]): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppMtsPegging/release',
      { plantCode, ids }
    );
  }

  /** 获取 非标计划组 */
  GetNonStdTypeScheduleGroup(PLANT_CODE: string, ITEM_ID: string, REQ_TYPE: string): Observable<ResponseDto> {
    return this.http.get(
      '/api/ps/ppReqOrders/queryScheduleGroup',
      {
        plantCode: PLANT_CODE,
        itemId: ITEM_ID,
        reqType: REQ_TYPE,
      }
    );
  }



  /** 获取 非标生产线 */
  GetNonStdTypeProductLine(PLANT_CODE: string, SCHEDULE_GROUP_CODE: string, ITEM_ID: string, REQ_TYPE: string): Observable<ResponseDto> {
    return this.http.get(
      '/api/ps/ppReqOrders/queryResource',
      {
        plantCode: PLANT_CODE,
        scheduleGroupCode: SCHEDULE_GROUP_CODE,
        itemId: ITEM_ID,
        reqType: REQ_TYPE,
      }
    );
  }

  /** 获取 色标卡 */
  GetColor(): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverppdemandclearupnotice/demandclearupnotice/GetColor',
      {

      },
    );
  }

  /** 获取 供应子库 */
  GetSupplySubinventorys(PLANT_CODE: string): Observable<ResponseDto> {
    return this.http.get(
      '/api/ps/ppReqOrders/getSupplySubInventory',
      { plantCode: PLANT_CODE }
    );
  }

  /** 获取 订单来源 */
  GetOderSources(language?: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/servermessage/MessageService/GetLookUpType',
      {
        lookUpType: 'PP_DM_SOURCE_SYSTEM',
        language: (language === undefined ? '' : language)
      },
    );
  }
  /** 获取编辑页面信息 */
  GetInfo(id: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverppdemandclearupnotice/demandclearupnotice/GetSingle?id=' + id,
      {
      }, { method: 'GET' });
  }


  /** 生成工单 */
  setMakeOrder(plantCode: string, projectNumList: string[]): Observable<ResponseDto> {
    return this.http.post(
      '/api/ps/ppReqOrders/generateDispatchNum',
      {
        plantCode, projectNumList
      }
    );
  }



  public loadMaterials(e: any, plantCode: string): Observable<any> {
    const pageIndex = Number((e.Skip || 0) / (e.PageSize || 1) + 1);
    const pageSize = Number(e.PageSize);
    const itemCode = e.SearchValue || '';
    return this.commonqueryService
      .getUserPlantItemPageList(plantCode, itemCode, '', pageIndex, pageSize)
      .map(it => {
        return { data: it.data.content, total: it.data.totalElements };
      });

  }

  importData(data): Observable<ResponseDto> {
    return this.http.post('/api/ps/ppReqOrders/importData', data);
  }

}
