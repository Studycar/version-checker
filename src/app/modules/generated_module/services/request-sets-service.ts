import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class RequestSetsService {
    constructor(private appApiService: AppApiService,
        private http: _HttpClient) { }

    GetRequestSets(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseRequestSets/getRequestSets', {}, { method: 'GET' });
    }

    GetAppliaction(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/application/list', {}, { method: 'GET' });
    }

    Edit(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/admin/baseRequestSets/save', dto);
    }

    EditRequestStage(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/admin/baseRequestSetStages/editRequestSetStage', dto);
    }

    DeleteRequestStage(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/admin/baseRequestSetStages/deleteRequestSetStage', dto);
    }

    UpdateStartStage(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/admin/baseRequestSets/updateStartStage', dto);
    }

    UpdateRequestSetStagesLink(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/admin/baseRequestSetStages/updateRequestSetStagesLink', dto);
    }

    QueryConcPrograms(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>('/api/admin/baseConcurrentPrograms/query',
            {
                concurrentProgramId: null,
                executableId: null,
                isExport: true,
                pageIndex: 1,
                pageSize: 100
            });
    }


    DeleteStageProgram(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/admin/baseRequestSetPrograms/deleteStageProgram', dto);
    }

    SaveStageProgram(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/admin/baseRequestSetPrograms/saveStageProgram', dto);
    }

    saveRequestSetProgArgs(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/admin/baseRequestSetProgArgs/saveRequestSetProgArgs', dto);
    }

    deleteRequestSetProgArgs(dto: any): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>('/api/admin/baseRequestSetProgArgs/deleteRequestSetProgArgs', dto);
    }
}
