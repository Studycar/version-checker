import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { DeliveryRatioReplaceDto } from '../dtos/delivery-ratio-replace-dto';
@Injectable()
export class DeliveryRatioReplaceService {
    constructor(private appApiService: AppApiService) { }
    // URL_Prefix = '/afs/ServerMrpDeliveryRatioReplace/DeliveryRatioReplaceService/';
    baseUrl = '/api/pc/pcVendorAllocationPercent/'; // 基路径
    seachUrl = this.baseUrl + 'page';
   

    // GetById(Id: string): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         // '/afs/ServerSopRegionPlant/ServerSopRegionPlant/GetById?Id=' + Id,
    //         this.URL_Prefix + 'GetById?Id=' + Id,
    //         {

    //         }, { method: 'GET' }
    //     );
    // }

}
