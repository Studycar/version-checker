import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { PredictionOffSetshowInputDto } from 'app/modules/generated_module/dtos/prediction-off-setshow-input-dto';

@Injectable()
/** 预测与冲减 */
export class PredictionOffSetshowService {
    constructor(private appApiService: AppApiService) { }

    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/QueryForecast';

    seachPlantUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/getplant';
    seachlookupUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/getlookupbytype';
    // 查询明细
    seachUrlInfo = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/QueryForecastDetails';

    // 查询释放日期
    seachUrlDateInfo = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/getdate';



    /** 搜索 子页面查询*/
    Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/QuerySyncHistoryInfo',
            {
                request
            });
    }


    /**编辑页面 获取所有绑定的组织*/
    GetAppliactioPlant(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
        '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/GetAppliactioPlant',
        {
        });  
    }

    /**  获取快码*/
    Getlookupbytype(type: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
        '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/getlookupbytype?type=' + type,
        {
        });  
    }

    /** 获取所有ITEM 根据工厂ID*/
    GetAppliactioItemByPlantID(plantId: string, itemCode: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
        '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/getitemCode?plantId=' + plantId + '&itemCode=' + itemCode,
        {
        });  
    }



    /** 编辑信息 */
    Edit(dto: PredictionOffSetshowInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/Edit',
            {
                dto
            });
    }

    /** 获取 */
    Get(id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/Get?id=' + id ,
            {
            }, { method: 'GET' });
      }


    /** 编辑信息 */
    ForecastDate(plantid: string, dates: string, batch_id: string, userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpppredictionoffsetshow/pppredictionoffsetshow/main_new?plantid=' + plantid + '&dates=' + dates + '&batch_id=' + batch_id + '&userid=' + userid,
            {

            }, { method: 'GET' });
    }


}
