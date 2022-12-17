import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { AssemblyRelationDto } from '../dtos/Assembly-Relation-dto';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()

export class PsAssemblyRelationService {

    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient
    ) { }

    public searchUrl = '/api/ps/psresourcelinkage/query';

    public GetById(Id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psresourcelinkage/getById/' + Id,
            {

            }, { method: 'GET' }
        );
    }

    public Edit(dto: AssemblyRelationDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psresourcelinkage/save', dto
        );
    }

    public GetPlant(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsassemblyrelation/psassemblyrelation/GetPlant',
            {

            }, { method: 'GET' }
        );
    }

    public SaveForNew(dto: AssemblyRelationDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psresourcelinkage/save', dto
        );
    }

    GetSchedule(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsassemblyrelation/psassemblyrelation/GetSchedule',
            {

            }, { method: 'GET' }
        );
    }

    GetResource(plantCode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psresourcelinkage/getResource?plantCode=' + plantCode,
            {

            }, { method: 'GET' }
        );
    }

    GetGroup(plantCode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psresourcelinkage/getScheduleGroup?plantCode=' + plantCode,
            {

            }, { method: 'GET' }
        );
    }

    GetItem(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsassemblyrelation/psassemblyrelation/GetItem',
            {

            }, { method: 'GET' }
        );
    }

    public remove(Id: String): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/ps/psresourcelinkage/deleteMainData/' + Id,
            {
                
            }, { method: 'GET' }
        );
    }

    public RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/api/ps/psresourcelinkage/deleteBatch', dtos
        );
    }

    GetPlant2(region: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsassemblyrelation/psassemblyrelation/GetPlant2?region=' + region,
            {

            }, { method: 'GET' }
        );
    }

    randomUserUrl: any;

    getRandomNameList(url: String): Observable<string[]> {
        return this.http.get(`${url}`).pipe(map((res: any) => res.data)).pipe(map((list: any) => {
            return list.content;
        }));
    }

    GetRegion(plantCode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto> (
            '/api/ps/psresourcelinkage/getScheduleRegion?plantCode=' + plantCode,
            {

            }, { method: 'GET' }
        );
    }
}
