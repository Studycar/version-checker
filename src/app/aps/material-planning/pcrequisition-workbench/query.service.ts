import { Injectable } from '@angular/core';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';

@Injectable()
export class QueryService extends CommonQueryService {

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService

  ) {
    super(http, appApiService);
  }

  requisitionWorkbenchBaseUrl = '/api/pc/pcrequisition/';
  public planWorkbenchQueryUrl = this.requisitionWorkbenchBaseUrl + 'queryRequisitionWorkbench';
  public planWorkbenchQuery = { url: this.planWorkbenchQueryUrl, method: 'POST' };

  public planExceptionQuery = { url: this.requisitionWorkbenchBaseUrl + 'queryPlanException', method: 'POST' };
  public planOnhandQuery = { url: this.requisitionWorkbenchBaseUrl + 'queryPlanOnhand', method: 'POST' };
  public planPeggingQuery = { url: this.requisitionWorkbenchBaseUrl + 'queryPlanPegging', method: 'POST' };


  // 获取计划相关数据
  GetDocumentNumByPlant(plantCode: string,poType: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      this.requisitionWorkbenchBaseUrl + 'getDocumentNumByPlant', { plantCode,poType}
    );
  }
  // 获取计划相关数据
  QueryLatestVersion(planName: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      this.requisitionWorkbenchBaseUrl + 'queryLatestVersion', { planName }
    );
  }
   // 获取计划相关数据-收货地点
   GetDeliverLocation(plantCode: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      this.requisitionWorkbenchBaseUrl + 'getDeliverLocation', { plantCode }
    );
  }
   // 获取计划相关数据 子库
   GetSubinventory(plantCode: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      this.requisitionWorkbenchBaseUrl + 'getSubinventory', { plantCode }
    );
  }
  // 获取依赖编号数据
  GetDocumentNumByPlantPage( plantCode:string, poType:string,   searchDocumentNum:string ,  pageIndex:number,  pageSize:number): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
     this.requisitionWorkbenchBaseUrl + 'getDocumentNumByPlantPage', { plantCode:plantCode, poType:poType,searchDocumentNum:searchDocumentNum, pageIndex:pageIndex, pageSize:pageSize},
    );
  }
  // 获取供应商数据
  QueryVendor( plantCode:string, vendorCode:string,  pageIndex:number,  pageSize:number): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
     this.requisitionWorkbenchBaseUrl + 'queryVendor', { plantCode:plantCode, vendorCode:vendorCode, pageIndex:pageIndex, pageSize:pageSize},
    );
  }
  //获取接收地点信息
  QueryDeliverLocation( plantCode:string, deliverLocationCode:string,  pageIndex:number,  pageSize:number): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      this.requisitionWorkbenchBaseUrl + 'queryDeliverLocation', { plantCode:plantCode, deliverLocationCode:deliverLocationCode, pageIndex:pageIndex, pageSize:pageSize},
    );
  }
    //获取子库信息
  QuerySubinventory( plantCode:string, subinventoryCode:string,  pageIndex:number,  pageSize:number): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      this.requisitionWorkbenchBaseUrl + 'querySubinventory', { plantCode:plantCode, subinventoryCode:subinventoryCode, pageIndex:pageIndex, pageSize:pageSize},
    );
  }

    // PR发布PO采购计划单
  PublishPcRequisitionOrder(inputDto: any): Observable<ActionResponseDto> {
      return this.http.post<ActionResponseDto>(
        this.requisitionWorkbenchBaseUrl + 'publishPcRequisitionOrder', inputDto
      );
    }
  }

