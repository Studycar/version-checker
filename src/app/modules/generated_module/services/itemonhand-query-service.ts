import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ItemCategoryDto } from '../dtos/item-category-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';

@Injectable()

export class ItemonhandQueryService {

    constructor(
        private appApiService: AppApiService
    ) {}
    url = '/api/ps/psOnhandQuantities/pageQuery';

    urlChild = '/api/ps/psOnhandQuantities/detailQuery';


    /*GetPlant(userId: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto> (
            '/afs/serverpsitemonhandquery/PSItemOnHandQuery/GetPlant?userId=' + userId,
            {

            }, { method: 'GET' }
        );
    }*/
}
