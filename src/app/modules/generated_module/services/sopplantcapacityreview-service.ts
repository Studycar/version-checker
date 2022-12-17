import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { SupplierDro } from '../dtos/supplier-dto';
import { _HttpClient } from '@delon/theme';
import { SopDimmainresrevViewDto } from '../dtos/sopdimmainresrevview-dto';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';

@Injectable()  

export class SopPlantCapacityReviewService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) {}

    url = '/api/sop/sopplantcapabilityreview/querySopPlantCapabilityReview';
    exportUrl = '/afs/ServerSopPlantCapacityReview/ServerSopPlantCapacityReview/ExportData';

    detailUrl = '/api/sop/sopplantcapabilityreview/querySopPlantCapabilityReviewChild';
    ExportdetailUrl = '/afs/ServerSopPlantCapacityReview/ServerSopPlantCapacityReview/ExportDetailData';


    /** 获取 产能分类 */
  GetCapacityClass(businessUnitCode = ''): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/sop/sopplantcapabilityreview/querySopCapacityclass?businessUnitCode=' +
      businessUnitCode,
      {}, { method: 'GET' }
    );
  }
  
   
}
