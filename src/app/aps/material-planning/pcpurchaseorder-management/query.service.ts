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
  public purchaseOrderManagementQueryUrl = this.requisitionWorkbenchBaseUrl + 'queryPurchaseOrderManagement';
  public purchaseOrderManagementQuery = { url: this.purchaseOrderManagementQueryUrl, method: 'POST' };

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
   GetPoNumberByPlant(plantCode: string,poType: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      this.requisitionWorkbenchBaseUrl + 'getPoNumberByPlant', { plantCode,poType}
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

 // 获取订单信息数据
 QueryPoNumberByPlantPage( plantCode:string,poType:string, searchPoNumber:string,  pageIndex:number,  pageSize:number): Observable<GridSearchResponseDto> {
  return this.http.get<GridSearchResponseDto>(
   this.requisitionWorkbenchBaseUrl + 'getPoNumberByPlantPage', { plantCode:plantCode, poType:poType, searchPoNumber:searchPoNumber,  pageIndex:pageIndex, pageSize:pageSize},
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

  RemovePcPurchaseOrder(inputDto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      this.requisitionWorkbenchBaseUrl + 'removePcPurchaseOrder', inputDto,
    );
 }
    // PR发布PO采购计划单
  PublishPcRequisitionOrder(inputDto: any): Observable<ActionResponseDto> {
      return this.http.post<ActionResponseDto>(
        this.requisitionWorkbenchBaseUrl + 'publishPcRequisitionOrder', { listPublishData: inputDto },
      );
    }
  //保存采购订单信息
  SavePcPurchaseOrder(inputDto: any): Observable<ActionResponseDto> {
      return this.http.post<ActionResponseDto>(
        this.requisitionWorkbenchBaseUrl + 'savePcPurchaseOrder', { listSaveData: inputDto },
      );
    }
  // 取消OR关闭采购订单
  CancelPcPurchaseOrder(inputDto: any): Observable<ActionResponseDto> {
      return this.http.post<ActionResponseDto>(
        this.requisitionWorkbenchBaseUrl + 'cancelPcPurchaseOrder', { listCancelData: inputDto },
      );
  }
  //采购订单转单
  ExchangePcPurchaseOrder(inputDto: any): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      this.requisitionWorkbenchBaseUrl + 'exchangePcPurchaseOrder', { listCancelData: inputDto },
    );
  }
    // 获取工厂物料对应的供应商库存地点
 GetVendorSiteByPlantItem(plantCode: string,itemCode:string): Observable<ActionResponseDto> {
  return this.http.get<ActionResponseDto>(
    this.requisitionWorkbenchBaseUrl + 'getVendorSiteByPlantItem', { plantCode,itemCode }
  );
}
 // 获取工厂物料对应的供应商
 GetVendorByPlantItemPage(plantCode: string,itemCode:string,vendorCode:string,pageIndex:number,  pageSize:number): Observable<GridSearchResponseDto> {
  return this.http.get<GridSearchResponseDto>(
    this.requisitionWorkbenchBaseUrl + 'getVendorByPlantItemPage', { plantCode,itemCode,vendorCode,pageIndex,pageSize}
  );
 }

 RemoveBathPurchaseOrder( inputDto: any) {
  return this.appApiService.call<ActionResponseDto>(
    this.requisitionWorkbenchBaseUrl + 'removeBathPurchaseOrder',
      {
        listRemoveData:inputDto
      }
  );
}
ApprovalPurchaseOrder(inputDto: any) {
  return this.appApiService.call<ActionResponseDto>(
    this.requisitionWorkbenchBaseUrl + 'approvalPurchaseOrder', inputDto
  );
}

GetPurchaseOrderById(Id: string): Observable<ActionResponseDto> {
  return this.appApiService.call<ActionResponseDto>(
    this.requisitionWorkbenchBaseUrl + 'getPurchaseOrderById?id=' + Id,
      {

      }, { method: 'GET' }
  );
}
}

