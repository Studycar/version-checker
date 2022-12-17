import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';


@Injectable()
/** 快码管理服务 */
export class PoComVindicateService {
    constructor(private appApiService: AppApiService) { }
    queryUrl1='/api/ps/psOpComVindicate/query';
    queryUrl = '/afs/serverpsopcomvindicate/psopcomvindicate/query';
    seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaselookupcode/lookuptype/querylookuptype';
    // 查询Mo编码
    queryMo(plantcodes: string, key: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverpsopcomvindicate/psopcomvindicate/getmobyplantcodeorkey?plantcode=' + plantcodes
            + '&key=' + key,
            {
            }, { method: 'GET' });
    }

    // // 根据工单号和工厂查询工单信息
    // queryMoInfo(plantcodes: string, key: string): Observable<any> {
    //     return this.appApiService.call<any>(
    //         '/afs/serverpsopcomvindicate/psopcomvindicate/getmoinfo?plantcode=' + plantcodes
    //         + '&key=' + key,
    //         {
    //         }, { method: 'GET' });
    // }

        // 根据工单号和工厂查询工单信息
        queryMoInfo(plantcodes: string, key: string): Observable<any> {
            return this.appApiService.call<any>(
                '/api/ps/psOpComVindicate/getMoInfo?plantcode=' + plantcodes
                + '&processMakeOrderNum=' + key,
                {
                }, { method: 'GET' });
        }

    // 查询Mo编码
    query(mo_num: string, desc: string, plantcode: string): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverpsopcomvindicate/psopcomvindicate/query?moNo=' + mo_num
            + '&desc=' + desc + '&plantcode=' + plantcode,
            {
            }, { method: 'GET' });
    }
}
