import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Injectable()

export class SopRegionPlantService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    url = '/api/sop/sopRegionPlant/getData';

    /**根据事业部得到业务大区*/
    public GetRegionByBusiness(business = ''): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            '/api/sop/sopRegionPlant/getRegionByBusiness?business=' +
            business,
            {},
        );
    }

    public GetById(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            '/api/sop/sopRegionPlant/getById',
            {id}
        );
    }


    EditData(dto: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/sop/sopRegionPlant/update',
                dto
        );
    }

    remove(dto: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/sop/sopRegionPlant/remove',
                dto
        );
    }

    RemoveBath(dtos: string[]): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/sop/sopRegionPlant/batchRemove',
                dtos
        );
    }

    SaveForNew(dto: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            '/api/sop/sopRegionPlant/save',
                dto
        );
    }

}
